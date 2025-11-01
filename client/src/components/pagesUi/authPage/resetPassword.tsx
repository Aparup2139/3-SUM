import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

import { AnimatePresence, motion } from "framer-motion"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { useLocation, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Loader2Icon } from "lucide-react"
import { GradientText } from "@/components/text-animation/text-animations"
import { showError } from "@/lib/showError"
import { resetPassword as resetPasswordRequest } from "@/httpfnc/auth"

export function ResetPasswordPage() {

    const [loading] = useState<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation();
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const email = location.state?.email;
    if (!email) {
        toast.error("Email not found. Please try again.");
        navigate("/auth");
        return null;
    }


    const resetPassword = async () => {
        if (!password || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match. Please try again.");
            return;
        }
        try {
            await resetPasswordRequest(email, password);
            toast.success("Password changed successfully.");
            navigate("/auth");
        } catch (error) {
            console.error("Error resetting password:", error);
            showError(error, "Failed to change password. Please try again.");
        }

    }

    return (
        <div
            className="h-dvh w-full px-1 sm:px-2 bg mix-blend-hard bg-background
        bg-[radial-gradient(circle_at_center,theme(colors.chart-bg)_10%,transparent_80%)] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm">
                <Card className="w-full max-w-sm ">
                    <CardHeader>
                        <CardTitle>
                            <AnimatePresence>
                                <motion.p
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}

                                    transition={{ duration: 0.3 }}
                                >
                                    <GradientText size="small" text="Change Password" />
                                </motion.p>
                            </AnimatePresence>
                        </CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Password</Label>
                                <Input
                                    type="password"
                                    disabled={loading}
                                    placeholder="Enter new Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Retype Password</Label>
                                <Input
                                    type="password"
                                    disabled={loading}
                                    placeholder="Retype Password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <Button
                                disabled={loading}
                                variant="outline"
                                className="w-fit px-2"
                                size="sm"
                                onClick={resetPassword}
                            >
                                {loading ? <p className="flex gap-1" >
                                    Changing Password ...<Loader2Icon className="animate-spin repeat-infinite" ></Loader2Icon> </p>
                                    : <p>Change Password</p>}
                            </Button>

                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">

                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )

}
