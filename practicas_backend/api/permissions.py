from rest_framework import permissions

class EsAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'ADMIN'

class EsEncargadoFUA(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'FUA'

class EsEncargadoPracticas(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'PRACTICAS'

class EsCoordinadorAcademico(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'COORDINADOR'

class EsSecretaria(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'SECRETARIA'

class EsDocente(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'DOCENTE'

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'supervisor'):
            return obj.supervisor == request.user
        return False

class EsEstudiante(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'ESTUDIANTE'

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'estudiante'):
            return obj.estudiante == request.user
        return False

class EsJurado(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol == 'JURADO'

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'jurado'):
            return obj.jurado == request.user
        return False

class EsAdminOEncargado(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.rol in ['ADMIN', 'FUA', 'PRACTICAS']

class PermisosModuloPracticas(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.rol in ['ADMIN', 'PRACTICAS']

class EsEstudiante(permissions.BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'perfil_estudiante')
