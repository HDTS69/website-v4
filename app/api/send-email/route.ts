import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, services, preferredTime, message } = body;

    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Send email to customer
    const customerData = await resend.emails.send({
      from: 'HD Trade Services <bookings@hdtradeservices.com.au>',
      to: [email],
      subject: 'Your Booking with HD Trade Services',
      html: `
        <div>
          <h1>Thank you for your booking, ${name}!</h1>
          <p>We've received your service request and our team will be in touch shortly to confirm your appointment.</p>
          <h2>Your Booking Details:</h2>
          <ul>
            <li><strong>Service:</strong> ${services}</li>
            <li><strong>Preferred Time:</strong> ${preferredTime}</li>
            <li><strong>Address:</strong> ${address}</li>
          </ul>
          <p>If you need to make any changes to your booking, please contact us at <a href="tel:1300889528">1300 889 528</a>.</p>
          <p>Thank you for choosing HD Trade Services!</p>
        </div>
      `,
    });

    // Send notification to staff
    const staffData = await resend.emails.send({
      from: 'HD Trade Services <bookings@hdtradeservices.com.au>',
      to: ['admin@hdtradeservices.com.au'],
      subject: 'New Booking Received',
      html: `
        <div>
          <h1>New Booking Received</h1>
          <h2>Customer Details:</h2>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Address:</strong> ${address}</li>
            <li><strong>Service:</strong> ${services}</li>
            <li><strong>Preferred Time:</strong> ${preferredTime}</li>
            <li><strong>Message:</strong> ${message || 'No message provided'}</li>
          </ul>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true,
      customerEmail: customerData,
      staffEmail: staffData
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 