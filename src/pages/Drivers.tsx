import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import type { Driver, LicenseCategory, DriverStatus } from "@/types";
import { Drawer } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDriver, updateDriver, deleteDriver } from "@/lib/firebase-services";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Form data interface (uses string for date inputs)
interface DriverFormData {
  name: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<DriverFormData>({
    name: "",
    licenseNumber: "",
    licenseCategory: "C",
    licenseExpiryDate: new Date().toISOString().split("T")[0],
    contactNumber: "",
    safetyScore: 100,
    status: "Available",
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "drivers"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          licenseExpiryDate: docData.licenseExpiryDate instanceof Timestamp 
            ? docData.licenseExpiryDate.toDate() 
            : new Date(docData.licenseExpiryDate),
          createdAt: docData.createdAt instanceof Timestamp 
            ? docData.createdAt.toDate() 
            : new Date(docData.createdAt),
          updatedAt: docData.updatedAt instanceof Timestamp 
            ? docData.updatedAt.toDate() 
            : new Date(docData.updatedAt),
        } as Driver;
      });
      setDrivers(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(search.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        licenseExpiryDate: new Date(formData.licenseExpiryDate),
      };

      if (editingDriver) {
        await updateDriver(editingDriver.id, dataToSave);
        toast({ title: "Driver updated successfully" });
      } else {
        await addDriver(dataToSave as Omit<Driver, "id" | "createdAt" | "updatedAt">);
        toast({ title: "Driver added successfully" });
      }
      setDrawerOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving driver:", error);
      toast({
        title: "Error",
        description: "Failed to save driver",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory,
      licenseExpiryDate: new Date(driver.licenseExpiryDate).toISOString().split("T")[0],
      contactNumber: driver.contactNumber,
      safetyScore: driver.safetyScore,
      status: driver.status,
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this driver?")) {
      try {
        await deleteDriver(id);
        toast({ title: "Driver deleted successfully" });
      } catch (error) {
        console.error("Error deleting driver:", error);
        toast({
          title: "Error",
          description: "Failed to delete driver",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      licenseNumber: "",
      licenseCategory: "C",
      licenseExpiryDate: new Date().toISOString().split("T")[0],
      contactNumber: "",
      safetyScore: 100,
      status: "Available",
    });
    setEditingDriver(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "default";
      case "On Trip":
        return "secondary";
      case "Off Duty":
        return "outline";
      case "Suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 80) return "secondary";
    return "destructive";
  };

  const MotionTableRow = motion(TableRow);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-full max-w-sm" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drivers</h1>
          <p className="text-muted-foreground mt-1">Manage your drivers</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDrawerOpen(true);
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full max-w-sm">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDrivers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UsersIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No drivers found</h3>
              <p className="text-muted-foreground mb-4">
                {search ? "Try a different search term" : "Add your first driver to get started"}
              </p>
              {!search && (
                <Button
                  onClick={() => {
                    resetForm();
                    setDrawerOpen(true);
                  }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Driver
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>License Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Safety Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver, index) => (
                    <MotionTableRow
                      key={driver.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    >
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.licenseNumber}</TableCell>
                      <TableCell>{driver.licenseCategory}</TableCell>
                      <TableCell>{driver.contactNumber}</TableCell>
                      <TableCell>
                        <Badge variant={getSafetyScoreColor(driver.safetyScore)}>
                          {driver.safetyScore}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(driver.status)}>
                          {driver.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(driver)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(driver.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingDriver ? "Edit Driver" : "Add Driver"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseCategory">License Category</Label>
            <Select
              value={formData.licenseCategory}
              onValueChange={(value) => setFormData({ ...formData, licenseCategory: value as LicenseCategory })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
            <Input
              id="licenseExpiryDate"
              type="date"
              value={formData.licenseExpiryDate}
              onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="safetyScore">Safety Score</Label>
            <Input
              id="safetyScore"
              type="number"
              min="0"
              max="100"
              value={formData.safetyScore}
              onChange={(e) => setFormData({ ...formData, safetyScore: Number(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as DriverStatus })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="On Trip">On Trip</SelectItem>
                <SelectItem value="Off Duty">Off Duty</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingDriver ? "Update Driver" : "Add Driver"}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
