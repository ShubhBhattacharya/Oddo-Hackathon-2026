import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TruckIcon, UsersIcon, MapPinIcon, WrenchIcon, DollarSignIcon, ActivityIcon, BarChart3Icon, AlertCircleIcon, PlusIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const vehicleStatusData = [
  { name: 'Available', value: 8, color: 'hsl(var(--primary))' },
  { name: 'On Trip', value: 5, color: 'hsl(var(--secondary))' },
  { name: 'In Maintenance', value: 2, color: 'hsl(var(--destructive))' },
  { name: 'Retired', value: 1, color: 'hsl(var(--muted-foreground))' },
]

const monthlyFuelCostData = [
  { month: 'Jan', cost: 4500 },
  { month: 'Feb', cost: 5200 },
  { month: 'Mar', cost: 4800 },
  { month: 'Apr', cost: 6100 },
  { month: 'May', cost: 5400 },
  { month: 'Jun', cost: 5800 },
]

const tripActivityData = [
  { day: 'Mon', trips: 12 },
  { day: 'Tue', trips: 15 },
  { day: 'Wed', trips: 18 },
  { day: 'Thu', trips: 14 },
  { day: 'Fri', trips: 20 },
  { day: 'Sat', trips: 8 },
  { day: 'Sun', trips: 5 },
]

const recentActivities = [
  { id: 1, icon: MapPinIcon, iconColor: 'text-primary', bgColor: 'bg-primary/10', title: 'Trip #123 completed', desc: 'Vehicle TRK-001 arrived at destination', time: '2 min ago', status: 'success' },
  { id: 2, icon: AlertCircleIcon, iconColor: 'text-destructive', bgColor: 'bg-destructive/10', title: 'Maintenance alert', desc: 'Vehicle TRK-002 is due for service', time: '15 min ago', status: 'warning' },
  { id: 3, icon: UsersIcon, iconColor: 'text-secondary-foreground', bgColor: 'bg-secondary', title: 'New driver assigned', desc: 'John Doe assigned to Vehicle TRK-003', time: '1 hour ago', status: 'info' },
  { id: 4, icon: WrenchIcon, iconColor: 'text-primary', bgColor: 'bg-primary/10', title: 'Maintenance completed', desc: 'Vehicle TRK-004 oil change done', time: '2 hours ago', status: 'success' },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your fleet today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <ClockIcon className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <TruckIcon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="flex items-center pt-1">
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                <PlusIcon className="h-3 w-3" /> +2
              </span>
              <span className="text-xs text-muted-foreground ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Vehicles</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="flex items-center pt-1">
              <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                <XCircleIcon className="h-3 w-3" /> -1
              </span>
              <span className="text-xs text-muted-foreground ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-lg">
              <WrenchIcon className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground">No change</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <div className="p-2 bg-secondary rounded-lg">
              <MapPinIcon className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <div className="flex items-center pt-1">
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                <PlusIcon className="h-3 w-3" /> +3
              </span>
              <span className="text-xs text-muted-foreground ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {vehicleStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Monthly Fuel Cost</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFuelCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Line type="monotone" dataKey="cost" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`p-2 ${activity.bgColor} rounded-full shrink-0`}>
                  <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Quick Actions & Trip Activity */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2">
                <TruckIcon className="h-4 w-4" />
                Add Vehicle
              </Button>
              <Button className="w-full justify-start gap-2" variant="secondary">
                <UsersIcon className="h-4 w-4" />
                Add Driver
              </Button>
              <Button className="w-full justify-start gap-2" variant="secondary">
                <MapPinIcon className="h-4 w-4" />
                Create Trip
              </Button>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Trip Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tripActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="trips" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
