import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  MapPinIcon,
  NavigationIcon,
  AlertCircleIcon
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import type { Trip, TripStatus } from "@/types";
import { Drawer } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addTrip, updateTrip, deleteTrip } from "@/lib/firebase-services";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface TripFormData {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  plannedDistance: number;
  revenue: number;
  status: TripStatus;
}

// Mock cities for simulation
const cities = [
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
];

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState<TripFormData>({
    source: "",
    destination: "",
    vehicleId: "",
    driverId: "",
    cargoWeight: 0,
    plannedDistance: 0,
    revenue: 0,
    status: "Draft",
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "trips"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          createdAt: docData.createdAt instanceof Timestamp 
            ? docData.createdAt.toDate() 
            : new Date(docData.createdAt),
          updatedAt: docData.updatedAt instanceof Timestamp 
            ? docData.updatedAt.toDate() 
            : new Date(docData.updatedAt),
        } as Trip;
      });
      setTrips(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredTrips = trips.filter(
    (trip) =>
      trip.source.toLowerCase().includes(search.toLowerCase()) ||
      trip.destination.toLowerCase().includes(search.toLowerCase()) ||
      trip.vehicleId.toLowerCase().includes(search.toLowerCase())
  );

  // Generate deterministic mock paths for dispatched trips for map
  const activeTripPaths = useMemo(() => {
    return filteredTrips
      .filter((t) => t.status === "Dispatched")
      .map((trip, idx) => {
        const sourceCity = cities[idx % cities.length];
        const destCity = cities[(idx + 3) % cities.length];
        return {
          ...trip,
          start: [sourceCity.lat, sourceCity.lng] as [number, number],
          end: [destCity.lat, destCity.lng] as [number, number],
          current: [
            sourceCity.lat + (destCity.lat - sourceCity.lat) * 0.4,
            sourceCity.lng + (destCity.lng - sourceCity.lng) * 0.4
          ] as [number, number]
        };
      });
  }, [filteredTrips]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTrip) {
        await updateTrip(editingTrip.id, formData);
        toast({ title: "Trip updated successfully" });
      } else {
        await addTrip(formData as Omit<Trip, "id" | "createdAt" | "updatedAt">);
        toast({ title: "Trip created successfully" });
      }
      setDrawerOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving trip:", error);
      toast({
        title: "Error",
        description: "Failed to save trip",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData(trip);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip(id);
        toast({ title: "Trip deleted successfully" });
      } catch (error) {
        console.error("Error deleting trip:", error);
        toast({
          title: "Error",
          description: "Failed to delete trip",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      source: "",
      destination: "",
      vehicleId: "",
      driverId: "",
      cargoWeight: 0,
      plannedDistance: 0,
      revenue: 0,
      status: "Draft",
    });
    setEditingTrip(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "outline";
      case "Dispatched":
        return "secondary";
      case "Completed":
        return "default";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const MotionTableRow = motion(TableRow);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Commander Workspace</h1>
          <p className="text-muted-foreground mt-1">
            Live GPS trip tracking, route operations, and dispatch management.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => toast({ title: 'Route Optimization Triggered' })}>
            <NavigationIcon className="h-4 w-4 mr-2" />
            Optimize Routes
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setDrawerOpen(true);
            }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Dispatch
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Top Section - Table */}
        <div className="w-full space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <CardTitle>Active Dispatches</CardTitle>
                <div className="relative w-full max-w-sm">
                  <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trips (e.g. by vehicle, source)..."
                    className="pl-9 bg-muted/50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTrips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl border border-dashed">
                  <MapPinIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">No trips found</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {search ? "Try a different search term" : "Create your first dispatch to see it on the map."}
                  </p>
                  {!search && (
                    <Button onClick={() => { resetForm(); setDrawerOpen(true); }}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Dispatch
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Route Info</TableHead>
                        <TableHead>Vehicle & Driver</TableHead>
                        <TableHead>Metrics</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTrips.map((trip, index) => (
                        <MotionTableRow
                          key={trip.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className="group"
                        >
                          <TableCell>
                            <div className="font-medium text-foreground">{trip.source}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">↓ {trip.destination}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{trip.vehicleId}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{trip.driverId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{trip.plannedDistance} km</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{trip.cargoWeight} kg</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(trip.status)} className="font-semibold shadow-sm">
                              {trip.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(trip)}>
                                <EditIcon className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(trip.id)}>
                                <TrashIcon className="h-4 w-4 text-destructive/70 hover:text-destructive" />
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
        </div>

        {/* Bottom Section - Map */}
        <div className="w-full space-y-6">
          <Card className="overflow-hidden border-border shadow-sm flex flex-col h-[600px]">
            <CardHeader className="bg-card z-10 py-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live GPS Tracking
              </CardTitle>
              <CardDescription>Real-time vehicle telemetry</CardDescription>
            </CardHeader>
            <div className="flex-1 relative bg-muted/20">
              {activeTripPaths.length > 0 ? (
                <MapContainer 
                  center={[21.0, 78.0]} 
                  zoom={4} 
                  style={{ height: '100%', width: '100%', zIndex: 0 }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {activeTripPaths.map((trip) => (
                    <div key={trip.id}>
                      <Marker position={trip.current} icon={customIcon}>
                        <Popup>
                          <div className="font-semibold">{trip.vehicleId}</div>
                          <div className="text-xs text-muted-foreground">Driver: {trip.driverId}</div>
                          <div className="text-xs text-emerald-600 font-medium mt-1">In-Transit ({trip.source} → {trip.destination})</div>
                        </Popup>
                      </Marker>
                      <Polyline 
                        positions={[trip.start, trip.current]} 
                        color="#4f46e5" 
                        weight={4} 
                        opacity={0.8} 
                      />
                      <Polyline 
                        positions={[trip.current, trip.end]} 
                        color="#94a3b8" 
                        weight={2} 
                        opacity={0.5} 
                        dashArray="5, 5"
                      />
                    </div>
                  ))}
                </MapContainer>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-slate-900/50">
                  <AlertCircleIcon className="h-8 w-8 text-muted-foreground opacity-30 mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">No active dispatches</p>
                  <p className="text-xs text-muted-foreground mt-1">Change a trip status to 'Dispatched' to track it live.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingTrip ? "Edit Trip" : "Create Trip"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-4 pb-8 max-w-3xl mx-auto">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{editingTrip ? "Edit Trip Dispatch" : "New Trip Dispatch"}</h2>
            <p className="text-muted-foreground text-sm">Fill in the details to schedule or dispatch a new vehicle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="source">Source Location</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="e.g. Mumbai Port"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g. Delhi Hub"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle Registration</Label>
              <Input
                id="vehicleId"
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                placeholder="e.g. MH-12-AB-1234"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverId">Assigned Driver</Label>
              <Input
                id="driverId"
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                placeholder="Driver Name or ID"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cargoWeight">Cargo Weight (kg)</Label>
              <Input
                id="cargoWeight"
                type="number"
                value={formData.cargoWeight}
                onChange={(e) => setFormData({ ...formData, cargoWeight: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedDistance">Distance (km)</Label>
              <Input
                id="plannedDistance"
                type="number"
                value={formData.plannedDistance}
                onChange={(e) => setFormData({ ...formData, plannedDistance: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue">Est. Revenue (₹)</Label>
              <Input
                id="revenue"
                type="number"
                value={formData.revenue}
                onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Dispatch Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as TripStatus })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft (Planning)</SelectItem>
                <SelectItem value="Dispatched">Dispatched (Active)</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]">
              {editingTrip ? "Save Changes" : "Create Dispatch"}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
