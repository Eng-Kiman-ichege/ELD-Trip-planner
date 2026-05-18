from datetime import datetime, time, timedelta

class EldService:
    @staticmethod
    def generate_daily_logs(start_dt: datetime, stops: list, end_dt: datetime):
        # 1. Build a continuous chronological list of status periods
        timeline = []
        
        # Day 1 Midnight
        day1_midnight = datetime.combine(start_dt.date(), time.min)
        
        # Add pre-trip Off-Duty period from midnight to the first stop's arrival
        first_arrival = stops[0]["arrival_time"] if stops else start_dt
        if first_arrival > day1_midnight:
            timeline.append({
                "status": "off_duty",
                "start": day1_midnight,
                "end": first_arrival
            })

        # Process stops and driving segments
        last_departure = start_dt
        
        for stop in stops:
            # Driving segment from last departure to this stop's arrival
            if stop["arrival_time"] > last_departure:
                timeline.append({
                    "status": "driving",
                    "start": last_departure,
                    "end": stop["arrival_time"]
                })
            
            # Map stop type to standard DOT ELD duty status
            status_map = {
                "pickup": "on_duty",
                "dropoff": "on_duty",
                "fuel": "on_duty",
                "break": "off_duty",
                "sleeper": "sleeper"
            }
            duty_status = status_map.get(stop["stop_type"], "off_duty")
            
            timeline.append({
                "status": duty_status,
                "start": stop["arrival_time"],
                "end": stop["departure_time"]
            })
            last_departure = stop["departure_time"]

        # Add post-trip Off-Duty segment until midnight of the last day
        last_day_midnight = datetime.combine(end_dt.date() + timedelta(days=1), time.min)
        if last_day_midnight > last_departure:
            timeline.append({
                "status": "off_duty",
                "start": last_departure,
                "end": last_day_midnight
            })

        # 2. Divide the continuous timeline into 24-hour daily logs
        daily_logs = []
        num_days = (end_dt.date() - start_dt.date()).days + 1
        
        for d in range(num_days):
            current_day_date = start_dt.date() + timedelta(days=d)
            day_start = datetime.combine(current_day_date, time.min)
            day_end = datetime.combine(current_day_date, time.max)
            
            day_segments = []
            
            for period in timeline:
                # Find intersection of status period with current calendar day
                overlap_start = max(period["start"], day_start)
                overlap_end = min(period["end"], day_end)
                
                if overlap_start < overlap_end:
                    duration_min = int(round((overlap_end - overlap_start).total_seconds() / 60.0))
                    if duration_min > 0:
                        day_segments.append({
                            "duty_status": period["status"],
                            "start_time": overlap_start.strftime("%I:%M %p"),
                            "end_time": overlap_end.strftime("%I:%M %p"),
                            "duration_minutes": duration_min,
                            # Keep absolute times for serialization
                            "start_dt": overlap_start,
                            "end_dt": overlap_end
                        })
            
            # Clean segments up to sum exactly 1440 minutes if there's any rounding deviation
            total_mins = sum(s["duration_minutes"] for s in day_segments)
            if total_mins != 1440 and day_segments:
                # Add or subtract diff to the last segment
                diff = 1440 - total_mins
                day_segments[-1]["duration_minutes"] = max(0, day_segments[-1]["duration_minutes"] + diff)

            daily_logs.append({
                "day_number": d + 1,
                "date": current_day_date.strftime("%Y-%m-%d"),
                "segments": day_segments
            })

        return daily_logs
