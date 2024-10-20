from django.db import models
from django.contrib.auth.models import AbstractUser

#Modelo Usuario 
class Usuario(AbstractUser):
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    ROL_CHOICES = [
        ('ADMIN', 'Administrador General'),
        ('FUA', 'Encargado FUA'),
        ('PRACTICAS', 'Encargado EFSRT'),
        ('COORDINADOR', 'Coordinador Academico'),
        ('SECRETARIA', 'Secretaria'),
        ('DOCENTE', 'Docente'),
        ('ESTUDIANTE', 'Estudiante'),
        ('JURADO', 'Jurado Evaluador'),
    ]
    rol = models.CharField(max_length=30, choices=ROL_CHOICES)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuario_set',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuario_set',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
    )

#modelo ModuloPracticas
class ModuloPracticas(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    tipo_modulo = models.CharField(max_length=50)

#modelo Practica
class Practica(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_PROGRESO', 'En Progreso'),
        ('COMPLETADA', 'Completada'),
        ('EVALUADA', 'Evaluada'),
    ]
    estudiante = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='practicas')
    modulo = models.ForeignKey(ModuloPracticas, on_delete=models.CASCADE)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='PENDIENTE')
    supervisor = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='practicas_supervisadas')

#modelo Asistencia
class Asistencia(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    fecha = models.DateField()
    presente = models.CharField(max_length=20)

#modelo Informe
class Informe(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    contenido = models.TextField()
    fecha_entrega = models.DateTimeField()
    aprobado = models.BooleanField(default=False)


#modelo AsignaciónJurado
class AsignacionJurado(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    jurado = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'JURADO'})
    fecha_asignacion = models.DateField()
    fecha_evaluacion = models.DateField(null=True, blank=True)

#modelo Evaluación
class Evaluacion(models.Model):
    practica = models.ForeignKey(Practica, on_delete=models.CASCADE)
    jurado = models.ForeignKey(Usuario, on_delete=models.CASCADE, limit_choices_to={'rol': 'JURADO'})
    calificacion = models.DecimalField(max_digits=4, decimal_places=2)
    comentarios = models.TextField()

#modelo AsignacionDocente
class AsignacionDocente(models.Model):
    docente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='asignaciones')
    modulo = models.ForeignKey(ModuloPracticas, on_delete=models.CASCADE)
    fecha_asignacion = models.DateField()

#EstructuraInforme
class EstructuraInforme(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    estructura_informe = models.ForeignKey(ModuloPracticas,on_delete=models.CASCADE)