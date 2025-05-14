"use client";

import type React from "react";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  Scissors,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuthMe } from "@/hooks/useAuthMe";
import {
  useGetServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useAssignWorkersToService,
} from "@/hooks/useServices";
import { getServiceWorkers } from "@/lib/services.service";

import { useGetWorkers } from "@/hooks/useWorkers";
import { MultiSelect } from "@/components/ui/multi-select"; // bunu birazdan açıklayacağım

export default function ServicesPage() {
  const { toast } = useToast();
  const { data: authData } = useAuthMe();
  const businessId = authData?.businessId;

  const { data: services = [], isLoading } = useGetServices(businessId);
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  const { data: workers = [] } = useGetWorkers(businessId);
  const { mutateAsync: assignWorkers } = useAssignWorkersToService();
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);

  // Mevcut formData state'ini kaldır
  // Yerine ayrı create ve edit state'leri ekle
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
    category: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
    category: "",
  });

  // Ayrı input değişiklik yöneticileri ekleyelim:
  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData({ ...createFormData, [name]: value });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Ayrı kategori değişiklik yöneticileri ekleyelim:
  const handleCreateCategoryChange = (value: string) => {
    setCreateFormData({
      ...createFormData,
      category: value,
    });
  };

  const handleEditCategoryChange = (value: string) => {
    setEditFormData({
      ...editFormData,
      category: value,
    });
  };

  // Mevcut form state'ini kaldır
  // const [formData, setFormData] = useState({
  //   name: "",
  //   description: "",
  //   price: "",
  //   durationMinutes: "",
  //   category: "",
  // })

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target
  //   setFormData({ ...formData, [name]: value })
  // }

  const handleCreateService = async () => {
    try {
      const createdService = await createServiceMutation.mutateAsync({
        name: createFormData.name,
        description: createFormData.description,
        price: Number.parseFloat(createFormData.price),
        durationMinutes: Number.parseInt(createFormData.durationMinutes, 10),
        category: createFormData.category,
        businessId,
      });

      if (selectedWorkerIds.length > 0) {
        await assignWorkers({
          serviceId: createdService.id,
          workerIds: selectedWorkerIds,
        });
      }

      toast({ title: "Başarılı", description: "Hizmet oluşturuldu." });
      setIsCreateDialogOpen(false);
      resetCreateForm();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hizmet oluşturulamadı.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateService = async () => {
    if (!currentService) return;
    try {
      await updateServiceMutation.mutateAsync({
        id: currentService.id,
        data: {
          name: editFormData.name,
          description: editFormData.description,
          price: Number.parseFloat(editFormData.price),
          durationMinutes: Number.parseInt(editFormData.durationMinutes, 10),
          category: editFormData.category,
          businessId,
        },
      });

      // Seçilen çalışanları güncelle
      await assignWorkers({
        serviceId: currentService.id,
        workerIds: selectedWorkerIds,
      });

      toast({ title: "Başarılı", description: "Hizmet güncellendi." });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hizmet güncellenemedi.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async () => {
    if (!currentService) return;
    try {
      await deleteServiceMutation.mutateAsync(currentService.id);
      toast({ title: "Başarılı", description: "Hizmet silindi." });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hizmet silinemedi.",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Form sıfırlama fonksiyonlarını güncelleyelim:
  const resetCreateForm = () => {
    setCreateFormData({
      name: "",
      description: "",
      price: "",
      durationMinutes: "",
      category: "",
    });
    setSelectedWorkerIds([]);
  };

  const resetEditForm = () => {
    setEditFormData({
      name: "",
      description: "",
      price: "",
      durationMinutes: "",
      category: "",
    });
    setSelectedWorkerIds([]);
  };

  // const resetForm = () => {
  //   setFormData({
  //     name: "",
  //     description: "",
  //     price: "",
  //     durationMinutes: "",
  //     category: "",
  //   })
  //   setSelectedWorkerIds([]) // çalışan seçimini de sıfırla
  // }

  const openDeleteDialog = (service: any) => {
    setCurrentService(service);
    setIsDeleteDialogOpen(true);
  };

  const categories = [
    { id: "Saç", name: "Saç" },
    { id: "Tırnak", name: "Tırnak" },
    { id: "Cilt Bakımı", name: "Cilt Bakımı" },
    { id: "Makyaj", name: "Makyaj" },
    { id: "Masaj", name: "Masaj" },
  ];

  // const handleCategoryChange = (value: string) => {
  //   setFormData({
  //     ...formData,
  //     category: value,
  //   })
  // }

  const openEditDialog = async (service: any) => {
    setCurrentService(service);
    setEditFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      durationMinutes: service.durationMinutes.toString(),
      category: service.category,
    });

    // Servise atanmış çalışanları getir ve seçili yap
    try {
      const result = await getServiceWorkers(service.id); // manuel çağrı (hook yerine doğrudan)
      const initialWorkerIds = result.map((w: any) => w.workerId);
      setSelectedWorkerIds(initialWorkerIds);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çalışanlar getirilemedi.",
        variant: "destructive",
      });
    }

    setIsEditDialogOpen(true);
  };

  const filteredServices = Array.isArray(services)
    ? services
        .filter((service) => {
          const matchesSearch =
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          const matchesCategory = selectedCategory
            ? service.category === selectedCategory
            : true;
          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          const fieldA =
            sortField === "price" || sortField === "durationMinutes"
              ? a[sortField]
              : a.name;
          const fieldB =
            sortField === "price" || sortField === "durationMinutes"
              ? b[sortField]
              : b.name;
          if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
          if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
          return 0;
        })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Services
        </h1>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              resetCreateForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="transition-all duration-200 hover:shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Service</DialogTitle>
              <DialogDescription>
                Add a new service your business offers. Make sure to fill out
                all the fields.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Saç Kesimi"
                    value={createFormData.name}
                    onChange={handleCreateInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={createFormData.category}
                    onValueChange={handleCreateCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Service description..."
                  value={createFormData.description}
                  onChange={handleCreateInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₺)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="150"
                    value={createFormData.price}
                    onChange={handleCreateInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="durationMinutes"
                    name="durationMinutes"
                    value={createFormData.durationMinutes}
                    onChange={handleCreateInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workers">Workers</Label>
                  <MultiSelect
                    options={workers.map((w: any) => ({
                      label: `${w.firstName} ${w.lastName}`,
                      value: w.id,
                    }))}
                    selected={selectedWorkerIds}
                    onChange={setSelectedWorkerIds}
                    placeholder="Select worker"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="transition-all duration-200 hover:bg-muted/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateService}
                className="transition-all duration-200 hover:shadow-sm"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-background to-muted/30">
          <CardTitle>Service List</CardTitle>
          <CardDescription>
            View, edit, or delete all the services your business offers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <Input
                placeholder="Search service..."
                className="pl-8 transition-all duration-200 border-muted focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[180px] transition-all duration-200 hover:border-primary focus:border-primary">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="animate-in fade-in-50 zoom-in-95 duration-100">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-md"></div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-inner">
                  <Scissors className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 bg-primary/10 p-2 rounded-full shadow-sm">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-center mt-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                No services found
              </h3>
              <p className="text-muted-foreground text-center max-w-md px-4">
                {searchTerm || selectedCategory ? (
                  <>
                    No services match your current filters. Try adjusting your
                    search criteria or selecting a different category.
                  </>
                ) : (
                  <>
                    You haven't added any services yet. Services are the
                    foundation of your business - they define what customers can
                    book.
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {(searchTerm || selectedCategory) && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-primary/20 hover:border-primary/50"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    Clear filters
                  </Button>
                )}
                {!searchTerm && !selectedCategory && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add your first service
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-md border shadow-sm hover:shadow-md transition-all duration-300">
              <Table>
                <TableHeader className="bg-gradient-to-r from-background to-muted/30">
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium transition-all duration-200 hover:text-primary"
                        onClick={() => handleSort("name")}
                      >
                        Service Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => handleSort("price")}
                      >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => handleSort("duration")}
                      >
                        Duration
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow
                      key={service.id}
                      className="transition-all duration-200 hover:bg-primary/5"
                    >
                      <TableCell className="font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {service.description}
                      </TableCell>
                      <TableCell>₺{service.price.toLocaleString()}</TableCell>
                      <TableCell>{service.durationMinutes} dk</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                            >
                              <span className="sr-only">Open menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="animate-in fade-in-50 zoom-in-95 duration-100"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openEditDialog(service)}
                              className="transition-colors duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(service)}
                              className="text-red-600 focus:text-red-600 transition-colors duration-200 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            resetEditForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update service information. Make sure to fill out all the fields.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Service Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Saç Kesimi"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editFormData.category}
                  onValueChange={handleEditCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Service description..."
                value={editFormData.description}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₺)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  placeholder="150"
                  value={editFormData.price}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (minutes)</Label>
                <Input
                  id="edit-duration"
                  name="durationMinutes"
                  type="number"
                  placeholder="30"
                  value={editFormData.durationMinutes}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-workers">Workers</Label>
                <MultiSelect
                  options={workers.map((w: any) => ({
                    label: `${w.firstName} ${w.lastName}`,
                    value: w.id,
                  }))}
                  selected={selectedWorkerIds}
                  onChange={setSelectedWorkerIds}
                  placeholder="Select worker"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateService} className="">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-red-600 hover:bg-red-700 transition-all duration-200 hover:shadow-sm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
