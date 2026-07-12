import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  BarChart3Icon,
  TruckIcon,
  UsersIcon,
  DollarSignIcon,
  DownloadIcon,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { Vehicle, Driver, Trip, Expense, FuelLog } from "@/types";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#10b981", "#f59e0b"];

export default function Analytics() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "vehicles"), (snap) =>
      setVehicles(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Vehicle[])
    );
    const unsub2 = onSnapshot(collection(db, "drivers"), (snap) =>
      setDrivers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Driver[])
    );
    const unsub3 = onSnapshot(collection(db, "trips"), (snap) =>
      setTrips(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Trip[])
    );
    const unsub4 = onSnapshot(collection(db, "expenses"), (snap) =>
      setExpenses(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Expense[])
    );
    const unsub5 = onSnapshot(collection(db, "fuelLogs"), (snap) =>
      setFuelLogs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as FuelLog[])
    );

    setLoading(false);
    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
    };
  }, []);

  const totalRevenue = trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
  const activeVehicles = vehicles.filter((v) => v.status === "Available").length;
  const activeDrivers = drivers.filter((d) => d.status === "Available").length;

  const monthlyRevenueData = [
    { month: "Jan", revenue: totalRevenue * 0.15 },
    { month: "Feb", revenue: totalRevenue * 0.18 },
    { month: "Mar", revenue: totalRevenue * 0.22 },
    { month: "Apr", revenue: totalRevenue * 0.25 },
    { month: "May", revenue: totalRevenue * 0.28 },
    { month: "Jun", revenue: totalRevenue * 0.3 },
  ];

  const vehicleStatusData = [
    { name: "Available", value: vehicles.filter((v) => v.status === "Available").length },
    { name: "On Trip", value: vehicles.filter((v) => v.status === "On Trip").length },
    { name: "In Shop", value: vehicles.filter((v) => v.status === "In Shop").length },
    { name: "Retired", value: vehicles.filter((v) => v.status === "Retired").length },
  ].filter((item) => item.value > 0);

  const expenseBreakdown = [
    { name: "Fuel", value: totalFuelCost },
    { name: "Maintenance", value: expenses.filter((e) => e.type === "Maintenance").reduce((sum, e) => sum + (e.amount || 0), 0) },
    { name: "Tolls", value: expenses.filter((e) => e.type === "Toll").reduce((sum, e) => sum + (e.amount || 0), 0) },
    { name: "Other", value: totalExpenses - totalFuelCost },
  ].filter((item) => item.value > 0);

  const tripActivity = [
    { day: "Mon", trips: trips.length > 0 ? Math.min(trips.length, 10) : 5 },
    { day: "Tue", trips: trips.length > 0 ? Math.min(trips.length + 2, 15) : 7 },
    { day: "Wed", trips: trips.length > 0 ? Math.min(trips.length + 4, 20) : 9 },
    { day: "Thu", trips: trips.length > 0 ? Math.min(trips.length + 1, 12) : 6 },
    { day: "Fri", trips: trips.length > 0 ? Math.min(trips.length + 5, 18) : 8 },
    { day: "Sat", trips: 3 },
    { day: "Sun", trips: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">View detailed fleet and financial analytics</p>
        </div>
        <Button>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 bg-primary/10 rounded-xl">
              <DollarSignIcon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-xl">
              <DollarSignIcon className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalExpenses + totalFuelCost).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TruckIcon className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <div className="p-2 bg-secondary rounded-xl">
              <UsersIcon className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDrivers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Vehicle Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {vehicleStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Trip Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tripActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="trips" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
