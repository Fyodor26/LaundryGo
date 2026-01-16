import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Truck, Sparkles, Home, Clock, Search, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "pickup" | "washing" | "delivered";

interface Order {
  id: string;
  service: string;
  quantity: number;
  status: OrderStatus;
  pickupDate: string;
  estimatedDelivery: string;
  price: number;
}

const mockOrders: Order[] = [
  {
    id: "LG-2024-001",
    service: "Wash + Iron",
    quantity: 5,
    status: "washing",
    pickupDate: "Jan 15, 2025",
    estimatedDelivery: "Jan 17, 2025",
    price: 245,
  },
  {
    id: "LG-2024-002",
    service: "Wash Only",
    quantity: 3,
    status: "pickup",
    pickupDate: "Jan 16, 2025",
    estimatedDelivery: "Jan 18, 2025",
    price: 117,
  },
  {
    id: "LG-2023-089",
    service: "Iron Only",
    quantity: 4,
    status: "delivered",
    pickupDate: "Jan 10, 2025",
    estimatedDelivery: "Jan 12, 2025",
    price: 100,
  },
];

const statusSteps = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "pickup", label: "Picked Up", icon: Truck },
  { key: "washing", label: "Washing", icon: Sparkles },
  { key: "delivered", label: "Delivered", icon: Home },
];

const getStatusIndex = (status: OrderStatus) => {
  const index = statusSteps.findIndex((s) => s.key === status);
  return index === -1 ? 0 : index;
};

const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "status-pending";
    case "pickup":
      return "status-pickup";
    case "washing":
      return "status-washing";
    case "delivered":
      return "status-delivered";
    default:
      return "status-pending";
  }
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders] = useState<Order[]>(mockOrders);

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Orders
              </h1>
              <p className="text-muted-foreground">
                Track your laundry status in real-time
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>

          {/* Orders */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No orders found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try a different search term"
                  : "Place your first order to get started!"}
              </p>
              <Button asChild>
                <a href="/order">Place Order</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const currentStep = getStatusIndex(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-border shadow-soft p-6 hover:shadow-soft-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {order.id}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.service} • {order.quantity} kg
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium capitalize",
                            getStatusBadgeClass(order.status)
                          )}
                        >
                          {order.status}
                        </span>
                        {order.status !== "delivered" && (
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative mb-6">
                      <div className="flex justify-between items-center">
                        {statusSteps.map((step, index) => {
                          const isCompleted = index <= currentStep;
                          const isCurrent = index === currentStep;

                          return (
                            <div
                              key={step.key}
                              className="flex flex-col items-center relative z-10"
                            >
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                  isCompleted
                                    ? "bg-primary text-white"
                                    : "bg-secondary text-muted-foreground",
                                  isCurrent && "ring-4 ring-primary/20"
                                )}
                              >
                                <step.icon className="w-5 h-5" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs mt-2 font-medium",
                                  isCompleted
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {/* Progress Line */}
                      <div className="absolute top-5 left-5 right-5 h-0.5 bg-secondary -z-0">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{
                            width: `${(currentStep / (statusSteps.length - 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-border">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Pickup:</span>
                          <span className="ml-2 font-medium text-foreground">
                            {order.pickupDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Est. Delivery:
                          </span>
                          <span className="ml-2 font-medium text-foreground">
                            {order.estimatedDelivery}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          Total:
                        </span>
                        <span className="ml-2 text-xl font-bold text-primary">
                          ₹{order.price}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
