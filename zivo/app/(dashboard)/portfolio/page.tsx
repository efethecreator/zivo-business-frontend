"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useGetPortfolios,
  useCreatePortfolio,
  useDeletePortfolio,
} from "@/hooks/usePortfolio";
import { useAuthMe } from "@/hooks/useAuthMe";
import CropImageDialog from "@/components/CropImageDialog";
import {
  Plus,
  Trash2,
  Upload,
  X,
  ImageIcon,
  ImagePlus,
  Camera,
} from "lucide-react";

interface PortfolioItem {
  id: string;
  businessId: string;
  imageUrl: string;
  description: string;
  uploadedAt: string;
}

interface NewPortfolioItem {
  title: string;
  description: string;
  category: string;
  imageFile: File | null;
}

const categories = [
  { id: "all", name: "All" },
  { id: "haircut", name: "Haircut" },
  { id: "coloring", name: "Hair Coloring" },
  { id: "nails", name: "Nails" },
  { id: "skincare", name: "Skincare" },
  { id: "massage", name: "Massage" },
];

export default function PortfolioPage() {
  const { toast } = useToast();
  const { data: authData } = useAuthMe();
  const businessId = authData?.businessId;

  const { data: portfolios = [], isLoading } = useGetPortfolios(businessId);
  const createPortfolioMutation = useCreatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [rawImage, setRawImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const [newItem, setNewItem] = useState<NewPortfolioItem>({
    title: "",
    description: "",
    category: "",
    imageFile: null,
  });

  const filteredItems =
    selectedCategory === "all" ? portfolios : portfolios.filter(() => true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRawImage(e.target.files[0]);
      setIsCropDialogOpen(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = async () => {
    if (!newItem.description || !newItem.imageFile) {
      toast({
        title: "Missing information",
        description: "Description and image are required.",
        variant: "destructive",
      });
      return;
    }

    if (!businessId) {
      toast({
        title: "Error",
        description: "Business not found.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("businessId", businessId);
    formData.append("description", newItem.description);
    formData.append("image", newItem.imageFile);

    try {
      await createPortfolioMutation.mutateAsync(formData);
      setIsAddDialogOpen(false);
      setNewItem({ title: "", description: "", category: "", imageFile: null });
      setPreviewUrl("");
      toast({ title: "Success", description: "Image added." });
    } catch {
      toast({
        title: "Error",
        description: "Upload failed.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deletePortfolioMutation.mutateAsync(id);
      toast({ title: "Deleted", description: "Image removed." });
    } catch {
      toast({
        title: "Error",
        description: "Deletion failed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Business Portfolio
        </h1>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setNewItem({
                title: "",
                description: "",
                category: "",
                imageFile: null,
              });
              setPreviewUrl("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="transition-all duration-200 hover:shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>New Image</DialogTitle>
              <DialogDescription>Share your work.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Image description"
                  value={newItem.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:border-primary/50"
                  >
                    {previewUrl ? (
                      <div className="relative w-full max-h-[320px] rounded-lg overflow-hidden border">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-auto max-h-[320px] object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewUrl("");
                            setNewItem({ ...newItem, imageFile: null });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, JPEG (max. 2MB)
                        </p>
                      </div>
                    )}
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="transition-all duration-200 hover:bg-muted/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                className="transition-all duration-200 hover:shadow-sm"
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Crop Dialog */}
      {isCropDialogOpen && rawImage && (
        <CropImageDialog
          imageFile={rawImage}
          onClose={() => {
            setIsCropDialogOpen(false);
            setRawImage(null);
          }}
          onCropComplete={(croppedBlob) => {
            const file = new File([croppedBlob], "cropped.jpg", {
              type: "image/jpeg",
            });
            setNewItem({ ...newItem, imageFile: file });
            const reader = new FileReader();
            reader.onload = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
          }}
        />
      )}

      <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-background to-muted/30">
          <CardTitle>Business Portfolio</CardTitle>
          <CardDescription>Manage uploaded images.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[300px] rounded-xl bg-muted animate-pulse shadow-sm"
                  />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center shadow-lg">
                    <ImageIcon className="h-14 w-14 text-primary/70" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-primary/30 to-primary/20 p-3 rounded-full shadow-md">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-medium text-center mt-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Your portfolio is empty
                </h3>
                <p className="text-muted-foreground text-center max-w-md px-6">
                  Showcase your best work by adding images to your portfolio.
                  This helps potential customers see examples of your services
                  and builds trust in your business.
                </p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <ImagePlus className="h-4 w-4" />
                  Add your first image
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-xl border bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/30"
                  >
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.description}
                      loading="lazy"
                      onLoad={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }))
                      }
                      className={`w-full aspect-[4/3] object-contain transition-all duration-500 ${
                        loadedImages[item.id]
                          ? "blur-0 scale-100"
                          : "blur-sm scale-105"
                      }`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                      <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-300 scale-75 group-hover:scale-100">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteItem(item.id)}
                          className="rounded-full shadow-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-b from-transparent to-background/5">
                      <p className="font-semibold text-gray-800">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
