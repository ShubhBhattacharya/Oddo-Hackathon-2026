import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import {
  TruckIcon,
  UsersIcon,
  MapPinIcon,
  WrenchIcon,
  FuelIcon,
  DollarSignIcon,
  BarChart3Icon,
  LogOutIcon,
  HomeIcon,
  BellIcon,
} from 'lucide-react'

const navItems = [
  { title: 'Dashboard', icon: HomeIcon, to: '/dashboard', roles: ['FleetManager', 'Dispatcher', 'SafetyOfficer', 'FinancialAnalyst'] },
  { title: 'Vehicles', icon: TruckIcon, to: '/dashboard/vehicles', roles: ['FleetManager'] },
  { title: 'Drivers', icon: UsersIcon, to: '/dashboard/drivers', roles: ['FleetManager', 'SafetyOfficer', 'Dispatcher'] },
  { title: 'Trips', icon: MapPinIcon, to: '/dashboard/trips', roles: ['Dispatcher', 'FleetManager'] },
  { title: 'Maintenance', icon: WrenchIcon, to: '/dashboard/maintenance', roles: ['FleetManager'] },
  { title: 'Fuel', icon: FuelIcon, to: '/dashboard/fuel', roles: ['FleetManager', 'FinancialAnalyst'] },
  { title: 'Expenses', icon: DollarSignIcon, to: '/dashboard/expenses', roles: ['FleetManager', 'FinancialAnalyst'] },
  { title: 'Reports', icon: BarChart3Icon, to: '/dashboard/reports', roles: ['FleetManager', 'FinancialAnalyst'] },
]

export default function Sidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  if (!user) return null

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role))

  return (
    <aside className="w-64 bg-card border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TruckIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold">TransitOps</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="mb-4">
          <p className="text-sm font-medium">{user.name || user.email}</p>
          <p className="text-xs text-muted-foreground">{user.role}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOutIcon className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
