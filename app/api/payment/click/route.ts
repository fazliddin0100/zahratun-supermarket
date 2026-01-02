// app/api/payment/click/route.ts  (API route)
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, orderId, returnUrl } = body; // amount so'mda

  const merchantId = 'YOUR_MERCHANT_ID'; // Click kabinetidan oling
  const serviceId = 'YOUR_SERVICE_ID';
  const secretKey = 'YOUR_SECRET_KEY';

  const params = new URLSearchParams({
    amount: amount.toString(),
    merchant_id: merchantId,
    service_id: serviceId,
    transaction_param: orderId, // sizning buyurtma ID
    return_url: returnUrl,
  });

  const redirectUrl = `https://my.click.uz/pay/?${params.toString()}`;

  return NextResponse.json({ redirectUrl });
}
