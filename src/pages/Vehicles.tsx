import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from 'lucide-react'

const mockVehicles = [
  { id: '1', registrationNumber: 'TRK-001', name: 'Truck 1', model: 'Ford F-150', type: 'Truck', maxLoadCapacity: 5000, odometerReading: 120000, acquisitionCost: 45000, status: 'Available' },
  { id: '2', registrationNumber: 'TRK-002', name: 'Truck 2', model: 'Chevrolet Silverado', type: 'Truck', maxLoadCapacity: 6000, odometerReading: 85000, acquisitionCost: 52000, status: 'On Trip' },
  { id: '3', registrationNumber: 'TRK-003', name: 'Truck 3', model: 'Ram 1500', type: 'Truck', maxLoadCapacity: 5500, odometerReading: 150000, acquisitionCost: 48000, status: 'In Shop' },
]

export default function Vehicles() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vehicles</h1>
          <p className="text-muted-foreground">Manage your fleet of vehicles</p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search vehicles..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                  <TableCell>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.status === 'Available' ? 'default' : vehicle.status === 'On Trip' ? 'secondary' : 'destructive'}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
