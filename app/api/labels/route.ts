import { NextResponse } from 'next/server';

async function GET(req: Request) {
  const searchParams = req.nextUrl.searchParams;
  console.log('GET /api/labels:', searchParams);
  const q = searchParams.get('q');

  return NextResponse.json([]);

}

export { GET };
