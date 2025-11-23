# Fix: "Error sending confirmation email" on Signup

This error occurs when Supabase tries to send a confirmation email but fails. Here are the solutions:

## Quick Fix Options

### Option 1: Disable Email Confirmation (For Development/Testing)

If you're in development and want users to sign up immediately without email confirmation:

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Scroll to **"Email Auth"** section
3. **Uncheck** "Enable email confirmations"
4. Click **Save**

**Note:** Users can now sign in immediately after signup, but this reduces security.

### Option 2: Configure SMTP (Recommended for Production)

Supabase's default email service has limits (3 emails/hour on free tier). Set up custom SMTP:

#### Using Resend (Recommended - Free tier: 100 emails/day)

1. **Sign up for Resend**: https://resend.com
2. **Get your API key** from Resend dashboard
3. **In Supabase Dashboard**:
   - Go to **Authentication** → **Settings** → **SMTP Settings**
   - Enable **Custom SMTP**
   - Enter these settings:
     ```
     Host: smtp.resend.com
     Port: 465 (or 587)
     Username: resend
     Password: [Your Resend API Key]
     Sender Email: onboarding@resend.dev (or your custom domain)
     Sender Name: CRT Academy
     ```
   - Enable **SSL/TLS**
   - Click **Save** or **Test Connection**

4. See `RESEND_SMTP_SETUP.md` for detailed instructions

#### Using Other SMTP Providers

You can also use:
- **SendGrid** (100 emails/day free)
- **AWS SES** (62,000 emails/month free)
- **Mailgun** (5,000 emails/month free)
- **Gmail SMTP** (for testing only)

### Option 3: Check Supabase Email Service Status

1. Go to **Supabase Dashboard** → **Authentication** → **Logs**
2. Check for email-related errors
3. Verify you haven't hit rate limits (3 emails/hour on free tier)

### Option 4: Use Supabase's Email Testing (Development)

For development, Supabase provides email testing:
1. Go to **Authentication** → **Email Templates**
2. Check if there's a test email feature
3. Or use a service like **Mailtrap** for testing

## What I've Fixed in the Code

I've updated the signup code to:
- ✅ Handle email errors more gracefully
- ✅ Show better error messages
- ✅ Allow signup to complete even if email fails (if email confirmation is disabled)
- ✅ Provide helpful guidance when email errors occur

## Current Behavior

After the fix:
- If email confirmation is **disabled**: Users can sign in immediately
- If email confirmation is **enabled** but email fails: 
  - The account is still created
  - User sees a helpful message
  - They can try to sign in (may work if confirmation is not strictly required)
  - Or they can request a new confirmation email later

## Recommended Solution

**For Development:**
- Disable email confirmation temporarily
- Or use Resend with their default domain

**For Production:**
- Set up Resend with a custom domain
- Configure proper SPF/DKIM records
- Monitor email delivery

## Testing

After fixing:
1. Try signing up with a test account
2. Check if the error is gone
3. Verify emails are being sent (check spam folder)
4. Test the confirmation link works

## Still Having Issues?

1. Check Supabase logs: **Authentication** → **Logs**
2. Check your SMTP provider logs (Resend, SendGrid, etc.)
3. Verify SMTP credentials are correct
4. Ensure your domain is verified (if using custom domain)
5. Check firewall/network settings aren't blocking SMTP

