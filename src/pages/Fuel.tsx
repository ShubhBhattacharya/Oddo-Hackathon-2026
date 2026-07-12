import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from 'lucide-react'

const mockFuelLogs = [
  { id: '1', vehicle: 'TRK-001', liters: 100, cost: 350, date: '2026-07-11' },
  { id: '2', vehicle: 'TRK-002', liters: 120, cost: 420, date: '2026-07-10' },
]

export default function Fuel() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fuel</h1>
          <p className="text-muted-foreground">Track fuel usage and costs</p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Fuel Log
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search fuel logs..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Liters</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFuelLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.vehicle}</TableCell>
                  <TableCell>{log.liters} L</TableCell>
                  <TableCell>${log.cost}</TableCell>
                  <TableCell>{log.date}</TableCell>
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
