// import { NotificationCard } from "./notificationCard"

import { noPfpImg } from "@/constast";
import { fetchNotification } from "@/httpfnc/notification";
import { useNotificationStore } from "@/store/notification.store";
import { useUserStore } from "@/store/user.store";
import type { NotificationType } from "@/types/types";
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";
import { NotificationCard } from "./notificationCard";
import { BrushCleaning } from "lucide-react";

export const LeftContent = () => {
    const id = useUserStore((state) => state.user.id);

    const { data, isLoading, error } = useQuery<NotificationType[]>({
        queryKey: ["fetchNotification", id],
        queryFn: fetchNotification,
        enabled: !!id,
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    console.log("error:", error)
    const notificationsData = useNotificationStore((state) => state.notifications)
    const setNotificationsData = useNotificationStore((state) => state.setState)


    useEffect(() => {
        if (data) {
            setNotificationsData(data);
        }
    }, [data]);

    return (<div className="h-full w-full flex flex-col justify-center items-center " >
        <div className="flex h-full py-5 items-center w-full flex-col gap-5 overflow-y-scroll">
            {notificationsData?.length > 0 && notificationsData.map((notification, index) => (
                <NotificationCard
                    loading={isLoading}
                    key={index}
                    title={notification.title}
                    description={notification.content}
                    read={notification.read ?? false}
                    userPfp={notification.user?.profileImgUrl || noPfpImg}
                    userId={notification.userId}
                    time={notification.createdAt ? new Date(notification.createdAt).getTime() : 0}
                    id={notification.id ?? 0}
                />
            ))}
        </div>
        {notificationsData?.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full w-full">
                <BrushCleaning size={30} />
                <p className="text-gray-500">No notifications available</p>
            </div>
        )}


    </div>)
}






