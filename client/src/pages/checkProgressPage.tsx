
import { LoadingTitle } from "@/components/loadingUI/loadingTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { socketUrl } from "@/constast";
import { UploadSocketEvent } from "@/types/socketEventEnums";
import { YTUploadStages } from "@/types/types";
import { LoaderIcon, PartyPopper, YoutubeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import AnimatedNumberCounter from "@/components/ui/animated-number-random"

export const CheckProgressPage = () => {
    const { taskId } = useParams();
    const [progres, setProgress] = useState(0);
    const [videoUploadStage, setVideoUploadStage] = useState(YTUploadStages.VIDEO_UPLOAD);
    const videoIdRef = useRef<string | null>(null);
    const numericTaskId = taskId ? Number(taskId) : undefined;
    console.log("CheckProgressPage taskId:", numericTaskId);
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("socketToken");
        const socket = io(socketUrl, {
            withCredentials: true,
            auth: (cb) => {
                cb({
                    token
                });
            }
        })
        socketRef.current = socket;

        socket.on(UploadSocketEvent.CONNECT, () => {
            console.log("Connected to socket server");
        })

        socket.on(UploadSocketEvent.CONNECT_ERROR, (err) => {
            console.error("websocket connection error:", err)
        })

        socket.on(UploadSocketEvent.UPLOAD_PROGRESS, (data) => {
            console.log("Upload progress:", data);
            setProgress(data.percent);
        });
        socket.on(UploadSocketEvent.UPLOAD_COMPLETE, (data) => {
            console.log("Upload complete:", data);
            toast.success("video upload completed successfully in private mode");
            setVideoUploadStage(YTUploadStages.THUMBNAIL_UPLOAD);

        });
        socket.on(UploadSocketEvent.UPLOAD_FAILED, (error) => {
            console.error("Upload failed:", error);
            setVideoUploadStage(YTUploadStages.ERROR);
            toast.error("video upload failed, please try again later");
        });
        socket.on(UploadSocketEvent.THUMBNAIL_UPLOADED, (data) => {
            console.log("Thumbnail uploaded:", data);
            toast.success("thumbnail uploaded successfully");
            setVideoUploadStage(YTUploadStages.PUBLISH_VIDEO);
        });
        socket.on(UploadSocketEvent.THUMBNAIL_UPLOAD_FAILED, (error) => {
            console.error("Thumbnail upload failed:", error);
            toast.error("thumbnail upload failed, please try again later");
            setVideoUploadStage(YTUploadStages.ERROR);
        });

        socket.on(UploadSocketEvent.PUBLISH_VIDEO, (data) => {
            console.log("Video published:", data);
            videoIdRef.current = data.videoId;
            toast.success("video published successfully");
            setVideoUploadStage(YTUploadStages.SUCCESSFULL);
        });

        socket.on(UploadSocketEvent.PUBLISH_VIDEO_FAILED, (error) => {
            console.error("Video publish failed:", error);
            toast.error("video publish failed, please try again later");
            setVideoUploadStage(YTUploadStages.ERROR);
        });

        return () => {
            socket.disconnect();
            console.log("Socket disconnected");
        }


    }, [])

    let displayPara = "";
    let displayMuted = ""
    switch (videoUploadStage) {
        case YTUploadStages.VIDEO_UPLOAD:
            displayPara = "Uploading Video to Youtube..."
            displayMuted = "The video will be uploaded in private mode first"
            break;
        case YTUploadStages.THUMBNAIL_UPLOAD:
            displayPara = "Uploading thumbnail to Youtube..."
            displayMuted = "Once thumbnail uploads, we will make the video public after adding metadatas like title, description etc..."
            break;
        case YTUploadStages.PUBLISH_VIDEO:
            displayPara = "Publishing Video to Youtube..."
            displayMuted = "Updating title, description, tags, madeForKids and making video public..."
            break;
        case YTUploadStages.SUCCESSFULL:
            displayPara = "Video Published Successfully!"
            displayMuted = "You can now view your video on your channel"
            break;

    }

    const error = videoUploadStage === YTUploadStages.ERROR;
    return (
        <Card className="w-screen h-screen flex items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">{error ? "An Error Occured!" : "Check Progress"}</h1>
                <p className="text-lg text-center opacity-80">{error ? error : displayPara}</p>
                {!error && <p className="text-sm text-center text-muted-foreground opacity-80">{displayMuted}</p>}

                {error ? <div className="flex flex-col items-center gap-2">

                    <Link to={"/video-preview/" + taskId}>
                        <Button>Go Back To Video Preview Page</Button>
                    </Link>

                </div> : <>

                    {numericTaskId ? (
                        <p className="text-sm text-gray-500">Task ID: {numericTaskId}</p>
                    ) : (
                        <p className="text-sm text-red-500">No valid task ID provided.</p>
                    )}
                    {videoUploadStage === YTUploadStages.VIDEO_UPLOAD ? <div className="flex flex-col gap-4">
                        <LoadingTitle />

                        <Progress value={progres} />
                        <p className="text-left w-full text-sm opacity-70" >
                            <AnimatedNumberCounter value={progres} />
                        </p>
                    </div> :
                        videoUploadStage !== YTUploadStages.SUCCESSFULL ? <LoaderIcon className="animate-spin repeat-infinite" /> :
                            <PartyPopper className="w-10 h-10 text-green-500 animate-bounce" />
                    }
                    {videoUploadStage === YTUploadStages.SUCCESSFULL &&
                        <a target="_blank" href={`https://www.youtube.com/watch?v=${videoIdRef.current}`} >
                            <Button className="mt-4">Go Checkout the Video on Youtube <YoutubeIcon /> </Button>
                        </a>}
                </>}
            </CardContent>
        </Card>
    );
}

