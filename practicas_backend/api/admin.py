from django.contrib import admin
from .models import *

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'rol', 'first_name', 'last_name')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('rol',)

@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'carrera', 'ciclo', 'codigo_estudiante')
    search_fields = ('codigo_estudiante', 'usuario__username')

admin.site.register(ModuloPracticas)
admin.site.register(Practica)
admin.site.register(Asistencia)
admin.site.register(Informe)
admin.site.register(Evaluacion)
admin.site.register(AsignacionDocente)
admin.site.register(AsignacionJurado)
