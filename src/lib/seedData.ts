import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export const sampleVehicles = [
  {
    registrationNumber: 'TRK-001',
    name: 'Ford F-150',
    model: 'Ford F-150 XL',
    type: 'Truck',
    maxLoadCapacity: 5000,
    odometerReading: 125000,
    acquisitionCost: 45000,
    status: 'Available',
  },
  {
    registrationNumber: 'TRK-002',
    name: 'Chevrolet Silverado',
    model: 'Chevrolet Silverado 1500',
    type: 'Truck',
    maxLoadCapacity: 6000,
    odometerReading: 85000,
    acquisitionCost: 52000,
    status: 'On Trip',
  },
  {
    registrationNumber: 'VAN-001',
    name: 'Mercedes Sprinter',
    model: 'Mercedes-Benz Sprinter',
    type: 'Van',
    maxLoadCapacity: 3500,
    odometerReading: 62000,
    acquisitionCost: 38000,
    status: 'Available',
  },
  {
    registrationNumber: 'TRK-003',
    name: 'Ram 1500',
    model: 'Ram 1500 Big Horn',
    type: 'Truck',
    maxLoadCapacity: 5500,
    odometerReading: 150000,
    acquisitionCost: 48000,
    status: 'In Shop',
  },
  {
    registrationNumber: 'BUS-001',
    name: 'Toyota Coaster',
    model: 'Toyota Coaster',
    type: 'Bus',
    maxLoadCapacity: 2000,
    odometerReading: 98000,
    acquisitionCost: 65000,
    status: 'Available',
  },
]

export const sampleDrivers = [
  {
    name: 'Rajesh Kumar',
    licenseNumber: 'DL-12-CD-2018-0012345',
    licenseCategory: 'B',
    licenseExpiryDate: new Date(2028, 5, 15),
    contactNumber: '+91-98765-43210',
    safetyScore: 95,
    status: 'Available',
  },
  {
    name: 'Amit Singh',
    licenseNumber: 'DL-05-AB-2019-0067890',
    licenseCategory: 'C',
    licenseExpiryDate: new Date(2027, 11, 20),
    contactNumber: '+91-98765-09876',
    safetyScore: 88,
    status: 'On Trip',
  },
  {
    name: 'Priya Sharma',
    licenseNumber: 'DL-04-DE-2020-0011223',
    licenseCategory: 'B',
    licenseExpiryDate: new Date(2029, 3, 10),
    contactNumber: '+91-98765-56789',
    safetyScore: 92,
    status: 'Off Duty',
  },
  {
    name: 'Vikram Patel',
    licenseNumber: 'DL-10-FG-2017-0044556',
    licenseCategory: 'A',
    licenseExpiryDate: new Date(2026, 8, 25),
    contactNumber: '+91-98765-65432',
    safetyScore: 85,
    status: 'Available',
  },
]

export const sampleTrips = [
  {
    source: 'Mumbai',
    destination: 'Pune',
    vehicleId: 'TRK-002',
    driverId: 'Amit Singh',
    cargoWeight: 4500,
    plannedDistance: 150,
    revenue: 8500,
    status: 'Dispatched',
  },
  {
    source: 'Delhi',
    destination: 'Agra',
    vehicleId: 'TRK-001',
    driverId: 'Rajesh Kumar',
    cargoWeight: 3000,
    plannedDistance: 200,
    revenue: 12000,
    status: 'Completed',
  },
  {
    source: 'Bangalore',
    destination: 'Chennai',
    vehicleId: 'VAN-001',
    driverId: 'Priya Sharma',
    cargoWeight: 2500,
    plannedDistance: 350,
    revenue: 18000,
    status: 'Draft',
  },
]

export const sampleMaintenance = [
  {
    vehicleId: 'TRK-003',
    type: 'Oil Change',
    description: 'Regular oil change and filter replacement',
    cost: 2500,
    date: new Date(2026, 6, 10),
    status: 'Open',
  },
  {
    vehicleId: 'TRK-001',
    type: 'Tire Rotation',
    description: 'Tire rotation and alignment check',
    cost: 1500,
    date: new Date(2026, 5, 25),
    status: 'Closed',
  },
]

export const sampleFuelLogs = [
  {
    vehicleId: 'TRK-001',
    liters: 50,
    cost: 5000,
    date: new Date(2026, 6, 10),
  },
  {
    vehicleId: 'TRK-002',
    liters: 60,
    cost: 6000,
    date: new Date(2026, 6, 9),
  },
  {
    vehicleId: 'VAN-001',
    liters: 40,
    cost: 4000,
    date: new Date(2026, 6, 8),
  },
]

export const sampleExpenses = [
  {
    vehicleId: 'TRK-001',
    type: 'Toll',
    amount: 1200,
    date: new Date(2026, 6, 10),
    description: 'Mumbai-Pune Expressway toll',
  },
  {
    vehicleId: 'TRK-002',
    type: 'Repair',
    amount: 5500,
    date: new Date(2026, 6, 7),
    description: 'Brake pad replacement',
  },
]

export async function seedFirestore() {
  try {
    console.log('Seeding Firestore...')

    // Add Vehicles
    for (const vehicle of sampleVehicles) {
      await addDoc(collection(db, 'vehicles'), {
        ...vehicle,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    console.log('Vehicles added!')

    // Add Drivers
    for (const driver of sampleDrivers) {
      await addDoc(collection(db, 'drivers'), {
        ...driver,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    console.log('Drivers added!')

    // Add Trips
    for (const trip of sampleTrips) {
      await addDoc(collection(db, 'trips'), {
        ...trip,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    console.log('Trips added!')

    // Add Maintenance
    for (const maintenance of sampleMaintenance) {
      await addDoc(collection(db, 'maintenance'), {
        ...maintenance,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    console.log('Maintenance added!')

    // Add Fuel Logs
    for (const fuel of sampleFuelLogs) {
      await addDoc(collection(db, 'fuelLogs'), {
        ...fuel,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    console.log('Fuel Logs added!')

    // Add Expenses
    for (const expense of sampleExpenses) {
      await addDoc(collection(db, 'expenses'), {
        ...expense,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    console.log('Expenses added!')

    console.log('Firestore seeded successfully!')
  } catch (error) {
    console.error('Error seeding Firestore:', error)
  }
}
