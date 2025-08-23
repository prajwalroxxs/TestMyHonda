"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, CheckCircle } from "lucide-react"
import type { Booking } from "@/lib/booking-storage"

interface CustomerFeedbackFormProps {
  isOpen: boolean
  onClose: () => void
  customer: Booking
}

const feedbackQuestions = [
  "How satisfied were you with the vehicle's performance during the test drive?",
  "How would you rate the comfort and interior quality of the Honda vehicle?",
  "How satisfied were you with the staff's knowledge and assistance?",
  "How would you rate the overall dealership experience?",
  "How likely are you to recommend Honda to friends and family?",
  "How satisfied were you with the booking and scheduling process?",
  "How would you rate the vehicle's features and technology?",
]

export function CustomerFeedbackForm({ isOpen, onClose, customer }: CustomerFeedbackFormProps) {
  const [ratings, setRatings] = useState<number[]>(new Array(7).fill(0))
  const [comments, setComments] = useState("")
  const [isFilled, setIsFilled] = useState(false)
  const [existingFeedback, setExistingFeedback] = useState<any>(null)

  useEffect(() => {
    if (isOpen && customer) {
      const existingFeedback = JSON.parse(localStorage.getItem("customer-feedback") || "[]")
      const customerFeedback = existingFeedback.find((f: any) => f.customerId === customer.id)

      if (customerFeedback) {
        setIsFilled(true)
        setExistingFeedback(customerFeedback)
        setRatings(customerFeedback.ratings)
        setComments(customerFeedback.comments || "")
      } else {
        setIsFilled(false)
        setExistingFeedback(null)
        setRatings(new Array(7).fill(0))
        setComments("")
      }
    }
  }, [isOpen, customer])

  const handleRatingChange = (questionIndex: number, rating: number) => {
    if (isFilled) return

    const newRatings = [...ratings]
    newRatings[questionIndex] = rating
    setRatings(newRatings)
  }

  const handleSubmit = () => {
    if (isFilled) {
      onClose()
      return
    }

    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length

    // Store feedback data
    const feedbackData = {
      customerId: customer.id,
      customerName: customer.customer,
      ratings,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      comments,
      date: new Date().toISOString(),
      branch: customer.branch,
    }

    // Save to localStorage
    const existingFeedback = JSON.parse(localStorage.getItem("customer-feedback") || "[]")
    existingFeedback.push(feedbackData)
    localStorage.setItem("customer-feedback", JSON.stringify(existingFeedback))

    setIsFilled(true)
    setExistingFeedback(feedbackData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Customer Feedback - {customer.customer}
            {isFilled && <CheckCircle className="h-5 w-5 text-green-500" />}
          </DialogTitle>
          <DialogDescription>
            {isFilled ? (
              <span className="text-green-600 font-medium">
                ✓ Feedback completed on {existingFeedback ? new Date(existingFeedback.date).toLocaleDateString() : ""}
              </span>
            ) : (
              `Collect feedback for ${customer.model} test drive on ${customer.date}`
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {feedbackQuestions.map((question, index) => (
            <div key={index} className="space-y-2">
              <Label className="text-sm font-medium">
                {index + 1}. {question}
              </Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(index, star)}
                    disabled={isFilled}
                    className={`p-1 transition-transform ${
                      isFilled ? "cursor-not-allowed" : "hover:scale-110 cursor-pointer"
                    }`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= ratings[index]
                          ? "fill-yellow-400 text-yellow-400"
                          : isFilled
                            ? "text-gray-200"
                            : "text-gray-300 hover:text-yellow-400"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {ratings[index] > 0 ? `${ratings[index]}/5` : "Not rated"}
                </span>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Any additional feedback or comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={isFilled}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              {isFilled ? "Close" : "Cancel"}
            </Button>
            {!isFilled && <Button onClick={handleSubmit}>Submit Feedback</Button>}
            {isFilled && (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle className="h-4 w-4" />
                Feedback Submitted
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
