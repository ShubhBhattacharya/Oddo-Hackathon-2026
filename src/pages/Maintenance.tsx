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
  WrenchIcon,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import type { Maintenance, MaintenanceStatus } from "@/types";
import { Drawer } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "@/lib/firebase-services";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface MaintenanceFormData {
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  date: string;
  status: MaintenanceStatus;
}

export default function Maintenance() {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Maintenance | null>(null);
  const [formData, setFormData] = useState<MaintenanceFormData>({
    vehicleId: "",
    type: "",
    description: "",
    cost: 0,
    date: new Date().toISOString().split("T")[0],
    status: "Open",
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "maintenance"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          date: docData.date instanceof Timestamp 
            ? docData.date.toDate() 
            : new Date(docData.date),
          createdAt: docData.createdAt instanceof Timestamp 
            ? docData.createdAt.toDate() 
            : new Date(docData.createdAt),
          updatedAt: docData.updatedAt instanceof Timestamp 
            ? docData.updatedAt.toDate() 
            : new Date(docData.updatedAt),
        } as Maintenance;
      });
      setMaintenance(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredMaintenance = maintenance.filter(
    (item) =>
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        date: new Date(formData.date),
      };
      if (editingItem) {
        await updateMaintenance(editingItem.id, dataToSave);
        toast({ title: "Maintenance updated successfully" });
      } else {
        await addMaintenance(dataToSave as Omit<Maintenance, "id" | "createdAt" | "updatedAt">);
        toast({ title: "Maintenance created successfully" });
      }
      setDrawerOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving maintenance:", error);
      toast({
        title: "Error",
        description: "Failed to save maintenance",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: Maintenance) => {
    setEditingItem(item);
    setFormData({
      vehicleId: item.vehicleId,
      type: item.type,
      description: item.description,
      cost: item.cost,
      date: new Date(item.date).toISOString().split("T")[0],
      status: item.status,
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this maintenance record?")) {
      try {
        await deleteMaintenance(id);
        toast({ title: "Maintenance deleted successfully" });
      } catch (error) {
        console.error("Error deleting maintenance:", error);
        toast({
          title: "Error",
          description: "Failed to delete maintenance",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleId: "",
      type: "",
      description: "",
      cost: 0,
      date: new Date().toISOString().split("T")[0],
      status: "Open",
    });
    setEditingItem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "secondary";
      case "Closed":
        return "default";
      default:
        return "outline";
    }
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
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground mt-1">Track maintenance records</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDrawerOpen(true);
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Maintenance
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full max-w-sm">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search maintenance..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMaintenance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <WrenchIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No maintenance records found</h3>
              <p className="text-muted-foreground mb-4">
                {search ? "Try a different search term" : "Add your first maintenance record to get started"}
              </p>
              {!search && (
                <Button
                  onClick={() => {
                    resetForm();
                    setDrawerOpen(true);
                  }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Maintenance
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaintenance.map((item, index) => (
                    <MotionTableRow
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    >
                      <TableCell className="font-medium">{item.vehicleId}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>₹{item.cost.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(item.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
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
        title={editingItem ? "Edit Maintenance" : "Add Maintenance"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Vehicle ID</Label>
            <Input
              id="vehicleId"
              value={formData.vehicleId}
              onChange={(e) =>
                setFormData({ ...formData, vehicleId: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: Number(e.target.value) })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as MaintenanceStatus })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
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
              {editingItem ? "Update Maintenance" : "Add Maintenance"}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
