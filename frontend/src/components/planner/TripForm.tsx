import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { MapPin, Truck, Sliders, Settings, Calendar, Loader2, AlertTriangle } from "lucide-react"
import { api } from "../../lib/api"

// Autocomplete recommendations for US states, regions, and major cities
const cities = [
  // Major Logistics Cities
  "Dallas, TX", "Houston, TX", "Miami, FL", "Atlanta, GA", "Chicago, IL", 
  "Orlando, FL", "New York, NY", "Los Angeles, CA", "Seattle, WA", "Denver, CO", 
  "Boston, MA", "San Francisco, CA", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX",
  "San Diego, CA", "Detroit, MI", "Charlotte, NC", "Indianapolis, IN", "Columbus, OH",
  "Memphis, TN", "Nashville, TN", "Kansas City, MO", "St. Louis, MO", "Minneapolis, MN",
  "Salt Lake City, UT", "Las Vegas, NV", "Portland, OR", "Pittsburgh, PA", "Cleveland, OH",
  // All 50 US States & Regions
  "Alabama (AL)", "Alaska (AK)", "Arizona (AZ)", "Arkansas (AR)", "California (CA)",
  "Colorado (CO)", "Connecticut (CT)", "Delaware (DE)", "Florida (FL)", "Georgia (GA)",
  "Hawaii (HI)", "Idaho (ID)", "Illinois (IL)", "Indiana (IN)", "Iowa (IA)",
  "Kansas (KS)", "Kentucky (KY)", "Louisiana (LA)", "Maine (ME)", "Maryland (MD)",
  "Massachusetts (MA)", "Michigan (MI)", "Minnesota (MN)", "Mississippi (MS)", "Missouri (MO)",
  "Montana (MT)", "Nebraska (NE)", "Nevada (NV)", "New Hampshire (NH)", "New Jersey (NJ)",
  "New Mexico (NM)", "New York (NY)", "North Carolina (NC)", "North Dakota (ND)", "Ohio (OH)",
  "Oklahoma (OK)", "Oregon (OR)", "Pennsylvania (PA)", "Rhode Island (RI)", "South Carolina (SC)",
  "South Dakota (SD)", "Tennessee (TN)", "Texas (TX)", "Utah (UT)", "Vermont (VT)",
  "Virginia (VA)", "Washington (WA)", "West Virginia (WV)", "Wisconsin (WI)", "Wyoming (WY)",
  // US Regional Logistics Hubs
  "Northeast Region", "Southeast Region", "Midwest Region", "Southwest Region", 
  "Rocky Mountain Region", "Pacific Northwest", "West Coast Hub", "Gulf Coast Logistics Hub"
]

export const tripSchema = z.object({
  currentLocation: z.string().min(2, "Current location must be at least 2 characters"),
  pickupLocation: z.string().min(2, "Pickup location must be at least 2 characters"),
  dropoffLocation: z.string().min(2, "Dropoff location must be at least 2 characters"),
  currentCycleUsed: z.coerce.number().min(0).max(70),
  currentDrivingHoursToday: z.coerce.number().min(0).max(11),
  currentOnDutyHoursToday: z.coerce.number().min(0).max(14),
  truckNumber: z.string().min(1, "Truck number is required"),
  trailerNumber: z.string().min(1, "Trailer number is required"),
  fuelCapacity: z.coerce.number().min(50, "Capacity must be at least 50 gallons"),
  mpgEstimate: z.coerce.number().min(4, "Estimate must be at least 4 MPG"),
  optimizeFuel: z.boolean(),
  avoidTolls: z.boolean(),
  preferTruckSafe: z.boolean(),
  includeOvernight: z.boolean(),
  autoHOS: z.boolean(),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  pickupTime: z.string().min(1, "Estimated pickup time is required"),
})

export type TripFormData = z.infer<typeof tripSchema>

const defaultValues: TripFormData = {
  currentLocation: "",
  pickupLocation: "",
  dropoffLocation: "",
  currentCycleUsed: 0,
  currentDrivingHoursToday: 0,
  currentOnDutyHoursToday: 0,
  truckNumber: "",
  trailerNumber: "",
  fuelCapacity: 150,
  mpgEstimate: 6.5,
  optimizeFuel: true,
  avoidTolls: false,
  preferTruckSafe: true,
  includeOvernight: true,
  autoHOS: true,
  startDate: new Date().toISOString().split('T')[0],
  startTime: "08:00",
  pickupTime: "",
}

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  onChange: (data: TripFormData) => void;
}

