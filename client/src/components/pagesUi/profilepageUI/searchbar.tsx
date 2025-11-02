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
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { type TaskDataType } from "@/types/types"
import { baseUrl, fallback_profileImg } from "@/constast"
import { fetchEvents } from "@/httpfnc/user"

const categories = ["", "Tech", "Music", "Business", "Education", "Sports", "Arts"]

export const SearchBar = () => {
  const [open, setOpen] = useState(false)

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        if (!open) setOpen(true)
      }}
      className="hover:border-foreground/30 cursor-pointer active:scale-90 ease-in duration-75 rounded-lg sm:rounded-3xl py-2 sm:min-w-32 sm:max-w-36 xl:max-w-48 border-border items-center flex gap-2 px-2 sm:px-3 xl:px-4 border sm:border-2"
    >
      <SearchIcon size={20} />
      <CommandDialogDemo open={open} setOpen={setOpen} />
    </div>
  )
}

export function CommandDialogDemo({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [category, setCategory] = useState("")
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)
  }, [query])

  const { data: events, isLoading } = useQuery<TaskDataType[]>({
    queryKey: ["fetchAllEvents", category, debouncedQuery],
    queryFn: () =>
      fetchEvents(baseUrl + `events?category=${category}&userQuery=${debouncedQuery}`),
    enabled: open,
    refetchOnWindowFocus: false,
  })

  return (
    <>
      <p className="text-muted-foreground hidden sm:block text-sm">
        Press{" "}
        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>

      <CommandDialog
        className="h-80"
        open={open}
        onOpenChange={(v) => {
          if (!v) setOpen(false)
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()} // Prevent click bubbling to outer div
          className="p-2"
        >
          <CommandInput
            value={query}
            onValueChange={(value) => setQuery(value)}
            placeholder="Search events..."
          />

          {/* Category Bubbles */}
          <div className="flex flex-wrap gap-2 mt-3 px-1">
            {categories.map((cat) => (
              <Badge
                key={cat || "All"}
                onClick={() => setCategory(cat)}
                className={`cursor-pointer select-none ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat || "All"}
              </Badge>
            ))}
          </div>
        </div>

        <CommandList>
          {!isLoading && events && events.length === 0 && (
            <CommandEmpty>No events found.</CommandEmpty>
          )}

          <CommandGroup>
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <CommandItem key={index}>
                  <Skeleton className="w-8 aspect-square rounded-full mr-2" />
                  <Skeleton className="w-32 h-4 rounded-sm" />
                </CommandItem>
              ))}

            {!isLoading &&
              events &&
              events.length > 0 &&
              events.map((event) => (
                <CommandItem
                  key={event.id}
                  value={event.title}
                  className="relative"
                  onSelect={() => {
                    setOpen(false)
                    window.location.href = `/home/event/${event.id}`
                  }}
                >
                  <img
                    className="h-12 w-28 aspect-square object-cover rounded-sm border ml-1"
                    src={event.eventImageUrl || fallback_profileImg}
                    alt={event.title}
                  />
                  <span>{event.title}</span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  )
}
