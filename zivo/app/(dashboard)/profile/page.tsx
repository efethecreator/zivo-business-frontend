"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserProfile } from "@/lib/auth.service";
import { useToast } from "@/hooks/use-toast";
import CropImageDialog from "@/components/CropImageDialog";
import { updateMe } from "@/lib/auth.service";
import { updateBusiness } from "@/lib/business.service";
import uploadProfileImage from "@/lib/uploadService";
import { useChangePassword } from "@/hooks/useChangePassword";
import {
  Camera,
  Mail,
  Phone,
  User,
  Lock,
  Save,
  CheckCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    profileImage: "",
    businessId: "",
    userType: "customer", // default
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    currentPasswordTekrar: "",
    newPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const changePasswordMutation = useChangePassword();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();

        const profileImage =
          userData.userType === "store_owner"
            ? userData.business?.profileImageUrl
            : userData.profile?.photoUrl;

        setUser({
          id: userData.id,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.business?.phone || "",
          profileImage: profileImage || "",
          businessId: userData.businessId || "",
          userType: userData.userType,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [passwordForm.newPassword]);

  // Simple password strength checker
  useEffect(() => {
    const { newPassword } = passwordForm;
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;

    setPasswordStrength(strength);
  }, [passwordForm.newPassword]);

  const handleAvatarClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        setRawImageFile(file);
        setCropDialogOpen(true);
      }
    };
    input.click();
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      const file = new File([croppedBlob], "avatar.jpg", {
        type: "image/jpeg",
      });

      const imageUrl = await uploadProfileImage(file);

      setUser((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));

      if (user.userType === "store_owner") {
        await updateBusiness(user.businessId, {
          phone: user.phone,
          profileImageUrl: imageUrl,
        });
        toast({ title: "Profil fotoğrafı güncellendi." });
      }
    } catch (error) {
      console.error("Görsel güncellenemedi", error);
      toast({ title: "Görsel yükleme başarısız", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // 1. Kullanıcı bilgilerini güncelle
      await updateMe({
        fullName: user.fullName,
        email: user.email,
      });

      // 2. Business güncelle (store_owner ise)
      if (user.userType === "store_owner") {
        await updateBusiness(user.businessId, {
          phone: user.phone,
          profileImageUrl: user.profileImage, // en günceli state'te var
        });
      }

      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla kaydedildi.",
      });
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast({
        title: "Güncelleme başarısız",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, currentPasswordTekrar, newPassword } =
      passwordForm;

    if (!currentPassword || !currentPasswordTekrar || !newPassword) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    if (currentPassword !== currentPasswordTekrar) {
      toast({
        title: "Şifre uyuşmuyor",
        description: "Mevcut şifreler aynı değil.",
        variant: "destructive",
      });
      return;
    }

    try {
      setChangingPassword(true);
      await changePasswordMutation.mutateAsync({
        currentPassword,
        currentPasswordTekrar,
        newPassword,
      });

      // Temizle
      setPasswordForm({
        currentPassword: "",
        currentPasswordTekrar: "",
        newPassword: "",
      });

      toast({
        title: "Şifre değiştirildi",
        description: "Şifreniz başarıyla güncellendi.",
      });
    } catch (error) {
      console.error("Şifre değiştirme hatası:", error);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-24 w-24 bg-muted rounded-full"></div>
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and change your credentials
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="overflow-hidden border-none shadow-md">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative group inline-block">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage
                      src={user.profileImage || "/default-avatar.png"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <button
                    onClick={handleAvatarClick}
                    type="button"
                    className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center z-10 transition-opacity opacity-80 group-hover:opacity-100"
                  >
                    <Camera className="h-5 w-5 text-gray-600" />
                    <span className="sr-only">Change profile picture</span>
                  </button>
                </div>

                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-2xl font-bold">
                    {user.fullName || "Your Name"}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    {user.userType === "store_owner"
                      ? "Business Owner"
                      : "Customer"}
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 pt-8 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-base font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      value={user.fullName}
                      onChange={(e) =>
                        setUser({ ...user, fullName: e.target.value })
                      }
                      className="pl-10 h-11"
                    />
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      className="pl-10 h-11"
                    />
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      value={user.phone}
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                      className="pl-10 h-11"
                    />
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {user.userType === "store_owner" && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Account Type
                    </Label>
                    <div className="bg-muted/50 rounded-md p-3 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Business Account</p>
                        <p className="text-sm text-muted-foreground">
                          You have access to all business features
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="p-6 flex justify-end">
              <Button
                onClick={handleSave}
                className="w-full sm:w-auto"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Saving Changes
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and security preferences
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                  We recommend using a strong password you don't use elsewhere
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPasswordTekrar">
                    Confirm Current Password
                  </Label>
                  <Input
                    id="currentPasswordTekrar"
                    type="password"
                    placeholder="Confirm your current password"
                    value={passwordForm.currentPasswordTekrar}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPasswordTekrar: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />

                {passwordForm.newPassword && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">
                      Password strength
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === 0
                            ? "w-0"
                            : passwordStrength === 1
                            ? "w-1/4 bg-red-500"
                            : passwordStrength === 2
                            ? "w-2/4 bg-orange-500"
                            : passwordStrength === 3
                            ? "w-3/4 bg-yellow-500"
                            : "w-full bg-green-500"
                        }`}
                      ></div>
                    </div>
                    <div className="text-xs mt-1">
                      {passwordStrength === 0 && "Enter a password"}
                      {passwordStrength === 1 &&
                        "Weak - Add numbers or symbols"}
                      {passwordStrength === 2 && "Fair - Add uppercase letters"}
                      {passwordStrength === 3 &&
                        "Good - Add special characters"}
                      {passwordStrength === 4 && "Strong password"}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">
                  Password requirements:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        passwordForm.newPassword?.length >= 8
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                      }`}
                    ></div>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        /[A-Z]/.test(passwordForm.newPassword || "")
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                      }`}
                    ></div>
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        /[0-9]/.test(passwordForm.newPassword || "")
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                      }`}
                    ></div>
                    At least one number
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        /[^A-Za-z0-9]/.test(passwordForm.newPassword || "")
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                      }`}
                    ></div>
                    At least one special character
                  </li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="p-6 flex justify-end">
              <Button
                onClick={handlePasswordChange}
                className="w-full sm:w-auto"
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Updating Password
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader>
              <CardTitle>Login Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions and devices
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                      >
                        <rect
                          width="16"
                          height="20"
                          x="4"
                          y="2"
                          rx="2"
                          ry="2"
                        />
                        <path d="M12 18h.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()} • {navigator.platform}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {cropDialogOpen && rawImageFile && (
        <CropImageDialog
          imageFile={rawImageFile}
          onClose={() => setCropDialogOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
