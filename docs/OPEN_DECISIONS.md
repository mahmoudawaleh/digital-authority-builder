# Open decisions

1. **Account profile data:** Before implementing authentication, ask whether usernames, display names, avatars, preferences or other user-specific profile fields are needed. Do not assume a profile table is necessary.
2. **Legacy ownership:** Decide a verifiable claim process for existing browser-owned projects; a caller-supplied browser identifier alone must not authorize ownership transfer.
3. **Seed provenance:** Obtain genuine contact information and supporting verification evidence, or label seeded records as demonstrations without deleting them.
4. **Verification authority:** Identify who may review a claim, acceptable evidence, expiry rules and appeal process before implementing verified badges.
5. **Pricing:** Confirm actual commercial plans and entitlements before enabling trials, subscriptions or payment claims. Existing displayed prices are not treated as approved requirements.
6. **Privacy and operations:** Confirm contact/support details, retention, deletion/export expectations and responsible operator; verify hosted backup/restore capabilities rather than inventing them.

No architectural rewrite, product repositioning, automatic legacy claims or destructive database cleanup is approved by this audit.