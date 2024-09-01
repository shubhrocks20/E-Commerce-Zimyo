import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Provider } from "@radix-ui/react-tooltip";
import store from "./redux/store";

const App = () => {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/register");
    }
  }, [token, navigate]);
  return (
    <>
      <div className="h-screen items-center justify-center flex flex-col text-green-900 text-7xl">
        <Dashboard />
      </div>
    </>
  );
};

export default App;
