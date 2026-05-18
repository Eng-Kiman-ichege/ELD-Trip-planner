from django.db import models
from django.conf import settings

class Trip(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trips"
    )
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.FloatField(default=0.0)
    
    total_distance = models.FloatField(default=0.0)  # in miles
    total_duration = models.FloatField(default=0.0)  # in hours
    estimated_fuel_stops = models.IntegerField(default=0)
    estimated_rest_stops = models.IntegerField(default=0)
    estimated_trip_days = models.IntegerField(default=1)
    is_hos_compliant = models.BooleanField(default=True)
    
    # JSON coordinates array representing standard polyline path
    route_geometry = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pickup_location} to {self.dropoff_location} ({self.total_distance} mi)"


class Stop(models.Model):
    STOP_TYPES = [
        ("pickup", "Pickup Location"),
        ("dropoff", "Dropoff Location"),
        ("fuel", "Fuel Stop"),
        ("break", "HOS Rest Break"),
        ("rest", "Overnight Sleep Stop"),
        ("sleeper", "Sleeper Berth Rest"),
    ]

    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="stops"
    )
    stop_type = models.CharField(max_length=50, choices=STOP_TYPES)
    location_name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    arrival_time = models.DateTimeField()
    departure_time = models.DateTimeField()
    duration_minutes = models.IntegerField(default=0)
    fuel_required = models.FloatField(default=0.0)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.stop_type} at {self.location_name}"
