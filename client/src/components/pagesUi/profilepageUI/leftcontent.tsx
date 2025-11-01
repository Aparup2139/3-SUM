import { Button } from "@/components/ui/button"
import { LinkIcon, MessageCircleIcon, StickyNote, VideoIcon } from "lucide-react"
import { FullTextDialogView } from "../common/fullTextDialogView";
import { useQuery } from "@tanstack/react-query";
import { getProfileData } from "@/httpfnc/user";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "@/store/user.store";
import { UserRole, type profileDataType } from "@/types/types";
import { fallback_bannerImg, fallback_profileImg } from "@/constast";
import { Skeleton } from "@/components/ui/skeleton";
import { EditProfileDialog } from "@/components/dialogbox/editProfileDialog";

const CHAR_LIMIT = 200;


export const LeftContent = () => {

    const { username } = useParams();
    const updateState = useUserStore((state) => state.updateState);
    const currentUserState = useUserStore((state) => state.user)
    if (!username) {
        return <div className="h-full w-full flex items-center justify-center">404</div>;
    }

    const { data, isLoading: loading, error } = useQuery<profileDataType>({
        queryKey: ["profile", username],
        queryFn: () => getProfileData(username!),
        enabled: !!username,
        staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        if (data && data.editable)
            updateState(data);
    }, [data])

    if (error) return <div className="h-full w-full flex items-center justify-center text-red-500">{error.message}</div>;
    let userState: profileDataType | undefined = undefined;
    if (!loading){
        if(data?.editable) userState = currentUserState
        else userState = data;
    }

    const isBioLong = !loading && userState?.bio && userState.bio?.length > CHAR_LIMIT;
    let truncatedBio = "No bio available!";
    truncatedBio = !loading && userState?.bio && (isBioLong ? userState.bio.slice(0, CHAR_LIMIT) + "..." : userState.bio) || truncatedBio;

    return <div className="h-full w-full" >
        <div className="w-full h-1/2 relative rounded-lg">
            {loading ? <Skeleton className="w-full h-full" /> :
                <img
                    className="w-full h-full border-b border-border object-cover"
                    src={userState?.bannerImgUrl || fallback_bannerImg}>
                </img>}
            {!loading ? <div className="absolute h-fit -bottom-0 translate-y-1/2 left-5  flex gap-2 items-center" >
                <img
                    className="h-16 sm:h-24 rounded-full border border-border aspect-square object-cover "
                    src={userState?.profileImgUrl || fallback_profileImg}
                />
                <div className="mt-8 flex w-full gap-10" >
                    <h1>{userState?.name ? userState.name : userState?.email}</h1>
                </div>
            </div> :
                <div className="absolute h-fit -bottom-0 translate-y-1/2 left-5  flex gap-2 items-center" >
                    <Skeleton className="h-16 sm:h-24 rounded-full border border-border aspect-square " />
                    <Skeleton className="mt-8 border w-20 h-4 rounded" />
                </div>}

            <div className="absolute h-fit -bottom-2 translate-y-[100%] right-5  flex gap-2 items-center" >
                {loading ? <Skeleton className="h-6 w-6 sm:w-24 rounded" /> :
                    userState?.editable ?
                        <EditProfileDialog />
                        :
                        <Button variant={"outline"} className="flex gap-2 text-chart-3 w-full" >
                            <MessageCircleIcon />
                            <h1 className="max-[600px]:hidden" >chat</h1>
                        </Button>
                }

            </div>

        </div>

        {!loading ? <div className="w-[95%] m-auto flex flex-col gap-2 rounded-xl mt-14 py-5 px-10 bg-popover text-popover-foreground ">
            {truncatedBio}
            {isBioLong && <FullTextDialogView text={userState?.bio as string} />}
        </div> :
            <Skeleton className="w-[95%] h-28 sm:h-20 m-auto flex flex-col gap-2 rounded-xl mt-14 py-5 px-10 bg-popover text-popover-foreground " />
        }
        <br />

        <div className="px-10  flex flex-col gap-2">
            {userState?.role === UserRole.EDITOR && <RatingComp loading={loading} rating={userState.rating} />}
            <div className="flex gap-2 opacity-80 items-center">
                <LinkIcon size={15} />
                {userState?.attachedLinks ? (
                    <a href={userState.attachedLinks} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {userState.attachedLinks}
                    </a>
                ) : (
                    <p>No links available</p>
                )}
            </div>

            {userState?.role === UserRole.EDITOR && (userState.tasksCompleted || userState.tasksCompleted === 0) && <div className="flex gap-2 opacity-80 items-center">
                <StickyNote size={15} />
                <p>{`Task completed: ${userState.tasksCompleted}`}</p>
            </div>}

            {userState?.role === UserRole.YOUTUBER && (userState.videosUploaded || userState.videosUploaded === 0) && <div className="flex gap-2 opacity-80 items-center">
                <VideoIcon size={15} />
                <p>{`Videos uploaded: ${userState.videosUploaded}`}</p>
            </div>}

        </div>
    </div>
}

const RatingComp = ({ rating, loading = false }: { rating: number | undefined | null, loading?: boolean }) => {
    if (loading) return <Skeleton className="h-6 w-24" />;
    if (!rating)
        return <div className="flex gap-1 opacity-70">unrated</div>;
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars.push(<span key={i} className="text-yellow-500">★</span>);
        } else {
            stars.push(<span key={i} className="text-gray-400">★</span>);
        }
    }
    return <div className="flex gap-1">{stars}</div>;
}