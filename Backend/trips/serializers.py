import json
from rest_framework import serializers
from .models import Trip, Stop

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, read_only=True)
    coordinates = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = '__all__'

    def get_coordinates(self, obj):
        if obj.route_geometry:
            try:
                return json.loads(obj.route_geometry)
            except Exception:
                return []
        return []
