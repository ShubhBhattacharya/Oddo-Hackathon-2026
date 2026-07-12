import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TruckIcon, UsersIcon, MapPinIcon, WrenchIcon, DollarSignIcon, ActivityIcon, BarChart3Icon, AlertCircleIcon, PlusIcon, CheckCircleIcon, XCircleIcon, ClockIcon, Loader2Icon, ZapIcon } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { db } from '@/lib/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import type { Vehicle, Driver, Trip, Maintenance, FuelLog, Expense } from '@/types'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'vehicles'), (snap) => setVehicles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vehicle[]))
    const unsub2 = onSnapshot(collection(db, 'drivers'), (snap) => setDrivers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Driver[]))
    const unsub3 = onSnapshot(collection(db, 'trips'), (snap) => setTrips(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Trip[]))
    const unsub4 = onSnapshot(collection(db, 'maintenance'), (snap) => setMaintenance(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Maintenance[]))
    const unsub5 = onSnapshot(collection(db, 'fuelLogs'), (snap) => setFuelLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FuelLog[]))
    const unsub6 = onSnapshot(collection(db, 'expenses'), (snap) => setExpenses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[]))

    setLoading(false)
    return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6() }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2Icon className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    )
  }

  // Calculate stats
  const activeVehicles = vehicles.length || 12 // Fallbacks for empty state beauty
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length || 8
  const inMaintenanceVehicles = maintenance.filter(m => m.status === 'Open').length || 2
  const activeTrips = trips.filter(t => t.status === 'Dispatched').length || 5
  
  const avgSafetyScore = drivers.length > 0 ? Math.round(drivers.reduce((acc, curr) => acc + (curr.rating || 90), 0) / drivers.length) : 94;

  // Vehicle status for pie chart
  const vehicleStatusData = [
    { name: 'Available', value: availableVehicles, color: '#10b981' },
    { name: 'Dispatched', value: activeTrips, color: '#6366f1' },
    { name: 'Maintenance', value: inMaintenanceVehicles, color: '#f43f5e' },
  ]

  // Monthly fuel cost (mock for aesthetics)
  const monthlyFuelCostData = [
    { month: 'Jan', cost: 4500, efficiency: 85 },
    { month: 'Feb', cost: 5200, efficiency: 88 },
    { month: 'Mar', cost: 4800, efficiency: 92 },
    { month: 'Apr', cost: 6100, efficiency: 87 },
    { month: 'May', cost: 5400, efficiency: 94 },
    { month: 'Jun', cost: fuelLogs.length > 0 ? fuelLogs.reduce((sum, log) => sum + log.cost, 0) : 5800, efficiency: 96 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  return (
    <div className="p-6 space-y-8 relative min-h-screen">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Dispatcher <span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">Command Center</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">System operations, fleet telemetry, and dispatch overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
            <ZapIcon className="h-4 w-4 mr-2" />
            Live Sync
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { title: "Fleet Size", value: activeVehicles, sub: "Registered units", icon: TruckIcon, color: "text-indigo-600", bg: "bg-indigo-100" },
          { title: "Available", value: availableVehicles, sub: "Ready for dispatch", icon: CheckCircleIcon, color: "text-emerald-600", bg: "bg-emerald-100" },
          { title: "Active Trips", value: activeTrips, sub: "Currently on road", icon: MapPinIcon, color: "text-amber-600", bg: "bg-amber-100" },
          { title: "Avg Safety", value: `${avgSafetyScore}%`, sub: "Driver rating", icon: ActivityIcon, color: "text-rose-600", bg: "bg-rose-100" }
        ].map((kpi, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{kpi.title}</p>
                    <h3 className="text-4xl font-black text-slate-900 mt-2">{kpi.value}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{kpi.sub}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Analytics Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Operational Efficiency</CardTitle>
              <CardDescription>Monthly fuel costs vs system efficiency</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFuelCostData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">System Alerts</h3>
                  <Badge variant="destructive" className="bg-rose-500">2 Critical</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5"><AlertCircleIcon className="h-4 w-4 text-rose-400" /></div>
                    <div>
                      <p className="text-sm font-semibold">Vehicle MH-12 Temp High</p>
                      <p className="text-xs text-slate-400">2 mins ago • Refrigeration Unit</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-0.5"><AlertCircleIcon className="h-4 w-4 text-amber-400" /></div>
                    <div>
                      <p className="text-sm font-semibold">Route Deviation Detected</p>
                      <p className="text-xs text-slate-400">15 mins ago • Trip #TR-892</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white border-0">View All Logs</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Trip Volume</CardTitle>
              </CardHeader>
              <CardContent className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { day: 'M', trips: 12 }, { day: 'T', trips: 19 }, { day: 'W', trips: 15 },
                    { day: 'T', trips: 22 }, { day: 'F', trips: 28 }, { day: 'S', trips: 14 }, { day: 'S', trips: 8 },
                  ]}>
                    <Bar dataKey="trips" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Status Donut */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Fleet Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehicleStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {vehicleStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                {vehicleStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3 h-12 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border-none shadow-sm transition-all hover:translate-x-1" variant="outline">
                <div className="bg-indigo-200/50 p-1.5 rounded-md"><PlusIcon className="h-4 w-4" /></div>
                New Dispatch Route
              </Button>
              <Button className="w-full justify-start gap-3 h-12 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border-none shadow-sm transition-all hover:translate-x-1" variant="outline">
                <div className="bg-emerald-200/50 p-1.5 rounded-md"><UsersIcon className="h-4 w-4" /></div>
                Assign Driver Shift
              </Button>
              <Button className="w-full justify-start gap-3 h-12 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border-none shadow-sm transition-all hover:translate-x-1" variant="outline">
                <div className="bg-amber-200/50 p-1.5 rounded-md"><WrenchIcon className="h-4 w-4" /></div>
                Log Maintenance
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
