from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Usuario, Estudiante, ModuloPracticas, Practica, Asistencia, Informe, Evaluacion

class UsuarioTests(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create(
            username="estudiante1",
            email="estudiante1@test.com",
            rol="ESTUDIANTE",
            telefono="123456789",
            edad=20
        )

    def test_usuario_creation(self):
        usuario = Usuario.objects.get(username="estudiante1")
        self.assertEqual(usuario.rol, "ESTUDIANTE")
        self.assertEqual(usuario.edad, 20)

class EstudianteTests(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create(
            username="estudiante2",
            email="estudiante2@test.com",
            rol="ESTUDIANTE"
        )
        self.estudiante = Estudiante.objects.create(
            usuario=self.usuario,
            carrera="Ingeniería de Sistemas",
            ciclo=6,
            codigo_estudiante="2024001"
        )

    def test_estudiante_creation(self):
        estudiante = Estudiante.objects.get(codigo_estudiante="2024001")
        self.assertEqual(estudiante.carrera, "Ingeniería de Sistemas")
        self.assertEqual(estudiante.usuario.rol, "ESTUDIANTE")

class ModuloPracticasTests(TestCase):
    def setUp(self):
        self.modulo = ModuloPracticas.objects.create(
            nombre="Módulo de Prueba",
            descripcion="Descripción de prueba",
            tipo_modulo="MODULO1",
            horas_requeridas=120
        )

    def test_modulo_creation(self):
        modulo = ModuloPracticas.objects.get(nombre="Módulo de Prueba")
        self.assertEqual(modulo.tipo_modulo, "MODULO1")
        self.assertEqual(modulo.horas_requeridas, 120)

class PracticaTests(TestCase):
    def setUp(self):
        # Crear usuario estudiante
        self.estudiante_usuario = Usuario.objects.create(
            username="estudiante3",
            rol="ESTUDIANTE"
        )
        
        # Crear supervisor
        self.supervisor = Usuario.objects.create(
            username="supervisor1",
            rol="DOCENTE"
        )
        
        # Crear módulo
        self.modulo = ModuloPracticas.objects.create(
            nombre="Módulo Test",
            tipo_modulo="MODULO1"
        )
        
        # Crear práctica
        self.practica = Practica.objects.create(
            estudiante=self.estudiante_usuario,
            modulo=self.modulo,
            supervisor=self.supervisor,
            fecha_inicio="2024-01-01",
            fecha_fin="2024-06-30",
            estado="EN_CURSO",
            horas_completadas=0
        )

    def test_practica_creation(self):
        practica = Practica.objects.get(estudiante=self.estudiante_usuario)
        self.assertEqual(practica.estado, "EN_CURSO")
        self.assertEqual(practica.supervisor, self.supervisor)

    def test_calculo_nota_final(self):
        # Crear asistencia
        Asistencia.objects.create(
            practica=self.practica,
            fecha="2024-01-01",
            presente="ASISTIO",
            puntaje_general=18.5
        )
        
        # Crear evaluación
        Evaluacion.objects.create(
            practica=self.practica,
            jurado=self.supervisor,
            calificacion=17.5
        )
        
        # Crear informe
        Informe.objects.create(
            practica=self.practica,
            contenido="Contenido de prueba",
            aprobado=True
        )

        nota_final = self.practica.calcular_nota_final()
        self.assertIsNotNone(nota_final)
        self.assertTrue(0 <= nota_final <= 20)

