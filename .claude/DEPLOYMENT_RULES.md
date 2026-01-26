# Astra Terra - Deployment Rules

**CRITICAL: Always require user approval for:**

1. **Git Push**
   ```bash
   git push origin roki-new
   ```
   - SafeToAutoRun: **false**
   - User must approve before pushing to GitHub

2. **Vercel Production Deployment**
   ```bash
   vercel --prod
   ```
   - SafeToAutoRun: **false**
   - User must approve before deploying to production

**Why:**
- Production deployment affects live website (astraterra.ae)
- Code changes go to client's repository
- Requires review before going live

**Allowed Auto-run:**
- Local build: `npm run build` ✅
- Dev server: `npm run dev` ✅
- Git commit: `git commit -m "..."` ✅
- Git status/log: `git status`, `git log` ✅

---

**Always ask permission before deploying or pushing!** 🛑
