import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, CreditCard, Send } from "lucide-react";
import { createBooking } from "@/api/booking.api";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const [method, setMethod] = useState<"qr" | "card" | "upi">("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get booking details from location state
  const location = useLocation();
  const navState = (location.state || {}) as {
    propertyId?: string;
    price?: number;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };

  const propertyId = navState.propertyId;
  const price = typeof navState.price === "number" ? navState.price : null;
  const checkIn = navState.checkIn;
  const checkOut = navState.checkOut;
  const guests = navState.guests || 1;

  const cardValid = () => {
    return (
      cardName.trim().length > 0 &&
      cardNumber.replace(/\s/g, "").length >= 12 &&
      expiry.trim().length > 0 &&
      cvv.trim().length >= 3
    );
  };

  const upiValid = () => {
    // Basic UPI ID validation: contains an @ and no spaces
    return /\S+@\S+/.test(upiId);
  };

  const handlePayNow = async () => {
    // Validate required booking details
    if (!propertyId || !checkIn || !checkOut) {
      toast({
        title: "Missing Details",
        description: "Please complete your booking selection first",
        variant: "destructive",
      });
      navigate("/properties");
      return;
    }

    if (method === "card" && !cardValid()) {
      toast({
        title: "Invalid Card Details",
        description: "Please fill in valid card details.",
        variant: "destructive",
      });
      return;
    }

    if (method === "upi" && !upiValid()) {
      toast({
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID (for example: name@bank).",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      // Create booking with the provided details
      const bookingResponse = await createBooking({
        propertyId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
      });

      if (bookingResponse.success) {
        toast({
          title: "Booking Confirmed",
          description: "Your booking has been created successfully!",
        });
        // Navigate to guest dashboard to view the booking
        navigate("/guest-dashboard", { state: { bookingId: bookingResponse.booking._id } });
      } else {
        throw new Error(bookingResponse.message || "Booking failed");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error?.response?.data?.message || error.message || "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Payment</h1>

        {!propertyId || !checkIn || !checkOut ? (
          <Card className="p-6 max-w-2xl mx-auto">
            <CardContent>
              <p className="text-center text-muted-foreground mb-4">
                No booking details found. Please select a property and dates first.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => navigate("/properties")}>
                  Browse Properties
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <aside className="md:col-span-1">
              <Card className="p-4">
                <CardContent>
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

                  <div className="flex flex-col gap-3">
                    <button
                      className={`flex items-center gap-3 p-3 rounded-lg text-left border ${method === "card" ? "border-primary bg-accent/5" : "border-border"}`}
                      onClick={() => setMethod("card")}
                      aria-pressed={method === "card"}
                    >
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Card</div>
                        <div className="text-sm text-muted-foreground">Pay with debit or credit card</div>
                      </div>
                    </button>

                    <button
                      className={`flex items-center gap-3 p-3 rounded-lg text-left border ${method === "qr" ? "border-primary bg-accent/5" : "border-border"}`}
                      onClick={() => setMethod("qr")}
                      aria-pressed={method === "qr"}
                    >
                      <QrCode className="h-5 w-5" />
                      <div>
                        <div className="font-medium">QR Code</div>
                        <div className="text-sm text-muted-foreground">Scan QR to pay from your banking app</div>
                      </div>
                    </button>

                    <button
                      className={`flex items-center gap-3 p-3 rounded-lg text-left border ${method === "upi" ? "border-primary bg-accent/5" : "border-border"}`}
                      onClick={() => setMethod("upi")}
                      aria-pressed={method === "upi"}
                    >
                      <Send className="h-5 w-5" />
                      <div>
                        <div className="font-medium">UPI</div>
                        <div className="text-sm text-muted-foreground">Pay using your UPI ID (e.g. name@bank)</div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <main className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-6 pb-6 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Check-in:</span>
                      <span>{new Date(checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Check-out:</span>
                      <span>{new Date(checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Guests:</span>
                      <span>{guests}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-muted-foreground">Total Amount</div>
                    <div className="font-semibold text-lg">₹{(price || 0).toFixed(2)}</div>
                  </div>

                {method === "card" ? (
                  <div className="space-y-4">
                    <label className="block">
                      <div className="text-sm font-medium mb-1">Cardholder Name</div>
                      <Input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Full name" />
                    </label>

                    <label className="block">
                      <div className="text-sm font-medium mb-1">Card Number</div>
                      <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" />
                    </label>

                    <div className="grid grid-cols-3 gap-3">
                      <label>
                        <div className="text-sm font-medium mb-1">Expiry</div>
                        <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
                      </label>
                      <label className="col-span-1">
                        <div className="text-sm font-medium mb-1">CVV</div>
                        <Input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" />
                      </label>
                    </div>

                    <div className="mt-4">
                      <Button onClick={handlePayNow} disabled={processing || !cardValid()} size="lg">
                        {processing ? "Processing..." : `Pay ₹${(price || 0).toFixed(2)}`}
                      </Button>
                    </div>
                  </div>
                ) : method === "qr" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Scan the QR code below with your banking app to complete the payment. After you finish the transfer, click "Confirm Payment".
                    </p>

                    <div className="flex items-center justify-center p-6">
                      {/* Placeholder QR image — replace with generated QR for real payments */}
                      <div className="w-40 h-40 bg-muted rounded-md flex items-center justify-center">
                        <div className="text-sm text-muted-foreground">QR CODE</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handlePayNow} disabled={processing} size="lg">
                        {processing ? "Processing..." : `Pay ₹${(price || 0).toFixed(2)}`}
                      </Button>
                      <Button variant="outline" onClick={() => alert("Simulate scanning QR: show wallet or bank app")}>How to pay</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Enter your UPI ID to pay. Example: <span className="font-medium">name@bank</span></p>

                    <label className="block">
                      <div className="text-sm font-medium mb-1">UPI ID</div>
                      <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@bank" />
                    </label>

                    <div className="flex gap-3">
                      <Button onClick={handlePayNow} disabled={processing || !upiValid()} size="lg">
                        {processing ? "Processing..." : `Pay ₹${(price || 0).toFixed(2)}`}
                      </Button>
                      <Button variant="outline" onClick={() => alert("Open your UPI app and pay to the provided UPI ID")}>How to pay</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
        )}
      </div>
    </div>
  );
};

export default Payment;