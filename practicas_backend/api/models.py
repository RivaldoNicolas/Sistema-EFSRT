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
    dni = models.CharField(max_length=8, unique=True, null=True, blank=True)
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
    boleta_pago = models.FileField(upload_to='boletas_pago/', null=True, blank=True)
    fut = models.FileField(upload_to='futs/', null=True, blank=True)

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
    class Meta:
        unique_together = ['estudiante', 'modulo']

    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_CURSO', 'En Curso'),
        ('COMPLETADO', 'Completado'),
        ('EVALUADO', 'Evaluado')
    ]

    estudiante = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='practicas')
    modulo = models.ForeignKey(ModuloPracticas, on_delete=models.CASCADE)
    supervisores = models.ManyToManyField(
        Usuario,
        related_name='practicas_supervisadas',
        limit_choices_to={'rol': 'DOCENTE'}
    )
    jurados = models.ManyToManyField(
        Usuario, 
        related_name='practicas_evaluadas', 
        limit_choices_to={'rol': 'JURADO'}, 
        through='AsignacionJurado'
    )
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    horas_completadas = models.IntegerField(default=0)
    nota_final = models.DecimalField(max_digits=4, decimal_places=2, null=True)

    def __str__(self):
        return f"{self.estudiante.username} - {self.modulo.nombre}"

    def calcular_nota_final(self):
        # Obtener todas las evaluaciones necesarias
        asistencias = Asistencia.objects.filter(practica=self)
        evaluaciones_jurado = Evaluacion.objects.filter(
            practica=self,
            jurado__rol='JURADO'
        )
        informes = Informe.objects.filter(
            practica=self,
            calificacion__isnull=False
        )

        # Calcular nota de asistencia (30%)
        nota_asistencia = asistencias.aggregate(
            Avg('puntaje_general')
        )['puntaje_general__avg'] or Decimal('0')

        # Calcular nota de jurados (40%) - Promedio de los 3 jurados
        nota_jurado = evaluaciones_jurado.aggregate(
            Avg('calificacion')
        )['calificacion__avg'] or Decimal('0')

        # Calcular nota de informe (30%)
        nota_informe = informes.aggregate(
            Avg('calificacion')
        )['calificacion__avg'] or Decimal('0')

        # Calcular nota final ponderada
        self.nota_final = (
            (Decimal(str(nota_asistencia)) * Decimal('0.3')) +
            (Decimal(str(nota_jurado)) * Decimal('0.4')) +
            (Decimal(str(nota_informe)) * Decimal('0.3'))
        )

        # Verificar si todas las evaluaciones están completas
        jurados_count = evaluaciones_jurado.count()
        todas_evaluaciones_completas = (
            asistencias.exists() and
            jurados_count == 3 and
            informes.exists()
        )

        if todas_evaluaciones_completas:
            self.estado = 'EVALUADO'

        self.save()
        return self.nota_final

    def verificar_estado_evaluaciones(self):
        return {
            'asistencias_completas': Asistencia.objects.filter(practica=self).exists(),
            'jurados_evaluaron': Evaluacion.objects.filter(
                practica=self,
                jurado__rol='JURADO'
            ).count(),
            'informe_evaluado': Informe.objects.filter(
                practica=self,
                calificacion__isnull=False
            ).exists()
        }

    def clean(self):
        if self.fecha_fin < self.fecha_inicio:
            raise ValidationError('La fecha de fin debe ser posterior a la fecha de inicio')
        
        if self.horas_completadas < 0:
            raise ValidationError('Las horas completadas no pueden ser negativas')
        
        if self.nota_final and (self.nota_final < 0 or self.nota_final > 20):
            raise ValidationError('La nota final debe estar entre 0 y 20')

        # Verificar límite de 3 jurados
        jurados_count = self.jurados.count()
        if jurados_count > 3:
            raise ValidationError('No se pueden asignar más de 3 jurados por práctica')


