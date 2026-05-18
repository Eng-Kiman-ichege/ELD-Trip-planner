from django.urls import path
from .views import TripLogsListView

urlpatterns = [
    path('trips/<int:id>/logs/', TripLogsListView.as_view(), name='trip_logs_list'),
]
