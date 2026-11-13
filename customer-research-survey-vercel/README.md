# Customer Research Customer Research Survey

A mobile-friendly 10-question survey built with Next.js, designed for deployment on Vercel and response storage in Supabase.

## 1. Create the Supabase database

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run the contents of `supabase/schema.sql`.
3. In Project Settings → API, copy the Project URL and **service_role** key. Keep the service-role key secret.

## 2. Configure locally

```bash
cp .env.example .env.local
```

Set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (local: `http://localhost:3000`)

Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## 3. Deploy to Vercel

1. Create a GitHub repository and push this project.
2. In Vercel, choose **Add New → Project** and import the GitHub repository.
3. Add the three environment variables above in Project Settings → Environment Variables.
4. Deploy.
5. Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS URL and redeploy.

## 4. QR code

After deployment, open `https://YOUR-DEPLOYED-URL/qr`, confirm the URL shown is your live survey URL, then download the SVG QR code. Test it on another phone before printing.

## Privacy and launch checklist

- Add a real privacy notice at a public URL and link it from the survey before collecting live responses.
- Confirm the organisation/controller name and contact email in that notice.
- Explain the purpose, retention period, lawful basis, and how respondents can exercise their data rights.
- The survey asks for an email only when someone selects “Yes, definitely” to early membership, and requires a separate contact opt-in.
- The Supabase service-role key is used only in the server API route. Never expose it as a `NEXT_PUBLIC_` variable.
- Restrict access to the Supabase dashboard and response exports.
- Consider adding rate limiting/CAPTCHA before broad public distribution.
- The cohort field is a preliminary proxy based on reported use of loyalty/cashback/card rewards. Analyse raw answers too; it is not a perfect classification.

This starter is a technical implementation, not legal advice. Have the privacy notice and data handling reviewed before launch.
