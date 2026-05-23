import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");

function getStatusText(status: string) {
  if (status === "processing") {
    return "Your order is now being prepared by Ressential.";
  }

  if (status === "completed") {
    return "Your order has been completed. Thank you for choosing Ressential.";
  }

  if (status === "cancelled") {
    return "Your order has been cancelled. Please contact Ressential if you need more information.";
  }

  return `Your order status has been updated to ${status}.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { customerEmail, customerName, orderId, status } = body;

    if (!customerEmail || !orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const shortId = String(orderId).slice(0, 8).toUpperCase();

    const data = await resend.emails.send({
      from: "Ressential Orders <onboarding@resend.dev>",
      to: customerEmail,
      subject: `Order #${shortId} status update`,
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h1>Order Status Update</h1>

          <p>Hello ${customerName || "there"},</p>

          <p>
            Your order <strong>#${shortId}</strong> status has changed to:
          </p>

          <p style="font-size:22px;font-weight:bold;text-transform:capitalize;">
            ${status}
          </p>

          <p>${getStatusText(status)}</p>

          <p style="margin-top:30px;">
            Thank you,<br/>
            Ressential
          </p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Status email failed" },
      { status: 500 }
    );
  }
}