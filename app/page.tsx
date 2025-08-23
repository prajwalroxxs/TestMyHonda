import { Header } from "../components/header"
import { HeroSection } from "../components/hero-section"
import { CarModels } from "../components/car-models"
import { BookingSection } from "../components/booking-section"
import { Footer } from "../components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-75 bg-fixed"
          style={{
            backgroundImage: "url(/honda-sports-car-bg.jpg)",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            imageRendering: "crisp-edges",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/70" />
      </div>

      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <CarModels />
          <BookingSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
