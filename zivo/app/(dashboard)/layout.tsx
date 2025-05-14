"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  Briefcase,
  ImageIcon,
} from "lucide-react";
import { getUserProfile, logoutUser } from "@/lib/auth.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface User {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();

        const profileImage =
          userData.userType === "store_owner"
            ? userData.business?.profileImageUrl
            : userData.profile?.photoUrl;

        console.log("✅ getUserProfile data:", userData);
        console.log(
          "🖼️ user profil fotoğrafı (store_owner ise business):",
          profileImage
        );

        // If profile image is undefined but we just registered, try to fetch again after a short delay
        if (!profileImage && sessionStorage.getItem("justRegistered")) {
          console.log(
            "Profile image not found after registration, retrying in 2 seconds..."
          );
          setTimeout(async () => {
            try {
              const refreshedUserData = await getUserProfile();
              const refreshedProfileImage =
                refreshedUserData.userType === "store_owner"
                  ? refreshedUserData.business?.profileImageUrl
                  : refreshedUserData.profile?.photoUrl;

              console.log("Retry profile image fetch:", refreshedProfileImage);

              setUser({
                id: refreshedUserData.id,
                fullName: refreshedUserData.fullName,
                email: refreshedUserData.email,
                profileImage: refreshedProfileImage,
              });

              // Clear the flag after successful retry
              sessionStorage.removeItem("justRegistered");
            } catch (error) {
              console.error("Failed to refresh profile data:", error);
            }
          }, 2000);
        }

        setUser({
          id: userData.id,
          fullName: userData.fullName,
          email: userData.email,
          profileImage,
        });
      } catch (error) {
        console.error("❌ Profil alınamadı:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out",
        description: "You have successfully logged out.",
      });
      router.push("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b border-border/40 p-4">
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ZIVO
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard"}
                  >
                    <Link
                      href="/dashboard"
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/appointments"}
                  >
                    <Link
                      href="/appointments"
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Appointments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/services"}
                  >
                    <Link
                      href="/services"
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <Briefcase className="h-5 w-5" />
                      <span>Services</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/workers"}>
                    <Link
                      href="/workers"
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <Users className="h-5 w-5" />
                      <span>Employees</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Business</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/business"}
                  >
                    <Link
                      href="/business"
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <Briefcase className="h-5 w-5" />
                      <span>Business Information</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/portfolio"}
                  >
                    <Link
                      href="/portfolio"
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <ImageIcon className="h-5 w-5" />
                      <span>Gallery</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/shifts"}>
                    <Link
                      href="/shifts"
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Working Hours</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-border/40 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2 transition-all duration-200 hover:bg-primary/5"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.fullName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium">
                        {user?.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="cursor-pointer flex w-full items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 transition-all duration-200 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b bg-gradient-to-r from-background to-background/95 px-4 md:px-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
              <h1 className="text-lg font-semibold">
                {pathname === "/dashboard" &&
                  `Welcome, ${user?.fullName || "user"}`}
                {pathname === "/appointments" &&
                  `Welcome, ${user?.fullName || "user"}`}
                {pathname === "/services" &&
                  `Welcome, ${user?.fullName || "user"}`}
                {pathname === "/workers" &&
                  `Welcome, ${user?.fullName || "user"}`}
                {pathname === "/business" &&
                  `Welcome, ${user?.fullName || "user"}`}
                {pathname === "/portfolio" &&
                  `Welcome, ${user?.fullName || "user"}`}
                {pathname === "/contacts" &&
                  `Welcome, ${user?.fullName || "user"}`}
                {pathname === "/shifts" &&
                  `Welcome, ${user?.fullName || "user"}`}
                {pathname === "/profile" &&
                  `Welcome, ${user?.fullName || "user"}`}
              </h1>
            </div>
            {/* <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-600"></span>
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Button>
            </div> */}
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
