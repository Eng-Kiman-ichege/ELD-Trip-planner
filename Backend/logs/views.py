from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DriverLog
from .serializers import DriverLogSerializer

class TripLogsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DriverLogSerializer

    def get_queryset(self):
        trip_id = self.kwargs.get("id")
        return DriverLog.objects.filter(
            trip__id=trip_id, 
            trip__user=self.request.user
        ).order_by("day_number", "start_time")
