import { NotificationSettings } from "./notificationSettings"


export const RightContent = () => {
    return <div className="h-full w-full flex flex-col gap-10" >
        <div className=" h-[3%] w-full " >
            <h1>Notification Settings</h1>
        </div>
        <div className="flex gap-5 flex-col h-[97%] " >
            <NotificationSettings />
        </div>
    </div>
}



