import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

export interface RuleStatus {
  name: string;
  limit: string;
  used: string;
  status: "compliant" | "warning" | "violation";
  description: string;
}

interface ComplianceStatusProps {
  rules: RuleStatus[];
}

export function ComplianceStatus({ rules }: ComplianceStatusProps) {
  const getStatusInfo = (status: RuleStatus["status"]) => {
    switch (status) {
      case "compliant":
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          badge: <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800">Compliant</Badge>,
          border: "border-green-100 dark:border-green-900/30",
          shadow: "shadow-green-500/5"
        }
      case "warning":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          badge: <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">Warning</Badge>,
          border: "border-amber-100 dark:border-amber-900/30",
          shadow: "shadow-amber-500/5"
        }
      case "violation":
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          badge: <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800">Violation</Badge>,
          border: "border-red-100 dark:border-red-900/30",
          shadow: "shadow-red-500/5"
        }
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {rules.map((rule) => {
        const info = getStatusInfo(rule.status);
        return (
          <Card key={rule.name} className={`border ${info.border} shadow-sm ${info.shadow} hover:shadow-md transition-shadow`}>
            <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {info.icon}
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{rule.name}</h4>
                </div>
                {info.badge}
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Limit</span>
                  <span className="text-sm font-bold">{rule.limit}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Current Used</span>
                  <span className={`text-sm font-bold ${rule.status === "violation" ? "text-red-500" : "text-slate-800 dark:text-slate-200"}`}>
                    {rule.used}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{rule.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
