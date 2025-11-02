import React, { useState, useEffect } from "react";
import {
  X,
  Ticket,
  User,
  CreditCard,
  Users,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { baseUrl } from "@/constast";
import { useNavigate } from "react-router-dom";

interface TicketBookingModalProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  eventId: string;
  eventName?: string;
  ticketPrice?: number;
}

interface AttendeeInfo {
  name: string;
  age: string;
  gender: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventName,
  ticketPrice,
}) => {
  const [formData, setFormData] = useState({
    ticketCount: 1,
  });
  console.log("eventId", eventId);
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([
    { name: "", age: "", gender: "" },
  ]);

  const [attendeeErrors, setAttendeeErrors] = useState<
    Record<number, Record<string, string>>
  >({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleTicketCountChange = (newCount: number) => {
    const count = Math.min(5, Math.max(1, newCount));
    setFormData({ ...formData, ticketCount: count });

    const currentLength = attendees.length;
    if (count > currentLength) {
      setAttendees([
        ...attendees,
        ...Array(count - currentLength).fill({ name: "", age: "", gender: "" }),
      ]);
    } else if (count < currentLength) {
      setAttendees(attendees.slice(0, count));
      const newAttendeeErrors = { ...attendeeErrors };
      for (let i = count; i < currentLength; i++) {
        delete newAttendeeErrors[i];
      }
      setAttendeeErrors(newAttendeeErrors);
    }
  };

  const handleAttendeeChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newAttendees = [...attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value };
    setAttendees(newAttendees);

    if (attendeeErrors[index]?.[field]) {
      const newErrors = { ...attendeeErrors };
      if (newErrors[index]) {
        delete newErrors[index][field];
        if (Object.keys(newErrors[index]).length === 0) {
          delete newErrors[index];
        }
      }
      setAttendeeErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const newAttendeeErrors: Record<number, Record<string, string>> = {};

    attendees.forEach((attendee, index) => {
      const errors: Record<string, string> = {};

      if (!attendee.name.trim()) {
        errors.name = "Name is required";
      }

      if (!attendee.age) {
        errors.age = "Age is required";
      } else if (parseInt(attendee.age) < 1 || parseInt(attendee.age) > 120) {
        errors.age = "Invalid age";
      }

      if (!attendee.gender) {
        errors.gender = "Gender is required";
      }

      if (Object.keys(errors).length > 0) {
        newAttendeeErrors[index] = errors;
      }
    });

    setAttendeeErrors(newAttendeeErrors);
    return (
      Object.keys(newErrors).length === 0 &&
      Object.keys(newAttendeeErrors).length === 0
    );
  };

  const createOrder = async (amount: number) => {
    try {
      console.log("amount", amount);
      console.log("currency", "INR");
      console.log("eventId", eventId);
      console.log("attendees", attendees);
      console.log("ticketCount", formData.ticketCount);
      const response = await fetch(baseUrl + "bookings/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          eventId,
          attendees,
          ticketCount: formData.ticketCount,
        }),
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };
  const navigate = useNavigate();
  const handlePayment = async (
    bookingId: string,
    amount: number,
    order_id: string
  ) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount,
      currency: "INR",
      name: "Mid-Events",
      description: `Ticket booking for ${eventName}`,
      order_id: order_id,
      handler: async function (response: unknown) {
        try {
          const verifyResponse = await fetch(
            baseUrl + "bookings/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId,
              }),
              credentials: "include",
            }
          );

          const result = await verifyResponse.json();

          if (result.success) {
            navigate("/payment-success");
            onClose(false);
          } else {
            navigate("/payment-failure");
          }
        } catch (error) {
          navigate('/payment-success')
          console.error("Payment verification error:", error);
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: attendees[0]?.name || "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#ea580c",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    const totalAmount = formData.ticketCount * (ticketPrice || 10);

    try {
      const orderData = await createOrder(totalAmount);
      console.log("The orderData is", orderData);
      if (orderData.orderId) {
        await handlePayment(
          orderData.bookingId,
          totalAmount,
          orderData.orderId
        );
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const totalAmount = formData.ticketCount * (ticketPrice || 10);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-background rounded-lg border border-foreground/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative p-6 border-b border-foreground/10 bg-gradient-to-r from-orange-600/10 via-pink-600/10 to-purple-600/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full blur-md opacity-50"></div>
                <div className="relative bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 p-2 rounded-full">
                  <Ticket className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Book Tickets
                </h2>
                <p className="text-xs text-muted-foreground">{eventName}</p>
              </div>
            </div>
            <button
              onClick={() => onClose(false)}
              className="p-2 hover:bg-foreground/5 rounded-md transition-colors"
              disabled={isProcessing}
            >
              <X size={20} className="text-foreground/60" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm text-foreground/80 mb-2">
              <Ticket size={16} />
              Number of Tickets (Max 5)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleTicketCountChange(formData.ticketCount - 1)
                }
                disabled={isProcessing}
                className="w-10 h-10 flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 rounded-md border border-foreground/10 text-foreground font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={formData.ticketCount}
                onChange={(e) =>
                  handleTicketCountChange(parseInt(e.target.value) || 1)
                }
                disabled={isProcessing}
                min="1"
                max="5"
                className="flex-1 text-center bg-background rounded-md px-3 py-2.5 text-sm text-foreground border border-foreground/10 focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() =>
                  handleTicketCountChange(formData.ticketCount + 1)
                }
                disabled={isProcessing}
                className="w-10 h-10 flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 rounded-md border border-foreground/10 text-foreground font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User size={16} />
              Attendee Information
            </h3>

            {attendees.map((attendee, index) => (
              <div
                key={index}
                className="bg-foreground/5 rounded-md p-4 border border-foreground/10 space-y-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Attendee {index + 1}
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-foreground/80 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={attendee.name}
                    onChange={(e) =>
                      handleAttendeeChange(index, "name", e.target.value)
                    }
                    placeholder="Enter full name"
                    disabled={isProcessing}
                    className={`w-full bg-background rounded-md px-3 py-2 text-sm text-foreground border ${
                      attendeeErrors[index]?.name
                        ? "border-red-500"
                        : "border-foreground/10"
                    } focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground disabled:opacity-50`}
                  />
                  {attendeeErrors[index]?.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {attendeeErrors[index].name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-foreground/80 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    value={attendee.age}
                    onChange={(e) =>
                      handleAttendeeChange(index, "age", e.target.value)
                    }
                    placeholder="Enter age"
                    disabled={isProcessing}
                    min="1"
                    max="120"
                    className={`w-full bg-background rounded-md px-3 py-2 text-sm text-foreground border ${
                      attendeeErrors[index]?.age
                        ? "border-red-500"
                        : "border-foreground/10"
                    } focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground disabled:opacity-50`}
                  />
                  {attendeeErrors[index]?.age && (
                    <p className="text-xs text-red-500 mt-1">
                      {attendeeErrors[index].age}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-foreground/80 mb-1.5">
                    <Users size={14} />
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["male", "female", "other"].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() =>
                          handleAttendeeChange(index, "gender", gender)
                        }
                        disabled={isProcessing}
                        className={`py-2 px-2 rounded-md text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          attendee.gender === gender
                            ? "bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 text-white"
                            : "bg-background text-foreground hover:bg-foreground/5 border border-foreground/10"
                        }`}
                      >
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </button>
                    ))}
                  </div>
                  {attendeeErrors[index]?.gender && (
                    <p className="text-xs text-red-500 mt-1">
                      {attendeeErrors[index].gender}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="bg-foreground/5 rounded-md p-4 border border-foreground/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground/80">
                Price per ticket
              </span>
              <span className="text-sm font-medium text-foreground">
                ₹{ticketPrice}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground/80">
                Number of tickets
              </span>
              <span className="text-sm font-medium text-foreground">
                ×{formData.ticketCount}
              </span>
            </div>
            <div className="border-t border-foreground/10 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-foreground flex items-center gap-2">
                  <CreditCard size={16} />
                  Total Amount
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="p-6 border-t border-foreground/10 bg-background">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              disabled={isProcessing}
              className="flex-1 px-5 py-2.5 rounded-md text-sm font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="flex-1 px-5 py-2.5 rounded-md text-sm font-medium bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 hover:from-orange-700 hover:via-pink-700 hover:to-purple-700 text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketBookingModal;
