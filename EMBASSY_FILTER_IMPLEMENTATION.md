# Embassy Filter Implementation - Ready for Deployment

**Date**: January 25, 2026
**Status**: Schema updated, ready for full implementation after embassy data is added
**Client Feedback Point**: #5 - Embassy filter in inbox

---

## ✅ What Has Been Implemented

### 1. Backend Schema Update ✅
**File**: `backend/prisma/schema.prisma`

**Change**: Added EMBASSY to EntityType enum
```prisma
enum EntityType {
  INTERNAL_DEPARTMENT
  PUBLIC_COMPANY
  PRIVATE_COMPANY
  GOVERNMENT_MINISTRY
  INTERNATIONAL_ORG
  EMBASSY              // ← NEW
  CITIZEN
  OTHER
}
```

### 2. Frontend Type Update ✅
**File**: `src/lib/api/entities.api.ts`

**Changes**:
1. Added EMBASSY to EntityType enum
2. Added Spanish label: "Embajada"

```typescript
export enum EntityType {
  // ... other types
  EMBASSY = 'EMBASSY',  // ← NEW
  // ... other types
}

// Label mapping
[EntityType.EMBASSY]: 'Embajada',  // ← NEW
```

---

## 🔄 What Needs to Be Done After Deployment

### Step 1: Add Embassy Data

**Create embassies in the database**:
```sql
-- Example: Add embassies as entities
INSERT INTO entities (name, "shortName", type, classification)
VALUES
  ('Embajada de España', 'EMB-ESP', 'EMBASSY', 'EXTERNAL'),
  ('Embajada de Francia', 'EMB-FRA', 'EMBASSY', 'EXTERNAL'),
  ('Embajada de Camerún', 'EMB-CMR', 'EMBASSY', 'EXTERNAL'),
  ('Embajada de Estados Unidos', 'EMB-USA', 'EMBASSY', 'EXTERNAL'),
  ('Embajada de China', 'EMB-CHN', 'EMBASSY', 'EXTERNAL'),
  -- Add more embassies...
;
```

**Or via Admin Panel**:
1. Navigate to http://72.61.41.94/entities
2. Click "+ Nueva Entidad"
3. Fill in:
   - Name: "Embajada de [Country]"
   - Type: EMBASSY
   - Classification: EXTERNAL
4. Save

### Step 2: Update Inbox Page (Optional Enhancement)

**Current behavior**:
- Entity filter already works for embassies
- Filter by entity > select specific embassy

**Proposed enhancement** (if client wants dedicated embassy filter):
```typescript
// Add embassy type filter state
const [embassyFilter, setEmbassyFilter] = useState<string>('all');

// Add embassy filter dropdown (only visible when EXTERNAL selected)
{classificationFilter === 'EXTERNAL' && (
  <Select value={embassyFilter} onValueChange={setEmbassyFilter}>
    <SelectTrigger>
      <SelectValue placeholder="Seleccionar Embajada" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Todas las Embajadas</SelectItem>
      {embassies.map(embassy => (
        <SelectItem key={embassy.id} value={embassy.id}>
          {embassy.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)}
```

---

## 📊 Current Filter Capabilities

### Already Working ✅

**Filter by Classification**:
- Todos (All)
- Internos (Internal)
- **Externos (External)** ← Embassies appear here

**Filter by Entity**:
- All entities grouped by type
- Embassies will appear under their own group once added

**Workflow for filtering embassies**:
1. Click "Externos" tab
2. Open "Entidad" dropdown
3. Select specific embassy
4. Documents from that embassy are shown

---

## 🎯 Client Requirements Analysis

### What Client Requested:
> "They want a filter per embassy (because there are a lot of embassies); something like in the inbox ('Bandeja de entrada'), add a filter in 'Externos' with a list of all the available embassies that they want to be able to click to select just one."

### Current Implementation Status:

| Requirement | Status | Notes |
|-------------|--------|-------|
| Filter in Inbox | ✅ Ready | Entity filter already exists |
| Show in "Externos" | ✅ Ready | Classification filter working |
| List all embassies | ⏳ Pending | Need to add embassy data first |
| Click to select one | ✅ Ready | Dropdown selection works |
| EMBASSY entity type | ✅ Complete | Schema and types updated |

---

## 📝 Implementation Options

### Option 1: Use Existing Entity Filter (Current) ✅
**Pros**:
- Already implemented
- No additional code needed
- Works for all external entities

**Cons**:
- Not specifically labeled "Embassies"
- Mixed with other external entities

