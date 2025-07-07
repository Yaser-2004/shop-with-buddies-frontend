import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { socket } from "@/lib/socket";
import { useAppContext } from "@/context/AppContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

export const FocusedProductModal = ({ products }) => {
  const [focusedProductId, setFocusedProductId] = useState<string | null>(null);
  const [senderName, setSenderName] = useState<string | null>(null);
  const { roomCode } = useAppContext();

  const focusedProduct = products.find((p) => p._id === focusedProductId);

  useEffect(() => {
    const handleFocusProduct = ({ productId, sender }) => {
      if (!productId || !sender) return;
      setFocusedProductId(productId);
      setSenderName(sender.name || "Someone");
    };

    socket.on("focus-product", handleFocusProduct);

    return () => {
      socket.off("focus-product", handleFocusProduct);
    };
  }, []);

  return (
    <Dialog open={!!focusedProductId} onOpenChange={() => setFocusedProductId(null)}>
      <DialogContent className="max-w-lg w-full p-6">
        {focusedProduct ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-700 text-sm mb-1">
                {senderName} wants you to check this product:
              </p>
              <h2 className="text-lg font-semibold">{focusedProduct.title}</h2>
            </div>

            <Link to={`/product/${focusedProduct._id}`}>
            <img
              src={focusedProduct.image}
              alt={focusedProduct.title}
              className="w-full h-64 object-cover rounded-md"
            />
            </Link>

            <p className="text-gray-600">{focusedProduct.description}</p>
            <p className="text-lg font-bold text-green-600">₹{focusedProduct.price}</p>

            <button
              onClick={() => setFocusedProductId(null)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading...</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
