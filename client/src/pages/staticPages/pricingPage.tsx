import { Check } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PricingPage() {
  return (
    <section className="min-h-dvh w-full bg-background bg-[radial-gradient(circle_at_center,theme(colors.chart-bg)_10%,transparent_80%)] px-4 py-24 flex items-center justify-center">
      <Card className="w-full max-w-md border border-muted rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold">Free Trial</CardTitle>
          <CardDescription>Early Access Free Trial</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-extrabold tracking-tight">₹0<span className="text-base font-medium text-muted-foreground"> /month</span></p>
          </div>

          <ul className="space-y-3 text-sm w-full">
            {[
              "Unlimited uploads",
              "Priority support",
              "Collaborator management",
              "Full access to analytics",
              "Early access to new features"
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-1" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button className="w-full">Get Started</Button>
        </CardFooter>
      </Card>
    </section>
  )
}
