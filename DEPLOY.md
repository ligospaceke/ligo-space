# Deploying L.I.G.O. SPACE (GitHub + Cloudflare Pages + Worker)

**Today (demo mode):** push these files to GitHub and publish as you do now. Everything works, but accounts/profiles live only in each visitor's browser. Do not invite real contributors yet.

## Go live with the backend
Prereqs: your domain on Cloudflare DNS, `npm i -g wrangler`, `wrangler login`.

1. **Frontend:** Cloudflare dashboard > Workers & Pages > Create > Pages > connect the GitHub repo. Build command: none. Output directory: `/`. Add your custom domain (DNS records are created for you).
2. **Database:** DONE. D1 database `ligo` is created and the schema is applied; its id is already in `wrangler.toml`.
3. **First admin and founder:** run the two commented INSERTs at the bottom of `schema.sql` (edit the email) with `wrangler d1 execute ligo --remote --command="..."`.
4. **Storage:** in the Cloudflare dashboard open R2 and enable it (it may ask for a payment method; the free tier is generous). Then `wrangler r2 bucket create ligo-media`.
5. **Email (sign-in links):** make a Resend account, verify your domain, then `wrangler secret put RESEND_API_KEY`. Set `FROM_EMAIL` in `wrangler.toml`.
6. **Deploy the API:** replace `YOUR-DOMAIN.org` in `wrangler.toml`, then `wrangler deploy`. It serves `/api/*` on the same domain, so login cookies work.
7. **Switch the site on:** in `js/data/env.js` set `API:'/api'`, commit and push.
8. **Test:** sign in with the admin email, invite a test member, submit a profile, approve it, check the Team page.

## Later: open sign-up
Set `SIGNUP:'open'` in `js/data/env.js` and `SIGNUP = "open"` in `wrangler.toml`, then `wrangler deploy`. New people can sign in and sit as "pending" until you approve their profile.

## Notes
- Videos: members paste a YouTube link (stored as a link, not a file). Photos go to R2 and stay private until approved.
- Members of the Children & Vulnerable Communities program never show direct links; the Worker strips them. Introductions go through the admin queue.
- Add rate limiting in Cloudflare (Security > WAF > Rate limiting) for `/api/chat`, `/api/auth/login` and `/api/submissions`.
- Impact figures still use browser storage; moving them to D1 with the evidence records is the next backend step.
