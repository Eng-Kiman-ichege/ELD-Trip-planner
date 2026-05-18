import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { MapPin, Truck, Sliders, Settings, Calendar, Loader2 } from "lucide-react"

// Autocomplete recommendations
const cities = ["Dallas, TX", "Houston, TX", "Miami, FL", "Atlanta, GA", "Chicago, IL", "Orlando, FL", "New York, NY", "Los Angeles, CA"]

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
  currentLocation: "Dallas, TX",
  pickupLocation: "Houston, TX",
  dropoffLocation: "Miami, FL",
  currentCycleUsed: 22,
  currentDrivingHoursToday: 4,
  currentOnDutyHoursToday: 5,
  truckNumber: "ELD-902",
  trailerNumber: "TR-5542",
  fuelCapacity: 150,
  mpgEstimate: 6.5,
  optimizeFuel: true,
  avoidTolls: false,
  preferTruckSafe: true,
  includeOvernight: true,
  autoHOS: true,
  startDate: new Date().toISOString().split('T')[0],
  startTime: "08:00",
  pickupTime: "10:00",
}

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  onChange: (data: TripFormData) => void;
}

export function TripForm({ onSubmit, onChange }: TripFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(tripSchema),
    defaultValues,
  })

  // Watch entire form and bubble up to trigger live preview panel updates
  const watchedValues = watch()
  useEffect(() => {
    onChange(watchedValues)
  }, [JSON.stringify(watchedValues)])

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true)
    // Simulate API request calculation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    onSubmit(data as TripFormData)
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Pickup Time</label>
              <input
                type="time"
                {...register("pickupTime")}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-lg text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
