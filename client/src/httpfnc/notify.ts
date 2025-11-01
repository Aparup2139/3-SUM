import { baseUrl } from "@/constast";
import type { httpRequstType } from "@/types/types";

const notifyViaPushNotification = async (fcmToken: string, title: string, body: string) => {
    const response = await fetch(baseUrl + `notify/send-pushNotifications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fcmToken, title, body }),
        credentials: "include",
    });

    const resData: httpRequstType = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to send push notification");
    };
    return resData.data;
}

export {
    notifyViaPushNotification
}
