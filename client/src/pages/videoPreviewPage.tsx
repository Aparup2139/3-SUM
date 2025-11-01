import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getVideoPreviewUrl } from "@/httpfnc/task";
import { useQuery } from "@tanstack/react-query";
import { Check, SquareX } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export const VideoPreviewPage = () => {
    const { taskId } = useParams();

    const numericTaskId = taskId ? Number(taskId) : undefined;

    const { data, isLoading, error } = useQuery({
        queryKey: ["video-preview", numericTaskId],
        enabled: !!numericTaskId,
        queryFn: () => getVideoPreviewUrl(numericTaskId),
    })

    return (

        data && !isLoading ?
            <div className="h-screen flex flex-col justify-center items-center gap-5 w-full px-6 
            lg:px-20 lg:w-3/4 pt-14" >
                <div className="flex flex-col gap-2 w-full max-w-[600px]">
                    <h1 className="text-xl ml-2" >{data.taskTitle}</h1>
                    <Link to={`/c/profile/${data.editor.name}`} className="flex justify-between items-center w-fit rounded-xl py-1 px-2 hover:border-chart-1/60 border " >
                        <div className="flex gap-4 items-end">
                            <span className="text-sm" >Edited by: {data.editor.name}</span>
                            <img
                                className="w-8 shadow-2xl shadow-chart-4 aspect-square rounded-full object-cover border border-border"
                                src={data.editor.profileImgUrl || "https://via.placeholder.com/150"}
                                alt="editor profile"
                            />
                        </div>
                    </Link>

                </div>
                <video
                    className=" object-cover w-full max-h-[300px] max-w-[600px]  rounded-xl"
                    controls
                    src={data.editedVideoUrl}
                >
                    Your browser does not support the video tag.
                </video>
                {error && <p className="text-red-500">Error loading video preview: {error.message}</p>}

                <div className="flex justify-between max-w-[600px] w-full" >
                    <Button className="dark:text-red-500 text-red-800" variant="outline" >Reject <SquareX /></Button>
                    <Link to={`/task-update/${taskId}`} >
                        <Button variant={"outline"} className="text-green-800 dark:text-green-500" >Approve <Check /> </Button>
                    </Link>
                </div>
            </div>
            :
            <div className="w-full h-full flex justify-center items-center">
                <Skeleton className="w-full h-full" />
            </div>

    );
}