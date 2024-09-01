import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Register } from "./Auth/Register";
import { Login } from "./Auth/Login";
import ProtectedRoute from "./routeProtector";
import Cart from "./Cart/Cart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute>
        <Register />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cart",
    element: <Cart />,
  },
]);

export default router;
