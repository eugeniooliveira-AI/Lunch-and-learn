# IBA Lunch & Learn Landing Page
**Event:** April 30, 2026 · Toronto · Vantage Venues
**Hosts:** Nations Royalty Corp. × Fogler, Rubinoff LLP
**Live URL:** https://lunch.nationsroyalty.com (after DNS setup)

## What this is
Single-file HTML landing page for the IBA Lunch & Learn event at FNMPC 2026.
QR-coded on tent cards, scanned by guests during the event.

## How it works
- All assets (logos, headshots, hero image) baked in as base64 — no external dependencies
- Form submits to HubSpot via Forms API (configured in script block at bottom of HTML)
- HubSpot workflow handles email notifications

## To update content
Edit `index.html`, then redeploy: `npx vercel --prod`

## To swap images
Hard-coded as base64 — easier to ask Claude to regenerate the file with new assets.
