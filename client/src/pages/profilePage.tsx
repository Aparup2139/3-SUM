import { LeftContent } from "@/components/pagesUi/profilepageUI/leftcontent";
import { RightContent } from "@/components/pagesUi/profilepageUI/rightcontent";
import { SearchBar } from "@/components/pagesUi/profilepageUI/searchbar";
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user.store";
import { UserRole } from "@/types/types";
import { ArrowBigLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export const ProfilePage = () => {
    const { username } = useParams()
    return (<PageWrapper
        HeaderJSX={<SearchBar />}
        HeaderIcon={<GetBackToYourProfile />}
        headerText={username || "Profile"}
        leftContent={<LeftContent />}
        rightContent={<RightContent />}
    />)
}


const GetBackToYourProfile = () => {
    const { username } = useParams()
    const role = useUserStore((state) => state.user.role);
    const name = useUserStore((state) => state.user.name);

    if (!name || !username) return <></>;

    if (name.toLowerCase() !== username.toLowerCase()) {
        return <Link to={`/${role === UserRole.EDITOR ? "c" : "y"}/profile/${name}`} >
            <Button variant={"outline"} className=" border rounded-lg text-chart-3 border-chart-4/50 ">
                <ArrowBigLeft/>
            </Button>

        </Link>
    }
    return <></>

}



