# Email Configuration for CRT Academy

## Current Setup

When users sign up, Supabase automatically sends a **confirmation email** if email confirmation is enabled in your Supabase project settings.

## How to Customize Signup Emails

### Option 1: Customize Email Templates in Supabase Dashboard (Recommended - Easiest)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Email Templates**
4. Customize the **"Confirm signup"** template to include:
   - Welcome message
   - CRT Academy branding
   - Instructions for getting started
   - Link to your academy

**Email Template Variables Available:**
- `{{ .ConfirmationURL }}` - Link to confirm email
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Confirmation token
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL

**Example Custom Template:**
```html
<h2>Welcome to CRT Academy!</h2>
<p>Hi there,</p>
<p>Thank you for creating an account with CRT Academy. We're excited to have you join our trading community!</p>
<p>Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email Address</a></p>
<p>Once confirmed, you'll have full access to:</p>
<ul>
  <li>Interactive trading lessons</li>
  <li>Live market simulators</li>
  <li>Placement exams</li>
  <li>Progress tracking</li>
</ul>
<p>If you didn't create this account, please ignore this email.</p>
<p>Best regards,<br>The CRT Academy Team</p>
```

### Option 2: Send Welcome Email After Confirmation (Advanced)

To send a separate welcome email after the user confirms their email, you have two options:

#### A. Using Supabase Edge Function
1. Create an Edge Function that sends emails (using Resend, SendGrid, etc.)
2. Set up a database trigger that calls the function when `email_confirmed_at` is set
3. See `supabase_email_trigger.sql` for trigger example

#### B. Using Webhooks
1. Set up a webhook in Supabase that triggers on user confirmation
2. Use a service like Zapier, Make, or custom server to send welcome emails

### Option 3: Disable Email Confirmation (Not Recommended)

If you want users to be able to sign in immediately without email confirmation:

1. Go to **Authentication** → **Settings**
2. Disable **"Enable email confirmations"**
3. Users will receive no email, but can sign in immediately

**⚠️ Warning:** This reduces security and allows fake accounts.

## Current Email Flow

1. User submits signup form
2. `supabase.auth.signUp()` is called
3. Supabase sends confirmation email (if enabled)
4. User clicks confirmation link
5. Email is confirmed, user can now sign in
6. (Optional) Welcome email sent via trigger/function

## Testing

To test email functionality:
1. Use a real email address (not a test email if email confirmation is disabled in dev)
2. Check Supabase logs: **Authentication** → **Logs**
3. Check your email spam folder
4. For development, you can use Supabase's built-in email testing or disable confirmation

## Email Service Configuration

By default, Supabase uses their email service (limited to 3 emails/hour on free tier). For production:

1. Configure custom SMTP in **Authentication** → **Settings** → **SMTP Settings**
2. Use services like:
   - Resend (recommended)
   - SendGrid
   - AWS SES
   - Mailgun

## Next Steps

1. ✅ Customize the "Confirm signup" email template in Supabase Dashboard
2. (Optional) Set up custom SMTP for better deliverability
3. (Optional) Create welcome email trigger if you want a separate welcome email


