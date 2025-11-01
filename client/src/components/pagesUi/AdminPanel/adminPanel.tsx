import { PageWrapper2 } from "@/components/pagesWrapper/pagesWrapper"
import { CreateTaskSheet } from "@/components/dialogbox/createTaskSheet"
import { LeftContent } from "../tasksPageUI/leftContent"

export const AdminPanelPage = () => {


    return (<PageWrapper2
        headerText="Admin Panel"
        HeaderJSX={<CreateTaskSheet />}
        leftContent={<LeftContent admin />}
        rightContent={<></>}
    />)
}

