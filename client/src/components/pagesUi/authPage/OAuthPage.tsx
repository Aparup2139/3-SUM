import { getOauthLoginRegister } from "@/httpfnc/auth";
import { useUserStore } from "@/store/user.store"
import { UserRole, type AuthDataType } from "@/types/types";
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion";
import { googleIcon, logo } from "@/constast";
import { LoadingTitle } from "@/components/loadingUI/loadingTitle";

export function OAuthPage() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const role = useUserStore((state) => state.user.role);
    const navigate = useNavigate()
    const setState = useUserStore((state) => state.setState)

    useEffect(() => {

        if (!code) {
            console.error("no code was provided");
            return;
        }

        const getUserData = async () => {
            const userData: AuthDataType = await getOauthLoginRegister(code, role)
            setState(userData)
            const prefix = userData.role === UserRole.YOUTUBER ? "y" : "c";

            navigate(`/${prefix}/profile/${userData.name}`);
        }

        try {
            getUserData();
        }
        catch (error) {
            console.error("Error during OAuth login/register:", error);
            alert("Failed to login/register with OAuth. Please try again.");

        }

    }, [code, role])

    return (
        <div className="h-dvh w-full bg mix-blend-hard bg-background
        bg-[radial-gradient(circle_at_center,theme(colors.chart-bg)_10%,transparent_80%)] flex items-center justify-center">
            <div className="flex
        flex-col gap-10 items-center justify-center h-dvh" >

                <div className="flex gap-2 justify-center items-center">
                    <motion.img
                        initial={{ opacity: 0, rotate: 30 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        alt="TubeSpace Logo"
                        className="h-20" src={logo} />
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-4xl font-bold text-balance">TubeSpace</motion.h1>
                </div>
                <div className="flex flex-col w-screen justify-center items-center gap-5" >
                    Loggin you in with... <img className="shadow-border w-10 shadow-2xl" src={googleIcon} />
                    <LoadingTitle />

                </div>

            </div>
        </div>
    )

}



