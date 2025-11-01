import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserRole, type AuthDataType } from "@/types/types"
import { generateOTP, getOauthWindow, LoginUser, RegisterUser } from "@/httpfnc/auth"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/store/user.store"
import { googleIcon } from "@/constast"
import { Loader2Icon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { GradientText } from "@/components/text-animation/text-animations"
import { showError } from "@/lib/showError"

export function AuthPage() {
    const [loginBox, setLoginBox] = useState<boolean>(true)
    const [data, setData] = useState({ email: "", password: "", role: UserRole.NORMAL })
    const [loading, setLoading] = useState<boolean>(false)
    const [oauthLoading, setOauthLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const setState = useUserStore((state) => state.setState)


    const handleSubmit = async () => {
        if (data.role === UserRole.NORMAL && !loginBox) {
            toast.warning("Please select a role")
            return;
        }
        if (!data.email || !data.password || data.email?.trim() === "" || data.password?.trim() === "") {
            toast.warning("Please fill all fields")
            return;
        }
        if (!data.email.includes("@") || !data.email.includes(".")) {
            toast.warning("invalid email format")
            return;
        }
        setLoading(true)
        try {
            if (loginBox) {

                const userData: AuthDataType = await LoginUser(data.email, data.password)
                setState(userData)
                const isAdmin = userData.role === UserRole.ADMIN;
                toast.success("Login successful! Redirecting to profile...");
                if (isAdmin) {
                    navigate(`/admin-panel`);
                    setLoading(false)
                    return;
                }
                navigate(`/profile`);
            }
            else {
                const userData: AuthDataType = await RegisterUser(data.email, data.password, data.role);
                setState(userData)
                const isAdmin = userData.role === UserRole.ADMIN;
                toast.success("Login successful! Redirecting to profile...");
                if (isAdmin) {
                    navigate(`/admin-panel`);
                    setLoading(false)
                    return;
                }
                navigate(`/profile`);
            }

        } catch (error) {
            console.error("Error during authentication:", error);
            showError(error, "Failed to authenticate. Please try again.");
        }
        setLoading(false)
    }

    const handleOauthWindow = async () => {
        if (data.role === UserRole.NORMAL && !loginBox) {
            toast.warning("Please select a role")
            return;
        }
        useUserStore.getState().updateState({ role: data.role })
        setOauthLoading(true)
        try {
            const data: { url: string } = await getOauthWindow()
            if (!data || !data.url) {
                toast.error("Failed to get OAuth URL. Please try again later.");
                return;
            }
            window.location.href = data.url;
        } catch (error) {
            console.error("Error during OAuth window handling:", error);
            showError(error, "Failed to open OAuth window. Please try again.");
        }
        setOauthLoading(false)

    }

    return (
        <div
            className="h-dvh w-full px-2 bg mix-blend-hard bg-background
        bg-[radial-gradient(circle_at_center,theme(colors.chart-bg)_10%,transparent_80%)] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm">
                <Card className="w-full max-w-sm ">
                    <CardHeader>
                        <CardTitle>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={loginBox ? 'login' : 'signup'}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}

                                    transition={{ duration: 0.3 }}
                                >
                                    {loginBox ? <GradientText size="small" text="Login" /> : <GradientText size="small" text="Sign Up" />}
                                </motion.p>
                            </AnimatePresence>

                        </CardTitle>
                        <CardDescription>
                            {loginBox ? "Don't have an account? go to " : "Already have an account? go to "}
                            <a
                                onClick={() => setLoginBox(!loginBox)}
                                className="text-blue-500 cursor-pointer dark:text-blue-300 font-semibold">
                                {loginBox ? "Signup" : "Login"}
                            </a>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!loginBox && (
                            <Select
                                onValueChange={(val) => {
                                    setData((prev) => ({
                                        ...prev,
                                        role: val as UserRole, // cast string to enum
                                    }));
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Role</SelectLabel>
                                        <SelectItem value={UserRole.GENERAL}>General</SelectItem>
                                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}

                        <br />
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        disabled={loading}
                                        value={data.email}
                                        onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    {loginBox ? <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>

                                    </div> :
                                        <Label htmlFor="password">Password</Label>
                                    }
                                    <Input id="password" type="password"
                                        disabled={loading}
                                        value={data.password}
                                        onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="Enter your password"
                                        required />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        {loading ? <Button className="w-full" size="lg">
                            <p>{loginBox ? "Loggin you in" : "Signing you up"} </p>
                            <Loader2Icon className="animate-spin" />
                        </Button> :
                            <Button className="w-full" size="lg"
                                disabled={loading || oauthLoading}
                                onClick={handleSubmit} >
                                <p>{loginBox ? "Login" : "Sign up"} </p>
                            </Button>
                        }

                        {oauthLoading ? <Button variant="outline" className="w-full" size="lg" >
                            <img className="h-6 aspect-square" src={googleIcon} />
                            <p>{loginBox ? "Loggin you in" : "Signing you up"}  </p>
                            <Loader2Icon className="animate-spin" />
                        </Button> :

                            <Button variant="outline" className="w-full" size="lg"
                                disabled={loading || oauthLoading}
                                onClick={handleOauthWindow}  >
                                <img className="h-6 aspect-square" src={googleIcon} />
                                <p>{loginBox ? "Login with google" : "Sign up with google"} </p>
                            </Button>
                        }

                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )

}
