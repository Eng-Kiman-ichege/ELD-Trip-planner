from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, TripCreateView, TripStopsListView, DashboardAnalyticsView

router = DefaultRouter()
router.register(r'trips', TripViewSet, basename='trip')

urlpatterns = [
    path('trips/create/', TripCreateView.as_view(), name='trip_create'),
    path('trips/<int:id>/stops/', TripStopsListView.as_view(), name='trip_stops_list'),
    path('dashboard/analytics/', DashboardAnalyticsView.as_view(), name='dashboard_analytics'),
    path('', include(router.urls)),
]
