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


export function VerifyOTPPage() {

    const [sendingOTP, setSendingOTP] = useState<boolean>(false)
    const [verifying, setVerifying] = useState<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation();
    const [otp, setOtp] = useState<number | null | undefined>();

    const email = location.state?.email;

    const [changeEmail, setChangeEmail] = useState<boolean>(email ? false : true);
    const [emailInput, setEmailInput] = useState<string>(email || "");

    const sendOTP = async () => {
        setSendingOTP(true);
        try {
            await generateOTP(emailInput);
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error("Failed to send OTP. Please try again.");
            setSendingOTP(false);
            return;

        }
        setSendingOTP(false);
        setChangeEmail(false);
        toast.success("OTP sent to your email. Please check your inbox.");
    }

    const verifyTheOtp = async () => {
        setVerifying(true)
        if (!otp || otp.toString().length !== 4) {
            toast.error("Please enter a valid OTP.");
            setVerifying(false);
            return;
        }

        try {
            await verifyOTP(emailInput, otp);
            toast.success("OTP verified successfully.");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            showError(error, "Failed to verify OTP. Please try again.");
            setVerifying(false);
            return;

        }
        setVerifying(false)
        navigate("/auth/reset-password", { state: { email: emailInput } });

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
                                    <GradientText size="small" text="Verify OTP" />
                                </motion.p>
                            </AnimatePresence>
                        </CardTitle>
                        <CardDescription>
                            {!changeEmail ? <div className="flex flex-col gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Enter the OTP sent to your email {emailInput}
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-fit mb-2"
                                    size="sm"
                                    onClick={() => setChangeEmail(true)}
                                >
                                    Change Email
                                </Button>

                                <div className="flex sm:flex-row flex-col gap-3">
                                    <InputOTPPattern otp={otp} setOtp={setOtp} />
                                    <Button
                                        variant="outline"
                                        className="w-fit px-2"
                                        size="sm"
                                        onClick={verifyTheOtp}
                                    >
                                        {verifying ? <p className="flex gap-1" >Verifying ...<Loader2Icon className="animate-spin repeat-infinite" ></Loader2Icon> </p> : <p>Verify</p>}
                                    </Button>
                                </div>
                            </div> :
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm text-muted-foreground">
                                        Enter your email
                                    </p>
                                    <Input
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full"
                                        disabled={sendingOTP}
                                    />
                                    <Button
                                        variant="outline"
                                        className="w-fit mb-2"
                                        size="sm"
                                        onClick={sendOTP}
                                        disabled={sendingOTP}
                                    >
                                        {sendingOTP ? <p className="flex gap-1" >Sending OTP ...<Loader2Icon className="animate-spin repeat-infinite" ></Loader2Icon> </p> : <p>Send OTP</p>}
                                    </Button>

                                </div>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                    <CardFooter className="flex-col gap-2">
                        <p className="text-muted-foreground text-sm text-left w-full" >otp expires in 2 minute.</p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )

}


import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { Loader2Icon } from "lucide-react"
import { GradientText } from "@/components/text-animation/text-animations"
import { generateOTP, verifyOTP } from "@/httpfnc/auth"
import { showError } from "@/lib/showError"

export function InputOTPPattern({
    otp,
    setOtp,
}: {
    otp: number | null | undefined;
    setOtp: (otp: number | null | undefined) => void;
}) {
    return (
        <InputOTP
            maxLength={4}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={!otp ? "" : otp.toString()}
            onChange={(val) => {
                setOtp(val === "" ? null : Number(val))
            }}
        >
            <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
            </InputOTPGroup>
        </InputOTP>
    )
}

