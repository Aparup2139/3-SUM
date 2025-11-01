import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
export function NotificationSettings() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Checkbox id="terms" defaultChecked />
                <Label htmlFor="terms">Push Notifications</Label>
            </div>
            <div className="flex items-start gap-3">
                <Checkbox id="terms-2" defaultChecked />
                <div className="grid gap-2">
                    <Label htmlFor="terms-2">Email Notifications</Label>
                </div>
            </div>
            <p className="text-muted-foreground text-sm">
                save your changes
            </p>
            <Button className="bg-primary w-1/2 text-primary-foreground" type="submit">
                Save Changes
            </Button>

        </div>
    )
}