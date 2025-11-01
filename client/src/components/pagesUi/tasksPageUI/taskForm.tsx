import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon, ServerCrash, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { baseUrl } from "@/constast";
import { Input } from "@/components/ui/input";
import { EditorSelectDialog } from "@/components/dialogbox/createTaskSheet";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useOpenTaskUpdate } from "@/store/updateTaskSheet";
import { useQuery } from "@tanstack/react-query";
import { fetchTaskById } from "@/httpfnc/task";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskDataType } from "@/types/types";
import { toast } from "sonner";
import { useTaskStore } from "@/store/task.store";

type FormValues = {
    taskTitle: string;
    workDescription: string;
    deadline: string;
    title: string;
    description: string;
    assignedTo: string;
    madeForKids: boolean;
    thumbnail: FileList;
};

type VideoTaskFormProps = {
    setIsCompleted: (val: boolean) => void;
    submitting: boolean;
    setSubmitting: (v: boolean) => void;
    id?: number;
};

export const VideoTaskForm = ({ setIsCompleted, submitting, setSubmitting }: VideoTaskFormProps) => {
    const taskId = useOpenTaskUpdate((state) => state.taskId);
    const appendState = useTaskStore((state) => state.appendState);
    const updateState = useTaskStore((state) => state.updateStateById);
    const { data, isLoading, error } = useQuery<Partial<TaskDataType>>({
        queryKey: ["taskData", taskId],
        enabled: !!taskId,
        queryFn: () => fetchTaskById(taskId as number),
        staleTime: 0,
    });

    if (error) {
        console.error("Error fetching task data:", error);
        toast.error(error.message || "Failed to fetch task data");
        return <div className="p-6 flex flex-col gap-2 "><ServerCrash /> Failed to load task data</div>;
    }

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: { assignedTo: "" },
    });

    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<(File & { url?: string })[]>([]);


    useEffect(() => {
        if (data) {
            reset({
                taskTitle: data.taskTitle || "",
                workDescription: data.workDescription || "",
                deadline: data.deadline?.split("T")[0] || "",
                assignedTo: data.editor?.name || "",
                title: data.title || "",
                description: data.description || "",
                madeForKids: data.madeForKids ?? false,
            });

            setTags(data.tags || []);
            if (data.thumbnail) setThumbnailPreviewUrl(data.thumbnail);

            if (data.attachments?.length) {
                const fakeFiles = data.attachments.map((url, idx) => ({
                    name: `file-${idx}`,
                    type: url.includes(".mp4") ? "video/mp4" : "image/jpeg",
                    size: 0,
                    url,
                })) as (File & { url: string })[];

                setSelectedFiles(fakeFiles);
            }
        }
    }, [data, reset]);

    console.log("assigned to:", data?.editor?.name);
    const onSubmit = async (form: FormValues) => {
        const formData = new FormData();
        formData.append("taskTitle", form.taskTitle);
        formData.append("workDescription", form.workDescription);
        formData.append("deadline", form.deadline);
        formData.append("assignedTo", form.assignedTo);
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("madeForKids", String(form.madeForKids));
        formData.append("tags", JSON.stringify(tags));


        // Attach new files only
        selectedFiles
            .filter((f) => !("url" in f))
            .forEach((file) => formData.append("files", file));

        // Append old attachment URLs
        const oldAttachmentUrls = selectedFiles
            .filter((f) => "url" in f)
            .map((f) => (f as any).url);
        formData.append("oldAttachments", JSON.stringify(oldAttachmentUrls));

        // Thumbnail file
        if (form.thumbnail?.[0]) {
            formData.append("thumbnail", form.thumbnail[0]);
        }

        const url = taskId ? `${baseUrl}task/update-task/${taskId}` : `${baseUrl}task/create-task`;
        const method = taskId ? "PATCH" : "POST";

        try {
            setSubmitting(true);
            const res = await fetch(url, {
                method,
                credentials: "include",
                body: formData,
            });
            const result = await res.json();

            if (!res.ok) throw new Error(result.message || "Failed");

            console.log("Task success:", result.task);
            toast.success("Task saved successfully!");
            if (taskId) {
                updateState(taskId, result.task);
            }
            else {
                appendState(result.task);
            }

        } catch (err) {
            console.error(err);
            toast.error("Failed to save task");
        } finally {
            setSubmitting(false);
            setIsCompleted(true);
        }
    };


    return (
        <>
            {isLoading ? (
                <div className="flex flex-col gap-4 p-6 border h-[100dvh] overflow-y-scroll rounded-lg w-full max-w-full mx-auto">
                    <Skeleton className="w-full h-8 mb-4" />
                    <Skeleton className="w-full h-12 mb-4" />
                    <Skeleton className="w-full h-8 mb-4" />
                    <Skeleton className="w-full h-8 mb-4" />
                    <Skeleton className="w-full h-4 mb-4" />
                    <Skeleton className="w-full h-8 mb-4" />
                    <Skeleton className="w-full h-8 mb-4" />
                    <Skeleton className="w-full h-8 mb-4" />
                    <Skeleton className="w-full h-8 mb-4" />
                    <Skeleton className="w-full h-8 mb-4" />
                    <Skeleton className="w-full h-8 mb-4" />
                    <Skeleton className="w-full h-8 mb-4" />

                </div>
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 p-6 border h-[100dvh] overflow-y-scroll rounded-lg w-full max-w-full mx-auto"
                >
                    <h2 className="text-muted-foreground">Task Details (required)</h2>

                    <label className="font-semibold">TaskTitle</label>
                    <Input {...register("taskTitle", { required: "Task title is required" })} />
                    {errors.taskTitle && <span className="text-red-500 text-sm">{errors.taskTitle.message}</span>}
                    <label>Work description</label>
                    <Textarea {...register("workDescription", { required: "Work description is required" })} />
                    {errors.workDescription && <span className="text-red-500 text-sm">{errors.workDescription.message}</span>}

                    <h2 className="text-muted-foreground">Add video/img for editor's reference:</h2>
                    <Input
                        type="file"
                        multiple
                        accept="video/*,image/*"
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setSelectedFiles((prev) => [...prev, ...files]);
                        }}
                    />

                    {selectedFiles.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" type="button">
                                        Preview Uploaded Files
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                    <Carousel className="w-full relative max-w-full">
                                        <CarouselContent>
                                            {selectedFiles.map((file, idx) => {
                                                const isVideo = file.type.startsWith("video");
                                                const previewUrl = "url" in file ? file.url : URL.createObjectURL(file);
                                                return (
                                                    <CarouselItem key={idx} className="flex flex-col items-center gap-2">
                                                        <div className="flex w-full justify-between py-1">
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="text-sm"
                                                                onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                                remove
                                                            </Button>
                                                        </div>
                                                        <div className="relative flex justify-center items-center w-full">
                                                            {isVideo ? (
                                                                <video src={previewUrl} controls className="max-h-[70vh] w-auto rounded-lg" />
                                                            ) : (
                                                                <img src={previewUrl} className="max-h-[70vh] w-auto rounded-lg" />
                                                            )}
                                                        </div>
                                                    </CarouselItem>
                                                );
                                            })}
                                        </CarouselContent>
                                        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
                                        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
                                    </Carousel>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}

                    <label>Deadline</label>
                    <Input type="date" {...register("deadline", { required: "Deadline is required" })} />
                    {errors.deadline && <span className="text-red-500 text-sm">{errors.deadline.message}</span>}

                    <label>Assign to:</label>
                    <Controller
                        control={control}
                        name="assignedTo"
                        rules={{ required: "Please select an editor" }}
                        render={({ field }) => (
                            <>
                                <EditorSelectDialog value={field.value} onChange={field.onChange} />
                                {errors.assignedTo && <p className="text-red-500 text-sm">{errors.assignedTo.message}</p>}
                            </>
                        )}
                    />

                    <Separator />
                    <h2 className="text-muted-foreground">YouTube Video Details</h2>
                    <p className="text-muted-foreground text-sm">Fill the below video details right now or before uploading...</p>

                    <label>Title</label>
                    <Input {...register("title")} />

                    <label>Description</label>
                    <Textarea {...register("description")} />

                    <label className="font-semibold">Add Tags + :</label>
                    <div className="flex gap-2 flex-wrap">
                        {tags.map((tag, idx) => (
                            <div key={idx} className="border rounded-full px-3 py-1 flex items-center gap-2">
                                <span>{tag}</span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                                >
                                    ×
                                </Button>
                            </div>
                        ))}
                        <Input
                            placeholder="Add tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && newTag.trim()) {
                                    e.preventDefault();
                                    setTags((prev) => [...prev, newTag.trim()]);
                                    setNewTag("");
                                }
                            }}
                            className="w-auto"
                        />
                    </div>

                    <label className="font-semibold">For Kids</label>
                    <Controller
                        control={control}
                        name="madeForKids"
                        defaultValue={false}
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />

                    <label className="font-semibold">Upload Thumbnail</label>
                    <p className="text-muted-foreground text-sm" >Make your thumbnail 1280 by 720 pixels (16:9 ratio)
                        Ensure that your thumbnail is less than 2MB
                        Use a JPG, PNG, or GIF file format
                        Make sure your thumbnail follows YOUTUBE <a target="_blank" href="https://www.youtube.com/howyoutubeworks/our-policies/" >Community Guidelines</a></p>
                    <Input
                        type="file"
                        accept="image/*"
                        {...register("thumbnail")}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setThumbnailPreviewUrl(URL.createObjectURL(file));
                            } else {
                                setThumbnailPreviewUrl(null);
                            }
                        }}
                    />
                    {thumbnailPreviewUrl && (
                        <div className="mt-2">
                            <p className="text-muted-foreground text-sm mb-1">Thumbnail Preview:</p>
                            <img src={thumbnailPreviewUrl} alt="Thumbnail Preview" className="max-h-[200px] rounded-lg border" />
                        </div>
                    )}

                    <div className="flex gap-4 justify-end pt-4">
                        <Button disabled={submitting} type="submit">
                            {submitting && <Loader2Icon className="animate-spin" />}
                            {submitting ? "Saving..." : "Save Task"}
                        </Button>
                        <SheetTrigger asChild>
                            <Button disabled={submitting} type="button" variant="outline" onClick={() => reset()}>
                                Cancel
                            </Button>
                        </SheetTrigger>
                    </div>
                </form>
            )}
        </>
    );
};
