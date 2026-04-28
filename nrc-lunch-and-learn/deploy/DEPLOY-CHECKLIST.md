# IBA Lunch & Learn — Deployment Checklist

**Event:** Thursday, April 30, 2026 · 12:00–2:00 PM ET
**Today:** Monday, April 27, 2026
**Time you have:** 72 hours
**Time these steps take:** ~45 minutes total

---

## ⚡ Critical path — do these in order

### ☐ STEP 1 — Send Fogler the preview for approval (5 min)

**This blocks everything else.** The page has Fogler's logo, partners' photos, and firm name. Before any tent card prints, get sign-off.

Email to send (copy-paste, change recipient):

> **To:** [Gary Kissack, or your Fogler contact]
> **Subject:** Quick approval — IBA Lunch & Learn landing page
>
> Hi [Name],
>
> Putting together a small companion landing page for the lunch on April 30 — guests will scan a QR on the tent card to access company info, speaker details, and a question form that routes to either NRC, Fogler, or both teams.
>
> Could you take 2 minutes to review the draft and confirm you're comfortable with the logo placement, partner photos, and firm copy? Anything you'd like changed, just say the word and I'll update before it goes to print.
>
> [PASTE PREVIEW URL HERE — you'll have it after Step 2]
>
> Need a yes/no by Tuesday EOD if possible — printing Wednesday.
>
> Thanks,
> Eugenio

**Don't print tent cards until they reply.**

---

### ☐ STEP 2 — Deploy to Vercel (10 min)

You'll get a preview URL to send Fogler in Step 1. Two paths — pick whichever:

#### Path A: Drag and drop (zero terminal)
1. Go to **https://vercel.com/new**
2. Sign in with your GitHub or Google
3. Click **"Other"** → **"Browse all templates"** → cancel out (you don't need a template)
4. On the dashboard, click **"Add New" → "Project"** → click **"Deploy"** without git → choose **"Upload"**
5. Drag the `nrc-lunch-and-learn` folder I prepared (you'll have this from below)
6. Click **Deploy**
7. Wait ~30 seconds → you get a URL like `nrc-lunch-and-learn-xxx.vercel.app`

That's your **preview URL**. Send it to Fogler (Step 1).

#### Path B: Terminal (faster if you've used Vercel before)
Open Terminal in the `nrc-lunch-and-learn` folder:
```bash
npx vercel
```
Follow prompts (Y to setup, accept defaults). Done in 30 seconds.

---

### ☐ STEP 3 — Set up the HubSpot form (15 min)

While Fogler reviews, set up the backend.

**3.1 Create the custom property**
1. HubSpot → Settings (gear icon top right) → **Properties**
2. Object type: **Contact**
3. Click **Create property**
4. **Group:** Contact information
5. **Label:** "Lunch & Learn — Route To"
6. **Internal name** (will auto-fill): `lunch_and_learn_route_to`
7. **Field type:** Dropdown select
8. **Options:** Add three options:
   - Label: `Nations Royalty` · Internal value: `nrc`
   - Label: `Fogler, Rubinoff LLP` · Internal value: `fogler`
   - Label: `Both teams` · Internal value: `both`
9. Save

**3.2 Create the form**
1. HubSpot → **Marketing** → **Forms** → **Create form**
2. Choose: **Embedded form** (NOT pop-up)
3. Template: **Blank template**
4. **Form name:** `IBA Lunch & Learn — Apr 30 2026`
5. Drag these fields in (use the search bar on the left to find them):
   - First name *(required)*
   - Last name *(required)*
   - Email *(required)*
   - Company
   - Job title
   - **Lunch & Learn — Route To** *(your custom property — required)*
   - Message *(required — you may need to create this as a multi-line text property)*
6. Form options tab → uncheck "Pre-populate fields with known values" (we want fresh entries)
7. **Publish**

**3.3 Get your IDs and paste into the HTML**
1. After publishing, click **"Share"** → **"Embed code"**
2. In the code, find these two values:
   - `portalId: "12345678"` ← copy this number
   - `formId: "abcdef-1234-5678-..."` ← copy this whole string
3. Open `index.html` (in the deploy folder I gave you)
4. Find these lines near the bottom of the file (search for `YOUR_PORTAL_ID`):
   ```js
   const HUBSPOT_PORTAL_ID  = 'YOUR_PORTAL_ID';
   const HUBSPOT_FORM_GUID  = 'YOUR_FORM_GUID';
   ```
5. Replace `YOUR_PORTAL_ID` with your portal ID number (keep the quotes)
6. Replace `YOUR_FORM_GUID` with your form GUID (keep the quotes)
7. Save

**3.4 Re-deploy**
- If you used Path A: drag the updated folder into Vercel again, it'll redeploy
- If you used Path B: run `npx vercel --prod` in the folder

---

### ☐ STEP 4 — Set up email notifications (5 min)

So you (and optionally Karen + a Fogler contact) get pinged the second someone submits.

1. HubSpot → **Automation** → **Workflows** → **Create workflow**
2. Choose: **Contact-based** workflow
3. **Enrollment trigger:** "Form submission" → select your IBA form
4. Add action: **Send internal email**
5. **To:** your email (and any others — Karen, James, your Fogler contact)
6. **Subject:** `🍽️ IBA Lunch & Learn — New submission from {{contact.firstname}} {{contact.lastname}}`
7. **Body:** (copy-paste this, HubSpot supports the `{{contact.x}}` syntax)

```
New submission from the IBA Lunch & Learn landing page.

ROUTE TO: {{contact.lunch_and_learn_route_to}}

Name: {{contact.firstname}} {{contact.lastname}}
Email: {{contact.email}}
Organization: {{contact.company}}
Role: {{contact.jobtitle}}

Message:
{{contact.message}}

---
Submitted via lunch.nationsroyalty.com
```

8. **Turn workflow ON**
9. Test it by submitting your own form once

---

### ☐ STEP 5 — Point your domain at Vercel (10 min, optional but recommended)

QR codes scan better with short, branded URLs. `lunch.nationsroyalty.com` looks 10x more legitimate than `nrc-xxx.vercel.app`.

1. In Vercel → your project → **Settings** → **Domains**
2. Type: `lunch.nationsroyalty.com` → click Add
3. Vercel shows you a CNAME record like:
   ```
   Type: CNAME
   Name: lunch
   Value: cname.vercel-dns.com
   ```
4. Go to wherever `nationsroyalty.com` is registered (probably GoDaddy/Namecheap/Cloudflare). Find DNS settings.
5. Add the CNAME record above
6. Wait 5–60 minutes for propagation
7. Vercel will auto-issue an SSL cert when DNS is live

**Don't know who manages NRC's domain?** Ask Derrick or whoever set up the website.

---

### ☐ STEP 6 — Generate the QR code (5 min)

**Use Bitly** (you have it connected) for a dynamic short link — meaning you can change the destination later WITHOUT reprinting tent cards.

1. Bitly → Create → paste your live URL (`lunch.nationsroyalty.com` or the Vercel URL)
2. Customize the back-half: `bit.ly/nrc-iba` or similar
3. Bitly → click your new link → **QR Code** tab
4. Customize: black on white, add NRC logo in center if Bitly allows (premium feature)
5. Download as **SVG** (scales infinitely) or **high-res PNG** at minimum 1000×1000px

**Alternative if Bitly doesn't suit:** [qr-code-generator.com](https://www.qr-code-generator.com/) — free, gives clean QRs.

**Test the QR before printing:**
- Scan with your iPhone (built-in camera)
- Scan with an Android device
- Scan from across a table (bad lighting, tilted angle)
- Make sure it loads fast

---

### ☐ STEP 7 — Add to tent card design

Whoever's designing the tent cards (you?) needs:
- **The QR code SVG** — minimum 1.5" × 1.5" on the printed card (smaller doesn't scan reliably from across a table)
- **Short instructional text** below it: "Scan to ask a question or follow up"
- **The URL printed below** as a fallback in case the QR fails: `lunch.nationsroyalty.com`

---

## After the event

### ☐ Pull the data (10 min)
1. HubSpot → Contacts → filter by `Lunch & Learn — Route To` is known
2. Export as CSV
3. Forward Fogler-tagged contacts to your Fogler contact
4. Reply to NRC-tagged contacts yourself (or hand to Karen)

### ☐ Track outcomes
Add a contact list in HubSpot called "IBA Lunch & Learn 2026 — Attendees" so you can track these contacts over time and prove ROI later.

---

## If something breaks

| Problem | Fix |
|---|---|
| Page won't load | Check Vercel deployment status; redeploy |
| Form doesn't submit | Check browser console; verify HubSpot Portal ID + Form GUID |
| Email notification doesn't arrive | Test workflow in HubSpot; check spam folder |
| QR doesn't scan | Print bigger; ensure it's not in a glossy plastic sleeve that reflects |
| URL doesn't work | DNS may still be propagating — wait 1 hour |

---

## Total time estimate
- **Active work:** ~45 minutes
- **Wait time:** 1–60 minutes (DNS propagation) + 24 hours (Fogler approval)
- **Cost:** $0 (Vercel free tier, HubSpot free, Bitly free)
