# Security Policy — High on Intelligence · Hazem Soussi

## Reporting a vulnerability
1. **Do not** open a public issue for security problems.
2. Prefer GitHub's private vulnerability reporting on this repository ("Security" tab → "Report a vulnerability"), or contact the maintainer through the contact in `.well-known/security.txt`.
3. Include: what you found, how to reproduce, and impact. We respond within 7 days and aim to fix within 30.

## Scope
- The static site code (`js/`, `css/`, `index.html`) and any future deploy workflows.
- Third-party learning resources linked from the library are **out of scope** — report them to their owners.

## Supply chain posture
- Zero runtime dependencies. The site is vanilla JS — nothing to poison, nothing to pin.
- CI (`security` workflow) blocks merges/pushes that introduce syntax errors, non-HTTPS links, or secret-like strings.
- `main` has branch protection: required status check `security`, enforced for everyone except the repository admin (who may bypass with care).
- Local storage only; no data collection; no cookies; no trackers.

## Supported versions
The live site is served from `main`. There is no other supported version.
