from rest_framework import serializers
from .models import Usuario, Estudiante,ModuloPracticas, Practica, Asistencia, Informe, Evaluacion, AsignacionDocente, AsignacionJurado
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from django.utils import timezone
from django.db.models import Avg

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    estudiante_data = serializers.SerializerMethodField(read_only=True)
    carrera = serializers.CharField(write_only=True, required=False)
    ciclo = serializers.IntegerField(write_only=True, required=False)
    boleta_pago = serializers.FileField(write_only=True, required=False)
    fut = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'rol', 'first_name', 'last_name',
                 'telefono', 'direccion', 'edad', 'estudiante_data', 'carrera', 'ciclo',
                 'boleta_pago', 'fut', 'dni']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'rol': {'required': True},
        }
    def validate_dni(self, value):
        # Validación para el DNI
        if not value.isdigit() or len(value) != 8:
            raise serializers.ValidationError("El DNI debe tener 8 dígitos numéricos")
        return value


    def get_estudiante_data(self, obj):
        try:
            estudiante = Estudiante.objects.get(usuario=obj)
            return {
                'carrera': estudiante.carrera,
                'ciclo': estudiante.ciclo,
                'boleta_pago': estudiante.boleta_pago.url if estudiante.boleta_pago else None,
                'fut': estudiante.fut.url if estudiante.fut else None
            }
        except Estudiante.DoesNotExist:
            return None

    def create(self, validated_data):
        # Extraer datos de estudiante
        carrera = validated_data.pop('carrera', None)
        ciclo = validated_data.pop('ciclo', None)
        boleta_pago = validated_data.pop('boleta_pago', None)
        fut = validated_data.pop('fut', None)

        # Crear usuario
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            rol=validated_data['rol'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            telefono=validated_data.get('telefono', ''),
            direccion=validated_data.get('direccion', '')
        )
        user.set_password(validated_data['password'])
        user.save()

        # Si es estudiante, crear perfil estudiante
        if user.rol == 'ESTUDIANTE' and carrera and ciclo:
            Estudiante.objects.create(
                usuario=user,
                carrera=carrera,
                ciclo=ciclo,
                boleta_pago=boleta_pago,
                fut=fut
            )

        return user


    def update(self, instance, validated_data):
        # Solo actualiza el password si viene en los datos
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        # Actualiza el resto de campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class ModuloPracticasSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuloPracticas
        fields = '__all__'

class PracticaSerializer(serializers.ModelSerializer):
    estudiante = UsuarioSerializer(read_only=True)
    supervisores = UsuarioSerializer(many=True, read_only=True)
    modulo = ModuloPracticasSerializer(read_only=True)
    
    # Add write fields
    estudiante_id = serializers.IntegerField(write_only=True)
    supervisores_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )
    modulo_id = serializers.IntegerField(write_only=True)
   
    nota_asistencia = serializers.SerializerMethodField()
    nota_jurado = serializers.SerializerMethodField()
    nota_informe = serializers.SerializerMethodField()
    nota_final = serializers.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(20)],
        read_only=True
    )
    class Meta:
        model = Practica
        fields = [
            'id',
            'estudiante', 'estudiante_id',
            'supervisores', 'supervisores_ids',
            'modulo', 'modulo_id',
            'fecha_inicio',
            'fecha_fin',
            'estado',
            'nota_final',
            'nota_asistencia',
            'nota_jurado',
            'nota_informe',
            'horas_completadas'
        ]

    def create(self, validated_data):
        supervisores_ids = validated_data.pop('supervisores_ids')
        practica = super().create(validated_data)
        practica.supervisores.set(supervisores_ids)
        return practica

    def update(self, instance, validated_data):
        if 'supervisores_ids' in validated_data:
            supervisores_ids = validated_data.pop('supervisores_ids')
            instance.supervisores.set(supervisores_ids)
        return super().update(instance, validated_data)
    def get_nota_asistencia(self, obj):
        asistencias = Asistencia.objects.filter(practica=obj)
        if asistencias.exists():
            return asistencias.aggregate(Avg('puntaje_general'))['puntaje_general__avg']
        return None

    def get_nota_jurado(self, obj):
        evaluaciones = Evaluacion.objects.filter(practica=obj)
        if evaluaciones.exists():
            return evaluaciones.aggregate(Avg('calificacion'))['calificacion__avg']
        return None

    def get_nota_informe(self, obj):
        informes = Informe.objects.filter(practica=obj, calificacion__isnull=False)
        if informes.exists():
            return informes.aggregate(Avg('calificacion'))['calificacion__avg']
        return None



class AsistenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistencia
        fields = [
            'id',
            'practica',
            'fecha',
            'asistio',
            'puntualidad',
            'criterios_asistencia',
            'puntaje_diario',
            'puntaje_general'
        ]
        read_only_fields = ['puntaje_diario', 'puntaje_general']

    def validate_asistio(self, value):
        valid_choices = dict(Asistencia._meta.get_field('asistio').choices)
        if value not in valid_choices:
            raise serializers.ValidationError(f"Estado de asistencia inválido. Opciones válidas: {list(valid_choices.keys())}")
        return value

    def validate_puntualidad(self, value):
        valid_choices = dict(Asistencia._meta.get_field('puntualidad').choices)
        if value not in valid_choices:
            raise serializers.ValidationError(f"Estado de puntualidad inválido. Opciones válidas: {list(valid_choices.keys())}")
        return value

    def validate_criterios_asistencia(self, value):
        required_criterios = ['CONCEPTUAL', 'PROCEDIMENTAL', 'ACTITUDINAL']
        
        if not isinstance(value, dict):
            raise serializers.ValidationError("Los criterios deben ser un objeto JSON")
        
        for criterio in required_criterios:
            if criterio not in value:
                raise serializers.ValidationError(f"Falta el criterio {criterio}")
            
            try:
                puntaje = Decimal(str(value[criterio]))
                if not (0 <= puntaje <= 20):
                    raise serializers.ValidationError(f"El puntaje de {criterio} debe estar entre 0 y 20")
            except (TypeError, ValueError):
                raise serializers.ValidationError(f"El puntaje de {criterio} debe ser un número válido")
        
        return value

    def create(self, validated_data):
        asistencia = Asistencia.objects.create(**validated_data)
        asistencia.calcular_puntaje_diario()
        asistencia.calcular_puntaje_general()
        return asistencia

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class InformeSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.CharField(source='practica.estudiante.get_full_name', read_only=True)
    documento_url = serializers.SerializerMethodField()
    evaluador_nombre = serializers.CharField(source='evaluado_por.get_full_name', read_only=True)
    modulo_nombre = serializers.CharField(source='practica.modulo.nombre', read_only=True)
    modulo_tipo = serializers.CharField(source='practica.modulo.tipo_modulo', read_only=True)
    supervisores_nombres = serializers.SerializerMethodField()

    class Meta:
        model = Informe
        fields = '__all__'
        read_only_fields = ['evaluado_por', 'fecha_evaluacion', 'aprobado']

    def get_supervisores_nombres(self, obj):
        return [f"{supervisor.first_name} {supervisor.last_name}" 
                for supervisor in obj.practica.supervisores.all()]

    def get_documento_url(self, obj):
        if obj.documento:
            return self.context['request'].build_absolute_uri(obj.documento.url)
        return None


class EvaluacionSerializer(serializers.ModelSerializer):
    jurado = UsuarioSerializer(read_only=True)
    practica_details = PracticaSerializer(source='practica', read_only=True)
    
    class Meta:
        model = Evaluacion
        fields = [
            'id',
            'practica',
            'practica_details',
            'jurado',
            'calificacion',
            'fecha_evaluacion',
            'observaciones',
            'criterios_evaluados'
        ]
        read_only_fields = ['fecha_evaluacion', 'jurado']

    def validate(self, data):
        if 'calificacion' in data and not 0 <= data['calificacion'] <= 20:
            raise serializers.ValidationError({
                "calificacion": "La calificación debe estar entre 0 y 20"
            })
           
        if 'criterios_evaluados' in data:
            required_criterios = [
                'presentacion',
                'conocimiento_teorico',
                'habilidades_practicas',
                'actitud_profesional'
            ]
           
            for criterio in required_criterios:
                if criterio not in data['criterios_evaluados']:
                    raise serializers.ValidationError({
                        "criterios_evaluados": f"Falta el criterio {criterio}"
                    })
               
                valor = data['criterios_evaluados'][criterio]
                if not 0 <= float(valor) <= 20:
                    raise serializers.ValidationError({
                        "criterios_evaluados": f"El valor de {criterio} debe estar entre 0 y 20"
                    })
       
        return data

    def create(self, validated_data):
        validated_data['fecha_evaluacion'] = timezone.now()
        return super().create(validated_data)
    
    
    
class AsignacionDocenteSerializer(serializers.ModelSerializer):
    docente = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = AsignacionDocente
        fields = ['id', 'docente', 'modulo', 'fecha_asignacion']

class AsignacionJuradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignacionJurado
        fields = ['practica', 'jurado', 'fecha_asignacion', 'fecha_evaluacion']

class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = ['id', 'usuario', 'carrera', 'ciclo', 'boleta_pago', 'fut']
    def validate_ciclo(self, value):
        if not 1 <= value <= 6:
            raise serializers.ValidationError("El ciclo debe estar entre 1 y 6")
        return value
    def validate_codigo_estudiante(self, value):
        if not value.isalnum():
            raise serializers.ValidationError("El código debe ser alfanumérico")
        return value