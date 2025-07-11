/* src/pages/MyOrders.tsx */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface OrderItem {
  productId: {
    _id: string;
    title: string;
    description: string;
    image: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
}

export const OrderHistory = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* fetch on mount */
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/orders/user/${user._id}`)
      .then(res => setOrders(res.data.orders))
      .catch(() => setError("Could not load orders"))
      .finally(() => setLoading(false));
  }, [user?._id]);

  if (loading) return <p className="text-center mt-10">Loading orders…</p>;
  if (error)   return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (orders.length === 0) {
    return (
      <Card className="max-w-md mx-auto text-center py-16">
        <CardContent>
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
          <p className="text-gray-600">Your orders will appear here once you checkout.</p>
        </CardContent>
      </Card>
    );
  }

  /* All orders go in one tab; keeping tab structure in case you add filters */
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.map(order => (
            <Card key={order._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:justify-between">
                  <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                  <span className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {order.items.map(it => (
                    <div key={it.productId._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                      <img
                        src={it.productId.image}
                        alt={it.productId.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{it.productId.title}</p>

                        {/* NEW – description */}
                        {it.productId.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {it.productId.description}
                          </p>
                        )}

                        <p className="text-xs text-gray-600">
                          Qty {it.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right font-semibold">
                  Order Total: ${order.total.toFixed(2)}
                </div>

                {/* optional actions */}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Re-order</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
