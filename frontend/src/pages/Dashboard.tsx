import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Truck, Sparkles, Home, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "pickup" | "washing" | "delivered";

interface Order {
  _id: string;
  service: string;
  quantity: number;
  status: OrderStatus;
  pickupdate: string;
  total: number;
}

const statusSteps = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "pickup", label: "Picked Up", icon: Truck },
  { key: "washing", label: "Washing", icon: Sparkles },
  { key: "delivered", label: "Delivered", icon: Home },
];

const getStatusIndex = (status: OrderStatus) =>
  Math.max(0, statusSteps.findIndex((s) => s.key === status));

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o =>
    o._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">
                Track your laundry status in real-time
              </p>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              <Input
                placeholder="Search by Order ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading orders…</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No orders found</h3>
              <Button asChild className="mt-4">
                <a href="/order">Place Order</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((order) => {
                const step = getStatusIndex(order.status);

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border p-6 shadow-soft"
                  >
                    <div className="flex justify-between mb-6">
                      <div>
                        <h3 className="font-semibold">{order._id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.service} • {order.quantity} kg
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs bg-primary-soft text-primary">
                        {order.status}
                      </span>
                    </div>

                    <div className="relative mb-6">
                      <div className="flex justify-between">
                        {statusSteps.map((s, i) => (
                          <div key={s.key} className="flex flex-col items-center">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                i <= step
                                  ? "bg-primary text-white"
                                  : "bg-secondary"
                              )}
                            >
                              <s.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs mt-2">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between border-t pt-4">
                      <span className="text-muted-foreground">
                        Pickup: {new Date(order.pickupdate).toDateString()}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ₹{order.total}
                      </span>
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
