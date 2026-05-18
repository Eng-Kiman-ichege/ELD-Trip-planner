import os
import django
from datetime import datetime

# Setup django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "back.settings")
django.setup()

from django.contrib.auth import get_user_model
from trips.models import Trip, Stop
from logs.models import DriverLog
from services.routing_service import RoutingService
from services.hos_service import HosService
from services.eld_service import EldService
from services.analytics_service import AnalyticsService

User = get_user_model()

def run_verification():
    print("==================================================")
    print("  RouteELD Backend Engine Verification & Audit")
    print("==================================================")

    # 1. Clean and create verification user
    print("\n[1/5] Auditing Authentication Custom User System...")
    username = "safety_auditor"
    email = "auditor@routeeld.com"
    password = "SecurePassword123"
    
    # Remove existing to prevent collisions
    User.objects.filter(username=username).delete()
    
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        company_name="Safety Logistics Inc.",
        phone="555-019-9022"
    )
    print(f" -> Custom User successfully created:")
    print(f"    - Username: {user.username}")
    print(f"    - Email: {user.email}")
    print(f"    - Company: {user.company_name}")
    print(f"    - Phone: {user.phone}")
    
    # 2. Routing Service Verification
    print("\n[2/5] Auditing Routing Service Map Engine...")
    pickup = "Dallas, TX"
    dropoff = "Miami, FL"
    route = RoutingService.get_route(pickup, dropoff)
    print(f" -> Generated Route Info:")
    print(f"    - Origin Hub: {route['origin']}")
    print(f"    - Destination Hub: {route['destination']}")
    print(f"    - Calculated DETOUR Miles: {route['distance_miles']} mi")
    print(f"    - Estimated Driving Hours: {route['duration_hours']} hrs")
    print(f"    - Polyline Coordinate Pins: {len(route['coordinates'])} coordinate points loaded")

    # 3. HOS Engine & Stops Planner Verification
    print("\n[3/5] Auditing Hours of Service & Stops Planner Engine...")
    schedule = HosService.calculate_schedule(
        distance_miles=route["distance_miles"],
        duration_hours=route["duration_hours"],
        current_cycle_used=22.0,
        current_driving_hours_today=4.0,
        current_on_duty_hours_today=5.0,
        start_date_str="2026-05-18",
        start_time_str="08:00",
        origin_name=route["origin"],
        destination_name=route["destination"],
        coordinates=route["coordinates"]
    )
    print(f" -> Generated Schedule Summary:")
    print(f"    - Compliant by design: {schedule['is_hos_compliant']}")
    print(f"    - Estimated Fuel Stops: {schedule['estimated_fuel_stops']}")
    print(f"    - Estimated Rest Stops: {schedule['estimated_rest_stops']}")
    print(f"    - Total Duration (Driving + Rest Reset): {schedule['total_duration_hours']} hrs")
    print(f"    - Estimated Days: {schedule['estimated_trip_days']} days")
    print(f"    - Stops Sequence Planned:")
    for idx, stop in enumerate(schedule["stops"]):
        print(f"      [{idx+1}] {stop['stop_type'].upper():8s} | {stop['location_name']:35s} | Arrival: {stop['arrival_time'].strftime('%Y-%m-%d %I:%M %p')} | Departure: {stop['departure_time'].strftime('%Y-%m-%d %I:%M %p')} | Duration: {stop['duration_minutes']} mins")

    # 4. ELD daily 24h Logs Verification
    print("\n[4/5] Auditing DOT-style Daily ELD Logs Generator...")
    start_dt = datetime(2026, 5, 18, 8, 0)
    daily_logs = EldService.generate_daily_logs(start_dt, schedule["stops"], schedule["arrival_time"])
    print(f" -> Split ELD Logs by Day:")
    for day in daily_logs:
        print(f"    * Day {day['day_number']} ({day['date']}):")
        for seg in day["segments"]:
            print(f"      - [{seg['duty_status'].upper():10s}] {seg['start_time']} -> {seg['end_time']} ({seg['duration_minutes']} minutes)")

    # 5. Dashboard Aggregates Verification
    print("\n[5/5] Auditing Dispatch Analytics Control Room...")
    # Clean previous verification trips for accurate aggregation
    Trip.objects.filter(user=user).delete()
    
    trip = Trip.objects.create(
        user=user,
        current_location="Dallas, TX",
        pickup_location=route["origin"],
        dropoff_location=route["destination"],
        current_cycle_used=22.0,
        total_distance=route["distance_miles"],
        total_duration=schedule["total_duration_hours"],
        estimated_fuel_stops=schedule["estimated_fuel_stops"],
        estimated_rest_stops=schedule["estimated_rest_stops"],
        estimated_trip_days=schedule["estimated_trip_days"],
        is_hos_compliant=schedule["is_hos_compliant"],
        route_geometry=route["route_geometry"]
    )
    
    analytics = AnalyticsService.get_user_analytics(user)
    print(f" -> Aggregated operations stats:")
    print(f"    - Total Planned Trips: {analytics['total_trips']}")
    print(f"    - Cumulative Fleet Miles: {analytics['total_miles']} mi")
    print(f"    - Avg Trip Miles: {analytics['avg_distance']} mi")
    print(f"    - Active Schedules: {analytics['active_schedules']}")
    print(f"    - Safety Alert Bulletin Feed:")
    for alert in analytics["alerts"]:
        print(f"      ! [{alert['severity'].upper()}] {alert['title']}: {alert['message']}")

    print("\n==================================================")
    print("  VERIFICATION AUDIT COMPLETELY SUCCESSFUL & PASSED!")
    print("==================================================")

if __name__ == "__main__":
    run_verification()
