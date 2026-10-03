// js/data/env.js: the ONLY switches to flip when the Cloudflare backend is live
export const ENV={
 API:'',            // '' = demo mode (data stays in the visitor's browser). Set to '/api' once the Worker is deployed.
 SIGNUP:'invite',   // 'invite' = only approved emails can sign in. 'open' = anyone can sign up and wait as pending (also set SIGNUP in worker/wrangler.toml).
 CHAT:true,         // show the AI chat widget
 FOUNDER:'samuel-mk'
};
