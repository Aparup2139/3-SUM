import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Maximize2 } from "lucide-react"

export const FullTextDialogView = ({ text }: { text: string }) => {
    return (
        <Dialog>

            <DialogTrigger asChild>
                <span className="text-xs flex gap-2 border bg-background rounded-r-2xl w-fit cursor-pointer pl-2 pr-3 border-border py-1 items-center text-popover-foreground">
                    <p>view more </p>
                    <Maximize2 size={10} className="inline text-popover-foreground" />
                </span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription className="py-2 pt-4" >
                        {text}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>

        </Dialog>
    )
}