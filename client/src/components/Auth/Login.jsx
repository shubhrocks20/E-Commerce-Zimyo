import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { AlertDestructive } from "../helpers/AlertError";
import { AlertDemo } from "../helpers/AlertSuccess";
import Loader from "../helpers/Loader";

export const description = "A login form with email and password. ";

export function Login() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoading(true);
    setError("");
    setSuccess("");
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    await axios
      .post(
        "http://localhost:4000/api/user/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const result = res.data;
        const token = result.token;
        window.localStorage.setItem("token", token);
        setSuccess(true);
        console.log(result);
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.log(err.response.data.message);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-center">
        <Card className="mx-auto max-w-lg">
          {error && <AlertDestructive error={error} />}
          {success && (
            <AlertDemo title={"Success"} description={"Login Successfully!"} />
          )}
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                  <span className=" font-light text-sm text-slate-400">
                    Password must contain one uppercase, one special character
                    and atleast min of 8 length
                  </span>
                </div>
                <Button type="submit" className="w-full">
                  Login
                  {loading && <Loader />}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
