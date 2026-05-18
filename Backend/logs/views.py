from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DriverLog
from .serializers import DriverLogSerializer

class TripLogsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DriverLogSerializer

    def get(self, request, *args, **kwargs):
        trip_id = self.kwargs.get("id")
        logs = DriverLog.objects.filter(
            trip__id=trip_id, 
            trip__user=request.user
        ).order_by("day_number", "start_time")
        
        # Group segments by day number
        grouped_logs = {}
        for log in logs:
            day = log.day_number
            if day not in grouped_logs:
                grouped_logs[day] = {
                    "day_number": day,
                    "date": log.start_time.strftime("%Y-%m-%d"),
                    "segments": []
                }
            
            grouped_logs[day]["segments"].append({
                "id": log.id,
                "duty_status": log.duty_status,
                "start_time": log.start_time.strftime("%I:%M %p"),
                "end_time": log.end_time.strftime("%I:%M %p"),
                "duration_minutes": log.duration_minutes
            })
            
        return Response(list(grouped_logs.values()), status=status.HTTP_200_OK)
