import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { DragAndDropVideo } from "../dragAndDrop/dragAndDrop"


export function UploadEditedVideoDialog({ TriggerJsx, taskId }: { TriggerJsx: React.ReactNode, taskId: number }) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    console.log(setSubmitting)

    const handleOpenChange = (value: boolean) => {
        if (!submitting) {
            setOpen(value)
        }
    }
    return (
        <Dialog open={open} onOpenChange={handleOpenChange} >
            <form>
                <DialogTrigger asChild>
                    {TriggerJsx}
                </DialogTrigger>
                <DialogContent className="max-[600px]:w-96  flex flex-col gap-5 justify-center items-center">
                    <DragAndDropVideo taskId={taskId} />
                </DialogContent>
            </form>
        </Dialog>
    )
}


