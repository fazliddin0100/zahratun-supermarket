import { NextResponse } from 'next/server';

const customers = [
  {
    id: 1,
    name: 'Bonnie Howe',
    email: 'bonniehowe@gmail.com',
    phone: '+998901234567',
    spent: 49,
    status: 'active',
    avatar: '',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newCustomer = {
    id: Date.now(),
    ...body,
    spent: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  customers.push(newCustomer);

  return NextResponse.json(newCustomer, { status: 201 });
}
