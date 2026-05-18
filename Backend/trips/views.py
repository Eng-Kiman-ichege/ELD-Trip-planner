from datetime import datetime
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Trip, Stop
from .serializers import TripSerializer, StopSerializer
from services.routing_service import RoutingService
from services.hos_service import HosService
from services.eld_service import EldService
from logs.models import DriverLog

class TripCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TripSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        
        # Extract inputs with defaults
        current_location = data.get("currentLocation", "Dallas, TX")
        pickup_location = data.get("pickupLocation", "Houston, TX")
        dropoff_location = data.get("dropoffLocation", "Miami, FL")
        current_cycle_used = float(data.get("currentCycleUsed", 22))
        
        start_date = data.get("startDate", datetime.now().strftime("%Y-%m-%d"))
        start_time = data.get("startTime", "08:00")
        
        # 1. Generate realistic routing path coordinates and miles
        route = RoutingService.get_route(pickup_location, dropoff_location)
        
        # 2. Run HOS & rest break engine
        schedule = HosService.calculate_schedule(
            distance_miles=route["distance_miles"],
            duration_hours=route["duration_hours"],
            current_cycle_used=current_cycle_used,
            current_driving_hours_today=float(data.get("currentDrivingHoursToday", 4)),
            current_on_duty_hours_today=float(data.get("currentOnDutyHoursToday", 5)),
            start_date_str=start_date,
            start_time_str=start_time,
            origin_name=route["origin"],
            destination_name=route["destination"],
            coordinates=route["coordinates"]
        )

        # 3. Create Trip database record
        trip = Trip.objects.create(
            user=request.user,
            current_location=current_location,
            pickup_location=route["origin"],
            dropoff_location=route["destination"],
            current_cycle_used=current_cycle_used,
            total_distance=route["distance_miles"],
            total_duration=schedule["total_duration_hours"],
            estimated_fuel_stops=schedule["estimated_fuel_stops"],
            estimated_rest_stops=schedule["estimated_rest_stops"],
            estimated_trip_days=schedule["estimated_trip_days"],
            is_hos_compliant=schedule["is_hos_compliant"],
            route_geometry=route["route_geometry"]
        )

        # 4. Save Stop instances
        stops_instances = []
        for s in schedule["stops"]:
            stop_obj = Stop.objects.create(
                trip=trip,
                stop_type=s["stop_type"],
                location_name=s["location_name"],
                latitude=s["latitude"],
                longitude=s["longitude"],
                arrival_time=s["arrival_time"],
                departure_time=s["departure_time"],
                duration_minutes=s["duration_minutes"],
                fuel_required=s["fuel_required"],
                notes=s["notes"]
            )
            stops_instances.append(stop_obj)

        # 5. Build daily HOS logs
        try:
            start_dt = datetime.strptime(f"{start_date} {start_time}", "%Y-%m-%d %H:%M")
        except Exception:
            start_dt = datetime.now()

        daily_logs = EldService.generate_daily_logs(start_dt, schedule["stops"], schedule["arrival_time"])
        
        for day_log in daily_logs:
            for segment in day_log["segments"]:
                DriverLog.objects.create(
                    trip=trip,
                    day_number=day_log["day_number"],
                    duty_status=segment["duty_status"],
                    start_time=segment["start_dt"],
                    end_time=segment["end_dt"],
                    duration_minutes=segment["duration_minutes"]
                )

        # 6. Respond with full integrated response
        serializer = TripSerializer(trip)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TripViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TripSerializer

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        # Fallback basic creation if required
        serializer.save(user=self.request.user)


class TripStopsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StopSerializer

    def get_queryset(self):
        trip_id = self.kwargs.get("id")
        return Stop.objects.filter(trip__id=trip_id, trip__user=self.request.user)


class DashboardAnalyticsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        from services.analytics_service import AnalyticsService
        analytics = AnalyticsService.get_user_analytics(request.user)
        return Response(analytics, status=status.HTTP_200_OK)
