"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Clock, MapPin, Car } from "lucide-react"
import { saveBooking } from "@/lib/booking-storage"

const carModels = ["Honda Amaze", "Honda Elevate", "Honda City", "Honda CR-V"]

const dealerships = ["Honda Showroom - Central Delhi", "Honda Showroom - Gurgaon", "Honda Showroom - Noida"]

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]

export function BookingSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carModel: "",
    dealership: "",
    date: "",
    timeSlot: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const booking = saveBooking({
        customer: formData.name,
        email: formData.email,
        phone: formData.phone,
        model: formData.carModel,
        dealership: formData.dealership,
        date: formData.date,
        time: formData.timeSlot,
        message: formData.message,
      })

      console.log("Booking saved:", booking)

      try {
        const emailResponse = await fetch("/api/send-confirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(booking),
        })

        const emailResult = await emailResponse.json()

        if (emailResult.success) {
          alert("Test drive booking submitted successfully! A confirmation email has been sent to your email address.")
        } else {
          alert(
            "Test drive booking submitted successfully! However, there was an issue sending the confirmation email.",
          )
        }
      } catch (emailError) {
        console.error("[v0] Email sending failed:", emailError)
        alert("Test drive booking submitted successfully! However, the confirmation email could not be sent.")
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        carModel: "",
        dealership: "",
        date: "",
        timeSlot: "",
        message: "",
      })
    } catch (error) {
      console.error("Error saving booking:", error)
      alert("There was an error submitting your booking. Please try again.")
    }
  }

  return (
    <section id="booking" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">Book Your Test Drive</h2>
            <p className="text-xl text-muted-foreground">Schedule your Honda experience in just a few simple steps</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Test Drive Booking Form</CardTitle>
              <CardDescription>Fill in your details and preferences to book your Honda test drive</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carModel">
                      <Car className="w-4 h-4 inline mr-2" />
                      Car Model
                    </Label>
                    <Select
                      value={formData.carModel}
                      onValueChange={(value) => setFormData({ ...formData, carModel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Honda model" />
                      </SelectTrigger>
                      <SelectContent>
                        {carModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dealership">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Dealership Location
                  </Label>
                  <Select
                    value={formData.dealership}
                    onValueChange={(value) => setFormData({ ...formData, dealership: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a dealership" />
                    </SelectTrigger>
                    <SelectContent>
                      {dealerships.map((dealership) => (
                        <SelectItem key={dealership} value={dealership}>
                          {dealership}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      <CalendarDays className="w-4 h-4 inline mr-2" />
                      Preferred Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeSlot">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Preferred Time
                    </Label>
                    <Select
                      value={formData.timeSlot}
                      onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any specific requirements or questions?"
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg py-6">
                  Book Test Drive
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
