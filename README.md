# GoodSpan Admin CRM

Admin dashboard for managing 30-day longevity span programs.

## Project Structure

```
src/
├── skills/              # Pure business logic (no React)
│   ├── db.skill.ts      # SQLite database layer
│   ├── practices.skill.ts # Practice bank (220+ items)
│   ├── pdf-generator.skill.ts # PDF rendering
│   └── overrides.skill.ts # Admin edits (Phase 2)
│
├── components/          # React UI components
│   ├── MemberList/
│   ├── CircleManager/
│   ├── PracticeSelector/
│   ├── PlanGenerator/
│   ├── FeedbackForm/
│   └── HistoryView/
│
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app router & layout
├── main.tsx             # React entry point
└── index.css            # Tailwind styles
```

## Data Flow

```
App
  ├─ Load practices (practicesLib.load())
  ├─ Select span
  │
  ├─ MemberList
  │  ├─ useMembers(spanId) → db.getMembersBySpan()
  │  └─ Create/Edit member → db.createMember()
  │
  ├─ CircleManager
  │  ├─ useCircles(spanId) → db.getCirclesBySpan()
  │  └─ Drag-drop → db.addMemberToCircle()
  │
  ├─ PracticeSelector
  │  ├─ usePracticeSelection(memberId) → db.getPracticeSelectionsByMember()
  │  └─ Select 5 practices → db.createPracticeSelection()
  │
  ├─ PlanGenerator
  │  └─ Generate PDF → generatePlanPDF() → download
  │
  └─ FeedbackForm
     └─ Collect feedback → db.createFeedback()
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Add practices data:**
   - Convert `GoodSpan-practices.xlsx` to `src/data/practices-data.json`
   - Use the Python script or Excel export to JSON

4. **Start dev server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Key Files to Implement

### Phase 1 (MVP)
- [ ] Convert practices XLSX to JSON (practices-data.json)
- [ ] Implement db connection in components (useMembers, useCircles, etc.)
- [ ] Build MemberList component
- [ ] Build CircleManager component
- [ ] Build PracticeSelector component
- [ ] Build PlanGenerator component
- [ ] Build FeedbackForm component

### Phase 2
- [ ] Bulk CSV import for members
- [ ] Email integration (send PDFs to participants)
- [ ] Feedback analytics dashboard
- [ ] PDF template customization per span
- [ ] Multi-admin auth with audit logs
- [ ] Admin notes/comments on members

## Skills (Modules)

### db.skill.ts
Pure database queries. No side effects, no React.

**Public methods:**
```typescript
db.createSpan() / getSpan() / getAllSpans() / updateSpan() / deleteSpan()
db.createMember() / getMember() / getMembersBySpan() / updateMember() / deleteMember()
db.createCircle() / getCircle() / getCirclesBySpan() / updateCircle() / deleteCircle()
db.createPracticeSelection() / getPracticeSelectionsByMember() / updatePracticeSelection()
db.createFeedback() / getFeedbackByMember() / getFeedbackBySpan()
db.addMemberToCircle() / removeMemberFromCircle()
```

### practices.skill.ts
In-memory practice bank. Load once, serve reads.

**Public methods:**
```typescript
practicesLib.load() // Load JSON on startup
practicesLib.search(pillar, query) // Search by text/category
practicesLib.getByCategory(pillar, category)
practicesLib.findPractice(pillar, category, text)
practicesLib.getReferences(practices)
practicesLib.getByLevel(pillar, level)
```

### pdf-generator.skill.ts
Render plan PDFs.

**Public methods:**
```typescript
generatePlanPDF(member, selections, practices, options) → Buffer
generatePlansBulk(members, getSelectionsAndPractices, options) → Array
```

## Notes

- Database: SQLite (better-sqlite3) stored as `goodspan.db`
- No API calls in Phase 1; all data local
- Each component owns its own queries via custom hooks
- Practices loaded once at startup; never updated without restart
- PDF generation works client-side for now; can move to server later

## Reference

See `SPAN_ADMIN_SPEC.md` for complete technical specification.
