export interface Booking {
  id: string
  customer: string
  email: string
  phone: string
  model: string
  dealership: string
  branch: "Noida" | "Gurgaon" | "Central Delhi"
  date: string
  time: string
  message?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
}

export const getBranchFromDealership = (dealership: string): "Noida" | "Gurgaon" | "Central Delhi" => {
  if (dealership.includes("Noida")) return "Noida"
  if (dealership.includes("Gurgaon")) return "Gurgaon"
  if (dealership.includes("Central Delhi")) return "Central Delhi"
  return "Central Delhi" // default fallback
}

export const getBookings = (): Booking[] => {
  if (typeof window === "undefined") return []
  const bookings = localStorage.getItem("honda-bookings")
  return bookings ? JSON.parse(bookings) : []
}

export const getBookingsByBranch = (branch: string): Booking[] => {
  return getBookings().filter((booking) => booking.branch === branch)
}

export const saveBooking = (booking: Omit<Booking, "id" | "createdAt" | "status" | "branch">): Booking => {
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    status: "pending",
    branch: getBranchFromDealership(booking.dealership),
    createdAt: new Date().toISOString(),
  }

  const bookings = getBookings()
  bookings.unshift(newBooking)
  localStorage.setItem("honda-bookings", JSON.stringify(bookings))

  return newBooking
}

export const updateBookingStatus = (id: string, status: Booking["status"]): void => {
  const bookings = getBookings()
  const bookingIndex = bookings.findIndex((b) => b.id === id)
  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = status
    localStorage.setItem("honda-bookings", JSON.stringify(bookings))
  }
}
