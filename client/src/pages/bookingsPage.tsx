import { LeftContent } from "@/components/pagesUi/bookings/leftContent";
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper"

import { RightContent } from "@/components/pagesUi/tasksPageUI/rightContent"
export const BookingsPage = () => {    

    return (<PageWrapper
        headerText="Booked Tickets"
        leftContent={<LeftContent />}
        rightContent={<RightContent />}
    />)
}

