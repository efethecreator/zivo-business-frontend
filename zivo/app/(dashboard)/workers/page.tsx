"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import type React from "react";

import { useState } from "react";
import {
  useGetWorkers,
  useCreateWorker,
  useUpdateWorker,
  useDeleteWorker,
  useGetWorkerTypes,
} from "@/hooks/useWorkers";
import { useAuthMe } from "@/hooks/useAuthMe";
import { useToast } from "@/hooks/use-toast";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  Search,
  Filter,
  Users,
  UserPlus,
  Briefcase,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WorkersPage() {
  const { toast } = useToast();
  const { data: authData } = useAuthMe();
  const businessId = authData?.businessId;

  const { data: workers = [], isLoading } = useGetWorkers(businessId);
  const { data: workerTypes = [] } = useGetWorkerTypes();
  const createWorkerMutation = useCreateWorker();
  const updateWorkerMutation = useUpdateWorker();
  const deleteWorkerMutation = useDeleteWorker();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortField, setSortField] = useState<string>("firstName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentWorker, setCurrentWorker] = useState<any>(null);

  const [createFormData, setCreateFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    workerTypeId: "",
  });

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    workerTypeId: "",
  });

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateWorkerTypeChange = (value: string) => {
    setCreateFormData((prev) => ({ ...prev, workerTypeId: value }));
  };

  const handleEditWorkerTypeChange = (value: string) => {
    setEditFormData((prev) => ({ ...prev, workerTypeId: value }));
  };

  const resetCreateForm = () => {
    setCreateFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      workerTypeId: "",
    });
  };

  const resetEditForm = () => {
    setEditFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      workerTypeId: "",
    });
    setCurrentWorker(null);
  };

  const handleCreateWorker = async () => {
    try {
      await createWorkerMutation.mutateAsync({ ...createFormData, businessId });
      toast({ title: "Success", description: "Employee created." });
      setIsCreateDialogOpen(false);
      resetCreateForm();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create employee.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateWorker = async () => {
    if (!currentWorker) return;
    try {
      await updateWorkerMutation.mutateAsync({
        id: currentWorker.id,
        data: { ...editFormData, businessId },
      });
      toast({ title: "Success", description: "Employee updated." });
      setIsEditDialogOpen(false);
      resetEditForm();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update employee.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorker = async () => {
    if (!currentWorker) return;
    try {
      await deleteWorkerMutation.mutateAsync(currentWorker.id);
      toast({ title: "Success", description: "Employee deleted." });
      setIsDeleteDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete employee.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (worker: any) => {
    const editData = {
      firstName: worker.firstName,
      lastName: worker.lastName,
      email: worker.email,
      phone: worker.phone,
      workerTypeId: worker.workerTypeId,
    };
    setCurrentWorker(worker);
    setEditFormData(editData);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (worker: any) => {
    setCurrentWorker(worker);
    setIsDeleteDialogOpen(true);
  };

  // enrich workers
  const enrichedWorkers = workers.map((worker: any) => {
    const type = workerTypes.find((t: any) => t.id === worker.workerTypeId);
    return {
      ...worker,
      workerTypeName: type ? type.name : "",
      isActive: worker.isActive ?? false,
    };
  });

  const filteredWorkers = enrichedWorkers
    .filter((worker: any) => {
      const fullName = `${worker.firstName} ${worker.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.phone.includes(searchTerm);
      const matchesType = selectedType
        ? worker.workerTypeId === selectedType
        : true;
      return matchesSearch && matchesType;
    })
    .sort((a: any, b: any) => {
      const fieldA =
        sortField === "workerType"
          ? a.workerTypeName
          : `${a.firstName} ${a.lastName}`;
      const fieldB =
        sortField === "workerType"
          ? b.workerTypeName
          : `${b.firstName} ${b.lastName}`;
      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Employees
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
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
              <DialogDescription>
                Add a new employee to your business. Make sure you fill in all
                the fields.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Ahmet"
                    value={createFormData.firstName}
                    onChange={handleCreateInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Yılmaz"
                    value={createFormData.lastName}
                    onChange={handleCreateInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ahmet.yilmaz@example.com"
                  value={createFormData.email}
                  onChange={handleCreateInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+90 555 123 4567"
                  value={createFormData.phone}
                  onChange={handleCreateInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workerTypeId">Position</Label>
                <Select
                  value={createFormData.workerTypeId}
                  onValueChange={handleCreateWorkerTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {workerTypes.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="photoUrl">Profil Fotoğrafı URL</Label>
                <Input
                  id="photoUrl"
                  name="photoUrl"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                />
              </div> */}
              {/* <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="isActive">Aktif</Label>
              </div> */}
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
                onClick={handleCreateWorker}
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
          <CardTitle>Employee List</CardTitle>
          <CardDescription>
            View, edit, or delete all employees working in your business.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <Input
                placeholder="Search employee..."
                className="pl-8 transition-all duration-200 border-muted focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px] transition-all duration-200 hover:border-primary focus:border-primary">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Positions" />
                </div>
              </SelectTrigger>
              <SelectContent className="animate-in fade-in-50 zoom-in-95 duration-100">
                <SelectItem value="all">View All</SelectItem>
                {workerTypes.map((type: any) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-md"></div>
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center shadow-lg">
                  <Users className="h-14 w-14 text-primary/80" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-primary/30 to-primary/20 p-3 rounded-full shadow-md">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-medium text-center mt-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Your team is empty
              </h3>
              <p className="text-muted-foreground text-center max-w-md px-6">
                {searchTerm || selectedType ? (
                  <>
                    No employees match your current filters. Try adjusting your
                    search criteria or selecting a different position.
                  </>
                ) : (
                  <>
                    You haven't added any employees yet. Add staff members to
                    assign them to services and manage their schedules.
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {(searchTerm || selectedType) && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-primary/20 hover:border-primary/50"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedType("");
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    Clear filters
                  </Button>
                )}
                {!searchTerm && !selectedType && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add your first employee
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
                        onClick={() => handleSort("firstName")}
                      >
                        Full Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => handleSort("workerType")}
                      >
                        Position
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => handleSort("email")}
                      >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-medium"
                        onClick={() => handleSort("phone")}
                      >
                        Phone
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((worker: any) => (
                    <TableRow
                      key={worker.id}
                      className="transition-all duration-200 hover:bg-primary/5"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm transition-all duration-300 hover:ring-primary/20 hover:shadow-md">
                            <AvatarImage
                              src={worker.photoUrl || "/placeholder.svg"}
                              className="transition-all duration-500 hover:scale-105"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {worker.firstName[0]}
                              {worker.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">
                            {worker.firstName} {worker.lastName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{worker.workerTypeName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {worker.email}
                      </TableCell>
                      <TableCell>{worker.phone}</TableCell>
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
                              onClick={() => openEditDialog(worker)}
                              className="transition-colors duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(worker)}
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
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information. Make sure you fill in all the fields.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  name="firstName"
                  placeholder="Ahmet"
                  value={editFormData.firstName}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  name="lastName"
                  placeholder="Yılmaz"
                  value={editFormData.lastName}
                  onChange={handleEditInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                placeholder="ahmet.yilmaz@example.com"
                value={editFormData.email}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                name="phone"
                placeholder="+90 555 123 4567"
                value={editFormData.phone}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-workerTypeId">Position</Label>
              <Select
                value={editFormData.workerTypeId}
                onValueChange={handleEditWorkerTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {workerTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="edit-photoUrl">Profil Fotoğrafı URL</Label>
              <Input
                id="edit-photoUrl"
                name="photoUrl"
                placeholder="https://example.com/photo.jpg"
                value={formData.photoUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit-isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="edit-isActive">Aktif</Label>
            </div> */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateWorker} className="">
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
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorker}
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