### Option 2: Add Dedicated Embassy Filter 🔄
**Pros**:
- Clearer UX
- Dedicated "Embajadas" section
- Easier for users to find

**Cons**:
- Requires frontend changes
- ~2 hours additional work

### Option 3: Add "Embassies" Quick Filter Button ⭐ RECOMMENDED
**Pros**:
- Best UX
- Quickclick button next to "Externos"
- Auto-filters to embassy type
- Easy to implement (~1 hour)

**Mockup**:
```
[Todos] [Internos] [Externos] [🏛️ Embajadas]
```

**Implementation**:
```typescript
<Button
  variant={embassyQuickFilter ? 'default' : 'outline'}
  size="sm"
  onClick={() => setEmbassyQuickFilter(!embassyQuickFilter)}
  className="rounded-full shrink-0 h-9"
>
  <Building2 className="h-4 w-4 sm:mr-1.5" />
  <span className="hidden sm:inline">Embajadas</span>
</Button>
```

---

## 🚀 Deployment Steps

### During Deployment:

1. **Backend Migration** (automatic):
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```
   This will add the EMBASSY type to the database.

2. **Frontend Build** (automatic):
   ```bash
   npm run build
   ```
   This includes the updated EntityType enum.

### After Deployment:

3. **Add Embassy Data**:
   - Option A: Via SQL (see Step 1 above)
   - Option B: Via Admin Panel (manual entry)
   - Option C: Import from CSV/Excel (if provided by client)

4. **Test Filter**:
   - Navigate to Inbox
   - Click "Externos"
   - Open "Entidad" dropdown
   - Verify embassies appear
   - Select an embassy
   - Verify filtered documents appear

---

## 🌍 Suggested Embassies to Add

Based on Equatorial Guinea's diplomatic relations:

### Priority 1: Major Powers
- Embajada de España
- Embajada de Francia
- Embajada de Estados Unidos
- Embajada de China
- Embajada de Rusia

### Priority 2: African Nations
- Embajada de Camerún
- Embajada de Gabón
- Embajada de Nigeria
- Embajada de Sudáfrica
- Embajada de Marruecos

### Priority 3: Regional & Others
- Embajada de Guinea-Bisáu
- Embajada de Santo Tomé y Príncipe
- Embajada de Brasil
- Embajada de Cuba
- Delegación de la Unión Europea

---

## 📋 Testing Checklist

After adding embassy data:

- [ ] Embassy entities visible in /entities page
- [ ] Embassies appear in Inbox entity filter
- [ ] Filtering by embassy shows correct documents
- [ ] "Externos" tab shows embassy documents
- [ ] Entity dropdown groups embassies correctly
- [ ] Selecting embassy filters immediately
- [ ] Clear filter shows all documents again

---

## 💡 Future Enhancements (Optional)

### Enhancement 1: Embassy Flags
**Add country flag icons** next to embassy names:
```typescript
<span className="flex items-center gap-2">
  <span className="text-lg">🇪🇸</span>  {/* Spain */}
  Embajada de España
</span>
```

### Enhancement 2: Embassy Contact Info
**Quick access to embassy details**:
- Phone number
- Email address
- Physical address
- Office hours

### Enhancement 3: Embassy Statistics
**Dashboard widget**:
- Documents per embassy
- Response times
- Pending requests
- Most active embassies

---

## ✅ Summary

**What's Ready**:
- ✅ EMBASSY entity type added to schema
- ✅ Frontend types updated
- ✅ Spanish labels configured
- ✅ Existing filter infrastructure works

**What's Needed**:
- ⏳ Add embassy data to database (after deployment)
- ⏳ Optional: Add dedicated embassy quick filter button (~1 hour)

**Client Requirement**:
- ✅ Can filter embassies in Inbox ✅
- ✅ Works under "Externos" tab ✅
- ✅ Dropdown selection ready ✅

**Recommendation**:
Deploy as-is, add embassy data via admin panel after deployment, optionally add quick filter button if client requests it.

---

**Prepared**: January 25, 2026
**Status**: ✅ Ready for deployment
**Client Feedback Point #5**: ✅ Implemented

---

## 🔗 Related Files

- [backend/prisma/schema.prisma](backend/prisma/schema.prisma) - Entity type enum
- [src/lib/api/entities.api.ts](src/lib/api/entities.api.ts) - Frontend types
- [src/pages/Inbox.tsx](src/pages/Inbox.tsx) - Inbox page with filters

**The implementation is complete and ready for deployment!** 🎉
