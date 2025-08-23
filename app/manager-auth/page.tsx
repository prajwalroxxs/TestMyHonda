"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import { saveManager, loginManager, getManagerSession, getAvailableBranches } from "@/lib/manager-auth"

export default function ManagerAuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [availableBranches, setAvailableBranches] = useState<string[]>([])

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    branch: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Check if already logged in
    const session = getManagerSession()
    if (session) {
      router.push("/manager")
      return
    }

    // Load available branches
    setAvailableBranches(getAvailableBranches())
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const result = loginManager(loginData.email, loginData.password)

    if (result.success) {
      setMessageType("success")
      setMessage(result.message)
      setTimeout(() => {
        router.push("/manager")
      }, 1000)
    } else {
      setMessageType("error")
      setMessage(result.message)
    }

    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (signupData.password !== signupData.confirmPassword) {
      setMessageType("error")
      setMessage("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (signupData.password.length < 6) {
      setMessageType("error")
      setMessage("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    const result = saveManager({
      name: signupData.name,
      email: signupData.email,
      branch: signupData.branch as any,
      password: signupData.password,
    })

    if (result.success) {
      setMessageType("success")
      setMessage(result.message)
      setAvailableBranches(getAvailableBranches())
      setSignupData({
        name: "",
        email: "",
        branch: "",
        password: "",
        confirmPassword: "",
      })
    } else {
      setMessageType("error")
      setMessage(result.message)
    }

    setIsLoading(false)
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed opacity-95"
          style={{
            backgroundImage: "url(/honda-sports-car-bg.jpg)",
            backgroundAttachment: "fixed",
            imageRendering: "crisp-edges",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/20 via-white/15 to-slate-100/25" />
        <div className="absolute inset-0 opacity-2">
          <div className="absolute top-10 left-10 w-32 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-lg animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-18 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg animate-pulse delay-2000"></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-lg animate-pulse delay-3000"></div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToHome}
        className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md hover:bg-white/95 transition-all duration-200 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Booking
      </Button>

      <Card className="w-full max-w-md relative z-10 bg-white/90 backdrop-blur-md shadow-2xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">Manager Portal</CardTitle>
          <CardDescription>Access your Honda branch dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-branch">Branch</Label>
                  <Select
                    value={signupData.branch}
                    onValueChange={(value) => setSignupData((prev) => ({ ...prev, branch: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBranches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availableBranches.length === 0 && (
                    <p className="text-sm text-muted-foreground">All branches have managers assigned</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || availableBranches.length === 0}>
                  {isLoading ? "Creating Account..." : "Create Manager Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {message && (
            <Alert className={`mt-4 ${messageType === "error" ? "border-destructive" : "border-green-500"}`}>
              <AlertDescription className={messageType === "error" ? "text-destructive" : "text-green-600"}>
                {message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
