"use client";

import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Eye, EyeOff, Mail, Lock, Cookie, Croissant } from "lucide-react";
import { signIn } from "@/lib/authClient";
import { useRouter } from "next/navigation";

export default function BakeryTerminalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await signIn.email({ email, password });

      if (error) {
        setError(
          error.message || "Login failed. Please check your credentials."
        );
        return;
      }

      if (data) {
        // Successful login - redirect to homepage
        console.log("Login successful:", data);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="absolute top-10 left-10 opacity-10">
        <Croissant className="w-32 h-32 text-amber-800" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <Cookie className="w-32 h-32 text-amber-800" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full shadow-2xl mb-4 border-4 border-white">
            <Cookie className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2 font-serif">
            Sweet Delights Bakery
          </h1>
          <p className="text-amber-700 font-medium">Point of Sale Terminal</p>

          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg px-6 py-4 shadow-md border border-amber-200">
            <div className="text-3xl font-bold text-amber-900 tabular-nums">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-amber-700 mt-1">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-2 border-amber-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6 bg-gradient-to-b from-amber-50 to-transparent">
            <CardTitle className="text-2xl font-bold text-amber-900">
              Employee Sign In
            </CardTitle>
            <CardDescription className="text-amber-700">
              Enter your credentials to start your shift
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="space-y-5">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-300 bg-red-50"
                >
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-amber-900"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-600" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 text-lg"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-amber-900"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-600" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-12 h-12 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 text-lg"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors disabled:text-amber-300 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Clock In"
                )}
              </Button>
            </div>

            <div className="text-center pt-4 border-t-2 border-amber-100">
              <p className="text-sm text-amber-700">
                Need help signing in?{" "}
                <button
                  type="button"
                  className="font-semibold text-amber-800 hover:text-amber-900 transition-colors underline"
                  disabled={isLoading}
                >
                  Contact Manager
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 bg-white/40 backdrop-blur-sm rounded-lg p-4">
          <p className="text-xs text-amber-800 font-medium">
            🍞 Fresh Baked Daily Since 1995 🥐
          </p>
          <p className="text-xs text-amber-700 mt-2">
            Terminal ID: POS-001 | Version 2.1.0
          </p>
        </div>
      </div>
    </div>
  );
}
