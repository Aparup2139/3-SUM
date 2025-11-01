import { LeftContent } from "@/components/pagesUi/bookings/leftContent";
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper"

import { RightContent } from "@/components/pagesUi/tasksPageUI/rightContent"
export const BookingsPage = () => {    

    return (<PageWrapper
        headerText=""
        leftContent={<LeftContent />}
        rightContent={<RightContent />}
    />)
}

