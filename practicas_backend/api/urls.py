from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UsuarioViewSet, ModuloPracticasViewSet, PracticaViewSet,
    AsistenciaViewSet, InformeViewSet, EvaluacionViewSet,
    GestionarEstudiantesViewSet, GestionarDocentesViewSet, EstudianteViewSet
)

router = DefaultRouter()

# Authentication and user routes
router.register(r'usuarios', UsuarioViewSet)
router.register(r'gestionar-estudiantes', GestionarEstudiantesViewSet, basename='gestion-estudiantes')
router.register(r'gestionar-docentes', GestionarDocentesViewSet, basename='gestion-docentes')
    
# Module and practice routes
router.register(r'modulos', ModuloPracticasViewSet,basename='modulos')
router.register(r'practicas', PracticaViewSet, basename='practica')

# Monitoring and evaluation routes
router.register(r'estudiantes', EstudianteViewSet)
router.register(r'asistencias', AsistenciaViewSet, basename='asistencia')
router.register(r'informes', InformeViewSet)
router.register(r'evaluaciones', EvaluacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)