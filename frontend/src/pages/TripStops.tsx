import { useNavigate } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { RouteMap } from "../components/shared/RouteMap"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { 
  Fuel, Moon, Package, MapPin, Coffee, AlertTriangle, 
  CheckCircle2, Compass, ChevronRight, Gauge 
} from "lucide-react"

// Complete Stops sequence details
interface StopDetail {
  type: "pickup" | "fuel" | "rest" | "sleep" | "dropoff";
  name: string;
  location: string;
  arrival: string;
  departure: string;
  duration: string;
  status: string;
  fuelText: string;
  eta: string;
  remainingDistance: string;
  remainingFuel: string;
  weather: string;
  notes: string;
}

const detailedStops: StopDetail[] = [
  {
    type: "pickup",
    name: "Dallas Terminal Cargo Hub",
    location: "440 Logistics Way, Dallas, TX",
    arrival: "Day 1, 07:00 AM",
    departure: "Day 1, 08:30 AM",
    duration: "1.5 hrs",
    status: "ON Duty (Pre-trip Inspection)",
    fuelText: "Tank Full (300 gal)",
    eta: "On Schedule",
    remainingDistance: "1,180 miles to destination",
    remainingFuel: "300 gallons (100%)",
    weather: "Clear, 72°F",
    notes: "Pre-trip HOS verification complete. Standard trailer cargo seals verified."
  },
  {
    type: "fuel",
    name: "Loves Travel Stop #48",
    location: "I-20 Exit 556, Lindale, TX",
    arrival: "Day 1, 12:30 PM",
    departure: "Day 1, 01:00 PM",
    duration: "30 mins",
    status: "ON Duty (Not Driving)",
    fuelText: "Refueled +110 gal",
    eta: "ETA 12:30 PM (On Time)",
    remainingDistance: "940 miles to destination",
    remainingFuel: "280 gallons remaining",
    weather: "Sunny, 78°F",
    notes: "Fuel price optimized ($3.72/gal). Walkaround tire pressure check verified."
  },
  {
    type: "rest",
    name: "Meridian Pilot Travel Center",
    location: "120 Hwy 45, Meridian, MS",
    arrival: "Day 1, 04:30 PM",
    departure: "Day 1, 05:00 PM",
    duration: "30 mins",
    status: "OFF Duty (Rest Break)",
    fuelText: "No Fuel Needed",
    eta: "ETA 04:25 PM (5m Early)",
    remainingDistance: "560 miles to destination",
    remainingFuel: "210 gallons remaining",
    weather: "Overcast, 74°F",
    notes: "Mandatory 30-minute rest break taken. HOS continuous driving clock reset successfully."
  },
  {
    type: "sleep",
    name: "Atlanta Interstate Rest Oasis",
    location: "I-75 South Exit 238, Atlanta, GA",
    arrival: "Day 1, 08:00 PM",
    departure: "Day 2, 06:00 AM",
    duration: "10.0 hrs",
    status: "Sleeper Berth (Overnight Stop)",
    fuelText: "No Fuel Needed",
    eta: "ETA 07:55 PM (On Time)",
    remainingDistance: "480 miles to destination",
    remainingFuel: "170 gallons remaining",
    weather: "Rainy, 68°F",
    notes: "Mandatory 10-hour sleeper berth reset. Secured parking reserve activated."
  },
  {
    type: "rest",
    name: "Orlando Logistics Depot",
    location: "880 Port Way, Orlando, FL",
    arrival: "Day 2, 09:30 AM",
    departure: "Day 2, 10:00 AM",
    duration: "30 mins",
    status: "ON Duty (Trailer Inspection)",
    fuelText: "No Fuel Needed",
    eta: "ETA 09:20 AM (10m Early)",
    remainingDistance: "230 miles to destination",
    remainingFuel: "120 gallons remaining",
    weather: "Humid, 82°F",
    notes: "Mid-route trailer connection check complete. Heavy traffic reported on I-95 south."
  },
  {
    type: "dropoff",
    name: "Miami Port Cargo Terminal",
    location: "Miami Port Gate 4, Miami, FL",
    arrival: "Day 2, 02:00 PM",
    departure: "N/A",
    duration: "Post-Trip Release",
    status: "ON Duty (Cargo Handover)",
    fuelText: "Tank Level Low (80 gal)",
    eta: "ETA 02:00 PM (On Time)",
    remainingDistance: "Arrived",
    remainingFuel: "80 gallons remaining",
    weather: "Sunny, 85°F",
    notes: "Post-trip HOS audit submitted. Trailer cargo discharge signed and processed."
  }
]

