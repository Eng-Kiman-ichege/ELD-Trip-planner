from rest_framework import generics, status, serializers as drf_serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": UserSerializer(user).data,
                "message": "User registered successfully."
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Allow login with email OR username + password."""

    def validate(self, attrs):
        # If the credential contains '@' treat it as an email and
        # resolve it to the matching username so SimpleJWT can proceed.
        credential = attrs.get(self.username_field, "")
        if "@" in credential:
            try:
                user_obj = User.objects.get(email__iexact=credential)
                attrs[self.username_field] = user_obj.username
            except User.DoesNotExist:
                raise drf_serializers.ValidationError(
                    {"detail": "No account found with that email address."}
                )

        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'company_name': self.user.company_name,
            'phone': self.user.phone,
        }
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
