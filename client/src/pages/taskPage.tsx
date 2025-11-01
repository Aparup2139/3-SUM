import { RightContent } from "@/components/pagesUi/tasksPageUI/rightContent"
import { LeftContent } from "@/components/pagesUi/tasksPageUI/leftContent"
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper"

export const HomePage = () => {
    return (<PageWrapper
        headerText="Home"
        HeaderJSX={<></>}
        leftContent={<LeftContent />}
        rightContent={<RightContent />}
    />)
}

