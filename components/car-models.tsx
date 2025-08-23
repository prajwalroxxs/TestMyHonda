"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const carModels = [
  {
    name: "Honda Amaze",
    type: "Compact Sedan",
    engine: "1.2L i-VTEC Petrol",
    mileage: "18.6 – 19.5 km/l",
    features: ["Spacious cabin", "Dual airbags", "7-inch touchscreen", "Cruise control"],
    highlight: "Perfect for urban commutes with comfort + efficiency",
    image: "/honda-amaze-silver.png",
  },
  {
    name: "Honda Elevate",
    type: "Subcompact SUV",
    engine: "1.5L i-VTEC Petrol",
    mileage: "15.3 – 16.9 km/l",
    features: ["Honda Sensing ADAS", "10.25-inch touchscreen", "Wireless connectivity", "18-inch alloys"],
    highlight: "SUV comfort + advanced driver assistance features",
    image: "/white-honda-elevate-suv.png",
  },
  {
    name: "Honda City",
    type: "Mid-Size Sedan",
    engine: "1.5L i-VTEC DOHC Petrol",
    mileage: "17.8 – 18.4 km/l",
    features: ["Honda LaneWatch", "Honda Sensing ADAS", "Sunroof", "Ventilated seats"],
    highlight: "Blend of luxury, technology, and performance",
    image: "/honda-city-red.webp",
  },
  {
    name: "Honda CR-V",
    type: "Premium SUV",
    engine: "1.5L VTEC Turbo Petrol (MT & CVT), Hybrid variant",
    mileage: "14–15 km/l",
    features: ["Spacious 5/7-seater SUV", "Panoramic sunroof", "Honda Sensing ADAS", "Wireless CarPlay/Android Auto"],
    highlight: "For customers seeking luxury, space, and SUV capability",
    isPremium: true,
    image: "/red-honda-crv-premium-suv.png",
  },
]

export function CarModels() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section id="models" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4 animate-in slide-in-from-bottom-4 duration-700">
            Choose Your Honda Model
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-200">
            Explore our range of vehicles and find the perfect Honda for your lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {carModels.map((car, index) => (
            <Card
              key={index}
              className={`h-full transition-all duration-500 cursor-pointer group animate-in slide-in-from-bottom-4 ${
                hoveredCard === index ? "shadow-2xl scale-105 -translate-y-2" : "hover:shadow-lg hover:scale-102"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  className={`w-full h-48 object-cover transition-transform duration-700 ${
                    hoveredCard === index ? "scale-110" : "scale-100"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${
                    hoveredCard === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="font-heading text-xl group-hover:text-primary transition-colors">
                    {car.name}
                  </CardTitle>
                  {car.isPremium && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 animate-pulse">
                      Premium
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-muted-foreground">{car.type}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Engine: {car.engine}</p>
                  <p className="text-sm font-medium text-primary">Mileage: {car.mileage}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Key Features:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {car.features.slice(0, 3).map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center group-hover:translate-x-1 transition-transform duration-300"
                        style={{ transitionDelay: `${idx * 50}ms` }}
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm text-muted-foreground italic border-t pt-3 group-hover:text-foreground transition-colors">
                  {car.highlight}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
