import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      'first-name': firstName,
      'last-name': lastName,
      email,
      phone,
      message,
      inquiry_type,
      'g-recaptcha-response': recaptchaResponse,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message || !inquiry_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA only if secret key is configured
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!recaptchaResponse) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification is required' },
          { status: 400 }
        );
      }

      const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaResponse,
          remoteip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        }),
      });

      const recaptchaData = await recaptchaVerify.json();
      if (!recaptchaData.success) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 400 }
        );
      }
    }

    // Determine form ID based on inquiry type
    let formId = '03d831e8-842f-463b-bff5-9a5b9a490e7b'; // BUY
    if (inquiry_type === 'RENT') {
      formId = '20348d4b-d85a-4989-8e43-87e63408bc09';
    }

    const fullName = `${firstName} ${lastName}`;

    // Send to Pixxi webhook
    const webhookToken = process.env.PIXXI_WEBHOOK_TOKEN || process.env.PIXXI_TOKEN;
    if (!webhookToken) {
      console.error('PIXXI_WEBHOOK_TOKEN or PIXXI_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Webhook token not configured' },
        { status: 500 }
      );
    }

    const pixxiPayload = {
      formId,
      propertyReference: '',
      name: fullName,
      email,
      nationality: '',
      phone: phone || '',
      extraData: {
        message,
      },
    };

    console.log('Sending to Pixxi CRM:', JSON.stringify(pixxiPayload, null, 2));

    const pixxiResponse = await fetch('https://dataapi.pixxicrm.ae/pixxiapi/webhook/v1/form', {
      method: 'POST',
      headers: {
        'X-PIXXI-TOKEN': webhookToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pixxiPayload),
    });

    const pixxiResult = await pixxiResponse.text();
    console.log('Pixxi CRM response:', pixxiResponse.status, pixxiResult);

    if (!pixxiResponse.ok) {
      console.error('Pixxi webhook error:', pixxiResponse.status, pixxiResult);
      // Don't fail the request if webhook fails, but log it
    }

    // Send email (using Resend or similar service)
    // For now, we'll just log it. You can integrate Resend here:
    // const emailResponse = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.EMAIL_SERVICE_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@astraterra.ae',
    //     to: process.env.EMAIL_TO,
    //     subject: 'New Contact Message',
    //     html: `
    //       <h2>New Contact Message</h2>
    //       <p><strong>Name:</strong> ${fullName}</p>
    //       <p><strong>Email:</strong> ${email}</p>
    //       <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    //       <p><strong>Message:</strong> ${message}</p>
    //     `,
    //   }),
    // });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

