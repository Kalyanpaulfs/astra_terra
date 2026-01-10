import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // For now, always respond with a fixed message
    // You can integrate OpenAI or other AI service here if needed
    const response = "For further inquiries, please fill-out the form <a href='#contact-us-anchor'>Here</a>";

    return NextResponse.json({
      user: message,
      bot: response,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