class Asistencia(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    fecha = models.DateField()
    asistio = models.CharField(
        max_length=10,
        choices=[('ASISTIO', 'Asistió'), ('FALTA', 'Falta')],
        default='ASISTIO'
    )
    puntualidad = models.CharField(
        max_length=10,
        choices=[('PUNTUAL', 'Puntual'), ('TARDANZA', 'Tardanza'), ('FALTA', 'Falta')],
        default='PUNTUAL'
    )
    criterios_asistencia = models.JSONField(null=True, blank=True)
    puntaje_diario = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    puntaje_general = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def calcular_puntaje_diario(self):
        if self.criterios_asistencia:
            conceptual = Decimal(str(self.criterios_asistencia.get('CONCEPTUAL', 0)))
            procedimental = Decimal(str(self.criterios_asistencia.get('PROCEDIMENTAL', 0)))
            actitudinal = Decimal(str(self.criterios_asistencia.get('ACTITUDINAL', 0)))
            
            self.puntaje_diario = (conceptual + procedimental + actitudinal) / 3
            return self.puntaje_diario
        return Decimal('0.00')

    def calcular_puntaje_general(self):
        asistencias = Asistencia.objects.filter(practica=self.practica)
        puntajes_validos = [a.puntaje_diario for a in asistencias if a.puntaje_diario]
        
        if puntajes_validos:
            self.puntaje_general = sum(puntajes_validos) / len(puntajes_validos)
            return self.puntaje_general
        return Decimal('0.00')

    def save(self, *args, **kwargs):
        if self.asistio == 'FALTA':
            self.puntualidad = 'FALTA'
        if self.criterios_asistencia:
            self.puntaje_diario = self.calcular_puntaje_diario()
        super().save(*args, **kwargs)
        self.puntaje_general = self.calcular_puntaje_general()
        if self.pk:  # Only update if record exists
            Asistencia.objects.filter(pk=self.pk).update(puntaje_general=self.puntaje_general)


class Informe(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    documento = models.FileField(upload_to='informes/', null=True, blank=True)
    contenido = models.TextField()
    fecha_entrega = models.DateTimeField(auto_now_add=True)
    calificacion = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)
    evaluado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='informes_evaluados')
    fecha_evaluacion = models.DateTimeField(null=True, blank=True)
    aprobado = models.BooleanField(default=False)


    def save(self, *args, **kwargs):
        # Si el informe tiene calificación, actualizar el estado de aprobado
        if self.calificacion is not None:
            self.aprobado = self.calificacion >= 12.5
        super().save(*args, **kwargs)

        # Actualizar nota final de la práctica
        if self.calificacion is not None:
            self.practica.calcular_nota_final()


class Evaluacion(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    jurado = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'JURADO'})
    fecha_evaluacion = models.DateTimeField(default=timezone.now)
    calificacion = models.DecimalField(max_digits=4, decimal_places=2)
    observaciones = models.TextField(blank=True)
    criterios_evaluados = models.JSONField(default=dict)
    class Meta:
        # Asegura que un jurado solo pueda evaluar una vez la misma práctica
        unique_together = ['practica', 'jurado']

class AsignacionDocente(models.Model):
    docente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='asignaciones')
    modulo = models.ForeignKey(ModuloPracticas, on_delete=models.CASCADE)
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE, null=True)
    fecha_asignacion = models.DateField()

    class Meta:
        unique_together = ['docente', 'practica']


class AsignacionJurado(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    jurado = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'JURADO'})
    fecha_asignacion = models.DateField(auto_now_add=True)
    fecha_evaluacion = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ['practica', 'jurado']

    def clean(self):
        # Verificar límite de 3 jurados por práctica
        jurados_count = AsignacionJurado.objects.filter(
            practica=self.practica
        ).exclude(id=self.id).count()
        
        if jurados_count >= 3:
            raise ValidationError('No se pueden asignar más de 3 jurados por práctica')
