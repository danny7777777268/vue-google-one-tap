# Vue Google One Tap

Minimal, dependency-free **Google One Tap** sign-in component for **Vue 3** applications.

Designed for **startups, SaaS products, and production systems** that need fast, secure Google authentication with minimal setup.

✔ Automatically loads Google Identity Services  
✔ Works with **Vue 3**, **Vite**, **Nuxt (client-side)**  
✔ No build step, no bundler required  
✔ Backend-agnostic (works with any stack)  
✔ Lightweight, auditable, and secure  

---

## Repository

Source code and issues are available on GitHub:

🔗 https://github.com/danny7777777268/vue-google-one-tap

---

---

✅ Recommended (README / docs)

Note: In our case, Google One Tap was tested and confirmed to work in production environments. It may not function correctly in local development environments, depending on browser settings, HTTPS requirements, and Google account state.

----

## Why This Package

Modern applications need **frictionless authentication**.  
Google One Tap significantly improves sign-in conversion, especially for mobile users and returning visitors.

This package focuses on:

- **Performance** – zero unnecessary dependencies  
- **Security** – Google ID tokens are never stored on the client  
- **Simplicity** – single component, minimal configuration  
- **Control** – backend verification is fully under your control  

Ideal for:

- SaaS platforms  
- AI & fintech startups  
- Marketplaces  
- Consumer applications  
- Enterprise dashboards  

---

## Production Note (Important)

> **Note:** This package was tested and confirmed to work in **production environments**.  
> Google One Tap may not function correctly in **local development environments**, depending on HTTPS availability, browser privacy settings, and Google account state.

---

## Installation

Using npm:

```bash
npm install vue-google-one-tap

Using yarn:

yarn add vue-google-one-tap

<template>
  <GoogleOneTap
    :clientId="clientId"
    authUrl="https://yourbackend.com:3030/api/auth/google"
    :onSignedIn="onSignedIn"
    :onError="onError"
  />
  <div>Your app UI...</div>
</template>

<script setup>
import GoogleOneTap from "vue-google-one-tap";

const clientId =
  "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function onSignedIn(data) {
  console.log("User:", data.user);
}

function onError(err) {
  console.error("One Tap error:", err);
}
</script>

Props

| Prop                 | Type       | Required | Description                                |
| -------------------- | ---------- | -------- | ------------------------------------------ |
| `clientId`           | `string`   | ✅        | Google OAuth Web Client ID                 |
| `authUrl`            | `string`   | ✅        | Backend endpoint to verify Google ID token |
| `onSignedIn`         | `function` | ❌        | Callback after successful authentication   |
| `onError`            | `function` | ❌        | Error callback                             |
| `headers`            | `object`   | ❌        | Custom headers for the auth request        |
| `autoSelect`         | `boolean`  | ❌        | Automatically sign in returning users      |
| `cancelOnTapOutside` | `boolean`  | ❌        | Prevent dismissal when clicking outside    |



Backend Example (Node.js / Express)


const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Missing credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const user = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified
    };

    // TODO: find-or-create user in your database
    // Create your own session or JWT here

    return res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Token verification failed" });
  }
});


Security Model

No tokens are stored in localStorage or sessionStorage

Google ID token is sent directly to your backend

You fully control:

Verification

Sessions

Cookies

User lifecycle

This follows OAuth best practices and modern security requirements.

Performance Notes

Google script is loaded only once

No re-renders

No layout shifts

No UI blocking

Zero runtime dependencies

Framework Notes
Nuxt

Use the component client-side only (for example via client-only components).

Vue Strict Mode

Safe to use — initialization is guarded internally.

CORS (Common Issue & How to Fix It)

Google One Tap itself does not cause CORS issues.
CORS problems usually occur when your frontend sends the Google ID token to your backend.

Typical Error
Access to fetch at 'https://api.yourdomain.com/api/auth/google'
from origin 'https://yourfrontend.com'
has been blocked by CORS policy

Recommended Backend CORS Setup


import cors from "cors";

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://yourfrontend.com"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));


⚠️ If you use credentials: true, you cannot use origin: "*".
Browsers will block the request.

SEO Keywords

vue google one tap
google one tap vue
google sign in vue
google oauth vue
vue authentication
vue auth component
google identity services

License

MIT


Sponsor

This project is sponsored and maintained by Stockbase.

🔗 https://stockbase.pro

Stockbase is building next-generation financial and AI-driven platforms focused on speed, security, and user experience.

