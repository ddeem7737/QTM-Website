import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const inquiryData: Record<string, string> = {};
    const requiredFields = [];

    for (const [key, value] of formData.entries()) {
      if (key === 'file') continue;
      inquiryData[key] = String(value);
      if (value) requiredFields.push(key);
    }

    const email = inquiryData['email'];
    if (!email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailHtml = `
      <h2>New QTM Group Inquiry</h2>
      <dl>
        ${Object.entries(inquiryData)
          .map(([key, value]) => `<dt>${key}:</dt><dd>${value}</dd>`)
          .join('')}
      </dl>
    `;

    const result = await resend.emails.send({
      from: 'noreply@qtm-group.com',
      to: 'info@qtm-group.com',
      replyTo: email,
      subject: `New Inquiry: ${inquiryData['inquiry-type'] || 'General'}`,
      html: emailHtml,
    });

    if (result.error) {
      return Response.json(
        { error: 'Failed to send inquiry' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Your inquiry has been sent successfully. QTM will review it shortly.',
      id: result.data?.id,
    });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return Response.json(
      { error: 'Server error processing inquiry' },
      { status: 500 }
    );
  }
}
