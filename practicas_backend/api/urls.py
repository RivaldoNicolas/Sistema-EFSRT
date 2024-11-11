from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UsuarioViewSet, ModuloPracticasViewSet, PracticaViewSet,
    AsistenciaViewSet, InformeViewSet, EvaluacionViewSet,
    GestionarEstudiantesViewSet, GestionarDocentesViewSet,EstudianteViewSet
)

router = DefaultRouter()

# Rutas de autenticación y usuarios
router.register(r'usuarios', UsuarioViewSet)
router.register(r'gestionar-estudiantes', GestionarEstudiantesViewSet, basename='gestion-estudiantes')
router.register(r'gestionar-docentes', GestionarDocentesViewSet, basename='gestion-docentes')

# Rutas de módulos y prácticas
router.register(r'modulos', ModuloPracticasViewSet)
router.register(r'practicas', PracticaViewSet, basename='practica')

# Rutas de seguimiento y evaluación
router.register(r'estudiantes', EstudianteViewSet)
router.register(r'asistencias', AsistenciaViewSet)
router.register(r'informes', InformeViewSet)
router.register(r'evaluaciones', EvaluacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
