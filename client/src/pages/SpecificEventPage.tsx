import { RightContent } from "@/components/pagesUi/tasksPageUI/rightContent"
import { LeftContent } from "@/components/pagesUi/specificEventPage/leftContent"
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper"

export const SpecificEventPage = () => {
    return (<PageWrapper
        headerText=""
        HeaderJSX={<></>}
        leftContent={<LeftContent />}
        rightContent={<RightContent />}
    />)
}

