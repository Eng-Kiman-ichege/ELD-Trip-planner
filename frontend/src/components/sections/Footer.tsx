import { Truck, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Truck className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold tracking-tight">RouteELD</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered logistics SaaS platform making Hours of Service compliance and complex route planning effortless for the modern trucking industry.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Route Planner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ELD Daily Logs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance Engine</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
            </div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} RouteELD Inc. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}
