# Setting Up Resend SMTP with Supabase

This guide will help you configure Resend as your SMTP provider for Supabase email delivery.

## Prerequisites

- A Resend account (sign up at https://resend.com)
- Access to your Supabase project dashboard
- A verified domain (recommended) or use Resend's default domain for testing

## Step 1: Create a Resend Account

1. Go to https://resend.com
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

## Step 2: Get Your Resend API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "Supabase SMTP")
5. Select permissions (you'll need "Sending access")
6. Copy the API key (you'll only see it once!)

## Step 3: Add and Verify Your Domain (Recommended for Production)

### Option A: Use Your Own Domain (Recommended)

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `crt-academy.com`)
4. Resend will provide DNS records to add:
   - **SPF Record**: `v=spf1 include:resend.com ~all`
   - **DKIM Records**: CNAME records provided by Resend
   - **DMARC Record** (optional but recommended)
5. Add these records to your domain's DNS settings
6. Wait for verification (usually takes a few minutes to 24 hours)
7. Once verified, you'll see a green checkmark

### Option B: Use Resend's Default Domain (For Testing)

- Resend provides a default domain like `resend.dev` for testing
- This is fine for development but not recommended for production
- Emails may go to spam with default domain

## Step 4: Configure SMTP in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Settings** → **SMTP Settings**
4. Click **Enable Custom SMTP** or **Configure SMTP**

5. Fill in the SMTP settings:

   **For Resend, use these settings:**
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 465 (or 587 for TLS)
   SMTP User: resend
   SMTP Password: [Your Resend API Key]
   Sender Email: noreply@yourdomain.com (or use Resend's default)
   Sender Name: CRT Academy (or your preferred name)
   ```

   **Detailed Settings:**
   - **Host**: `smtp.resend.com`
   - **Port**: `465` (SSL) or `587` (TLS)
   - **Username**: `resend`
   - **Password**: Your Resend API Key (from Step 2)
   - **Sender Email**: 
     - If using custom domain: `noreply@yourdomain.com` or `hello@yourdomain.com`
     - If using default: `onboarding@resend.dev` (or similar)
   - **Sender Name**: `CRT Academy`
   - **Enable SSL/TLS**: Yes (check the box)

6. Click **Save** or **Test Connection** to verify

## Step 5: Test Your Email Configuration

1. In Supabase, go to **Authentication** → **Email Templates**
2. Make sure your email templates are customized (you already have the template ready!)
3. Try signing up a test user with a real email address
4. Check if the email arrives (check spam folder too)
5. Verify the email looks correct and links work

## Step 6: Verify Email Delivery

1. Check Resend dashboard → **Logs** to see sent emails
2. Check Supabase → **Authentication** → **Logs** for email events
3. Monitor bounce rates and delivery status

## Important Notes

### Resend Free Tier Limits
- **100 emails per day** on free tier
- **3,000 emails per month**
- Upgrade to paid plans for higher limits

### Best Practices
1. **Use a custom domain** for better deliverability
2. **Set up SPF, DKIM, and DMARC** records properly
3. **Monitor your email logs** regularly
4. **Use a dedicated email** like `noreply@yourdomain.com` for system emails
5. **Test thoroughly** before going to production

### Troubleshooting

**Emails not sending:**
- Verify API key is correct
- Check SMTP port (465 for SSL, 587 for TLS)
- Ensure domain is verified (if using custom domain)
- Check Resend logs for errors

**Emails going to spam:**
- Verify SPF and DKIM records are set correctly
- Use a custom domain instead of default
- Avoid spam trigger words in subject/content
- Warm up your domain gradually

**Connection errors:**
- Double-check SMTP host: `smtp.resend.com`
- Verify port number (465 or 587)
- Ensure SSL/TLS is enabled
- Check firewall settings

## Alternative: Using Resend API Directly (Advanced)

If you want more control, you can also use Resend's API directly via Supabase Edge Functions, but SMTP is simpler and works well for authentication emails.

## Next Steps

1. ✅ Set up Resend account
2. ✅ Get API key
3. ✅ (Optional) Add and verify domain
4. ✅ Configure SMTP in Supabase
5. ✅ Test email delivery
6. ✅ Monitor and optimize

## Support Resources

- Resend Documentation: https://resend.com/docs
- Supabase SMTP Docs: https://supabase.com/docs/guides/auth/auth-smtp
- Resend Support: support@resend.com


