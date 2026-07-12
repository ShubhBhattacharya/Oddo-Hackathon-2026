export type UserRole = 'FleetManager' | 'Dispatcher' | 'SafetyOfficer' | 'FinancialAnalyst'

export interface User {
  id: string
  email: string
  role: UserRole
  name?: string
}

export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired'
export type VehicleType = 'Truck' | 'Van' | 'Bus' | 'Trailer' | 'Other'

export interface Vehicle {
  id: string
  registrationNumber: string
  name: string
  model: string
  type: VehicleType
  maxLoadCapacity: number
  odometerReading: number
  acquisitionCost: number
  status: VehicleStatus
  createdAt: Date
  updatedAt: Date
}

export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended'
export type LicenseCategory = 'A' | 'B' | 'C' | 'D' | 'E'

export interface Driver {
  id: string
  name: string
  licenseNumber: string
  licenseCategory: LicenseCategory
  licenseExpiryDate: Date
  contactNumber: string
  safetyScore: number
  status: DriverStatus
  createdAt: Date
  updatedAt: Date
}

export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled'

export interface Trip {
  id: string
  source: string
  destination: string
  vehicleId: string
  driverId: string
  cargoWeight: number
  plannedDistance: number
  revenue: number
  status: TripStatus
  createdAt: Date
  updatedAt: Date
}

export type MaintenanceStatus = 'Open' | 'Closed'

export interface Maintenance {
  id: string
  vehicleId: string
  type: string
  description: string
  cost: number
  date: Date
  status: MaintenanceStatus
  createdAt: Date
  updatedAt: Date
}

export interface FuelLog {
  id: string
  vehicleId: string
  liters: number
  cost: number
  date: Date
  createdAt: Date
  updatedAt: Date
}

export type ExpenseType = 'Toll' | 'Repair' | 'Maintenance' | 'Other'

export interface Expense {
  id: string
  vehicleId: string
  type: ExpenseType
  amount: number
  date: Date
  description?: string
  createdAt: Date
  updatedAt: Date
}
