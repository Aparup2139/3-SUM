import { Button } from "@/components/ui/button";
import { BadgeDollarSign, X } from "lucide-react";
import { Link } from "react-router";

function PaymentFailure() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center  justify-center min-h-fit border border-red-300/20 bg-muted/90 max-w-3xl mx-auto p-4 md:p-8 rounded-2xl">
        <X className="bg-red-400 p-3 w-16 h-16 rounded-full text-white size-8 " />
        <h1 className="text-2xl font-bold text-center mt-5 flex items-center gap-3">
          Payment Failed! <BadgeDollarSign className="text-red-400" />
        </h1>
        <p className="text-center mt-4">
          Your transaction has failed due to some technical error.
        </p>
        <p className="text-center mt-2 ">
          Please contact us at{" "}
          <a
            href="mailto:support@evently.com"
            className="text-indigo-500 underline"
          >
            {" "}
            support@evently.com
          </a>
        </p>
        <Link to="/home">
          <Button variant="default" className="mt-5 py-4 cursor-pointer">
            Go Back
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default PaymentFailure;