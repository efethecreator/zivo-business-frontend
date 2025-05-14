"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormattedInput } from "@/components/formatted-input";
import { isValidEmail } from "@/lib/input-formatters";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const loginMutation = useLogin();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Set initial window size
    handleResize();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    loginMutation.mutate({ email, password });
  };

  // Calculate gradient position based on mouse movement
  const gradientX = (mousePosition.x / windowSize.width) * 100;
  const gradientY = (mousePosition.y / windowSize.height) * 100;

  // Floating elements animation variants
  const floatingVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden relative"
      style={{
        background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.15) 25%, rgba(2, 132, 199, 0.15) 50%, rgba(3, 105, 161, 0.05) 75%, rgba(12, 74, 110, 0) 100%)`,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{ top: "10%", left: "15%" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-sky-400/10 blur-3xl"
          animate={{
            x: [0, -70, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{ bottom: "5%", right: "10%" }}
        />
      </div>

      {/* Glass card container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl overflow-hidden border border-white/20">
          {/* Top decorative bar */}
          <div className="h-2 w-full bg-gradient-to-r from-sky-400 via-primary to-sky-500"></div>

          <div className="p-8">
            {/* Logo and title */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center items-center mb-2"
              >
                <div className="relative">
                  <div className="text-4xl font-bold bg-gradient-to-r from-sky-500 to-primary bg-clip-text text-transparent">
                    ZIVO
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute -top-1 -right-6"
                  >
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </motion.div>
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl font-bold text-gray-800"
              >
                Welcome Back
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-500 mt-1"
              >
                Sign in to continue to your dashboard
              </motion.p>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                className="space-y-2"
              >
                <FormattedInput
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onValueChange={setEmail}
                  validator={(value) => ({
                    isValid: isValidEmail(value),
                    message: isValidEmail(value)
                      ? "Valid email"
                      : "Please enter a valid email address",
                  })}
                  required
                />
                {emailError && (
                  <p className="text-xs text-red-500">{emailError}</p>
                )}
              </motion.div>

              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-500">{passwordError}</p>
                )}
              </motion.div>

              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-primary hover:from-sky-600 hover:to-primary/90 transition-all duration-300"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </div>
                  )}
                </Button>
              </motion.div>

              <motion.div
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </motion.div>
            </motion.form>
          </div>
        </div>

        {/* Floating features cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          <div className="backdrop-blur-md bg-white/60 p-3 rounded-xl shadow-sm border border-white/20 text-center">
            <div className="font-bold text-lg text-primary">500+</div>
            <div className="text-xs text-gray-600">Salons</div>
          </div>
          <div className="backdrop-blur-md bg-white/60 p-3 rounded-xl shadow-sm border border-white/20 text-center">
            <div className="font-bold text-lg text-primary">10k+</div>
            <div className="text-xs text-gray-600">Appointments</div>
          </div>
          <div className="backdrop-blur-md bg-white/60 p-3 rounded-xl shadow-sm border border-white/20 text-center">
            <div className="font-bold text-lg text-primary">98%</div>
            <div className="text-xs text-gray-600">Satisfaction</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
