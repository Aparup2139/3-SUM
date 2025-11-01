import { useUserStore } from "@/store/user.store"
import { UserCard } from "./userCard"
import { UserRole, type TopEditorsData } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getTopEditors, getTopYoutubers } from "@/httpfnc/user";
import { useCallback } from "react";
import { toast } from "sonner";


export const RightContent = () => {
    const role = useUserStore((state) => state.user.role);
    const fetchFnc = useCallback(() => {
        if (role === UserRole.YOUTUBER)
            return getTopEditors();
        else if (role === UserRole.EDITOR)
            return getTopYoutubers();
        return Promise.reject(new Error("Invalid role for fetching top users"));
    }, [role])

    const { data, isLoading, error } = useQuery<TopEditorsData[]>({
        queryKey: ["top-editors", role],
        queryFn: fetchFnc,
        enabled: role === UserRole.YOUTUBER || role === UserRole.EDITOR,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    if (error) {
        toast.error("Failed to fetch top users. Please try again later.");
    }

    return <div className="h-full w-full flex flex-col gap-10" >
        {role === UserRole.YOUTUBER && <div className=" h-[3%] w-full " >
            <h1>Top Editors </h1>
            <h1 className="opacity-70" >based on ratings an tasks completed</h1>
        </div>}
        {role === UserRole.EDITOR && <div className=" h-[3%] w-full " >
            <h1>Top Youtubers </h1>
            <h1 className="opacity-70" >based on videos uploaded</h1>
        </div>}
        {role === UserRole.NORMAL && <div className=" h-[3%] flex flex-col gap-1 w-full " >
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-[70%]" />
        </div>}

        {isLoading ? <div className="flex w-full overflow-y-scroll gap-5 items-center flex-col h-[97%]" >
            <UserCard loading />
            <UserCard loading />
            <UserCard loading />
            <UserCard loading />

        </div>
            :
            <div className="flex w-full overflow-y-scroll gap-5 items-start pr-4 flex-col h-[97%]" >
                {data && data.length > 0 && data.map(editor => <UserCard key={editor.id} {...editor} />)}
                {data && data.length === 0 && <div className="h-full w-full flex items-center justify-center text-gray-500" >
                    No Editors Found
                </div>}
            </div>}
    </div>
}
