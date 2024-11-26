from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.exceptions import ValidationError, NotFound
from django.utils import timezone
from datetime import timedelta
from .models import *
from .serializers import *
from .permissions import *


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'first_name', 'last_name', 'email']
    filterset_fields = ['rol']

    def get_permissions(self):
        if self.action in ['register', 'login', 'token_refresh','logout']:
            return [AllowAny()]
        return [IsAuthenticated(),EsAdminOEncargado()]


    @action(detail=False, methods=['post'])
    def register(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        try:
            user = request.user
            if not user.check_password(request.data.get('old_password')):
                return Response({'error': 'Contraseña actual incorrecta'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            new_password = request.data.get('new_password')
            if not new_password:
                return Response({'error': 'Nueva contraseña requerida'}, 
                              status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Contraseña actualizada exitosamente',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            # Invalidamos el token estableciendo su expiración al pasado
            token.set_exp(claim='exp', from_time=timezone.now(), lifetime=timedelta(seconds=0))
            return Response({'message': 'Sesión cerrada exitosamente'})
        except KeyError:
            return Response({'error': 'El campo refresh_token es requerido'}, status=400)
        except TokenError as e:
            return Response({'error': str(e)}, status=400)

class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer
    permission_classes = [IsAuthenticated, EsAdministrador|EsSecretaria]
    filter_backends = [filters.SearchFilter]
    search_fields = ['usuario__username', 'carrera', 'codigo_estudiante']

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            estudiante = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            estudiante = serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self):
        try:
            return super().get_object()
        except Exception:
            raise NotFound('Estudiante no encontrado')

class ModuloPracticasViewSet(viewsets.ModelViewSet):
    queryset = ModuloPracticas.objects.all()
    serializer_class = ModuloPracticasSerializer
    permission_classes = [IsAuthenticated, EsEncargadoPracticas]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['nombre', 'tipo_modulo']
    filterset_fields = ['tipo_modulo', 'activo']
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  # Set partial=True to allow partial updates
        instance = self.get_object()
        
        # Handle file upload separately if present
        if 'estructura_informe' in request.FILES:
            instance.estructura_informe = request.FILES['estructura_informe']
            
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='asignar-jurado')
    def asignar_jurado(self, request, pk=None):
        try:
            modulo = self.get_object()
            jurado_id = request.data.get('jurado')
            
            jurado = Usuario.objects.get(id=jurado_id, rol='JURADO')
            
            practica = Practica.objects.get(modulo=modulo)
            
            asignacion = AsignacionJurado.objects.create(
                practica=practica,
                jurado=jurado,
                fecha_asignacion=timezone.now().date()
            )
            
            return Response({
                'status': 'success',
                'message': 'Jurado asignado correctamente',
                'data': {
                    'asignacion_id': asignacion.id,
                    'jurado': {
                        'id': jurado.id,
                        'nombre': f"{jurado.first_name} {jurado.last_name}"
                    }
                }
            }, status=status.HTTP_201_CREATED)
            
        except Usuario.DoesNotExist:
            return Response({
                'message': 'El jurado seleccionado no existe o no tiene el rol correcto'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Practica.DoesNotExist:
            return Response({
                'message': 'No existe una práctica asociada a este módulo'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)



class PracticaViewSet(viewsets.ModelViewSet):
    serializer_class = PracticaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    
    filterset_fields = {
        'fecha_inicio': ['gte', 'lte', 'exact'],
        'modulo__tipo_modulo': ['exact'],
        'estudiante': ['exact'],
        'supervisor': ['exact'],
        'estado': ['exact']
    }
    
    search_fields = [
        'estudiante__username',
        'estudiante__first_name',
        'estudiante__last_name',
        'supervisor__username',
        'supervisor__first_name',
        'modulo__nombre',
        'modulo__tipo_modulo'
    ]

    def get_queryset(self):
        user = self.request.user
        queryset = Practica.objects.select_related(
            'estudiante',
            'supervisor',
            'modulo'
        ).prefetch_related(
            'evaluacion_set__jurado'
        )

        if user.rol == 'ESTUDIANTE':
            return queryset.filter(estudiante=user)
        elif user.rol == 'DOCENTE':
            return queryset.filter(supervisor=user)
        elif user.rol == 'JURADO':
            return queryset.filter(asignacionjurado__jurado=user)
        return queryset

    @action(detail=True, methods=['post'])
    def calcular_nota(self, request, pk=None):
        practica = self.get_object()
        nota_final = practica.calcular_nota_final()
        return Response({'nota_final': nota_final})

class AsistenciaViewSet(viewsets.ModelViewSet):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaSerializer
    permission_classes = [IsAuthenticated, EsDocente]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {
        'practica': ['exact'],
        'fecha': ['exact'],
        'presente': ['exact']
    }
    search_fields = ['practica__estudiante__username']

class InformeViewSet(viewsets.ModelViewSet):
    queryset = Informe.objects.all()
    serializer_class = InformeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['practica', 'aprobado']
    search_fields = ['practica__estudiante__username']

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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['practica', 'jurado']
    search_fields = ['practica__estudiante__username']

    @action(detail=False, methods=['post'])
    def evaluar_modulo(self, request):
        practica_id = request.data.get('practica_id')
        calificacion = request.data.get('calificacion')
        observaciones = request.data.get('observaciones')

        evaluacion = Evaluacion.objects.create(
            practica_id=practica_id,
            jurado=request.user,
            calificacion=calificacion,
            observaciones=observaciones
        )
        
        return Response(self.get_serializer(evaluacion).data)

class GestionarEstudiantesViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.filter(rol='ESTUDIANTE')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, EsSecretaria]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'first_name', 'last_name', 'carrera']
    filterset_fields = ['carrera', 'ciclo']

    @action(detail=False, methods=['post'])
    def asignar_modulo(self, request):
        estudiante_id = request.data.get('estudiante_id')
        modulo_id = request.data.get('modulo_id')
        
        practica = Practica.objects.create(
            estudiante_id=estudiante_id,
            modulo_id=modulo_id,
            estado='ACTIVO'
        )
        
        return Response({'message': 'Estudiante asignado exitosamente al módulo'})

class GestionarDocentesViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.filter(rol='DOCENTE')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, EsEncargadoPracticas]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'first_name', 'last_name']

    @action(detail=False, methods=['post'])
    def asignar_supervisor(self, request):
        docente_id = request.data.get('docente_id')
        modulo_id = request.data.get('modulo_id')
        
        AsignacionDocente.objects.create(
            docente_id=docente_id,
            modulo_id=modulo_id,
            fecha_asignacion=timezone.now().date()
        )
        
        return Response({'message': 'Docente asignado exitosamente como supervisor'})
