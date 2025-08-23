import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/honda-logo-clean.png"
                alt="Honda Logo - How we move you"
                width={280}
                height={80}
                className="h-18 w-auto"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#models" className="text-muted-foreground hover:text-foreground transition-colors">
                Models
              </Link>
              <Link href="/manager-auth" className="text-muted-foreground hover:text-foreground transition-colors">
                Manager Portal
              </Link>
            </nav>

            <Button asChild>
              <Link href="#booking">Book Test Drive</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
