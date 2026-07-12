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
  DollarSignIcon,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import type { Expense, ExpenseType } from "@/types";
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
  addExpense,
  updateExpense,
  deleteExpense,
} from "@/lib/firebase-services";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface ExpenseFormData {
  vehicleId: string;
  type: ExpenseType;
  amount: number;
  date: string;
  description?: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<ExpenseFormData>({
    vehicleId: "",
    type: "Other",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
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
        } as Expense;
      });
      setExpenses(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.type.toLowerCase().includes(search.toLowerCase()) ||
      expense.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        date: new Date(formData.date),
      };
      if (editingExpense) {
        await updateExpense(editingExpense.id, dataToSave);
        toast({ title: "Expense updated successfully" });
      } else {
        await addExpense(dataToSave as Omit<Expense, "id" | "createdAt" | "updatedAt">);
        toast({ title: "Expense created successfully" });
      }
      setDrawerOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast({
        title: "Error",
        description: "Failed to save expense",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      vehicleId: expense.vehicleId,
      type: expense.type,
      amount: expense.amount,
      date: new Date(expense.date).toISOString().split("T")[0],
      description: expense.description,
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        toast({ title: "Expense deleted successfully" });
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast({
          title: "Error",
          description: "Failed to delete expense",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleId: "",
      type: "Other",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setEditingExpense(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Toll":
        return "default";
      case "Repair":
        return "destructive";
      case "Maintenance":
        return "secondary";
      case "Other":
        return "outline";
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
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground mt-1">Track all expenses</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDrawerOpen(true);
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full max-w-sm">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DollarSignIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No expenses found</h3>
              <p className="text-muted-foreground mb-4">
                {search ? "Try a different search term" : "Add your first expense to get started"}
              </p>
              {!search && (
                <Button
                  onClick={() => {
                    resetForm();
                    setDrawerOpen(true);
                  }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Expense
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
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense, index) => (
                    <MotionTableRow
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    >
                      <TableCell className="font-medium">{expense.vehicleId}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(expense.type)}>
                          {expense.type}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(expense)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(expense.id)}
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
        title={editingExpense ? "Edit Expense" : "Add Expense"}
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
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as ExpenseType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toll">Toll</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
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
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
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
              {editingExpense ? "Update Expense" : "Add Expense"}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
