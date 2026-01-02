// app/api/orders/route.ts - Backend API for orders (GET, POST, PUT, DELETE)
import { NextResponse } from 'next/server';

let orders = [
  {
    id: 'FC#1007',
    customer: 'Jennifer Sullivan',
    date: '01 May 2023',
    payment: 'Paypal',
    status: 'Success',
    amount: '$12.99',
    image: '/images/products/product-img-1.jpg',
  },
  {
    id: 'FC#1006',
    customer: 'Willie Hanson',
    date: '20 April 2023',
    payment: 'COD',
    status: 'Success',
    amount: '$8.19',
    image: '/images/products/product-img-2.jpg',
  },
  {
    id: 'FC#1005',
    customer: 'Dori Stewart',
    date: '11 March 2023',
    payment: 'Paypal',
    status: 'Pending',
    amount: '$8.19',
    image: '/images/products/product-img-3.jpg',
  },
  {
    id: 'FC#1004',
    customer: 'Ezekiel Rogerson',
    date: '09 March 2023',
    payment: 'Stripe',
    status: 'Success',
    amount: '$23.11',
    image: '/images/products/product-img-4.jpg',
  },
  {
    id: 'FC#1002',
    customer: 'Robert Donald',
    date: '12 Feb 2022',
    payment: 'Paypal',
    status: 'Cancel',
    amount: '$56.00',
    image: '/images/products/product-img-6.jpg',
  },
];

export async function GET() {
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const newOrder = await request.json();
  newOrder.id = `FC#${Math.floor(Math.random() * 10000)}`;
  orders.push(newOrder);
  return NextResponse.json(newOrder, { status: 201 });
}

export async function PUT(request: Request) {
  const updatedOrder = await request.json();
  const index = orders.findIndex((o) => o.id === updatedOrder.id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updatedOrder };
    return NextResponse.json(orders[index]);
  }
  return NextResponse.json({ error: 'Order not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  orders = orders.filter((o) => o.id !== id);
  return NextResponse.json({ success: true });
}
