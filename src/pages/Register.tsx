import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TruckIcon, ArrowRight, Loader2, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import type { UserRole } from '@/types'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('FleetManager')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        name,
        role,
        createdAt: new Date(),
      })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Decorative Image/Brand area */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 overflow-hidden items-center justify-center">
        {/* Background image */}
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10" />
        
        <div className="relative z-20 flex flex-col items-center justify-center p-12 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/30">
                <TruckIcon className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">TransitOps</h1>
            </div>
            <h2 className="text-2xl font-medium text-zinc-300 mb-4 max-w-md mx-auto">
              Join the future of fleet management.
            </h2>
            <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Create an account to monitor, track, and optimize your transportation logistics in real-time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        <Link 
          to="/" 
          className="absolute top-6 left-6 lg:top-12 lg:left-12 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors z-50"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full max-w-sm xl:max-w-md space-y-8 my-12"
        >
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">Create account</h2>
            <p className="text-muted-foreground">
              Sign up for your TransitOps account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-muted/50 focus-visible:ring-primary/50 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-muted/50 focus-visible:ring-primary/50 text-base"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-muted/50 focus-visible:ring-primary/50 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="flex h-12 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                >
                  <option value="FleetManager">Fleet Manager</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="SafetyOfficer">Safety Officer</option>
                  <option value="FinancialAnalyst">Financial Analyst</option>
                </select>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20"
              >
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-white text-zinc-950 hover:bg-zinc-200 border border-zinc-200 shadow-sm text-base font-medium transition-all group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground pt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
