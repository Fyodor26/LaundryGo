import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Minus, Plus, Shirt, Wind, Sparkles, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const laundryTypes = [
  {
    id: "wash",
    name: "Wash Only",
    description: "Machine wash & tumble dry",
    price: 39,
    icon: Shirt,
  },
  {
    id: "wash-iron",
    name: "Wash + Iron",
    description: "Complete cleaning & pressing",
    price: 49,
    icon: Sparkles,
  },
  {
    id: "iron",
    name: "Iron Only",
    description: "Professional pressing",
    price: 25,
    icon: Wind,
  },
];

const timeSlots = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const Order = () => {
  const [laundryType, setLaundryType] = useState("wash-iron");
  const [quantity, setQuantity] = useState(3);
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [hostel, setHostel] = useState("");
  const [room, setRoom] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedType = laundryTypes.find((t) => t.id === laundryType);
  const estimatedPrice = selectedType ? selectedType.price * quantity : 0;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!date || !timeSlot || !hostel || !room || !phone) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields.",
      variant: "destructive",
    });
    return;
  }

  const orderData = {
    laundryType,
    quantity,
    pickupDate: date,
    timeSlot,
    location: hostel,
    room: Number(room),
    phone: Number(phone),
    notes: notes || "",
    estimatedPrice,
  };

  try {
    // 1️⃣ Create order in backend and get Razorpay order
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(orderData),
    });

    if (!res.ok) throw new Error("Order creation failed");

    const { orderId, razorpayOrderId, amount, currency } = await res.json();

    // 2️⃣ Initialize Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // frontend key
      amount: amount,
      currency: currency,
      name: "Laundry Service",
      description: selectedType?.name,
      order_id: razorpayOrderId,
      handler: async function (response: any) {
        // 3️⃣ Verify payment on backend
        try {
          const verifyRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/orders/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                
              }),
            }
          );

          const verifyData = await verifyRes.json();
          console.log(verifyData);
          

          if (verifyData.success) {
            setSubmitted(true);
            toast({
              title: "Payment Successful! 🎉",
              description: "Your order is confirmed.",
            });
          } else {
            toast({
              title: "Payment Failed",
              description: "Something went wrong. Try again.",
              variant: "destructive",
            });
          }
        } catch (err) {
          toast({
            title: "Error",
            description: "Payment verification failed.",
            variant: "destructive",
          });
        }
      },
      prefill: {
        name: "", // you can prefill user's name
        email: "", // prefill email if available
        contact: phone,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Could not place order. Try again.",
      variant: "destructive",
    });
  }
};


  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary-soft mx-auto mb-6 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground mb-8">
                Your laundry pickup has been scheduled. We'll send you a 
                WhatsApp confirmation shortly.
              </p>
              <div className="bg-secondary/50 rounded-2xl p-6 text-left mb-8">
                <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{selectedType?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{quantity} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup</span>
                    <span className="font-medium">{date && format(date, "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{timeSlot}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border mt-2">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-primary">₹{estimatedPrice}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="mr-4">
                Place Another Order
              </Button>
              <Button asChild>
                <a href="/dashboard">Track Order</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary text-sm font-medium mb-4">
              New Order
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Schedule Your Pickup
            </h1>
            <p className="text-muted-foreground">
              Fill in the details below and we'll pick up your laundry 
              right from your doorstep.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Laundry Type */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Select Service</Label>
                <RadioGroup
                  value={laundryType}
                  onValueChange={setLaundryType}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {laundryTypes.map((type) => (
                    <label
                      key={type.id}
                      className={cn(
                        "relative flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:border-primary/50",
                        laundryType === type.id
                          ? "border-primary bg-primary-soft"
                          : "border-border bg-white"
                      )}
                    >
                      <RadioGroupItem value={type.id} className="sr-only" />
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                        laundryType === type.id ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                      )}>
                        <type.icon className="w-7 h-7" />
                      </div>
                      <span className="font-semibold text-foreground">{type.name}</span>
                      <span className="text-sm text-muted-foreground text-center mt-1">
                        {type.description}
                      </span>
                      <span className="text-lg font-bold text-primary mt-3">
                        ₹{type.price}/kg
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Quantity */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Quantity (kg)</Label>
                <div className="flex items-center gap-4 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="text-4xl font-bold text-foreground w-16 text-center">
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-center text-muted-foreground text-sm">
                  Estimated: <span className="font-semibold text-primary">₹{estimatedPrice}</span>
                </p>
              </div>

              {/* Pickup Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Pickup Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 rounded-xl",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Time Slot</Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Pickup Location</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hostel" className="text-sm text-muted-foreground">
                      Hostel / PG Name
                    </Label>
                    <Input
                      id="hostel"
                      placeholder="e.g., Krishna Hostel"
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room" className="text-sm text-muted-foreground">
                      Room Number
                    </Label>
                    <Input
                      id="room"
                      placeholder="e.g., 304"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-lg font-semibold">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your WhatsApp number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl max-w-sm"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-lg font-semibold">
                  Special Instructions <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special care instructions for your clothes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>

              {/* Summary & Submit */}
              <div className="bg-secondary/50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Total</p>
                    <p className="text-3xl font-bold text-foreground">
                      ₹{estimatedPrice}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Final price based on actual weight
                    </p>
                  </div>
                  <Button type="submit" size="xl" className="w-full md:w-auto">
                    Place Order
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Order;
