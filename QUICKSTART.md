# Quick Start Guide

## 1. Setup (5 min)

### Copy skeleton files into your project:
```bash
# Create directory structure
mkdir -p src/data src/skills src/components/{MemberList,CircleManager,PracticeSelector,PlanGenerator,FeedbackForm,HistoryView}

# Copy all the skeleton files you received
# package.json, tsconfig.json, vite.config.ts, etc. go in root
# src/types.ts, src/*.skill.ts, src/App.tsx, src/main.tsx go in src/
```

### Install dependencies:
```bash
npm install
# Also install:
npm install @vitejs/plugin-react
```

### Convert practices data:
```bash
python3 convert-practices.py GoodSpan-practices.xlsx src/data/practices-data.json
```

### Start dev server:
```bash
npm run dev
```

Visit `http://localhost:5173` — you should see the GoodSpan admin skeleton with placeholder views.

---

## 2. Build Order

Follow this order to implement components. Each one uses only the files before it.

### Step 1: Database Connection
- Implement hooks in each component folder
- Each hook should call `db.method()` and cache with useState/useReducer
- Example for MemberList:

```typescript
// src/components/MemberList/useMembers.ts
import { useState, useEffect } from 'react';
import { db } from '../../skills/db.skill';
import { Member } from '../../types';

export function useMembers(spanId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = db.getMembersBySpan(spanId);
      setMembers(data);
    } finally {
      setLoading(false);
    }
  }, [spanId]);

  return { members, loading };
}
```

### Step 2: Build Components in Order
1. **MemberList** (read-only first, then add/edit)
2. **CircleManager** (create circles, drag-drop members)
3. **PracticeSelector** (search 220+ practices, pick 5)
4. **PlanGenerator** (render PDF preview, download)
5. **FeedbackForm** (simple form, save to DB)
6. **HistoryView** (show past spans per member)

### Step 3: Polish
- Error boundaries
- Loading states
- Confirmation dialogs
- Toast notifications
- CSV import (Phase 2)

---

## 3. Key Patterns

### Reading Data from Database
```typescript
const members = db.getMembersBySpan(spanId);
```

### Writing Data to Database
```typescript
db.createMember({
  id: generateId(),
  spanId,
  email: 'user@example.com',
  name: 'John Doe',
  pillar: 'sleep',
});
```

### Searching Practices
```typescript
const results = practicesLib.search('sleep', 'circadian');
```

### Generating PDF
```typescript
const pdf = await generatePlanPDF(member, selections, practices);
// Browser: download it
// Server: send to API
```

---

## 4. Testing Locally

### Add sample data:
```typescript
// In a test component or admin page
db.createSpan({
  id: 'founding-sept-2026',
  name: 'Founding Span of September 2026',
  pillar: 'sleep',
  startDate: '2026-09-17',
  endDate: '2026-10-17',
});

db.createMember({
  id: 'member-1',
  spanId: 'founding-sept-2026',
  email: 'sofia@example.com',
  name: 'Sofia Morazzo',
  pillar: 'sleep',
});
```

### View database:
```bash
sqlite3 goodspan.db
> SELECT * FROM members;
> .schema
```

---

## 5. Common Tasks

### Add a new field to Member
1. Update `types.ts` (Member type)
2. Update database schema in `db.skill.ts` (ALTER TABLE or migrate)
3. Update component that uses members

### Add new component view
1. Add to View type in App.tsx
2. Create component folder in src/components/
3. Add case in main render

### Debug database issues
```bash
# Inspect database
sqlite3 goodspan.db

# Backup before testing
cp goodspan.db goodspan.db.backup

# Reset (careful!)
rm goodspan.db
# App will recreate on next run
```

---

## 6. Files Reference

| File | Purpose | Edit? |
|------|---------|-------|
| `types.ts` | Type definitions | ✅ Extend as needed |
| `db.skill.ts` | Database queries | ⚠️ Extend methods, don't modify existing |
| `practices.skill.ts` | Practice bank | ❌ Leave as-is (read-only) |
| `pdf-generator.skill.ts` | PDF rendering | ✅ Customize template |
| `App.tsx` | Router & layout | ✅ Add views, update nav |
| Components | UI implementation | ✅ Build from scratch |

---

## 7. Next Steps After MVP

- [ ] Connect to backend (if needed)
- [ ] Add authentication
- [ ] Email integration (send PDFs)
- [ ] Analytics dashboard
- [ ] Admin audit log
- [ ] Feedback trends

---

## 8. Troubleshooting

**Error: "Practices not loaded"**
- Make sure `await practicesLib.load()` is called in App.tsx useEffect before any component tries to use it

**Error: "SQLITE_CANTOPEN"**
- Check node_modules/better-sqlite3 is installed
- Try: `npm install --save-dev @types/better-sqlite3`

**Error: "Cannot find module 'db.skill'"**
- Make sure skill files are in `src/skills/` not `src/`
- Update import paths to use `@/skills/db.skill`

**PDF not generating**
- In browser: uses html2pdf library (need to add to package.json)
- On server: uses puppeteer (need to configure)
- For Phase 1, just download HTML as a workaround

---

## Reference

- **Spec:** See `SPAN_ADMIN_SPEC.md` for complete technical details
- **Data:** Practices bank loaded from `src/data/practices-data.json`
- **Members:** 987 assessment responses in the XLSX you sent

Questions? Review the spec or ask me when you get stuck on implementation.