export function TripStops() {
  const navigate = useNavigate()

  // Get icons according to stop type
  const getStopIcon = (type: StopDetail["type"]) => {
    switch (type) {
      case "pickup":
        return <Package className="h-5 w-5 text-blue-500" />
      case "fuel":
        return <Fuel className="h-5 w-5 text-amber-500" />
      case "rest":
        return <Coffee className="h-5 w-5 text-emerald-500" />
      case "sleep":
        return <Moon className="h-5 w-5 text-indigo-500" />
      case "dropoff":
        return <MapPin className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <PageContainer className="bg-slate-50 dark:bg-slate-950">
      <div className="container relative mx-auto px-4 md:px-6 space-y-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/trip/1")} 
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer focus:outline-none"
          >
            Trip Results
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-xs font-bold text-slate-400 dark:text-slate-650">Stops Timeline</span>
        </div>

        {/* A. Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3 max-w-[800px]">
            <Badge className="bg-indigo-600/90 text-white border-0 flex items-center gap-1.5 h-6 text-[10px] uppercase font-bold tracking-wider px-3 rounded-full w-fit">
              <Compass className="h-3.5 w-3.5" /> Route Intelligence
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
              Trip Stops & Schedule Timeline
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
              View all generated fuel stops, rest breaks, overnight stops, and delivery checkpoints.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="outline" className="h-9 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => navigate("/trip/1")}>
              View Route Results
            </Button>
            <Button variant="outline" className="h-9 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => navigate("/trip/1/logs")}>
              View ELD Logs
            </Button>
            <Button variant="outline" className="h-9 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => navigate("/planner")}>
              Back To Planner
            </Button>
          </div>
        </div>

        {/* F. Trip Metrics Dashboard */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 pt-2">
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Stops</span>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">6 stops</p>
            <span className="text-[9px] font-bold text-slate-400">2 terminals + 4 stops</span>
          </Card>
          
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fuel Stops</span>
            <p className="text-3xl font-black text-amber-500">1 stop</p>
            <span className="text-[9px] font-bold text-slate-400">Loves Fuel Stop #48</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Overnight Rest Stops</span>
            <p className="text-3xl font-black text-indigo-500">1 sleep</p>
            <span className="text-[9px] font-bold text-slate-400">Atlanta Rest Oasis</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Rest Duration</span>
            <p className="text-3xl font-black text-emerald-500">11.0 hrs</p>
            <span className="text-[9px] font-bold text-slate-400">HOS reset + rest breaks</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fuel Consumption</span>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">180 gal</p>
            <span className="text-[9px] font-bold text-slate-400">Avg 6.5 MPG estimate</span>
          </Card>
        </div>

        {/* Main Two Column Split: Map Preview and Timeline Detail */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* LEFT COLUMN: Vertical Timeline chronology stop details */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Stops Schedule Breakdown</h3>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-250 dark:border-emerald-800 font-bold text-[10px]">
                Compliant (Score 100)
              </Badge>
            </div>

            {/* B. Interactive Trip Timeline */}
            <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 dark:border-slate-800 ml-4 pt-1">
              
              {detailedStops.map((stop, idx) => (
                <div key={idx} className="relative group">
                  
                  {/* Floating Indicator icon */}
                  <div className="absolute -left-10 top-0.5 h-8 w-8 rounded-full border border-slate-200 bg-white dark:border-slate-850 dark:bg-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    {getStopIcon(stop.type)}
                  </div>

                  <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-6 rounded-2xl shadow-lg hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-colors">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                          Stop {idx + 1} • {stop.type}
                        </span>
                        <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 leading-snug">{stop.name}</h4>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-blue-50/80 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 border-0 h-5 text-[9px] font-bold uppercase rounded-md px-2.5">
                          {stop.arrival}
                        </Badge>
                        <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-0 h-5 text-[9px] font-bold uppercase rounded-md px-2.5">
                          Dur: {stop.duration}
                        </Badge>
                      </div>
                    </div>

                    {/* C. Stop Detail Cards content */}
                    <div className="grid gap-4 sm:grid-cols-2 text-xs font-semibold leading-relaxed mb-4">
                      <div className="space-y-1.5 text-slate-500 dark:text-slate-450">
                        <p>📍 Location: <span className="text-slate-850 dark:text-slate-200">{stop.location}</span></p>
                        <p>⏱️ Status: <span className="text-slate-850 dark:text-slate-200">{stop.status}</span></p>
                        <p>⛽ Fuel Action: <span className="text-amber-500 dark:text-amber-400">{stop.fuelText}</span></p>
                      </div>
                      <div className="space-y-1.5 text-slate-500 dark:text-slate-450">
                        <p>🚀 ETA Status: <span className="text-emerald-500 font-bold">{stop.eta}</span></p>
                        <p>📦 Fuel Stock: <span className="text-slate-850 dark:text-slate-200">{stop.remainingFuel}</span></p>
                        <p>☁️ Weather: <span className="text-slate-850 dark:text-slate-200">{stop.weather}</span></p>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/50 border border-blue-100/60 dark:bg-blue-950/20 dark:border-blue-900/20 rounded-xl flex items-start gap-2 text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                      <p className="font-semibold">{stop.notes}</p>
                    </div>

                  </Card>
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT COLUMN: React Leaflet mini preview & logistics recommendations */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            
            {/* D. Mini Route Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">Active Dispatch Route Map</h3>
                <Badge className="bg-blue-500 text-white h-5 text-[9px] font-bold rounded-md uppercase">Vegas Hub Map</Badge>
              </div>
              
              <RouteMap height="340px" zoomLevel={5} />
            </div>

            {/* E. Smart Logistics Recommendations */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">AI Route Intelligence</h3>
              
              <div className="space-y-3">
                <Card className="border-l-4 border-l-amber-500 border border-slate-200/50 bg-white/70 dark:border-slate-850 dark:bg-slate-950/70 p-4 shadow-sm flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">Reserved Truck Parking Available</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-semibold mt-1">
                      Atlanta Rest Oasis parking remains at 82% capacity. Pre-booked sleeper slot #144 verified and confirmed secured.
                    </p>
                  </div>
                </Card>

                <Card className="border-l-4 border-l-red-500 border border-slate-200/50 bg-white/70 dark:border-slate-850 dark:bg-slate-950/70 p-4 shadow-sm flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">Road Jam entering Miami</h5>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal font-semibold mt-1">
                      Heavy traffic delays of ~20m reported on I-95 south near Miami cargo gates. Planner recommends utilizing outer terminal lanes.
                    </p>
                  </div>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 border border-slate-200/50 bg-white/70 dark:border-slate-850 dark:bg-slate-950/70 p-4 shadow-sm flex gap-3">
                  <Gauge className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">Fuel Prices Optimized</h5>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal font-semibold mt-1">
                      Refueling complete at Loves Travel Stop #48 at $3.72/gal, saving $0.34/gal compared to standard metropolitan fuel depots.
                    </p>
                  </div>
                </Card>
              </div>

            </div>

          </div>

        </div>

      </div>
    </PageContainer>
  )
}
