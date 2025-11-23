# Resend SMTP Quick Reference for Supabase

## Quick Setup Steps

### 1. Get Resend API Key
- Go to https://resend.com → API Keys → Create API Key
- Copy the API key (starts with `re_...`)

### 2. Configure in Supabase Dashboard

Navigate to: **Authentication** → **Settings** → **SMTP Settings**

### 3. Enter These Exact Settings:

```
SMTP Host: smtp.resend.com
SMTP Port: 465
SMTP User: resend
SMTP Password: [Your Resend API Key - paste here]
Sender Email: onboarding@resend.dev (Resend's default - works perfectly!)
Sender Name: CRT Academy
Enable SSL: ✓ (checked)
```

**Note:** You can use `onboarding@resend.dev` or any of Resend's default domains. No custom domain needed!

### 4. Test Connection
- Click "Test Connection" or "Save"
- Try sending a test email
- Check Resend dashboard → Logs to verify

## Using Resend's Default Domain (What You'll Use)

**You can use Resend's default domain - no custom domain needed!**

Resend provides default sender emails like:
- `onboarding@resend.dev`
- `hello@resend.dev`
- `noreply@resend.dev`

These work perfectly fine and you don't need to verify any domain. Just use one of these as your Sender Email.

### Optional: Add Custom Domain Later (Not Required)

If you want to use your own domain for emails in the future:
1. Resend Dashboard → Domains → Add Domain
2. Add DNS records provided by Resend
3. Wait for verification
4. Update Sender Email to: `noreply@yourdomain.com`

But this is completely optional - Resend's default domain works great!

## Important Notes

- **Free Tier**: 100 emails/day, 3,000/month
- **Port 465** = SSL (recommended)
- **Port 587** = TLS (alternative)
- Use custom domain for better deliverability
- Monitor logs in both Resend and Supabase dashboards

## Troubleshooting

**Connection fails?**
- Double-check API key is correct
- Verify port is 465 (SSL) or 587 (TLS)
- Ensure SSL/TLS checkbox is enabled

**Emails not arriving?**
- Check spam folder
- Verify domain DNS records (if using custom domain)
- Check Resend logs for delivery status

