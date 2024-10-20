from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UsuarioViewSet, ModuloPracticasViewSet, PracticaViewSet, AsistenciaViewSet,
    InformeViewSet, EvaluacionViewSet, AsignacionDocenteViewSet, AsignacionJuradoViewSet,
    GestionarEstudiantes, GestionarDocentes, RegisterView, LogoutView, ChangePasswordView
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'modulos', ModuloPracticasViewSet)
router.register(r'practicas', PracticaViewSet)
router.register(r'asistencias', AsistenciaViewSet)
router.register(r'informes', InformeViewSet)
router.register(r'evaluaciones', EvaluacionViewSet)
router.register(r'asignaciones-docentes', AsignacionDocenteViewSet)
router.register(r'asignaciones-jurados', AsignacionJuradoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('gestionar-estudiantes/', GestionarEstudiantes.as_view(), name='gestionar_estudiantes'),
    path('gestionar-docentes/', GestionarDocentes.as_view(), name='gestionar_docentes'),
]