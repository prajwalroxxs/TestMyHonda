import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const booking = await request.json()

    // In a real application, you would integrate with an email service like Resend, SendGrid, or Nodemailer
    // For now, we'll simulate the email sending and log the details

    const emailContent = {
      to: booking.email,
      subject: "Honda Test Drive Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Honda Test Drive Confirmed</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Dear ${booking.customer},</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thank you for booking a test drive with Honda! We're excited to help you experience our latest vehicles.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #1f2937; margin-top: 0;">Booking Details:</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li><strong>Vehicle:</strong> ${booking.model}</li>
                <li><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</li>
                <li><strong>Time:</strong> ${booking.time}</li>
                <li><strong>Location:</strong> ${booking.dealership}</li>
                <li><strong>Phone:</strong> ${booking.phone}</li>
              </ul>
              ${booking.message ? `<p><strong>Your Message:</strong> ${booking.message}</p>` : ""}
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-weight: 500;">
                📋 Please bring a valid driver's license for your test drive.
              </p>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Our team will contact you shortly to confirm the appointment. If you need to reschedule or have any questions, please don't hesitate to reach out.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280;">
                Thank you for choosing Honda!<br>
                <strong>The Power of Dreams</strong>
              </p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              This is an automated confirmation email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    }

    // Log the email that would be sent (in production, replace with actual email service)
    console.log("[v0] Email confirmation would be sent:", emailContent)

    // Simulate successful email sending
    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully",
      emailPreview: emailContent,
    })
  } catch (error) {
    console.error("[v0] Error sending confirmation email:", error)
    return NextResponse.json({ success: false, message: "Failed to send confirmation email" }, { status: 500 })
  }
}
