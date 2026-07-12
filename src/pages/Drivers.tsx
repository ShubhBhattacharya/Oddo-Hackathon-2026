import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from 'lucide-react'

const mockDrivers = [
  { id: '1', name: 'John Doe', licenseNumber: 'DL-1234', licenseCategory: 'C', licenseExpiryDate: '2026-12-31', contactNumber: '+1 234 567 8900', safetyScore: 95, status: 'Available' },
  { id: '2', name: 'Jane Smith', licenseNumber: 'DL-5678', licenseCategory: 'B', licenseExpiryDate: '2025-06-15', contactNumber: '+1 234 567 8901', safetyScore: 88, status: 'On Trip' },
  { id: '3', name: 'Bob Johnson', licenseNumber: 'DL-9012', licenseCategory: 'D', licenseExpiryDate: '2027-03-20', contactNumber: '+1 234 567 8902', safetyScore: 92, status: 'Off Duty' },
]

export default function Drivers() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drivers</h1>
          <p className="text-muted-foreground">Manage your drivers</p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search drivers..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>{driver.licenseCategory}</TableCell>
                  <TableCell>{driver.licenseExpiryDate}</TableCell>
                  <TableCell>
                    <Badge variant={driver.status === 'Available' ? 'default' : driver.status === 'On Trip' ? 'secondary' : 'outline'}>
                      {driver.status}
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
