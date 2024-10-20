from rest_framework import serializers
from .models import Usuario, ModuloPracticas, Practica, Asistencia, Informe, Evaluacion, AsignacionDocente, AsignacionJurado

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'rol', 'first_name', 'last_name', 'telefono', 'direccion']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Usuario(
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
        return user

class ModuloPracticasSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuloPracticas
        fields = '__all__'

class PracticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Practica
        fields = '__all__'

class AsistenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistencia
        fields = '__all__'

class InformeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Informe
        fields = '__all__'

class EvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluacion
        fields = '__all__'

class AsignacionDocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignacionDocente
        fields = '__all__'

class AsignacionJuradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignacionJurado
        fields = '__all__'
