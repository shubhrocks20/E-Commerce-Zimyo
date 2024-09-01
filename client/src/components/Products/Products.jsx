import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux/cart/cartSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const Products = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/product/list-products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ id: product._id, ...product }));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const getProductQuantityInCart = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>Buy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="hidden sm:table-cell">
                      <img
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.image}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleProductClick(product);
                        }}
                      >
                        {product.name}
                      </a>
                    </TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      ${product.price}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PlusCircle
                          className="cursor-pointer"
                          onClick={() => handleAddToCart(product)}
                        />
                        <span>{getProductQuantityInCart(product._id)}</span>
                        <MinusCircle
                          className="cursor-pointer"
                          onClick={() => handleRemoveFromCart(product._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{products.length}</strong> products
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      {selectedProduct && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <button onClick={handleCloseDialog} className="hidden" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogClose onClick={handleCloseDialog} />
            </DialogHeader>
            <div className="p-4">
              <img
                alt="Product image"
                className="aspect-square rounded-md object-cover"
                height="128"
                src={selectedProduct.image}
                width="128"
              />
              <p>{selectedProduct.description}</p>
              <p>Price: ${selectedProduct.price}</p>
              <p>
                Created At:{" "}
                {new Date(selectedProduct.createdAt).toLocaleDateString()}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Products;
