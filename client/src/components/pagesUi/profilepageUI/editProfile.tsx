import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm, useWatch } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/user.store"
import { baseUrl } from "@/constast"
import { UserRole, type AuthDataType } from "@/types/types"
import { useNavigate } from "react-router-dom"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

type FormValues = {
    name: string
    bio: string
    link: string
    banner?: FileList
    profilePic?: FileList
}

export function ProfileEditCard({
    onSubmittingChange,
    submitting,
}: {
    onSubmittingChange: (isSubmitting: boolean) => void
    submitting: boolean
}) {
    const controllerRef = useRef<AbortController | null>(null)
    const naviagte = useNavigate()
    const updateState = useUserStore((state) => state.updateState)
    const user = useUserStore((state) => state.user)

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            bio: "",
            link: "",
        }
    })

    useEffect(() => {
        reset({
            name: user.name,
            bio: user.bio ?? "",
            link: user.attachedLinks?.[0] ?? "",
        })
    }, [user.name, user.bio, user.attachedLinks, reset])

    const bannerInputRef = useRef<HTMLInputElement>(null)
    const pfpInputRef = useRef<HTMLInputElement>(null)

    const bannerFile = useWatch({ control, name: "banner" })
    const pfpFile = useWatch({ control, name: "profilePic" })


    useEffect(() => {
        return () => {
            controllerRef?.current?.abort()
        }
    }, [])

    const previewFile = (fileList?: FileList) =>
        fileList?.[0] ? URL.createObjectURL(fileList[0]) : undefined

    const onSubmit = async (data: FormValues) => {
        console.log("Submitted:", data)
        if (data.name.trim() === "") {
            alert("Name is required")
            return;
        }

        controllerRef.current = new AbortController();
        try {
            onSubmittingChange(true);
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("bio", data.bio);
            formData.append("link", data.link);
            if (data.profilePic?.[0]) {
                formData.append("profileImg", data.profilePic[0]);
            }

            if (data.banner?.[0]) {
                formData.append("BannerImg", data.banner[0]);
            }

            const res = await fetch(`${baseUrl}user/edit-profile`, {
                signal: controllerRef.current.signal,
                method: "POST",
                credentials: "include",
                body: formData,
            });

            interface resultType {
                message: string;
                data: Partial<AuthDataType>
            }
            const result: resultType = await res.json();
            if (!res.ok) {
                throw new Error(result.message || "Failed to update profile");
            }

            toast.success("Profile updated successfully!");
            updateState({
                name: result.data.name,
                bio: result.data.bio,
                attachedLinks: result.data.attachedLinks,
                profileImgUrl: result.data.profileImgUrl,
                bannerImgUrl: result.data.bannerImgUrl,
            })
            naviagte(`/${useUserStore.getState().user.role === UserRole.YOUTUBER ? "y" : "c"}/profile/${result.data.name}`);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to update profile");
        } finally {
            onSubmittingChange(false);
        }
    }

    return (
        <Card className="w-full bg-transparent border-0 mx-auto p-4 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div
                    onClick={() => !submitting && bannerInputRef.current?.click()}
                    className="relative w-full h-32 bg-muted/30 rounded-md flex items-center justify-center text-sm cursor-pointer overflow-visible"
                >
                    {bannerFile?.[0] ? (
                        <img
                            src={previewFile(bannerFile)}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        user.bannerImgUrl ? (
                            <img
                                src={user.bannerImgUrl}
                                alt="Banner"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs opacity-70">add banner</span>
                        )
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        disabled={submitting}
                        {...register("banner")}
                        ref={(e) => {
                            register("banner").ref(e)
                            bannerInputRef.current = e
                        }}
                        className="hidden"
                    />

                    <div
                        onClick={(e) => {
                            if (!submitting) {
                                e.stopPropagation()
                                pfpInputRef.current?.click()
                            }
                        }}
                        className="absolute -bottom-8 left-4 w-16 h-16 rounded-full bg-muted border flex items-center justify-center text-xs cursor-pointer overflow-hidden"
                    >
                        {pfpFile?.[0] ? (
                            <img
                                src={previewFile(pfpFile)}
                                alt="PFP preview"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            user.profileImgUrl ? (
                                <img
                                    src={user.profileImgUrl}
                                    alt="PFP"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <span className="text-[10px]">add pfp</span>
                            )
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            disabled={submitting}
                            {...register("profilePic")}
                            ref={(e) => {
                                register("profilePic").ref(e)
                                pfpInputRef.current = e
                            }}
                            className="hidden"
                        />
                    </div>
                </div>

                <br />

                <div className="flex flex-col gap-1">
                    <Label htmlFor="name">name</Label>
                    <Input
                        id="name"
                        disabled={submitting}
                        {...register("name", { required: "Name is required" })}
                        className={cn(errors.name && "border-red-500")}
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="bio">bio</Label>
                    <Textarea
                        id="bio"
                        disabled={submitting}
                        {...register("bio")}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="link">link</Label>
                    <Input
                        id="link"
                        disabled={submitting}
                        {...register("link")}
                    />
                </div>

                <div className="flex justify-between pt-2">
                    <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2Icon className="animate-spin" />}
                        {submitting ? "saving..." : "save"}
                    </Button>

                </div>
            </form>
        </Card>
    )
}