const HUBS: Record<string, [number, number]> = {
  "dallas": [32.7767, -96.7970],
  "houston": [29.7604, -95.3698],
  "miami": [25.7617, -80.1918],
  "atlanta": [33.7490, -84.3880],
  "chicago": [41.8781, -87.6298],
  "orlando": [28.5384, -81.3789],
  "new york": [40.7128, -74.0060],
  "los angeles": [34.0522, -118.2437],
  "seattle": [47.6062, -122.3321],
  "denver": [39.7392, -104.9903],
  "birmingham": [33.5186, -86.8104],
}

export function TripForm({ onSubmit, onChange }: TripFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pickupTimeHint, setPickupTimeHint] = useState<string>("")
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(tripSchema),
    defaultValues,
  })

  // Watch entire form and bubble up to trigger live preview panel updates
  const watchedValues = watch()
  
  // Watch fields for dynamic Estimated Pickup Time calculation
  const watchedCurrent = watch("currentLocation")
  const watchedPickup = watch("pickupLocation")
  const watchedStartTime = watch("startTime")

  useEffect(() => {
    onChange(watchedValues)
  }, [JSON.stringify(watchedValues)])

  useEffect(() => {
    if (!watchedCurrent || !watchedPickup || !watchedStartTime) {
      setPickupTimeHint("");
      return;
    }

    const resolveCoords = async (loc: string) => {
      const clean = loc.toLowerCase().trim();
      const matched = Object.keys(HUBS).find(k => clean.includes(k));
      if (matched) return HUBS[matched];

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(loc)}`);
        const data = await res.json();
        if (data && data[0]) {
          return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
        }
      } catch (e) {
        console.error("OSM geocode lookup failed in form", e);
      }
      return null;
    };

    const timer = setTimeout(async () => {
      const c1 = await resolveCoords(watchedCurrent);
      const c2 = await resolveCoords(watchedPickup);

      if (c1 && c2) {
        // Haversine distance formula with winding/highway scale
        const R = 3958.8; // miles
        const dLat = (c2[0] - c1[0]) * Math.PI / 180;
        const dLon = (c2[1] - c1[1]) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c * 1.18; // 18% highway winding factor

        const driveHrs = distance / 55.0; // average truck speed ~55mph
        const totalBufferHrs = driveHrs + 0.5; // add 30-min pre-trip audit/inspection window

        // Parse start time (HH:MM) and add duration
        const [startH, startM] = watchedStartTime.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const pickupMinutes = Math.round(startMinutes + totalBufferHrs * 60);

        const pickupH = Math.floor((pickupMinutes / 60) % 24);
        const pickupM = Math.floor(pickupMinutes % 60);

        const formattedTime = `${String(pickupH).padStart(2, '0')}:${String(pickupM).padStart(2, '0')}`;
        setValue("pickupTime", formattedTime);
        setPickupTimeHint(`(${Math.round(distance)} mi, ${Math.round(driveHrs * 10) / 10}h transit)`);
      } else {
        setPickupTimeHint("");
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [watchedCurrent, watchedPickup, watchedStartTime]);

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.trips.create(data)
      // Bubble up the backend response (with the DB trip record details)
      onSubmit(response)
    } catch (err: any) {
      console.error("Trip creation error:", err)
      setError(err.message || "Failed to create trip. Please verify your Django server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      
      {/* SECTION 1 — Route Information */}
      <Card className="border-slate-200/50 shadow-sm dark:border-slate-800/50 dark:bg-slate-950/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-150">Route Information</h3>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Location</label>
              <input
                {...register("currentLocation")}
                placeholder="e.g. Dallas, TX"
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                list="cities"
              />
              {errors.currentLocation && <p className="text-[10px] text-red-500 font-semibold">{errors.currentLocation.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup Location</label>
              <input
                {...register("pickupLocation")}
                placeholder="e.g. Houston, TX"
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                list="cities"
              />
              {errors.pickupLocation && <p className="text-[10px] text-red-500 font-semibold">{errors.pickupLocation.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dropoff Location</label>
              <input
                {...register("dropoffLocation")}
                placeholder="e.g. Miami, FL"
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                list="cities"
              />
              {errors.dropoffLocation && <p className="text-[10px] text-red-500 font-semibold">{errors.dropoffLocation.message as string}</p>}
            </div>
          </div>
          
          <datalist id="cities">
            {cities.map((city) => <option key={city} value={city} />)}
          </datalist>
        </CardContent>
      </Card>

      {/* SECTION 2 — Driver Information */}
      <Card className="border-slate-200/50 shadow-sm dark:border-slate-800/50 dark:bg-slate-950/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            <Sliders className="h-5 w-5 text-purple-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-150">Driver HOS Parameters</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-wider">Current Cycle Used (Hours)</span>
                <span className="text-slate-800 dark:text-slate-200 font-mono">{watchedValues?.currentCycleUsed} / 70 hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                {...register("currentCycleUsed")}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Driving Hours Today</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  {...register("currentDrivingHoursToday")}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Duty Hours Today</label>
                <input
                  type="number"
                  min="0"
                  max="14"
                  {...register("currentOnDutyHoursToday")}
                  className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3 — Vehicle Information */}
      <Card className="border-slate-200/50 shadow-sm dark:border-slate-800/50 dark:bg-slate-950/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            <Truck className="h-5 w-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-150">Vehicle Profile</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Truck #</label>
              <input
                {...register("truckNumber")}
                placeholder="e.g. ELD-902"
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trailer #</label>
              <input
                {...register("trailerNumber")}
                placeholder="e.g. TR-5542"
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fuel Capacity (gal)</label>
              <input
                type="number"
                {...register("fuelCapacity")}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">MPG Estimate</label>
              <input
                type="number"
                step="0.1"
                {...register("mpgEstimate")}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4 — Trip Preferences */}
      <Card className="border-slate-200/50 shadow-sm dark:border-slate-800/50 dark:bg-slate-950/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            <Settings className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-150">Trip Preferences</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 p-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30">
              <input type="checkbox" {...register("optimizeFuel")} className="h-4 w-4 text-blue-600 rounded border-slate-350" />
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">Optimize Fuel Stops</p>
                <p className="text-slate-400">Add recommended stops based on truck range</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30">
              <input type="checkbox" {...register("avoidTolls")} className="h-4 w-4 text-blue-600 rounded border-slate-350" />
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">Avoid Toll Roads</p>
                <p className="text-slate-400">Calculate non-toll primary route</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30">
              <input type="checkbox" {...register("preferTruckSafe")} className="h-4 w-4 text-blue-600 rounded border-slate-350" />
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">Prefer Truck-Safe Routes</p>
                <p className="text-slate-400">Avoid low clearance/bridge weights</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30">
              <input type="checkbox" {...register("includeOvernight")} className="h-4 w-4 text-blue-600 rounded border-slate-350" />
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">Include Overnight Rest Parking</p>
                <p className="text-slate-400">Calculate 10-hour mandatory sleep stops</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30 sm:col-span-2">
              <input type="checkbox" {...register("autoHOS")} className="h-4 w-4 text-blue-600 rounded border-slate-350" />
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">Automatic HOS Compliance Audit</p>
                <p className="text-slate-400">Auto-inject 30-minute rest breaks after 8 hours of driving</p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5 — Scheduling */}
      <Card className="border-slate-200/50 shadow-sm dark:border-slate-800/50 dark:bg-slate-950/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            <Calendar className="h-5 w-5 text-red-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-150">Trip Scheduling</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
              <input
                type="time"
                {...register("startTime")}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Pickup Time</label>
                {pickupTimeHint && (
                  <span className="text-[10px] text-blue-500 font-extrabold animate-pulse">{pickupTimeHint}</span>
                )}
              </div>
              <input
                type="time"
                {...register("pickupTime")}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-250 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 rounded-2xl flex items-start gap-3 text-xs font-semibold">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 animate-pulse" />
          <div>
            <p className="font-extrabold text-sm mb-1">Route Planning Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* SECTION 6 — Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="submit"
          className="flex-1 h-12 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating Plan...
            </>
          ) : (
            "Generate Trip Plan"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => reset(defaultValues)}
          className="h-12 px-6 text-sm font-semibold"
          disabled={isLoading}
        >
          Reset Form
        </Button>
      </div>

    </form>
  )
}
