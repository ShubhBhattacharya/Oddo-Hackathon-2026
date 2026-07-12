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
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  FuelIcon,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import type { FuelLog } from "@/types";
import { Drawer } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  addFuelLog,
  updateFuelLog,
  deleteFuelLog,
} from "@/lib/firebase-services";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface FuelFormData {
  vehicleId: string;
  liters: number;
  cost: number;
  date: string;
}

export default function Fuel() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<FuelLog | null>(null);
  const [formData, setFormData] = useState<FuelFormData>({
    vehicleId: "",
    liters: 0,
    cost: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "fuelLogs"), (snapshot) => {
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
        } as FuelLog;
      });
      setFuelLogs(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredFuelLogs = fuelLogs.filter(
    (log) => log.vehicleId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        date: new Date(formData.date),
      };
      if (editingLog) {
        await updateFuelLog(editingLog.id, dataToSave);
        toast({ title: "Fuel log updated successfully" });
      } else {
        await addFuelLog(dataToSave as Omit<FuelLog, "id" | "createdAt" | "updatedAt">);
        toast({ title: "Fuel log created successfully" });
      }
      setDrawerOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving fuel log:", error);
      toast({
        title: "Error",
        description: "Failed to save fuel log",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (log: FuelLog) => {
    setEditingLog(log);
    setFormData({
      vehicleId: log.vehicleId,
      liters: log.liters,
      cost: log.cost,
      date: new Date(log.date).toISOString().split("T")[0],
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this fuel log?")) {
      try {
        await deleteFuelLog(id);
        toast({ title: "Fuel log deleted successfully" });
      } catch (error) {
        console.error("Error deleting fuel log:", error);
        toast({
          title: "Error",
          description: "Failed to delete fuel log",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleId: "",
      liters: 0,
      cost: 0,
      date: new Date().toISOString().split("T")[0],
    });
    setEditingLog(null);
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
          <h1 className="text-3xl font-bold">Fuel</h1>
          <p className="text-muted-foreground mt-1">Track fuel usage and costs</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDrawerOpen(true);
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Fuel Log
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full max-w-sm">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fuel logs..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFuelLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FuelIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No fuel logs found</h3>
              <p className="text-muted-foreground mb-4">
                {search ? "Try a different search term" : "Add your first fuel log to get started"}
              </p>
              {!search && (
                <Button
                  onClick={() => {
                    resetForm();
                    setDrawerOpen(true);
                  }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Fuel Log
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Liters</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFuelLogs.map((log, index) => (
                    <MotionTableRow
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    >
                      <TableCell className="font-medium">{log.vehicleId}</TableCell>
                      <TableCell>{log.liters} L</TableCell>
                      <TableCell>₹{log.cost.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(log.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(log)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(log.id)}
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
        title={editingLog ? "Edit Fuel Log" : "Add Fuel Log"}
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
            <Label htmlFor="liters">Liters</Label>
            <Input
              id="liters"
              type="number"
              step="0.01"
              value={formData.liters}
              onChange={(e) =>
                setFormData({ ...formData, liters: Number(e.target.value) })
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
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingLog ? "Update Fuel Log" : "Add Fuel Log"}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
