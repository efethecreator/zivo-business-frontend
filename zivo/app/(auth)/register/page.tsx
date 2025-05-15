"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  X,
  Upload,
  Check,
  Scissors,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapComponent } from "@/components/MapComponentWrapper";
import { BusinessHoursSelector } from "@/components/business-hours-selector";
import { useRegisterUser } from "@/hooks/useRegisterUser";
import { useLogin } from "@/hooks/useLogin";
import { useCreateBusiness } from "@/hooks/useCreateBusiness";
import { useCreateBusinessShift } from "@/hooks/useCreateBusinessShift";
import { useCreateShiftTime } from "@/hooks/useCreateShiftTime";
import CropImageDialog from "@/components/CropImageDialog";
import { api } from "@/utils/api";
import { FormattedInput } from "@/components/formatted-input";
import {
  formatPhoneNumber,
  formatPostalCode,
  isValidEmail,
  validatePassword,
} from "@/lib/input-formatters";
import { PasswordStrengthMeter } from "@/components/password-strength-meter";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const registerMutation = useRegisterUser();
  const loginMutation = useLogin();
  const createBusinessMutation = useCreateBusiness();
  const createShiftTimeMutation = useCreateShiftTime();
  const createBusinessShiftMutation = useCreateBusinessShift();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    userType: "store_owner" as const,
    isLawApproved: false,
  });

  const [businessData, setBusinessData] = useState({
    name: "",
    businessTypeId: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    latitude: 0,
    longitude: 0,
    profileImage: null as File | null,
    coverImage: null as File | null,
    description: "",
    phone: "",
  });

  const [businessHours, setBusinessHours] = useState({
    monday: {
      isActive: true,
      isOpen: true,
      openTime: "09:00",
      closeTime: "18:00",
    },
    tuesday: {
      isActive: true,
      isOpen: true,
      openTime: "09:00",
      closeTime: "18:00",
    },
    wednesday: {
      isActive: true,
      isOpen: true,
      openTime: "09:00",
      closeTime: "18:00",
    },
    thursday: {
      isActive: true,
      isOpen: true,
      openTime: "09:00",
      closeTime: "18:00",
    },
    friday: {
      isActive: true,
      isOpen: true,
      openTime: "09:00",
      closeTime: "18:00",
    },
    saturday: {
      isActive: true,
      isOpen: true,
      openTime: "10:00",
      closeTime: "16:00",
    },
    sunday: {
      isActive: false,
      isOpen: false,
      openTime: "10:00",
      closeTime: "16:00",
    },
  });

  // states
  const [isProfileCropOpen, setIsProfileCropOpen] = useState(false);
  const [isCoverCropOpen, setIsCoverCropOpen] = useState(false);
  const [rawProfileImage, setRawProfileImage] = useState<File | null>(null);
  const [rawCoverImage, setRawCoverImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    message: string;
    score: number;
  } | null>(null);

  const dayMapping: { [key: string]: number } = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
  };

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

  // Update password validation when password changes
  useEffect(() => {
    if (userData.password) {
      setPasswordValidation(validatePassword(userData.password));
    }
  }, [userData.password]);

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field when user makes changes
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBusinessDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "file" && e.target.files?.[0]) {
      setBusinessData((prev) => ({
        ...prev,
        [name]: e.target.files?.[0] || null,
      }));
    } else {
      setBusinessData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field when user makes changes
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBusinessTypeChange = (value: string) => {
    setBusinessData((prev) => ({ ...prev, businessTypeId: value }));

    // Clear error for this field when user makes changes
    if (formErrors.businessTypeId) {
      setFormErrors((prev) => ({ ...prev, businessTypeId: "" }));
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setBusinessData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRawProfileImage(e.target.files[0]);
      setIsProfileCropOpen(true);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRawCoverImage(e.target.files[0]);
      setIsCoverCropOpen(true);
    }
  };

  const handleBusinessHoursChange = (
    day: string,
    field: string,
    value: any
  ) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day as keyof typeof businessHours] || {}),
        [field]: value,
      },
    }));
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!userData.fullName) {
      errors.fullName = "Full name is required";
    }

    if (!userData.phone) {
      errors.phone = "Phone number is required";
    } else if (userData.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!userData.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(userData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!userData.password) {
      errors.password = "Password is required";
    } else {
      const validation = validatePassword(userData.password);
      if (!validation.isValid) {
        errors.password = validation.message;
      }
    }

    if (!userData.isLawApproved) {
      errors.isLawApproved = "You must accept the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!businessData.name) {
      errors.name = "Business name is required";
    }

    if (!businessData.description) {
      errors.description = "Business description is required";
    }

    if (!businessData.phone) {
      errors.businessPhone = "Business phone is required";
    } else if (businessData.phone.replace(/\D/g, "").length < 10) {
      errors.businessPhone = "Please enter a valid phone number";
    }

    if (!businessData.businessTypeId) {
      errors.businessTypeId = "Business type is required";
    }

    if (!businessData.city) {
      errors.city = "City is required";
    }

    if (!businessData.district) {
      errors.district = "District is required";
    }

    if (!businessData.address) {
      errors.address = "Address is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (step === 1) {
      if (!validateStep1()) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields correctly.",
          variant: "destructive",
        });
        return;
      }
    }
    if (step === 2) {
      if (!validateStep2()) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required business information.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Log the business data before submission for debugging
      console.log("Business data before submission:", businessData);

      await registerMutation.mutateAsync(userData);

      const loginResponse = await loginMutation.mutateAsync({
        email: userData.email,
        password: userData.password,
      });

      const token = loginResponse.token;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Ensure city and district are properly set
      const businessPayload = {
        ...businessData,
        city: businessData.city.trim(),
        district: businessData.district.trim(),
        postalCode: businessData.postalCode.trim(),
      };

      // Add more detailed logging to debug the issue
      console.log("Final business payload with city/district/postalCode:", {
        city: businessPayload.city,
        district: businessPayload.district,
        postalCode: businessPayload.postalCode,
      });

      const business = await createBusinessMutation.mutateAsync(
        businessPayload
      );

      const shiftPromises = Object.entries(businessHours).map(
        async ([day, hours]) => {
          if (!hours.isOpen) return;
          const shiftTime = await createShiftTimeMutation.mutateAsync({
            startTime: hours.openTime,
            endTime: hours.closeTime,
          });
          await createBusinessShiftMutation.mutateAsync({
            businessId: business.id,
            dayOfWeek: dayMapping[day],
            shiftTimeId: shiftTime.id,
          });
        }
      );

      await Promise.all(shiftPromises);

      // Set a flag to indicate we just registered
      sessionStorage.setItem("justRegistered", "true");

      toast({
        title: "Registration Successful",
        description: "Your account has been created. Redirecting...",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate gradient position based on mouse movement
  const gradientX = (mousePosition.x / windowSize.width) * 100;
  const gradientY = (mousePosition.y / windowSize.height) * 100;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: -20,
      opacity: 0,
    },
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: step >= num ? 1 : 0.8,
                opacity: step >= num ? 1 : 0.5,
              }}
              whileHover={{ scale: 1.05 }}
              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= num
                  ? "bg-gradient-to-r from-sky-500 to-primary text-white shadow-lg shadow-primary/30"
                  : "bg-gray-100 text-gray-400 border border-gray-200"
              }`}
            >
              {num === 1 && <Users className="h-5 w-5" />}
              {num === 2 && <Scissors className="h-5 w-5" />}
              {num === 3 && <Calendar className="h-5 w-5" />}
              <span className="absolute -bottom-6 text-xs font-medium whitespace-nowrap">
                {num === 1 ? "Account" : num === 2 ? "Business" : "Hours"}
              </span>
            </motion.div>
            {num !== 3 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: step > num ? 1 : 0,
                  backgroundColor: step > num ? "#0ea5e9" : "#e5e7eb",
                }}
                className="w-24 h-1 origin-left"
                style={{ backgroundColor: step > num ? "#0ea5e9" : "#e5e7eb" }}
              ></motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

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
        className="relative z-10 w-full max-w-3xl"
      >
        <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl overflow-hidden border border-white/20">
          {/* Top decorative bar */}
          <div className="h-2 w-full bg-gradient-to-r from-sky-400 via-primary to-sky-500"></div>

          <div className="p-8">
            {/* Logo and title */}
            <div className="text-center mb-6">
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
              {renderStepIndicator()}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 mt-2"
              >
                {step === 1
                  ? "Create Your Account"
                  : step === 2
                  ? "Business Information"
                  : "Working Hours"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-500 mt-1"
              >
                {step === 1
                  ? "Enter your personal details to create your account"
                  : step === 2
                  ? "Tell us about your business"
                  : "Set your business operating hours"}
              </motion.p>
            </div>

            {/* Form */}
            <form
              onSubmit={
                step === 3
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault();
                      nextStep();
                    }
              }
            >
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <motion.div variants={itemVariants} className="space-y-2">
                        <FormattedInput
                          id="fullName"
                          label="Full Name"
                          name="fullName"
                          placeholder="Full Name"
                          value={userData.fullName}
                          onValueChange={(value) =>
                            setUserData((prev) => ({
                              ...prev,
                              fullName: value,
                            }))
                          }
                          required
                        />
                        {formErrors.fullName && (
                          <p className="text-xs text-red-500">
                            {formErrors.fullName}
                          </p>
                        )}
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <FormattedInput
                          id="phone"
                          label="Phone"
                          name="phone"
                          placeholder="+1 555 123 4567"
                          value={userData.phone}
                          formatter={formatPhoneNumber}
                          onValueChange={(value) =>
                            setUserData((prev) => ({ ...prev, phone: value }))
                          }
                          required
                        />
                        {formErrors.phone && (
                          <p className="text-xs text-red-500">
                            {formErrors.phone}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <FormattedInput
                        id="email"
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={userData.email}
                        onValueChange={(value) =>
                          setUserData((prev) => ({ ...prev, email: value }))
                        }
                        validator={(value) => ({
                          isValid: isValidEmail(value),
                          message: isValidEmail(value)
                            ? "Valid email"
                            : "Please enter a valid email address",
                        })}
                        required
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500">
                          {formErrors.email}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={userData.password}
                          onChange={handleUserDataChange}
                          required
                          className={
                            formErrors.password ? "border-red-500" : ""
                          }
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

                      {userData.password && (
                        <PasswordStrengthMeter
                          password={userData.password}
                          className="mt-2"
                        />
                      )}

                      {passwordValidation && (
                        <p
                          className={`text-xs ${
                            passwordValidation.isValid
                              ? "text-green-500"
                              : "text-amber-500"
                          }`}
                        >
                          {passwordValidation.message}
                        </p>
                      )}
                      {formErrors.password && (
                        <p className="text-xs text-red-500">
                          {formErrors.password}
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex items-center space-x-2 mt-6"
                    >
                      <Checkbox
                        id="isLawApproved"
                        name="isLawApproved"
                        checked={userData.isLawApproved}
                        onCheckedChange={(checked) =>
                          setUserData((prev) => ({
                            ...prev,
                            isLawApproved: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="isLawApproved"
                        className="text-sm font-medium leading-none"
                      >
                        <span>
                          I accept the{" "}
                          <Link
                            href="/terms"
                            className="text-primary hover:text-primary/80"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="text-primary hover:text-primary/80"
                          >
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                    </motion.div>
                    {formErrors.isLawApproved && (
                      <p className="text-xs text-red-500">
                        {formErrors.isLawApproved}
                      </p>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    {/* Basic Information Section */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <Scissors className="h-4 w-4 mr-2 text-primary" />
                        Basic Information
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <FormattedInput
                              id="name"
                              label="Business Name"
                              name="name"
                              placeholder="Business Name"
                              value={businessData.name}
                              onValueChange={(value) =>
                                setBusinessData((prev) => ({
                                  ...prev,
                                  name: value,
                                }))
                              }
                              required
                            />
                            {formErrors.name && (
                              <p className="text-xs text-red-500">
                                {formErrors.name}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Business Type</Label>
                            <Select
                              value={businessData.businessTypeId}
                              onValueChange={handleBusinessTypeChange}
                            >
                              <SelectTrigger
                                className={
                                  formErrors.businessTypeId
                                    ? "border-red-500"
                                    : ""
                                }
                              >
                                <SelectValue placeholder="Select Business Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="17e8c196-d4b9-4949-806d-d093900a749f">
                                  Hair Salon
                                </SelectItem>
                                <SelectItem value="ab25e866-1922-45ef-8caa-fc0116175a3c">
                                  Spa & Wellness
                                </SelectItem>
                                <SelectItem value="46afc6d0-95ed-4b92-8047-3daed9f7472e">
                                  Beauty Salon
                                </SelectItem>
                                <SelectItem value="9a0432c8-098f-4339-a743-6bbf7ec07db3">
                                  Nail Studio
                                </SelectItem>
                                <SelectItem value="cd3048d1-1aa4-456d-b1b8-b497b9efd761">
                                  Tattoo Studio
                                </SelectItem>
                                <SelectItem value="9acf7844-ff2e-4453-a6ce-9e0cfea4d583">
                                  Skin Care
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors.businessTypeId && (
                              <p className="text-xs text-red-500">
                                {formErrors.businessTypeId}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <FormattedInput
                            id="description"
                            label="Business Description"
                            name="description"
                            placeholder="Short Description"
                            value={businessData.description}
                            onValueChange={(value) =>
                              setBusinessData((prev) => ({
                                ...prev,
                                description: value,
                              }))
                            }
                            required
                          />
                          {formErrors.description && (
                            <p className="text-xs text-red-500">
                              {formErrors.description}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <FormattedInput
                            id="businessPhone"
                            label="Business Phone"
                            name="phone"
                            placeholder="Phone Number"
                            value={businessData.phone}
                            formatter={formatPhoneNumber}
                            onValueChange={(value) =>
                              setBusinessData((prev) => ({
                                ...prev,
                                phone: value,
                              }))
                            }
                            required
                          />
                          {formErrors.businessPhone && (
                            <p className="text-xs text-red-500">
                              {formErrors.businessPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Location Section */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Location Details
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <FormattedInput
                              id="city"
                              label="City"
                              name="city"
                              placeholder="City"
                              value={businessData.city}
                              onValueChange={(value) =>
                                setBusinessData((prev) => ({
                                  ...prev,
                                  city: value,
                                }))
                              }
                              required
                            />
                            {formErrors.city && (
                              <p className="text-xs text-red-500">
                                {formErrors.city}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <FormattedInput
                              id="district"
                              label="District"
                              name="district"
                              placeholder="District"
                              value={businessData.district}
                              onValueChange={(value) =>
                                setBusinessData((prev) => ({
                                  ...prev,
                                  district: value,
                                }))
                              }
                              required
                            />
                            {formErrors.district && (
                              <p className="text-xs text-red-500">
                                {formErrors.district}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <FormattedInput
                              id="postalCode"
                              label="Postal Code"
                              name="postalCode"
                              placeholder="Postal Code"
                              value={businessData.postalCode}
                              formatter={formatPostalCode}
                              onValueChange={(value) =>
                                setBusinessData((prev) => ({
                                  ...prev,
                                  postalCode: value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <FormattedInput
                              id="address"
                              label="Address"
                              name="address"
                              placeholder="Address"
                              value={businessData.address}
                              onValueChange={(value) =>
                                setBusinessData((prev) => ({
                                  ...prev,
                                  address: value,
                                }))
                              }
                              required
                            />
                            {formErrors.address && (
                              <p className="text-xs text-red-500">
                                {formErrors.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Map Section */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        Pin Your Location
                      </h3>
                      <div className="h-[250px] rounded-md overflow-hidden">
                        <MapComponent onLocationSelect={handleLocationSelect} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Drag the marker to set your exact business location
                      </p>
                    </motion.div>

                    {/* Business Photos Section */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-primary" />
                        Business Photos
                      </h3>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Profile Image */}
                        <div className="space-y-2">
                          <Label className="text-sm">Profile Photo</Label>
                          {profileImagePreview ? (
                            <div className="relative border rounded-md overflow-hidden w-full h-40 bg-muted">
                              <img
                                src={profileImagePreview || "/placeholder.svg"}
                                alt="Profile Preview"
                                className="object-cover w-full h-full"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setBusinessData((prev) => ({
                                    ...prev,
                                    profileImage: null,
                                  }));
                                  setProfileImagePreview("");
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-white/30 hover:bg-white/50 transition-colors">
                              <div className="text-center p-4">
                                <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  Upload profile image
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Recommended: 400×400px
                                </p>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfileFileChange}
                              />
                            </label>
                          )}
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-2">
                          <Label className="text-sm">Cover Photo</Label>
                          {coverImagePreview ? (
                            <div className="relative border rounded-md overflow-hidden w-full h-40 bg-muted">
                              <img
                                src={coverImagePreview || "/placeholder.svg"}
                                alt="Cover Preview"
                                className="object-cover w-full h-full"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setBusinessData((prev) => ({
                                    ...prev,
                                    coverImage: null,
                                  }));
                                  setCoverImagePreview("");
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-white/30 hover:bg-white/50 transition-colors">
                              <div className="text-center p-4">
                                <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  Upload cover image
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Recommended: 1200×400px
                                </p>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverFileChange}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <motion.div
                      variants={itemVariants}
                      className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        Business Hours
                      </h3>
                      <BusinessHoursSelector
                        businessHours={businessHours}
                        onChange={handleBusinessHoursChange}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col space-y-4 pt-8">
                <div className="flex w-full space-x-2">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 border-primary/30 hover:bg-primary/5"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-sky-500 to-primary hover:from-sky-600 hover:to-primary/90 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {step < 3 ? (
                      <>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Complete Registration
                      </>
                    )}
                  </Button>
                </div>

                {step === 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-gray-600 mt-4"
                  >
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                  </motion.p>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {isProfileCropOpen && rawProfileImage && (
        <CropImageDialog
          imageFile={rawProfileImage}
          onClose={() => setIsProfileCropOpen(false)}
          onCropComplete={(croppedBlob) => {
            const file = new File([croppedBlob], "profile.jpg", {
              type: "image/jpeg",
            });
            setBusinessData((prev) => ({ ...prev, profileImage: file }));
            const reader = new FileReader();
            reader.onload = () =>
              setProfileImagePreview(reader.result as string);
            reader.readAsDataURL(file);
          }}
        />
      )}

      {isCoverCropOpen && rawCoverImage && (
        <CropImageDialog
          imageFile={rawCoverImage}
          onClose={() => setIsCoverCropOpen(false)}
          onCropComplete={(croppedBlob) => {
            const file = new File([croppedBlob], "cover.jpg", {
              type: "image/jpeg",
            });
            setBusinessData((prev) => ({ ...prev, coverImage: file }));
            const reader = new FileReader();
            reader.onload = () => setCoverImagePreview(reader.result as string);
            reader.readAsDataURL(file);
          }}
        />
      )}
    </div>
  );
}
