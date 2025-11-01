import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ProfileEditCard } from "../pagesUi/profilepageUI/editProfile"
import { EditIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"


export function EditProfileDialog() {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleOpenChange = (value: boolean) => {
        if (!submitting) {
            setOpen(value)
        }
    }
    return (
        <Dialog open={open} onOpenChange={handleOpenChange} >
            <form>
                <DialogTrigger asChild>
                    <Button variant={"outline"} className="flex text-chart-3 gap-2 w-full" >
                        <EditIcon />
                        <h1 className="max-[600px]:hidden" >Edit Profile</h1>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-[600px]:w-96  flex flex-col gap-5 justify-center items-start">
                    <ProfileEditCard
                        onSubmittingChange={(isSubmitting) => setSubmitting(isSubmitting)}
                        submitting={submitting}
                    />
                </DialogContent>
            </form>
        </Dialog>
    )
}
