# Accounts and progress: plan

Decided with the founder, November 2026.

- **Now (Phase A):** no accounts and no database. Make progress and the Couple Pass hard to lose.
- **Later (Phase B):** optional, end-to-end encrypted sync with passkey sign-in, built only once real couples ask for it.
- **Separately:** an optional email list on the landing page, never linked to game data.
- **Rejected:** standard accounts with readable data on our server (option C). It carries the most legal work and breach risk for the least privacy benefit.

## Why

Unlocked levels, cards seen and kept cards describe a couple's intimate life. Under GDPR Article 9 this is special-category data ("data concerning a person's sex life"). Storing it readable on a server would require explicit consent, a data protection impact assessment (DPIA) and breach planning. Today the server forgets everything when a night ends, so none of that applies. We keep it that way for as long as we can.

Progress is already partly resilient: each phone keeps a copy, and the two copies merge whenever the couple joins a game. Data is lost only when both phones lose it. That can happen when browser data is cleared, when both partners get new phones, or, we believe, when iOS Safari removes storage for sites not visited for about 7 days unless the site was added to the home screen. Verify that last behaviour against current WebKit documentation before relying on it.

## Phase A: build now (no database, no extra cost)

1. **The Couple Pass lives on both phones.** When a room's pass is on, the server sends the pass code to the partner's phone too, which stores it. A pass is then lost only if both phones are lost. The code proves a purchase and carries nothing intimate, so sharing it between partners is fine.
2. **Add to home screen.** After a couple's second night, show a gentle one-time prompt that explains why: it keeps progress safe on iPhone and opens like an app. On Android Chrome, use the install prompt. On iOS, show the Share → Add to Home Screen steps. Never show it during a night, and never repeat it after "No thanks".
3. **Backup code.** Settings → "Back up our progress" makes a code (and QR) holding unlocked levels, seen cards, kept cards and night count. It never includes "curious" taps, which stay private to each phone. The code is encrypted with a key that is itself in the code, so it isn't readable as plain text if pasted somewhere. "Restore from a backup code" merges it into this phone, using the existing progress merge. The server never sees it.
4. **Clear copy about where data lives,** on the privacy page and in Settings: "Your progress lives on your two phones. Back it up or add the game to your home screen to keep it safe."
5. **Tests.** The pass reaches the partner's phone. A backup round-trips and merges. A backup never contains curious taps. The install prompt never appears during a night.

## Email list: build now, separately

- An optional "Tell me about new decks" field on the landing page and the privacy page. One field (email), one button, no pop-up.
- It sends the address to an email service, not to the game server's memory or any game data. It's never linked to rooms, progress or the Couple Pass.
- Double opt-in (a confirmation email), an unsubscribe link in every email, and a line on the privacy page.
- **Decision needed: which email service.** Klaviyo is already connected to this workspace, and Buttondown or Mailchimp would also work. The service must accept a couples/relationship product.

## Phase B: later, only if couples ask

- **Trigger:** support requests or reviews about lost progress, or a request to play on a second device such as a tablet.
- **Sign-in:** passkeys (WebAuthn), synced by iCloud Keychain or Google Password Manager. No email, no password. A new phone signs in and progress returns.
- **Couple space:** both partners, in a live room, tap "Link our progress" on their own phones (both must agree, like everything else). The phones agree a shared couple key through the room (ECDH key exchange over the socket).
- **What the server stores:** one encrypted blob per couple (unlocked, seen, kept, night count, pass codes), plus each person's own encrypted blob for private "curious" taps, plus passkey public keys. The server cannot decrypt any of it.
- **Recovery:** a printable recovery code per couple. If every passkey and the recovery code are lost, progress is gone, and the UI says so plainly when you set it up.
- **Storage:** a small Postgres on Railway (about $5/month), or SQLite on a Railway volume while there is one server.
- **Legal:** even encrypted, there is now a database. Do a short DPIA, update the privacy policy, and offer one-tap "Delete our account" that removes both blobs. Recheck the GDPR position with a lawyer: encrypted data the provider can't read may still count as personal data.
- **Unlinking:** either partner can unlink. Their phone keeps a local copy and the couple blob is deleted.

## Not doing

- Readable server-side profiles, social login (Google or Apple sign-in ties an identity to the app), analytics on intimate screens, or marketing based on game behaviour.
