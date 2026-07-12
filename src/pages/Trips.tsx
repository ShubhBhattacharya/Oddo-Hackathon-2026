import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from 'lucide-react'

const mockTrips = [
  { id: '1', source: 'New York', destination: 'Los Angeles', vehicle: 'TRK-001', driver: 'John Doe', cargoWeight: 4500, plannedDistance: 2800, revenue: 5000, status: 'Dispatched' },
  { id: '2', source: 'Chicago', destination: 'Houston', vehicle: 'TRK-002', driver: 'Jane Smith', cargoWeight: 5500, plannedDistance: 1100, revenue: 2500, status: 'Completed' },
  { id: '3', source: 'Miami', destination: 'Atlanta', vehicle: 'TRK-003', driver: 'Bob Johnson', cargoWeight: 4000, plannedDistance: 600, revenue: 1500, status: 'Draft' },
]

export default function Trips() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trips</h1>
          <p className="text-muted-foreground">Manage your trips</p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Trip
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search trips..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.source}</TableCell>
                  <TableCell>{trip.destination}</TableCell>
                  <TableCell>{trip.vehicle}</TableCell>
                  <TableCell>{trip.driver}</TableCell>
                  <TableCell>
                    <Badge variant={trip.status === 'Completed' ? 'default' : trip.status === 'Dispatched' ? 'secondary' : 'outline'}>
                      {trip.status}
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
