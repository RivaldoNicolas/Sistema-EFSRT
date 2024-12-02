from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework.validators import ValidationError
from django.utils import timezone
from django.db.models import Avg
from decimal import Decimal

class Usuario(AbstractUser):
    ROL_CHOICES = [
        ('ADMIN', 'Administrador General'),
        ('FUA', 'Encargado JUA'),
        ('PRACTICAS', 'Encargado EFSRT'),
        ('COORDINADOR', 'Coordinador Academico'),
        ('SECRETARIA', 'Secretaria'),
        ('DOCENTE', 'Docente'),
        ('ESTUDIANTE', 'Estudiante'),
        ('JURADO', 'Jurado Evaluador'),
    ]
    rol = models.CharField(max_length=30, choices=ROL_CHOICES)
    telefono = models.CharField(max_length=15, null=True, blank=True)
    direccion = models.TextField(null=True, blank=True)
    edad = models.PositiveIntegerField(null=True, blank=True)
    def clean(self):
        if self.rol not in [choice[0] for choice in self.ROL_CHOICES]:
            raise ValidationError('Rol no válido')
        if self.edad and self.edad < 0:
            raise ValidationError('La edad no puede ser negativa')

class Estudiante(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_estudiante')
    carrera = models.CharField(max_length=100)
    ciclo = models.IntegerField()
    codigo_estudiante = models.CharField(max_length=20, unique=True)
    def __str__(self):
        return f"{self.usuario.username} - {self.carrera}"

    def save(self, *args, **kwargs):
        self.usuario.rol = 'ESTUDIANTE'
        self.usuario.save()
        super().save(*args, **kwargs)

class ModuloPracticas(models.Model):
    TIPO_CHOICES = [
        ('MODULO1', 'Módulo I'),
        ('MODULO2', 'Módulo II'),
        ('MODULO3', 'Módulo III'),
    ]
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    estructura_informe = models.FileField(upload_to='estructura-informe-pdfs/', null=True, blank=True)
    tipo_modulo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    horas_requeridas = models.IntegerField(null=True, blank=True)
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    def clean(self):
        if self.fecha_fin and self.fecha_inicio and self.fecha_fin < self.fecha_inicio:
            raise ValidationError('La fecha de fin debe ser posterior a la fecha de inicio')
        if self.horas_requeridas and self.horas_requeridas <= 0:
            raise ValidationError('Las horas requeridas deben ser positivas')

class Practica(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_CURSO', 'En Curso'),
        ('COMPLETADO', 'Completado'),
        ('EVALUADO', 'Evaluado')
    ]
    estudiante = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='practicas')
    modulo = models.ForeignKey(ModuloPracticas, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='supervisiones')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    horas_completadas = models.IntegerField(default=0)
    nota_final = models.DecimalField(max_digits=4, decimal_places=2, null=True)

    def calcular_nota_final(self):
        asistencias = Asistencia.objects.filter(practica=self)
        evaluaciones = Evaluacion.objects.filter(practica=self)
        informes = Informe.objects.filter(practica=self)

        if asistencias.exists() and evaluaciones.exists() and informes.exists():
            nota_asistencia = asistencias.aggregate(Avg('puntaje_general'))['puntaje_general__avg'] or 0
            nota_evaluacion = evaluaciones.aggregate(Avg('calificacion'))['calificacion__avg'] or 0
            nota_informe = Decimal('20') if informes.filter(aprobado=True).exists() else Decimal('0')

            self.nota_final = (nota_asistencia * Decimal('0.3')) + \
                            (nota_evaluacion * Decimal('0.4')) + \
                            (nota_informe * Decimal('0.3'))
            self.save()
            return self.nota_final
        return None

    def clean(self):
        if self.fecha_fin < self.fecha_inicio:
            raise ValidationError('La fecha de fin debe ser posterior a la fecha de inicio')
        if self.horas_completadas < 0:
            raise ValidationError('Las horas completadas no pueden ser negativas')
        if self.nota_final and (self.nota_final < 0 or self.nota_final > 20):
            raise ValidationError('La nota final debe estar entre 0 y 20')


class Asistencia(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora_entrada = models.TimeField(null=True, blank=True)
    hora_salida = models.TimeField(null=True, blank=True)
    criterios_asistencia = models.JSONField(null=True, blank=True)
    puntaje_diario = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    puntaje_general = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def calcular_puntaje_diario(self):
        if self.criterios_asistencia:
            conceptual = Decimal(str(self.criterios_asistencia.get('CONCEPTUAL', 0)))
            procedimental = Decimal(str(self.criterios_asistencia.get('PROCEDIMENTAL', 0)))
            actitudinal = Decimal(str(self.criterios_asistencia.get('ACTITUDINAL', 0)))
            
            suma = conceptual + procedimental + actitudinal
            self.puntaje_diario = suma / 3
            self.save()
            return self.puntaje_diario
        return Decimal('0.00')

    def calcular_puntaje_general(self):
        asistencias = Asistencia.objects.filter(practica=self.practica)
        total_puntajes = Decimal('0.00')
        count = 0
        
        for asistencia in asistencias:
            if asistencia.puntaje_diario:
                total_puntajes += asistencia.puntaje_diario
                count += 1
        
        if count > 0:
            self.puntaje_general = total_puntajes / count
            self.save()
            return self.puntaje_general
        return Decimal('0.00')

    def save(self, *args, **kwargs):
        if self.criterios_asistencia:
            self.calcular_puntaje_diario()
        super().save(*args, **kwargs)
        self.calcular_puntaje_general()


class Informe(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    documento = models.FileField(upload_to='informes/', null=True, blank=True)
    contenido = models.TextField()
    fecha_entrega = models.DateTimeField(auto_now_add=True)
    aprobado = models.BooleanField(default=False)

class Evaluacion(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    jurado = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'JURADO'})
    fecha_evaluacion = models.DateTimeField(default=timezone.now)
    calificacion = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    observaciones = models.TextField(blank=True)
    criterios_evaluados = models.JSONField(default=dict, blank=True)

class AsignacionDocente(models.Model):
    docente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='asignaciones')
    modulo = models.ForeignKey(ModuloPracticas, on_delete=models.CASCADE)
    fecha_asignacion = models.DateField()

class AsignacionJurado(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    jurado = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'JURADO'})
    fecha_asignacion = models.DateField()
    fecha_evaluacion = models.DateField(null=True, blank=True)
