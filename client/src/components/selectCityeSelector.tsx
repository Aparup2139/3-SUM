import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { cityMeta } from "./pagesUi/eventCityPage/leftContent"
import { useNavigate } from "react-router-dom"


const otherCities = [
  "Aalo", "Acharapakkam", "Adilabad", "Agra", "Ajmer", "Akola", "Alappuzha",
  "Alibaug", "Aligarh", "Allagadda", "Aizawl", "Ahmednagar", "Abu Road", "Adoni"
]

export function CitySelectorDialog({ setOpen, open, onClose }: { setOpen: any, open: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select your city</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <Input placeholder="Search for your city" className="w-full" />

          <div>
            <h3 className="text-base font-medium mb-3">Popular Cities</h3>
            <div className="grid grid-cols-5 gap-4">
              {cityMeta.map((city) => {
                const Icon = city.icon;
                return (
                  <div
                    onClick={() => {
                      setOpen(false)
                      navigate("/home/" + city.city);

                    }}
                    key={city.city}
                    className="flex flex-col items-center gap-2 cursor-pointer hover:text-primary transition"
                  >
                    <Icon className="text-3xl" />
                    <span className="text-sm">{city.city}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3 mt-6">Other Cities</h3>
            <ScrollArea className="h-40 rounded-md border p-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                {otherCities.map((city) => (
                  <div
                    key={city}
                    className="cursor-pointer hover:text-primary transition"
                  >
                    {city}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="text-center mt-4">
            <Button variant="ghost" className="text-rose-600">
              Hide all cities
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )


}
