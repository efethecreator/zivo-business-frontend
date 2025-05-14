"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthMe } from "@/hooks/useAuthMe";
import { useGetBusiness, useUpdateBusiness } from "@/hooks/useBusiness";
import {
  useGetBusinessContacts,
  useUpdateBusinessContacts,
  useCreateBusinessContact,
  useDeleteBusinessContact,
} from "@/hooks/useBusinessContacts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapComponent } from "@/components/MapComponentWrapper";

export default function BusinessPage() {
  const { toast } = useToast();
  const { data: authData } = useAuthMe();
  const businessId = authData?.businessId || "";

  const { data: business } = useGetBusiness(businessId);
  const { data: contactData = [] } = useGetBusinessContacts(businessId);

  const updateBusinessMutation = useUpdateBusiness();
  const updateContactsMutation = useUpdateBusinessContacts();
  const createContactMutation = useCreateBusinessContact();
  const deleteContactMutation = useDeleteBusinessContact();

  const [loading, setLoading] = useState(false);

  const [businessData, setBusinessData] = useState({
    name: "",
    businessTypeId: "",
    description: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    phone: "",
    website: "",
    latitude: 0,
    longitude: 0,
  });

  const [contacts, setContacts] = useState<
    {
      id?: string;
      contactName: string;
      contactValue: string;
    }[]
  >([
    {
      contactName: "",
      contactValue: "",
    },
  ]);

  useEffect(() => {
    if (business) {
      setBusinessData({
        name: business.name || "",
        businessTypeId: business.businessTypeId || "",
        description: business.description || "",
        address: business.address || "",
        city: business.city || "",
        district: business.district || "",
        postalCode: business.postalCode || "",
        phone: business.phone || "",
        website: business.website || "",
        latitude: Number(business.latitude) || 0,
        longitude: Number(business.longitude) || 0,
      });
    }
  }, [business]);

  useEffect(() => {
    if (contactData?.length > 0) {
      setContacts(contactData);
    }
  }, [contactData]);

  const handleContactCreate = async () => {
    const empty = contacts.find((c) => !c.contactName || !c.contactValue);
    if (empty) {
      toast({
        title: "Warning",
        description: "Fill all fields.",
        variant: "destructive",
      });
      return;
    }
    try {
      for (const contact of contacts) {
        if (!contact.id) {
          await createContactMutation.mutateAsync({ businessId, ...contact });
        }
      }
      toast({ title: "Successful", description: "New contacts saved." });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save new contacts.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveContact = async (index: number) => {
    const contactToDelete = contacts[index];
    setContacts((prev) => prev.filter((_, i) => i !== index));
    if (contactToDelete.id) {
      try {
        await deleteContactMutation.mutateAsync(contactToDelete.id);
        toast({ title: "Deleted", description: "Contact removed." });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete contact.",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBusinessTypeChange = (value: string) => {
    setBusinessData((prev) => ({ ...prev, businessTypeId: value }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setBusinessData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleContactChange = (
    index: number,
    field: "contactName" | "contactValue",
    value: string
  ) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const handleAddContact = () => {
    setContacts([...contacts, { contactName: "", contactValue: "" }]);
  };

  const handleSave = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      await updateBusinessMutation.mutateAsync({
        businessId,
        data: businessData,
      });

      const existingContacts = contacts.filter((c) => c.id);
      const newContacts = contacts.filter((c) => !c.id);

      for (const contact of existingContacts) {
        await updateContactsMutation.mutateAsync({
          contactId: contact.id!,
          data: {
            contactName: contact.contactName,
            contactValue: contact.contactValue,
          },
        });
      }

      for (const contact of newContacts) {
        await createContactMutation.mutateAsync({ businessId, ...contact });
      }

      toast({
        title: "Successful",
        description: "Business information saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Update failed.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Business Information
        </h1>
        <Button onClick={handleSave} disabled={loading} className="relative">
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Saving...
              <span className="absolute inset-0 rounded-md animate-pulse bg-primary/20"></span>
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="general"
            className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            General Information
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Contact, Address and Social Media Information
          </TabsTrigger>
          <TabsTrigger
            value="location"
            className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Location
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-background to-muted/30">
              <CardTitle>General Business Information</CardTitle>
              <CardDescription>
                Edit your business's basic information here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 group">
                <Label
                  htmlFor="name"
                  className="group-hover:text-primary transition-colors duration-200"
                >
                  Business Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={businessData.name}
                  onChange={handleInputChange}
                  className="transition-all duration-200 focus:border-primary hover:border-primary/50"
                />
              </div>
              <div className="space-y-2 group">
                <Label
                  htmlFor="businessTypeId"
                  className="group-hover:text-primary transition-colors duration-200"
                >
                  Business Type
                </Label>
                <Select
                  value={businessData.businessTypeId || ""}
                  onValueChange={handleBusinessTypeChange}
                >
                  <SelectTrigger className="transition-all duration-200 hover:border-primary focus:border-primary">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="animate-in fade-in-50 zoom-in-95 duration-100">
                    <SelectItem value="dfe8118a-4b96-4366-839e-899ff802fba8">
                      Hairdresser
                    </SelectItem>
                    <SelectItem value="ed90a82e-0041-4414-8772-d2aabf15f4cb">
                      Skin Care
                    </SelectItem>
                    <SelectItem value="28ec23f3-73c0-47fb-a72c-dc94da77dacf">
                      Day SPA
                    </SelectItem>
                    <SelectItem value="58858f87-0060-4869-a83c-c838cd1c1e29">
                      Pet Service
                    </SelectItem>
                    <SelectItem value="5">Dövme & Piercing</SelectItem>
                    <SelectItem value="6">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 group">
                <Label
                  htmlFor="description"
                  className="group-hover:text-primary transition-colors duration-200"
                >
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={businessData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="transition-all duration-200 focus:border-primary hover:border-primary/50"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Contact, Address and Social Media Information
              </CardTitle>
              <CardDescription>
                Edit your business's contact and social media information here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <Label
                    htmlFor="phone"
                    className="group-hover:text-primary transition-colors duration-200"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={businessData.phone}
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:border-primary hover:border-primary/50"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label
                    htmlFor="website"
                    className="group-hover:text-primary transition-colors duration-200"
                  >
                    Website
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    value={businessData.website}
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:border-primary hover:border-primary/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={businessData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={businessData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    name="district"
                    value={businessData.district}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={businessData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <hr className="my-4" />
              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div
                    key={contact.id || index}
                    className="grid grid-cols-2 gap-4 items-center"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`contactName-${index}`}>Title</Label>
                      <Input
                        id={`contactName-${index}`}
                        placeholder="Instagram, WhatsApp, Website"
                        value={contact.contactName}
                        onChange={(e) =>
                          handleContactChange(
                            index,
                            "contactName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`contactValue-${index}`}>Link</Label>
                      <Input
                        id={`contactValue-${index}`}
                        placeholder="https://..."
                        value={contact.contactValue}
                        onChange={(e) =>
                          handleContactChange(
                            index,
                            "contactValue",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600 col-span-2 text-right transition-all duration-200 hover:bg-red-50"
                      onClick={() => handleRemoveContact(index)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddContact}
                  className="transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:border-primary"
                >
                  + Add New Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>
                Edit your business's location information here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-600 w-600 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <MapComponent
                  onLocationSelect={handleLocationSelect}
                  initialLat={businessData.latitude}
                  initialLng={businessData.longitude}
                />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Selected Location: {businessData.latitude},{" "}
                {businessData.longitude}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
