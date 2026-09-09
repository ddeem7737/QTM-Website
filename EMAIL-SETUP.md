# Email Form Setup Guide

Your QTM Group website now has a functioning email form submission system using Resend.

## Quick Setup

### 1. Create a Resend Account
- Go to [resend.com](https://resend.com)
- Sign up for free (includes 100 emails/day free tier)
- Copy your API key

### 2. Set Environment Variable

**For Development:**
Create a `.env.local` file in your project root:
```bash
RESEND_API_KEY=re_your_api_key_here
```

**For Production:**
Set the environment variable in your hosting platform:
- **Railway/Render**: Add in environment variables section
- **Heroku**: Use `heroku config:set RESEND_API_KEY=re_...`
- **VPS/Node.js**: Set in `.env` or systemd service file

### 3. Verify Email Address

By default, Resend sends from `noreply@qtm-group.com`. To use your own domain:
1. Log in to Resend dashboard
2. Add your domain (qtm-group.com)
3. Follow DNS verification steps
4. Update the `from` address in `app/api/submit-inquiry/route.ts` if needed

### 4. Install Dependencies

```bash
npm ci
```

### 5. Test Locally

```bash
npm run dev
```

Then submit a form from any inquiry page. Check:
- Form submission feedback
- Email received at info@qtm-group.com

## How It Works

1. **Frontend** (`app/components/QtmSite.tsx`):
   - Collects form data and validates required fields
   - Submits to `/api/submit-inquiry` endpoint

2. **Backend** (`app/api/submit-inquiry/route.ts`):
   - Receives form data
   - Validates email format
   - Sends email via Resend
   - Returns success/error to user

3. **Email Delivery**:
   - Sent to: `info@qtm-group.com`
   - Reply-To: Customer's email address
   - Subject includes inquiry type

## Recipient Email

Inquiries are sent to `info@qtm-group.com`. To change this, edit `app/api/submit-inquiry/route.ts`:

```typescript
to: 'your-email@qtm-group.com',  // Change this line
```

## Troubleshooting

**"Failed to send inquiry" error:**
- Verify `RESEND_API_KEY` is set correctly
- Check the key starts with `re_`
- Ensure the email address in Resend is verified

**Forms work locally but not in production:**
- Confirm environment variable is set on your hosting platform
- Check logs for API errors

**Want to use a different email service?**
- **SendGrid**: Similar integration, change imports
- **Mailgun**: Also compatible
- **AWS SES**: For large volume

## Future Enhancements

- Add file upload handling (currently files aren't sent)
- Send confirmation email to customer
- Add inquiry tracking database
- Implement rate limiting
- Add email templates

## Support

For Resend support: https://resend.com/docs
For QTM: info@qtm-group.com
