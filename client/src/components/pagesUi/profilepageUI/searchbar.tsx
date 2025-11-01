import { SearchIcon } from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,

} from "@/components/ui/command"
import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { type userSearchType } from "@/types/types"
import { searchUsers } from "@/httpfnc/user"
import { toast } from "sonner"
import { fallback_profileImg } from "@/constast"

export const SearchBar = () => {
    const [open, setOpen] = useState(false)
    return (<div onClick={() => setOpen(!open)} className="hover:border-foreground/30 cursor-pointer active:scale-90 ease-in duration-75 rounded-lg sm:rounded-3xl py-2 sm:min-w-32 sm:max-w-36 xl:max-w-48 border-border items-center flex gap-2 px-2 sm:px-3 xl:px-4  border sm:border-2" >
        <SearchIcon size={20} />
        <CommandDialogDemo open={open} setOpen={setOpen} />
    </div>)
}

export function CommandDialogDemo({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(!open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const timer = useRef<NodeJS.Timeout | null>(null)
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const { data: users, isLoading } = useQuery<userSearchType[]>({
        queryKey: ["fetchEvents?category=tech&userQuery=hackathon", debouncedQuery],
        queryFn: () => searchUsers(debouncedQuery),
        enabled: open,
        refetchOnWindowFocus: false,
    })


    useEffect(() => {
        if (timer.current)
            clearTimeout(timer.current)

        timer.current = setTimeout(() => {
            setDebouncedQuery(query)
        }, 500);
    }, [query])


    return (
        <>
            <p className="text-muted-foreground hidden sm:block text-sm">
                Press{" "}
                <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                    <span className="text-xs">⌘</span>J
                </kbd>
            </p>
            <CommandDialog className="h-80" open={open} onOpenChange={setOpen}>
                <CommandInput
                    value={query}
                    onValueChange={(value) => setQuery(value)}
                    placeholder="Type a command or search..." />
                <CommandList>

                    {!isLoading && users && users.length === 0 && <CommandEmpty>No users found.</CommandEmpty>}
                    <CommandGroup >

                        {isLoading && Array.from({ length: 5 }).map((_, index) => (
                            <CommandItem key={index}>
                                <Skeleton className="w-8 aspect-square rounded-full mr-2" />
                                <Skeleton className="w-32 h-4 rounded-sm" />
                            </CommandItem>
                        ))}

                        {!isLoading && users && users.length > 0 && users.map(user => {
                            return (
                                <CommandItem
                                    key={user.id}
                                    value={user.name}
                                    className="relative"
                                    onSelect={() => {
                                        setOpen(false)
                                        window.location.href = `/home/event/121`
                                    }}
                                >
                                    <img
                                        className="w-8 aspect-square object-cover rounded-full ml-1"
                                        src={user.profileImgUrl || fallback_profileImg}
                                        alt={user.name}
                                    />

                                    <span>{user.name}</span>
                                </CommandItem>
                            )
                        })
                        }

                    </CommandGroup>
                    <CommandSeparator />
                </CommandList>
            </CommandDialog>
        </>
    )
}
