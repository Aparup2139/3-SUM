import { useState, useRef, useCallback } from "react"
import { Upload, Play, Pause, Volume2, VolumeX, Maximize, X, FileVideo, UploadIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { baseUrl } from "@/constast"
import { toast } from "sonner"

interface VideoFile {
    file: File
    url: string
    duration: number
}

export function DragAndDropVideo({ taskId }: { taskId: number }) {
    const [dragActive, setDragActive] = useState(false)
    const [videoFile, setVideoFile] = useState<VideoFile | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [loading, setLoading] = useState(false)

    const handleUpload = async () => {
        if (!videoFile) {
            toast.error("Please select a video file to upload")
            return
        }
        setLoading(true)
        const formData = new FormData()
        formData.append("video", videoFile.file)
        formData.append("taskId", taskId.toString())
        const response = await fetch(`${baseUrl}task/upload-video-to-server`, {
            method: "POST",
            body: formData,
            credentials: "include",
        })

        if (!response.ok) {
            const errorData = await response.json()
            toast.error(`Upload failed: ${errorData.message}`)
            return
        }

        toast.success("Video uploaded successfully!")
        setLoading(false)
        // Reset state after successful upload
        setVideoFile(null)
        setCurrentTime(0)
        setDuration(0)
        setIsPlaying(false)
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.src = ""
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        setIsFullscreen(false)
        setIsMuted(false)
        setVolume(1)
        setDragActive(false)
        if (containerRef.current) {
            containerRef.current.classList.remove("bg-primary/5", "border-primary")
        }
        if (videoRef.current) {
            videoRef.current.load()
        }

    }

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = Array.from(e.dataTransfer.files)
        handleFiles(files)
    }, [])

    const handleFiles = (files: File[]) => {
        if (files.length === 0) return

        const file = files[0]
        if (!file.type.startsWith("video/")) {
            alert("Please upload a video file")
            return
        }

        if (videoFile) {
            URL.revokeObjectURL(videoFile.url)
        }

        const url = URL.createObjectURL(file)
        setVideoFile({ file, url, duration: 0 })
        setCurrentTime(0)
        setIsPlaying(false)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        handleFiles(files)
    }

    const togglePlay = () => {
        if (!videoRef.current) return

        if (isPlaying) {
            videoRef.current.pause()
        } else {
            videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = () => {
        if (!videoRef.current) return
        setCurrentTime(videoRef.current.currentTime)
    }

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return
        setDuration(videoRef.current.duration)
        setVideoFile((prev) => (prev ? { ...prev, duration: videoRef.current!.duration } : null))
    }

    const handleSeek = (value: number[]) => {
        if (!videoRef.current) return
        const time = (value[0] / 100) * duration
        videoRef.current.currentTime = time
        setCurrentTime(time)
    }

    const handleVolumeChange = (value: number[]) => {
        if (!videoRef.current) return
        const vol = value[0] / 100
        videoRef.current.volume = vol
        setVolume(vol)
        setIsMuted(vol === 0)
    }

    const toggleMute = () => {
        if (!videoRef.current) return
        if (isMuted) {
            videoRef.current.volume = volume
            setIsMuted(false)
        } else {
            videoRef.current.volume = 0
            setIsMuted(true)
        }
    }

    const toggleFullscreen = () => {
        if (!containerRef.current) return

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen()
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
        setIsFullscreen(!isFullscreen)
    }

    const removeVideo = () => {
        if (videoFile) {
            URL.revokeObjectURL(videoFile.url)
            setVideoFile(null)
            setCurrentTime(0)
            setDuration(0)
            setIsPlaying(false)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div className="w-full max-w-4xl mx-auto py-2 px-1 sm:p-3">
            <div className="space-y-1">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">Video Upload & Player</h1>
                    <p className="text-muted-foreground">Drag and drop a video file or click to browse (Max: 1 video file)</p>
                </div>

                {!videoFile ? (
                    <Card className="transition-colors duration-200 hover:border-primary/50">
                        <CardContent className="p-0">
                            <div
                                ref={containerRef}
                                className={cn(
                                    "relative h-64 flex flex-col items-center justify-center space-y-4 transition-colors duration-200",
                                    dragActive && "bg-primary/5 border-primary",
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center space-y-4">
                                    <div
                                        className={cn(
                                            "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200",
                                            dragActive ? "bg-primary text-primary-foreground" : "bg-muted",
                                        )}
                                    >
                                        <FileVideo className="w-8 h-8" />
                                    </div>

                                    <div className="text-center space-y-2">
                                        <p className="text-lg font-medium">
                                            {dragActive ? "Drop your video here" : "Drop your video file here"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Supports MP4, WebM, AVI, MOV and other video formats
                                        </p>
                                    </div>

                                    <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                                        <Upload className="w-4 h-4" />
                                        Browse Files
                                    </Button>
                                </div>

                                <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileInput} className="hidden" />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    src={videoFile.url}
                                    className="w-full aspect-video object-contain"
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => setIsPlaying(false)}
                                />

                                {/* Video Controls Overlay */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-1">
                                    {/* Progress Bar */}
                                    <div className="space-y-1">
                                        <Slider
                                            value={[progressPercentage]}
                                            onValueChange={handleSeek}
                                            max={100}
                                            step={0.1}
                                            className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
                                        />
                                    </div>

                                    {/* Control Buttons */}
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center space-x-3">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={togglePlay}
                                                className="w-10 h-10 hover:bg-white/20 text-white hover:text-white"
                                            >
                                                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                                            </Button>

                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={toggleMute}
                                                    className="w-8 h-8 hover:bg-white/20 text-white hover:text-white"
                                                >
                                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                                </Button>
                                                <div className="w-20">
                                                    <Slider
                                                        value={[isMuted ? 0 : volume * 100]}
                                                        onValueChange={handleVolumeChange}
                                                        max={100}
                                                        step={1}
                                                        className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-sm font-medium">
                                                {formatTime(currentTime)} / {formatTime(duration)}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={toggleFullscreen}
                                                className="w-8 h-8 hover:bg-white/20 text-white hover:text-white"
                                            >
                                                <Maximize className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                disabled={loading}
                                                size="icon"
                                                variant="ghost"
                                                onClick={removeVideo}
                                                className="w-8 h-8 hover:bg-white/20 text-white hover:text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Video Info */}
                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold text-lg">{videoFile.file.name}</h3>
                                <div className="flex items-center space-x-4 text-xs sm:text-sm text-muted-foreground">
                                    <span>Size: {(videoFile.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    <span>Duration: {formatTime(duration)}</span>
                                    <span>Type: {videoFile.file.type}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {!loading ?
                                <Button onClick={handleUpload} >
                                    <UploadIcon size={20} />
                                    Upload to our Server
                                </Button>
                                :
                                <Button disabled >
                                    <UploadIcon size={20} />
                                    Uploading... <Loader2Icon className="animate-spin ml-2" size={16} />
                                </Button>
                            }
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}
