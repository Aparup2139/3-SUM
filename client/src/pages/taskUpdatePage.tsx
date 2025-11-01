import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon, ServerCrash, Trash } from "lucide-react";
import { baseUrl } from "@/constast";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { fetchTaskById } from "@/httpfnc/task";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskDataType } from "@/types/types";
import { toast } from "sonner";
import { useTaskStore } from "@/store/task.store";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useUploadVideo } from "@/store/uploadVideo.store";

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

export const TaskUpdatePage = () => {
    const { taskId } = useParams();
    const numericTaskId = taskId ? Number(taskId) : undefined;
    const appendState = useTaskStore((state) => state.appendState);
    const updateState = useTaskStore((state) => state.updateStateById);
    const { data, isLoading, error } = useQuery<Partial<TaskDataType>>({
        queryKey: ["taskData", numericTaskId],
        enabled: !!numericTaskId,
        queryFn: () => fetchTaskById(numericTaskId as number),
        staleTime: 0,
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ defaultValues: { assignedTo: "" } });

    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (data) {
            reset({
                title: data.title || "",
                description: data.description || "",
                madeForKids: data.madeForKids ?? false,
            });

            setTags(data.tags || []);
            if (data.thumbnail) setThumbnailPreviewUrl(data.thumbnail);
        }
    }, [data, reset]);

    const onSubmit = async (form: FormValues) => {
        if (!numericTaskId) {
            toast.error("Invalid Task ID");
            return;
        }
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("madeForKids", String(form.madeForKids));
        formData.append("tags", JSON.stringify(tags));
        formData.append("taskId", String(numericTaskId));
        if (form.thumbnail?.[0]) formData.append("thumbnail", form.thumbnail[0]);

        try {
            setSubmitting(true);
            const res = await fetch(`${baseUrl}yt-upload/update-meta-data`, {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed");

            toast.success("youtube video details updated successfully");
            useUploadVideo.getState().setTaskId(numericTaskId);

            taskId ? updateState(numericTaskId, result.task) : appendState(result.task);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update youtube video details");
        } finally {
            setSubmitting(false);
            console.log("taskId in state: ", useUploadVideo.getState().taskId)
            const promise: Promise<{ data: string | null, message: string }> = new Promise(async (resolve, reject) => {
                const response = await axios(`${baseUrl}yt-upload/authorize`, {
                    method: "GET",
                    withCredentials: true,
                })
                if (response.status === 200) {
                    resolve(response.data);
                } else {
                    reject(new Error("Failed to authorize"));
                }
            });

            toast.promise(promise, {
                loading: 'Redirecting to OAuth...',
                success: (data) => {
                    useUploadVideo.getState().setTaskId(numericTaskId);
                    if (data.data) {
                        window.location.href = data.data;
                    }
                    return data.message || "Redirecting to OAuth...";
                },
                error: 'Invalid OAuth URL',
            });
        }
    };

    if (isLoading) {
        return <Skeleton className="h-[100vh] w-full max-w-full mx-auto rounded-lg" />;
    }

    if (error) {
        console.error("Error fetching task data:", error);
        toast.error(error.message || "Failed to fetch task data");
        return <Card className="p-6"><CardContent className="flex flex-col gap-2 text-red-500"><ServerCrash /> Failed to load task data</CardContent></Card>;
    }




    if (!numericTaskId) {
        return (
            <Card className="p-6"><CardContent className="flex flex-col gap-2 text-red-500"><ServerCrash /> Invalid Task ID</CardContent></Card>
        );
    }

    return (
        <div className="px-10 pt-20 pb-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6  rounded-lg max-w-[800px]  mx-auto border">

                <h2 className="text-muted-foreground">YouTube Video Details</h2>
                <p className="text-muted-foreground text-sm">Fill the below video details right now or before uploading...</p>

                <label>Title</label>
                <Input {...register("title", { required: "video title is required" })} />
                {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}


                <label>Description</label>
                <Textarea {...register("description", { required: "video description is required" })} />
                {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}


                <label className="font-semibold">Add Tags + :</label>
                <div className="flex gap-2 flex-wrap">
                    {tags.map((tag, idx) => (
                        <div key={idx} className="border rounded-full px-3 py-1 flex items-center gap-2">
                            <span>{tag}</span>
                            <Button size="icon" variant="ghost" onClick={() => setTags(tags.filter((_, i) => i !== idx))}>×</Button>
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
                <Controller control={control} name="madeForKids" defaultValue={false} render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                )} />

                <label className="font-semibold">Upload Thumbnail</label>
                <p className="text-muted-foreground text-sm" >Make your thumbnail 1280 by 720 pixels (16:9 ratio)
                    Ensure that your thumbnail is less than 2MB
                    Use a JPG, PNG, or GIF file format
                    Make sure your thumbnail follows YOUTUBE <a
                        className="underline text-chart-4"
                        target="_blank" href="https://www.youtube.com/howyoutubeworks/our-policies/" >Community Guidelines</a></p>
                <Input
                    type="file"
                    accept="image/*"
                    {...register("thumbnail")}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file || file?.size >= 2 * 1024 * 1024) {
                            toast.error("Image should be less than 2 MB");
                            return;
                        }
                        if (file) setThumbnailPreviewUrl(URL.createObjectURL(file));
                        else setThumbnailPreviewUrl(null);
                    }}
                />
                {thumbnailPreviewUrl && (
                    <div className="mt-2 relative">
                        <span
                            onClick={() => {
                                setThumbnailPreviewUrl(null);
                                fileInputRef.current!.value = "";
                            }}
                            className="absolute top-8 right-6 opacity-70 hover:opacity-100 border 
                        hover:border-chart-4/50 active:scale-95 ease-in duration-75 p-1 rounded " ><Trash color="red" size={15} /></span>
                        <p className="text-muted-foreground  text-sm mb-1">Thumbnail Preview:</p>
                        <img src={thumbnailPreviewUrl} alt="Thumbnail Preview" className="max-h-[200px] rounded-lg border" />
                    </div>
                )}

                <div className="flex gap-4 justify-end pt-4">
                    <Link to={`/video-preview/${numericTaskId}`} > <Button disabled={submitting} type="button" variant="outline" onClick={() => reset()}>
                        Go Back
                    </Button>
                    </Link>
                    <Button disabled={submitting} type="submit">
                        {submitting && <Loader2Icon className="animate-spin" />}
                        {submitting ? "Saving..." : "Save Task"}
                    </Button>

                </div>
            </form>
        </div>
    );
};