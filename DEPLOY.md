# Deploying L.I.G.O. SPACE (GitHub + Cloudflare Pages + Worker)

**Today (demo mode):** push these files to GitHub and publish as you do now. Everything works, but accounts/profiles live only in each visitor's browser. Do not invite real contributors yet.

## Go live with the backend
Prereqs: your domain on Cloudflare DNS, `npm i -g wrangler`, `wrangler login`.

1. **Frontend:** Cloudflare dashboard > Workers & Pages > Create > Pages > connect the GitHub repo. Build command: none. Output directory: `/`. Add your custom domain (DNS records are created for you).
2. **Database:** DONE. D1 database `ligo` is created and the schema is applied; its id is already in `wrangler.toml`.
3. **First admin and founder:** run the two commented INSERTs at the bottom of `schema.sql` (edit the email) with `wrangler d1 execute ligo --remote --command="..."`.
4. **Photo storage (Supabase):** DONE. Project `ligo-space` and both buckets (`ligo-pending` private, `ligo-public` public) exist, and `SUPABASE_URL` is already in `wrangler.toml`. Remaining: `wrangler secret put SUPABASE_SERVICE_KEY` and paste the **service_role** key (Supabase dashboard > Project Settings > API Keys). Never put that key in the website files, GitHub or chat.
5. **Email (sign-in links):** make a Resend account, verify your domain, then `wrangler secret put RESEND_API_KEY`. Set `FROM_EMAIL` in `wrangler.toml`.
6. **Deploy the API:** replace `YOUR-DOMAIN.org` in `wrangler.toml`, then `wrangler deploy`. It serves `/api/*` on the same domain, so login cookies work.
7. **Switch the site on:** in `js/data/env.js` set `API:'/api'`, commit and push.
8. **Test:** sign in with the admin email, invite a test member, submit a profile, approve it, check the Team page.

## Later: open sign-up
Set `SIGNUP:'open'` in `js/data/env.js` and `SIGNUP = "open"` in `wrangler.toml`, then `wrangler deploy`. New people can sign in and sit as "pending" until you approve their profile.

## Notes
- Supabase free projects pause after about a week without activity, which takes the photos offline. Visit the project regularly, or move to a paid plan before launch.
- Videos: members paste a YouTube link (stored as a link, not a file). Photos are uploaded by the Worker to a private Supabase bucket and are copied to the public bucket only when you approve the profile. D1 stores just the image URL.
- Members of the Children & Vulnerable Communities program never show direct links; the Worker strips them. Introductions go through the admin queue.
- Add rate limiting in Cloudflare (Security > WAF > Rate limiting) for `/api/chat`, `/api/auth/login` and `/api/submissions`.
- Impact figures still use browser storage; moving them to D1 with the evidence records is the next backend step.
