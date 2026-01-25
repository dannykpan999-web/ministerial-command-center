# Application Name Change Guide

**Status**: Ready to implement (waiting for Honorato's confirmation)
**Current Name**: "Centro de Comando Ministerial"
**Proposed Names**:
- Option 1: "Centro de Control del Gabinete del Ministerio"
- Option 2: "Centro de Sistemas de Gestión del Ministro"

---

## Quick Change Instructions

### Option 1: Automated Script (Recommended)

```bash
# Change to Option 1
node scripts/change-app-name.js "Centro de Control del Gabinete del Ministerio"

# OR Change to Option 2
node scripts/change-app-name.js "Centro de Sistemas de Gestión del Ministro"
```

The script will:
- ✅ Update all 19 files automatically
- ✅ Show summary of changes
- ✅ Preserve file formatting

**Time**: ~30 seconds

---

## Files That Will Be Updated

### Frontend (9 files)
1. `src/components/layout/Sidebar.tsx` - Application title in sidebar
2. `src/pages/Register.tsx` - Registration page title
3. `src/pages/Login.tsx` - Login page title
4. `index.html` - HTML page title
5-9. Email templates (5 files in `backend/src/email/templates/`)

### Backend (6 files)
10. `backend/src/main.ts` - API documentation title
11. `backend/src/email/email.service.ts` - Email sender name
12. `backend/prisma/seed.ts` - Test data

### Documentation (3 files)
13. `README.md` - Project documentation
14. `plan/UPDATED_PROJECT_PLAN_2026.md` - Current plan
15. `plan/FRONTEND_COMPONENTS_SPEC.md` - Component specs
16. `plan/PROJECT_IMPLEMENTATION_PLAN_BUDGET.md` - Original plan
17. `scripts/generate-proposal-doc.js` - Proposal generator

---

## Manual Change Instructions (if needed)

If you prefer to change manually, here are the key locations:

### 1. Frontend Title (Sidebar)
**File**: `src/components/layout/Sidebar.tsx`
**Line**: ~30
```tsx
<h1 className="text-xl font-bold">NEW NAME HERE</h1>
```

### 2. Login Page
**File**: `src/pages/Login.tsx`
**Line**: ~40
```tsx
<h1 className="text-2xl font-bold">NEW NAME HERE</h1>
```

### 3. HTML Title
**File**: `index.html`
**Line**: ~6
```html
<title>NEW NAME HERE</title>
```

### 4. API Documentation
**File**: `backend/src/main.ts`
**Line**: ~30
```typescript
.setTitle('NEW NAME HERE')
```

### 5. All Email Templates
**Folder**: `backend/src/email/templates/`
**Files**: All `.html` files
**Search**: Replace all instances in email headers and footers

---

## Testing After Change

### 1. Test Frontend
```bash
npm run dev
```
**Check**:
- [ ] Browser tab title shows new name
- [ ] Login page title shows new name
- [ ] Sidebar title shows new name

### 2. Test Backend API Docs
```bash
cd backend
npm run start:dev
```
**Visit**: http://localhost:3000/api
**Check**:
- [ ] Swagger documentation shows new name

### 3. Test Email Templates
**Check**:
- [ ] Send test email to verify template headers
- [ ] Verify email signature shows new name

---

## Deployment After Change

### 1. Commit Changes
```bash
git add .
git commit -m "chore: Update application name to [NEW NAME]"
git push
```

### 2. Deploy Frontend
```bash
cd deployment
./deploy-frontend.sh
```

### 3. Deploy Backend
```bash
cd deployment
./deploy-backend.sh
```

### 4. Clear Browser Cache
Instruct users to:
- Refresh browser (Ctrl+F5 or Cmd+Shift+R)
- Or clear browser cache

---

## Why Two Name Options?

**Context from client**:
> "The name needs to match the function of the system"

**Option 1**: "Centro de Control del Gabinete del Ministerio"
- Emphasizes "control" and "cabinet"
- More formal, governmental tone
- Focus: Oversight and coordination

**Option 2**: "Centro de Sistemas de Gestión del Ministro"
- Emphasizes "management systems"
- More technical, operational tone
- Focus: Document and process management

**Decision maker**: Honorato (not present in original meeting)

---

## Cost & Timeline

**Development Time**: Already implemented ✅
**Script Execution**: 30 seconds
**Testing**: 15 minutes
**Deployment**: 10 minutes
**Total Time**: ~30 minutes (after name confirmation)
**Cost**: Included in project budget

---

## Next Steps

1. ⏳ **Waiting**: Get confirmation from Honorato on which name to use
2. ✅ **Ready**: Script is ready to execute immediately
3. ⏳ **After confirmation**: Run script, test, deploy

---

## Questions?

If you need help:
- Script not working? Check Node.js is installed: `node --version`
- Need to change back? Run script again with original name
- Manual changes needed? Use the manual instructions above

---

**Prepared**: January 25, 2026
**Status**: Ready to implement upon confirmation
**Client Feedback Point**: #2 - ✅ PREPARED
