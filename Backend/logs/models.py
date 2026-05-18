from django.db import models

class DriverLog(models.Model):
    DUTY_STATUSES = [
        ("off_duty", "Off Duty"),
        ("sleeper", "Sleeper Berth"),
        ("driving", "Driving"),
        ("on_duty", "On Duty (Not Driving)"),
    ]

    trip = models.ForeignKey(
        "trips.Trip",
        on_delete=models.CASCADE,
        related_name="driver_logs"
    )
    day_number = models.IntegerField()
    duty_status = models.CharField(max_length=50, choices=DUTY_STATUSES)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration_minutes = models.IntegerField()

    def __str__(self):
        return f"Day {self.day_number}: {self.duty_status} ({self.duration_minutes} mins)"
