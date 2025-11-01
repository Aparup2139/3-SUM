import { Button } from "@/components/ui/button"
import { FilePlus } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useOpenTaskUpdate } from "@/store/updateTaskSheet";
import { useState } from "react";

export function CreateTaskSheet({ type = 1, TriggerJsx = <><FilePlus /> Create Event</> }: { type?: number, TriggerJsx?: React.ReactNode }) {
  const [submitting, setSubmitting] = useState(false);
  const [explicitOpen, setExplicitOpen] = useState(false)
  const { resetState, taskId } = useOpenTaskUpdate((state) => state);

  return (
    <Sheet
      onOpenChange={(open) => {
        console.log("open:", open)
        if (open) {
          setExplicitOpen(true)
        }
        if (!open) {
          resetState()
          setExplicitOpen(false)
        }
      }}
      open={!!taskId || explicitOpen} >
      <SheetTrigger asChild>
        <Button className={`text-chart-3 ${type === 2 && "w-fit h-fit p-0"}`}
          variant={type === 1 ? "outline" : "ghost"} disabled={submitting} size="sm">
          {TriggerJsx}
        </Button>
      </SheetTrigger>
      <SheetContent >
        <AddEventForm />
      </SheetContent>
    </Sheet>
  )
}


import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type EventPayload = {
  bannerImg: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  category: string;
  totalTickets: number;
  basePrice: number;
  priceMin: number;
  priceMax: number;
};

type Props = {
  initial?: Partial<EventPayload>;
  onCreate?: (payload: EventPayload) => void;
};

export default function AddEventForm({ initial = {}, onCreate }: Props) {
  const [form, setForm] = useState<EventPayload>({
    bannerImg: initial.bannerImg ?? "",
    title: initial.title ?? "",
    description: initial.description ?? "",
    startDate: initial.startDate ?? "",
    endDate: initial.endDate ?? "",
    venue: initial.venue ?? "",
    city: initial.city ?? "",
    category: initial.category ?? "",
    totalTickets: initial.totalTickets ?? 0,
    basePrice: initial.basePrice ?? 0,
    priceMin: initial.priceMin ?? 0,
    priceMax: initial.priceMax ?? 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof EventPayload>(key: K, value: EventPayload[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};

    if (!form.bannerImg) e.bannerImg = "Banner image URL is required";
    if (!form.title) e.title = "Title is required";
    if (!form.description) e.description = "Description is required";
    if (!form.startDate) e.startDate = "Start date/time is required";
    if (!form.endDate) e.endDate = "End date/time is required";
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate))
      e.endDate = "End must be after start";
    if (!form.venue) e.venue = "Venue is required";
    if (!form.city) e.city = "City is required";
    if (!form.category) e.category = "Category is required";
    if (!Number.isFinite(form.totalTickets) || form.totalTickets <= 0)
      e.totalTickets = "Total tickets must be > 0";
    if (!Number.isFinite(form.basePrice) || form.basePrice < 0) e.basePrice = "Base price must be >= 0";
    if (form.priceMin < 0) e.priceMin = "Min price must be >= 0";
    if (form.priceMax < 0) e.priceMax = "Max price must be >= 0";
    if (form.priceMax < form.priceMin) e.priceMax = "Max price must be >= min price";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: EventPayload = {
        ...form,
        totalTickets: Number(form.totalTickets),
        basePrice: Number(form.basePrice),
        priceMin: Number(form.priceMin),
        priceMax: Number(form.priceMax),
      };

      if (onCreate) onCreate(payload);
      else console.log("Event created:", payload);

      setForm({
        bannerImg: "",
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        venue: "",
        city: "",
        category: "",
        totalTickets: 0,
        basePrice: 0,
        priceMin: 0,
        priceMax: 0,
      });
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="max-w-3xl overflow-y-scroll mx-auto border-none bg-transparent">
      <CardHeader>
        <CardTitle>Add Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8 ">
          <div>
            <Label className="mb-1 block">Banner image URL (no upload)</Label>
            <Input
              value={form.bannerImg}
              onChange={(v) => update("bannerImg", v.target.value)}
              placeholder="https://..."
            />
            {errors.bannerImg && <p className="text-sm text-red-600">{errors.bannerImg}</p>}

          </div>

          <div>
            <Label className="mb-1 block">Title</Label>
            <Input value={form.title} onChange={(v) => update("title", v.target.value)} />
            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <Label className="mb-1 block">Description</Label>
            <Textarea value={form.description} onChange={(v) => update("description", v.target.value)} />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Start (date & time)</Label>
              <Input
                type="datetime-local"
                value={form.startDate}
                onChange={(v) => update("startDate", v.target.value)}
              />
              {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
            </div>
            <div>
              <Label className="mb-1 block">End (date & time)</Label>
              <Input
                type="datetime-local"
                value={form.endDate}
                onChange={(v) => update("endDate", v.target.value)}
              />
              {errors.endDate && <p className="text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-1 block">Venue</Label>
              <Input value={form.venue} onChange={(v) => update("venue", v.target.value)} />
              {errors.venue && <p className="text-sm text-red-600">{errors.venue}</p>}
            </div>
            <div>
              <Label className="mb-1 block">City</Label>
              <Input value={form.city} onChange={(v) => update("city", v.target.value)} />
              {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
            </div>
            <div>
              <Label className="mb-1 block">Category</Label>
              <Input value={form.category} onChange={(v) => update("category", v.target.value)} placeholder="e.g. Tech, Music" />
              {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-1 block">Total tickets</Label>
              <Input
                type="number"
                min={0}
                value={String(form.totalTickets)}
                onChange={(v) => update("totalTickets", Number(v.target.value))}
              />
              {errors.totalTickets && <p className="text-sm text-red-600">{errors.totalTickets}</p>}
            </div>
            <div>
              <Label className="mb-1 block">Base price</Label>
              <Input
                type="number"
                min={0}
                value={String(form.basePrice)}
                onChange={(v) => update("basePrice", Number(v.target.value))}
              />
              {errors.basePrice && <p className="text-sm text-red-600">{errors.basePrice}</p>}
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Price min</Label>
              <Input
                type="number"
                min={0}
                value={String(form.priceMin)}
                onChange={(v) => update("priceMin", Number(v.target.value))}
              />
              {errors.priceMin && <p className="text-sm text-red-600">{errors.priceMin}</p>}
            </div>
            <div>
              <Label className="mb-1 block">Price max</Label>
              <Input
                type="number"
                min={0}
                value={String(form.priceMax)}
                onChange={(v) => update("priceMax", Number(v.target.value))}
              />
              {errors.priceMax && <p className="text-sm text-red-600">{errors.priceMax}</p>}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Note: price will dynamically range between <strong>{form.priceMin}</strong> and <strong>{form.priceMax}</strong> depending on demand. Base price: <strong>{form.basePrice}</strong>.
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Event"}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setForm({
                  bannerImg: "",
                  title: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                  venue: "",
                  city: "",
                  category: "",
                  totalTickets: 0,
                  basePrice: 0,
                  priceMin: 0,
                  priceMax: 0,
                });
                setErrors({});
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
