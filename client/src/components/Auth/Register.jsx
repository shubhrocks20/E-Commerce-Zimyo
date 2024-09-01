import { Link, useNavigate } from "react-router-dom";

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
import { useState } from "react";
import Loader from "../helpers/Loader";
import axios from "axios";
import { AlertDestructive } from "../helpers/AlertError";
import { AlertDemo } from "../helpers/AlertSuccess";

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export function Register() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    setLoading(true);
    setError("");
    setSuccess("");
    e.preventDefault();
    const formData = new FormData(e.target);
    const { name, email, password } = Object.fromEntries(formData);

    await axios
      .post(
        "http://localhost:4000/api/user/register",
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const result = res.data;
        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.log(err.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="h-screen flex flex-col justify-center ">
      <Card className="mx-auto max-w-lg">
        {error && <AlertDestructive error={error} />}
        {success && (
          <AlertDemo
            title={"Success"}
            description={
              "Verification code sent successfully on email. verify your account now."
            }
          />
        )}
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Max" required name="name" />
                </div>
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" />
                <span className=" font-light text-sm text-slate-400">
                  Password must contain one uppercase, one special character and
                  atleast min of 8 length
                </span>
              </div>
              <Button type="submit" className="w-full">
                Create an account
                {loading && <Loader />}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
