"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Users, Star, TrendingUp, Download, Car, LogOut } from "lucide-react"
import { getBookingsByBranch, updateBookingStatus, type Booking } from "@/lib/booking-storage"
import { getManagerSession, logoutManager, type ManagerSession } from "@/lib/manager-auth"
import { CustomerFeedbackForm } from "./customer-feedback-form"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const COLORS = ["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d"]

export function ManagerDashboard() {
  const router = useRouter()
  const [manager, setManager] = useState<ManagerSession | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Booking | null>(null)
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false)
  const [customerFeedback, setCustomerFeedback] = useState<any[]>([])

  useEffect(() => {
    const session = getManagerSession()
    if (!session) {
      router.push("/manager-auth")
      return
    }
    setManager(session)

    const branchBookings = getBookingsByBranch(session.branch)
    setBookings(branchBookings)

    const feedback = JSON.parse(localStorage.getItem("customer-feedback") || "[]")
    setCustomerFeedback(feedback.filter((f: any) => f.branch === session.branch))
  }, [router])

  const handleLogout = () => {
    logoutManager()
    router.push("/manager-auth")
  }

  const handleStatusUpdate = (bookingId: string, newStatus: Booking["status"]) => {
    updateBookingStatus(bookingId, newStatus)
    if (manager) {
      setBookings(getBookingsByBranch(manager.branch))
    }
  }

  const handleCustomerClick = (booking: Booking) => {
    setSelectedCustomer(booking)
    setIsFeedbackFormOpen(true)
  }

  const getCustomerAverageRating = (customerId: string) => {
    const feedback = customerFeedback.find((f) => f.customerId === customerId)
    return feedback ? feedback.averageRating : null
  }

  const getPieChartData = () => {
    const modelCounts = bookings.reduce(
      (acc, booking) => {
        acc[booking.model] = (acc[booking.model] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(modelCounts)
      .map(([model, count]) => ({
        name: model,
        value: count,
        percentage: bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }

  if (!manager) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-xl">Honda Manager Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {manager.name} - {manager.branch} Branch
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">{manager.branch} branch bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(bookings.map((b) => b.email)).size}</div>
              <p className="text-xs text-muted-foreground">Unique customers in {manager.branch}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Branch</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{manager.branch}</div>
              <p className="text-xs text-muted-foreground">Your assigned branch</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.filter((b) => b.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
            <TabsTrigger value="analytics">Popular Models</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Test Drive Bookings</CardTitle>
                  <CardDescription>Latest customer bookings for {manager.branch} branch</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No bookings for {manager.branch} branch yet.</p>
                      <p className="text-sm mt-2">Customer bookings for your branch will appear here.</p>
                    </div>
                  ) : (
                    bookings.slice(0, 10).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{booking.customer}</p>
                          <p className="text-sm text-muted-foreground">{booking.model}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.date} at {booking.time}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.email} • {booking.phone}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {booking.status}
                          </Badge>
                          {booking.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusUpdate(booking.id, "confirmed")
                              }}
                            >
                              Confirm
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Customer Feedback</CardTitle>
                  <CardDescription>
                    Reviews and ratings from test drive customers - Click on customers to add feedback
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No customer feedback available yet.</p>
                      <p className="text-sm mt-2">Customer feedback will appear here after test drives.</p>
                    </div>
                  ) : (
                    bookings.map((booking) => {
                      const averageRating = getCustomerAverageRating(booking.id)

                      return (
                        <div
                          key={booking.id}
                          className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleCustomerClick(booking)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <p className="font-medium">{booking.customer}</p>
                              {averageRating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium text-yellow-600">{averageRating}/5</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < (averageRating || booking.rating || 0) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{booking.model}</p>
                          <p className="text-sm">{booking.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2 opacity-70">
                            {averageRating ? "Click to view/edit feedback" : "Click to add detailed feedback"}
                          </p>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Model Popularity Distribution</CardTitle>
                  <CardDescription>Visual breakdown of test drive bookings by Honda model</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const pieData = getPieChartData()

                    if (pieData.length === 0) {
                      return (
                        <div className="text-center py-8 text-muted-foreground">
                          <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No booking data available yet.</p>
                        </div>
                      )
                    }

                    return (
                      <ChartContainer
                        config={{
                          bookings: {
                            label: "Bookings",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percentage }) => `${name} (${percentage}%)`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload
                                  return (
                                    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                                      <p className="font-medium">{data.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {data.value} bookings ({data.percentage}%)
                                      </p>
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Honda Models</CardTitle>
                  <CardDescription>Test drive booking statistics by model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const modelCounts = bookings.reduce(
                        (acc, booking) => {
                          acc[booking.model] = (acc[booking.model] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      )

                      const totalBookings = bookings.length
                      const modelStats = Object.entries(modelCounts)
                        .map(([model, count]) => ({
                          model,
                          bookings: count,
                          percentage: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
                        }))
                        .sort((a, b) => b.bookings - a.bookings)

                      if (modelStats.length === 0) {
                        return (
                          <div className="text-center py-8 text-muted-foreground">
                            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No booking data available yet.</p>
                          </div>
                        )
                      }

                      return modelStats.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Car className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{item.model}</p>
                              <p className="text-sm text-muted-foreground">{item.bookings} bookings</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{item.percentage}%</span>
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {selectedCustomer && (
        <CustomerFeedbackForm
          isOpen={isFeedbackFormOpen}
          onClose={() => {
            setIsFeedbackFormOpen(false)
            setSelectedCustomer(null)
          }}
          customer={selectedCustomer}
        />
      )}
    </div>
  )
}
