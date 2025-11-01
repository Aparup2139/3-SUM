import { baseUrl } from "@/constast";
import type { httpRequstType } from "@/types/types";

const fetchNotification = async () => {
    console.log("fetching notifications");
    const response = await fetch(baseUrl + `notification/fetch-notification`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const resData: httpRequstType = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to fetch user's notification");
    };
    return resData.data;
}

const readNotification = async (id: number) => {
    const response = await fetch(baseUrl + `notification/read-notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
    });

    const resData: httpRequstType = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to set notification as read");
    };
    return resData.data;
}

const toggleNotification = async (notificationId: number | null | undefined) => {
    if (!notificationId) throw new Error("Notification ID is invalid or missing");
    const response = await fetch(baseUrl + `notification/toggle-notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: notificationId }),
    });

    const resData: httpRequstType = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to fetch video preview url");
    };
    return resData.data;
}



export {
    fetchNotification,
    readNotification,
    toggleNotification
}