from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

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
            
            # Si es estudiante, crear el perfil adicional
            if user.rol == 'ESTUDIANTE':
                estudiante_data = {
                    'usuario': user,
                    'carrera': request.data.get('carrera'),
                    'ciclo': request.data.get('ciclo'),
                    'codigo_estudiante': request.data.get('codigo_estudiante')
                }
                Estudiante.objects.create(**estudiante_data)
            
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
    permission_classes = [IsAuthenticated, EsAdministrador|EsSecretaria|EsEncargadoPracticas]
    filter_backends = [filters.SearchFilter]
    search_fields = ['usuario__username', 'carrera', 'codigo_estudiante']

    def create(self, request, *args, **kwargs):
        try:
            # Create user first
            user_data = {
                'username': request.data.get('username'),
                'password': request.data.get('password'),
                'email': request.data.get('email'),
                'first_name': request.data.get('first_name'),
                'last_name': request.data.get('last_name'),
                'rol': 'ESTUDIANTE'
            }
            
            user = Usuario.objects.create_user(**user_data)
            
            # Create student profile
            estudiante_data = {
                'usuario': user,
                'carrera': request.data.get('carrera'),
                'ciclo': request.data.get('ciclo'),
                'codigo_estudiante': request.data.get('codigo_estudiante'),
                'semestre': request.data.get('semestre'),
                'grupo': request.data.get('grupo')
            }
            
            estudiante = Estudiante.objects.create(**estudiante_data)
            
            return Response({
                'message': 'Estudiante creado exitosamente',
                'data': self.get_serializer(estudiante).data
            }, status=status.HTTP_201_CREATED)
            
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
    parser_classes = (JSONParser,MultiPartParser, FormParser)

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
    

    @action(detail=True, methods=['get'], url_path='listar-jurados')
    def listar_jurados(self, request, pk=None):
        modulo = self.get_object()
        jurados = AsignacionJurado.objects.filter(practica__modulo=modulo).values('jurado__id', 'jurado__username')
        return Response({'data': jurados})



    @action(detail=True, methods=['post'], url_path='asignar-jurado')
    def asignar_jurado(self, request, pk=None):
        try:
            modulo = self.get_object()  # Obtén el módulo basado en el `pk`
            
            # Obtén IDs del jurado y estudiante del request
            jurado_id = request.data.get('jurado_id')
            estudiante_id = request.data.get('estudiante_id')

            if not jurado_id or not estudiante_id:
                raise ValidationError("Debe proporcionar 'jurado_id' y 'estudiante_id'.")

            # Validar existencia de jurado y estudiante
            try:
                jurado = Usuario.objects.get(id=jurado_id, rol='JURADO')
            except Usuario.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': f"Jurado con ID {jurado_id} no encontrado o no es un jurado."
                }, status=status.HTTP_404_NOT_FOUND)

            try:
                estudiante = Usuario.objects.get(id=estudiante_id, rol='ESTUDIANTE')
            except Usuario.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': f"Estudiante con ID {estudiante_id} no encontrado o no es un estudiante."
                }, status=status.HTTP_404_NOT_FOUND)

            # Crear o recuperar la práctica
            practica, created = Practica.objects.get_or_create(
                estudiante=estudiante,
                modulo=modulo,
                defaults={
                    'fecha_inicio': timezone.now().date(),
                    'fecha_fin': timezone.now().date() + timedelta(days=30),
                    'estado': 'PENDIENTE'
                }
            )

            # Validar si el jurado ya está asignado a esta práctica
            if AsignacionJurado.objects.filter(practica=practica, jurado=jurado).exists():
                return Response({
                    'status': 'error',
                    'message': 'El jurado ya está asignado a esta práctica.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Crear asignación del jurado
            asignacion = AsignacionJurado.objects.create(
                practica=practica,
                jurado=jurado,
                fecha_asignacion=timezone.now().date()
            )

            return Response({
                'status': 'success',
                'message': 'Jurado asignado correctamente.',
                'data': {
                    'asignacion_id': asignacion.id,
                    'practica_id': practica.id
                }
            })

        except ValidationError as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f"Error inesperado: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

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
        base_queryset = Practica.objects.select_related(
            'estudiante',
            'supervisor',
            'modulo'
        ).prefetch_related(
            'evaluacion_set__jurado'
        )

        if user.rol == 'ESTUDIANTE':
            # Get unique practice IDs first
            unique_practice_ids = base_queryset.filter(
                estudiante=user
            ).values('modulo').annotate(
                max_id=models.Max('id')
            ).values_list('max_id', flat=True)
            
            # Then filter by those IDs
            return base_queryset.filter(id__in=unique_practice_ids)
        elif user.rol == 'DOCENTE':
            return base_queryset.filter(supervisor=user)
        elif user.rol == 'JURADO':
            return base_queryset.filter(asignacionjurado__jurado=user)
        return base_queryset

    @action(detail=True, methods=['post'])
    def calcular_nota(self, request, pk=None):
        practica = self.get_object()
        nota_final = practica.calcular_nota_final()
        return Response({'nota_final': nota_final})

class AsistenciaViewSet(viewsets.ModelViewSet):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaSerializer
    permission_classes = [IsAuthenticated, EsDocente |EsEstudiante]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {
        'practica': ['exact'],
        'fecha': ['exact', 'gte', 'lte'],
        'asistio': ['exact'],
        'puntualidad': ['exact']
    }
    search_fields = ['practica_estudiante_username']
    def get_queryset(self):
        user = self.request.user
        if user.rol == 'ESTUDIANTE':
            return Asistencia.objects.filter(practica__estudiante=user)
        return Asistencia.objects.none()
    @action(detail=False, methods=['get'], url_path='estudiante/(?P<user_id>[^/.]+)')
    def asistencias_estudiante(self, request, user_id=None):
        asistencias = Asistencia.objects.filter(
            practica__estudiante_id=user_id
        ).order_by('-fecha')
        serializer = self.get_serializer(asistencias, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        asistencia = serializer.save()
        asistencia.calcular_puntaje_diario()
        asistencia.calcular_puntaje_general()

    def perform_update(self, serializer):
        asistencia = serializer.save()
        asistencia.calcular_puntaje_diario()
        asistencia.calcular_puntaje_general()


class InformeViewSet(viewsets.ModelViewSet):
    serializer_class = InformeSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['practica', 'aprobado']
    search_fields = ['practica__estudiante__username']

    def get_queryset(self):
        user = self.request.user
        queryset = Informe.objects.select_related(
            'practica__estudiante',
            'practica__supervisor',
            'evaluado_por'
        )

        if user.rol == 'ESTUDIANTE':
            return queryset.filter(practica__estudiante=user)
        elif user.rol == 'PRACTICAS':
            return queryset
        elif user.rol == 'DOCENTE':
            return queryset.filter(practica__supervisor=user)
        return queryset.none()

    def create(self, request, *args, **kwargs):
        try:
            # Validar que el estudiante tenga una práctica activa
            practica_id = request.data.get('practica')
            if not practica_id:
                return Response(
                    {'error': 'Se requiere especificar una práctica'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            practica = Practica.objects.get(
                id=practica_id,
                estudiante=request.user,
                estado__in=['PENDIENTE', 'EN_CURSO']
            )

            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Practica.DoesNotExist:
            return Response(
                {'error': 'No se encontró una práctica válida'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def evaluar_informe(self, request, pk=None):
        try:
            informe = self.get_object()
            calificacion = request.data.get('calificacion')
            observaciones = request.data.get('observaciones')

            if not calificacion:
                return Response(
                    {'error': 'La calificación es requerida'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                calificacion = Decimal(calificacion)
                if not 0 <= calificacion <= 20:
                    raise ValueError()
            except (TypeError, ValueError):
                return Response(
                    {'error': 'La calificación debe ser un número entre 0 y 20'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            informe.calificacion = calificacion
            informe.observaciones = observaciones
            informe.evaluado_por = request.user
            informe.fecha_evaluacion = timezone.now()
            informe.save()

            # Actualizar estado de la práctica si es necesario
            practica = informe.practica
            practica.calcular_nota_final()

            return Response({
                'message': 'Informe evaluado exitosamente',
                'calificacion': informe.calificacion,
                'nota_final': practica.nota_final
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def pendientes_evaluacion(self, request):
        informes = self.get_queryset().filter(
            calificacion__isnull=True,
            fecha_evaluacion__isnull=True
        ).order_by('fecha_entrega')
        serializer = self.get_serializer(informes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def mis_informes(self, request):
        if request.user.rol != 'ESTUDIANTE':
            return Response(
                {'error': 'Solo disponible para estudiantes'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        informes = self.get_queryset().order_by('-fecha_entrega')
        serializer = self.get_serializer(informes, many=True)
        return Response(serializer.data)



class EvaluacionViewSet(viewsets.ModelViewSet):
    queryset = Evaluacion.objects.all()
    serializer_class = EvaluacionSerializer
    permission_classes = [IsAuthenticated, EsJurado]

    @action(detail=False, methods=['post'])
    def evaluar_practica(self, request):
        try:
            # 1. Get practica_id and validate practice exists
            practica_id = request.data.get('practica_id')
            practica = Practica.objects.get(id=practica_id)
            if not practica_id:
                return Response({"error": "practica_id es requerido"}, status=400)
            
            practica = Practica.objects.get(id=practica_id)
            # Verificar si el jurado ya evaluó esta práctica
            evaluacion_existente = Evaluacion.objects.filter(
                practica_id=practica_id, 
                jurado=request.user
            ).exists()
            
            if evaluacion_existente:
                return Response({
                    "error": "Ya has evaluado esta práctica anteriormente"
                }, status=400)

            # 2. Check if jurado already evaluated
            if Evaluacion.objects.filter(practica=practica, jurado=request.user).exists():
                return Response(
                    {"error": "Ya has evaluado esta práctica"}, 
                    status=400
                )

            # 3. Check number of evaluations
            evaluaciones_count = Evaluacion.objects.filter(practica=practica).count()
            if evaluaciones_count >= 3:
                return Response(
                    {"error": "Esta práctica ya tiene 3 evaluaciones"},
                    status=400
                )

            # 4. Create evaluation
            evaluacion = Evaluacion.objects.create(
                practica=practica,
                jurado=request.user,
                calificacion=request.data.get('calificacion'),
                observaciones=request.data.get('observaciones', ''),
                criterios_evaluados=request.data.get('criterios_evaluados', {})
            )

            # 5. Calculate final grade if third evaluation
            if evaluaciones_count == 2:
                evaluaciones = Evaluacion.objects.filter(practica=practica)
                promedio = sum(e.calificacion for e in evaluaciones) / 3
                practica.nota_final = promedio
                practica.estado = 'EVALUADO'
                practica.save()

            return Response(self.get_serializer(evaluacion).data, status=201)

        except Practica.DoesNotExist:
            return Response({"error": "Práctica no encontrada"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)



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
