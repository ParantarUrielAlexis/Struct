from django.http import HttpResponseForbidden

def role_required(role):
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            # Allow superusers to bypass role checks
            if request.user.is_superuser:
                return view_func(request, *args, **kwargs)

            # Check if the user has a profile and the required role
            if not hasattr(request.user, 'profile') or request.user.profile.role != role:
                return HttpResponseForbidden("You do not have permission to access this page.")

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator