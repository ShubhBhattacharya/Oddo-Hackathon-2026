import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BellIcon,
  UserIcon,
  PaletteIcon,
  BuildingIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Settings */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BuildingIcon className="h-5 w-5 text-primary" />
              <CardTitle>Company Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="TransitOps Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input id="companyEmail" type="email" defaultValue="contact@transitops.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
            <Button className="w-full sm:w-auto">Save Company Settings</Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-primary" />
              <CardTitle>Account Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={user.role} disabled />
            </div>
            <Button className="w-full sm:w-auto">Update Account</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BellIcon className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Trip Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when a trip status changes</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full flex items-center px-1">
                <div className="h-4 w-4 bg-white rounded-full translate-x-5 transition-all" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminders for upcoming maintenance</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full flex items-center px-1">
                <div className="h-4 w-4 bg-white rounded-full translate-x-5 transition-all" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Driver Safety Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified of low driver safety scores</p>
              </div>
              <div className="h-6 w-11 bg-muted rounded-full flex items-center px-1">
                <div className="h-4 w-4 bg-white rounded-full transition-all" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <PaletteIcon className="h-5 w-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
