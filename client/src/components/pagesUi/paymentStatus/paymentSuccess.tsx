import { Button } from "@/components/ui/button";
import { Check, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds === 0) {
      navigate("/bookings");
      return;
    }
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, navigate]);
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center  justify-center min-h-fit border border-green-300/20 bg-muted/90 max-w-3xl mx-auto p-4 md:p-8 rounded-2xl">
        <Check className="bg-green-400 p-3 w-16 h-16 rounded-full text-white size-8 " />
        <h1 className="text-2xl font-bold text-center mt-5 flex items-center gap-3">
          Payment Successful! <PartyPopper className="text-green-500" />
        </h1>
        <p className="text-center mt-4">
          Thank you for your payment. Your transaction has been completed
          successfully.
        </p>
        <p className="text-center mt-2">You can now go to bookings page</p>
        <Link to="/bookings">
          <Button variant="default" className="mt-5 py-4 cursor-pointer">
            Proceed
          </Button>
        </Link>

        <p className="mt-6 text-slate-300">
          You will be redirected to your dashboard in {seconds} second
          {seconds !== 1 ? "s" : ""}...
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;