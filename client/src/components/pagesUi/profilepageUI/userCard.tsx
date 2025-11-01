import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { fallback_profileImg } from "@/constast"
import { UserRole, type TopEditorsData } from "@/types/types";
import { useNavigate } from "react-router-dom";

const BIO_LENGTH = 100;

type userCardProps = Partial<TopEditorsData> & { loading?: boolean }

export const UserCard = ({ name, role, bio, profileImgUrl, loading = false }: userCardProps
) => {
    const navigate = useNavigate()
    const truncatedBio = bio && bio.length > BIO_LENGTH ? bio.slice(0, BIO_LENGTH) + "..." : bio;
    return (<Card
        onClick={() => navigate(`/${role === UserRole.YOUTUBER ? "y" : "c"}/profile/${name}`)}
        className="w-[100%] cursor-pointer" >
        <CardHeader>
            <div className="flex w-full gap-3 items-start">
                {!loading && <img
                    className="object-cover w-10 aspect-square rounded-full border-2 border-sidebar-border"
                    src={profileImgUrl || fallback_profileImg}
                />}
                {loading && <Skeleton className="w-10 aspect-square rounded-full border-2 border-sidebar-border" />}
                {!loading && <div className="flex gap-1 justify-center flex-col">
                    <CardTitle className="hover:underline underline-offset-2 " >{name}</CardTitle>
                    <CardDescription>{!truncatedBio || truncatedBio.trim() === "" ? "no bio" : truncatedBio}</CardDescription>
                </div>}
                {loading && <div className="flex gap-1 justify-center w-full flex-col">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-9  w-full" />
                </div>}
            </div>
        </CardHeader>
    </Card>)
}