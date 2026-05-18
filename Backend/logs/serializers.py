from rest_framework import serializers
from .models import DriverLog

class DriverLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverLog
        fields = '__all__'
