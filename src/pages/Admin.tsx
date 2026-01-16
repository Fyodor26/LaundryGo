import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, Home, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "pickup" | "washing" | "out-for-delivery" | "delivered";

interface AdminOrder {
  id: string;
  studentName: string;
  phone: string;
  hostel: string;
  room: string;
  service: string;
  quantity: number;
  status: OrderStatus;
  pickupDate: string;
  timeSlot: string;
}

const mockAdminOrders: AdminOrder[] = [
  {
    id: "LG-2024-001",
    studentName: "Rahul Sharma",
    phone: "+91 98765 43210",
    hostel: "Krishna Hostel",
    room: "304",
    service: "Wash + Iron",
    quantity: 5,
    status: "washing",
    pickupDate: "Jan 15, 2025",
    timeSlot: "2:00 PM - 4:00 PM",
  },
  {
    id: "LG-2024-002",
    studentName: "Priya Patel",
    phone: "+91 87654 32109",
    hostel: "Saraswati PG",
    room: "102",
    service: "Wash Only",
    quantity: 3,
    status: "pickup",
    pickupDate: "Jan 16, 2025",
    timeSlot: "9:00 AM - 11:00 AM",
  },
  {
    id: "LG-2024-003",
    studentName: "Amit Kumar",
    phone: "+91 76543 21098",
    hostel: "Vishnu Hostel",
    room: "208",
    service: "Iron Only",
    quantity: 4,
    status: "out-for-delivery",
    pickupDate: "Jan 14, 2025",
    timeSlot: "4:00 PM - 6:00 PM",
  },
  {
    id: "LG-2024-004",
    studentName: "Sneha Gupta",
    phone: "+91 65432 10987",
    hostel: "Lakshmi Hostel",
    room: "405",
    service: "Wash + Iron",
    quantity: 6,
    status: "pending",
    pickupDate: "Jan 17, 2025",
    timeSlot: "11:00 AM - 1:00 PM",
  },
];

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "pickup", label: "Picked Up" },
  { value: "washing", label: "Washing" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-600";
    case "pickup":
      return "bg-amber-100 text-amber-700";
    case "washing":
      return "bg-blue-100 text-blue-700";
    case "out-for-delivery":
      return "bg-purple-100 text-purple-700";
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
  }
};

const Admin = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(mockAdminOrders);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const pickupOrders = orders.filter(o => o.status === "pending" || o.status === "pickup");
  const deliveryOrders = orders.filter(o => o.status === "out-for-delivery" || o.status === "washing");
  const completedOrders = orders.filter(o => o.status === "delivered");

  const OrderCard = ({ order }: { order: AdminOrder }) => (
    <div className="bg-white rounded-xl border border-border p-5 hover:shadow-soft transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{order.id}</h3>
          <p className="text-sm text-muted-foreground">{order.studentName}</p>
        </div>
        <span className={cn(
          "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
          getStatusColor(order.status)
        )}>
          {order.status.replace("-", " ")}
        </span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{order.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{order.hostel}, Room {order.room}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{order.pickupDate} • {order.timeSlot}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="w-4 h-4" />
          <span>{order.service} • {order.quantity} kg</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Select
          value={order.status}
          onValueChange={(value: OrderStatus) => updateOrderStatus(order.id, value)}
        >
          <SelectTrigger className="flex-1 h-9 rounded-lg text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" asChild>
          <a href={`tel:${order.phone}`}>
            <Phone className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Operations Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage pickups, deliveries, and order status
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pickupOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Pickups</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{deliveryOrders.length}</p>
                  <p className="text-sm text-muted-foreground">In Process</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Home className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {orders.filter(o => o.status === "out-for-delivery").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Out for Delivery</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pickup" className="space-y-6">
            <TabsList className="bg-white border border-border p-1 rounded-xl">
              <TabsTrigger value="pickup" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                Pickup List ({pickupOrders.length})
              </TabsTrigger>
              <TabsTrigger value="delivery" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                Delivery List ({deliveryOrders.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                All Orders ({orders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pickup" className="space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pickupOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {pickupOrders.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No pending pickups
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveryOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {deliveryOrders.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No pending deliveries
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
