import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      total,
      items,
      address,
      city,
      country,
    } = body;

    const itemsHtml = items
      .map(
        (item: any) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee;">
              ${item.name}
            </td>

            <td style="padding:10px;border-bottom:1px solid #eee;">
              ${item.quantity}
            </td>

            <td style="padding:10px;border-bottom:1px solid #eee;">
              €${Number(item.price).toFixed(2)}
            </td>
          </tr>
        `
      )
      .join("");

    const data = await resend.emails.send({
      from: "Ressential Orders <onboarding@resend.dev>",
      to: process.env.ADMIN_ORDER_EMAIL || "",
      subject: `New Order from ${customerName}`,
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h1>New Order Received</h1>

          <p>
            <strong>Customer:</strong> ${customerName}
          </p>

          <p>
            <strong>Email:</strong> ${customerEmail}
          </p>

          <p>
            <strong>Total:</strong> €${Number(total).toFixed(2)}
          </p>

          <p>
            <strong>Address:</strong>
            ${address}, ${city}, ${country}
          </p>

          <h2 style="margin-top:30px;">Products</h2>

          <table
            style="
              width:100%;
              border-collapse:collapse;
              margin-top:15px;
            "
          >
            <thead>
              <tr>
                <th
                  align="left"
                  style="padding:10px;border-bottom:2px solid #ddd;"
                >
                  Product
                </th>

                <th
                  align="left"
                  style="padding:10px;border-bottom:2px solid #ddd;"
                >
                  Qty
                </th>

                <th
                  align="left"
                  style="padding:10px;border-bottom:2px solid #ddd;"
                >
                  Price
                </th>
              </tr>
            </thead>

            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Email failed" },
      { status: 500 }
    );
  }
}