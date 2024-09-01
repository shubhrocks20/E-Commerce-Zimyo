import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "@/redux/cart/cartSlice";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cart || []);
  const dispatch = useDispatch();
  const [shippingAddress, setShippingAddress] = useState("");
  const [previousOrders, setPreviousOrders] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPreviousOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/api/user/order-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPreviousOrders(response.data);
      } catch (error) {
        console.error("Error fetching previous orders:", error);
      }
    };

    fetchPreviousOrders();
  }, [cartItems]);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/user/order",
        {
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            purchaseAtPrice: item.price,
          })),
          shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(clearCart());
      setShippingAddress("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const CartTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cartItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>${item.price}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>${item.price * item.quantity}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                onClick={() => handleRemoveFromCart(item.id)}
                size="icon"
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const PreviousOrdersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {previousOrders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>{order._id}</TableCell>
            <TableCell>
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {order.items.map((item, index) => (
                <div key={index}>
                  {item.productId.name} ({item.quantity})
                </div>
              ))}
            </TableCell>
            <TableCell>
              $
              {order.items.reduce(
                (total, item) => total + item.purchaseAtPrice * item.quantity,
                0
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length > 0 ? <CartTable /> : <p>Your cart is empty.</p>}
        </CardContent>
        {cartItems.length > 0 && (
          <CardFooter>
            <Button onClick={() => setIsDialogOpen(true)} className="ml-auto">
              Proceed to Checkout
            </Button>
          </CardFooter>
        )}
      </Card>

      {previousOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <PreviousOrdersTable />
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Checkout</DialogTitle>
          <Input
            type="text"
            placeholder="Enter your shipping address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="mt-2"
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckout}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
