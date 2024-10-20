from rest_framework import permissions

class EsAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'ADMIN'

class EsEncargadoPracticas(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'PRACTICAS'

class EsEncargadoFUA(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'FUA'

class EsCordinadorAcademico(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'COORDINADOR'

class EsSecretaria(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'SECRETARIA'

class EsDocente(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'DOCENTE'

class EsEstudiante(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'ESTUDIANTE'

class EsJurado(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'JURADO'

class EsAdministradorOEncargadoPracticas(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol in ['ADMIN', 'PRACTICAS']