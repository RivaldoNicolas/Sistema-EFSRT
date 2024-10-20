from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Usuario, ModuloPracticas, Practica, Asistencia, Informe, Evaluacion, AsignacionDocente, AsignacionJurado
from .serializers import UsuarioSerializer, ModuloPracticasSerializer, PracticaSerializer, AsistenciaSerializer, InformeSerializer, EvaluacionSerializer, AsignacionDocenteSerializer, AsignacionJuradoSerializer
from .permissions import EsAdministrador, EsEncargadoPracticas, EsEncargadoFUA, EsCordinadorAcademico, EsSecretaria, EsDocente, EsEstudiante, EsJurado, EsAdministradorOEncargadoPracticas
from rest_framework_simplejwt.tokens import RefreshToken


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, EsAdministrador]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        user = request.user
        if user.check_password(request.data.get('old_password')):
            user.set_password(request.data.get('new_password'))
            user.save()
            return Response({'status': 'password set'}, status=status.HTTP_200_OK)
        return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.check_password(request.data.get('old_password')):
            user.set_password(request.data.get('new_password'))
            user.save()
            return Response({'status': 'password set'}, status=status.HTTP_200_OK)
        return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)


class ModuloPracticasViewSet(viewsets.ModelViewSet):
    queryset = ModuloPracticas.objects.all()
    serializer_class = ModuloPracticasSerializer
    permission_classes = [IsAuthenticated, EsEncargadoPracticas]

class PracticaViewSet(viewsets.ModelViewSet):
    queryset = Practica.objects.all()
    serializer_class = PracticaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.rol == 'ESTUDIANTE':
            return Practica.objects.filter(estudiante=user)
        elif user.rol == 'DOCENTE':
            return Practica.objects.filter(supervisor=user)
        return Practica.objects.all()

class AsistenciaViewSet(viewsets.ModelViewSet):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaSerializer
    permission_classes = [IsAuthenticated, EsDocente]

class InformeViewSet(viewsets.ModelViewSet):
    queryset = Informe.objects.all()
    serializer_class = InformeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.rol == 'ESTUDIANTE':
            return Informe.objects.filter(practica__estudiante=user)
        elif user.rol == 'DOCENTE':
            return Informe.objects.filter(practica__supervisor=user)
        return Informe.objects.all()

class EvaluacionViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer
    permission_classes = [IsAuthenticated, EsJurado]

class AsignacionDocenteViewSet(viewsets.ModelViewSet):
    queryset = AsignacionDocente.objects.all()
    serializer_class = AsignacionDocenteSerializer
    permission_classes = [IsAuthenticated, EsEncargadoPracticas]

class AsignacionJuradoViewSet(viewsets.ModelViewSet):
    queryset = AsignacionJurado.objects.all()
    serializer_class = AsignacionJuradoSerializer
    permission_classes = [IsAuthenticated, EsEncargadoPracticas]

class GestionarEstudiantes(APIView):
    permission_classes = [IsAuthenticated, EsSecretaria]
    
    def post(self, request):
        # Lógica para agregar estudiantes a las prácticas
        pass

class GestionarDocentes(APIView):
    permission_classes = [IsAuthenticated, EsEncargadoPracticas]
    
    def post(self, request):
        # Lógica para gestionar docentes
        pass
