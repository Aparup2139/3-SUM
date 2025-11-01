import { Button } from "@/components/ui/button"
import { FilePlus } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export function CreateTaskSheet({ type = 1, TriggerJsx = <><FilePlus /> Create Task</> }: { type?: number, TriggerJsx?: React.ReactNode }) {
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const resetState = useOpenTaskUpdate((state) => state.resetState);
    return (
        <Sheet
            onOpenChange={(open) => {
                if (!open) {
                    resetState()
                }
            }}
            open={submitting && !completed ? true : undefined} >
            <SheetTrigger asChild>
                <Button className={`text-chart-3 ${type === 2 && "w-fit h-fit p-0"}`}
                    variant={type === 1 ? "outline" : "ghost"} disabled={submitting} size="sm">
                    {TriggerJsx}
                </Button>
            </SheetTrigger>
            <SheetContent >
                <VideoTaskForm
                    setIsCompleted={setCompleted}
                    setSubmitting={setSubmitting} submitting={submitting} />
            </SheetContent>
        </Sheet>
    )
}

import { useEffect, useRef, useState } from "react";
import {
    Dialog, DialogContent, DialogTrigger
} from "@/components/ui/dialog";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Check, Search } from "lucide-react";
import { VideoTaskForm } from "../pagesUi/tasksPageUI/taskForm";
import { useOpenTaskUpdate } from "@/store/updateTaskSheet";
import { toast } from "sonner";
import { searchEditros } from "@/httpfnc/user";
import { useQuery } from "@tanstack/react-query";
import type { userSearchType } from "@/types/types";
import { Skeleton } from "../ui/skeleton";
import { fallback_profileImg } from "@/constast";


type EditorSelectDialogProps = {
    value: string;
    onChange: (value: string) => void;
};

export const EditorSelectDialog = ({ value, onChange }: EditorSelectDialogProps) => {
    const [open, setOpen] = useState(false);
    const timer = useRef<NodeJS.Timeout | null>(null)
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const { data: users, isLoading, error } = useQuery<userSearchType[]>({
        queryKey: ["search-editors", debouncedQuery],
        queryFn: () => searchEditros(debouncedQuery),
        enabled: open,
        refetchOnWindowFocus: false,
    })

    if (error) {
        console.log("Error fetching users:", error)
        toast.error(error.message || "Failed to fetch users.")
    }

    useEffect(() => {
        if (timer.current)
            clearTimeout(timer.current)

        timer.current = setTimeout(() => {
            setDebouncedQuery(query)
        }, 500);
    }, [query])


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    type="button"
                    className="w-full justify-between"
                >
                    {value ? value : "Search editor"}
                    <Search className="w-4 h-4 opacity-50" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md p-0 overflow-hidden">
                <Command>
                    <CommandInput
                        placeholder="Search editors..."
                        value={query}
                        onValueChange={setQuery}
                    />

                    <CommandList>
                        <CommandEmpty>No editor found.</CommandEmpty>
                        <CommandGroup heading="Editors">
                            {!isLoading && users && users.length > 0 && users.map(user => {
                                return (
                                    <CommandItem
                                        key={user.id}
                                        value={user.name}

                                        onSelect={() => {
                                            onChange(user.name);
                                            setOpen(false);
                                        }}
                                        className="flex justify-between"

                                    >
                                        <div className="flex items-center justify-center gap-5" >
                                            <img
                                                className="w-8 aspect-square object-cover rounded-full ml-1"
                                                src={user.profileImgUrl || fallback_profileImg}
                                                alt={user.name}
                                            />

                                            <span>{user.name}</span>
                                        </div>
                                        {value === user.name && <Check className="w-4 h-4" />}
                                    </CommandItem>
                                )
                            })
                            }
                            {!isLoading && users && users.length === 0 && <CommandEmpty>No users found.</CommandEmpty>}
                            <CommandGroup ></CommandGroup>

                            {isLoading && Array.from({ length: 5 }).map((_, index) => (
                                <CommandItem key={index}>
                                    <Skeleton className="w-8 aspect-square rounded-full mr-2" />
                                    <Skeleton className="w-32 h-4 rounded-sm" />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};
