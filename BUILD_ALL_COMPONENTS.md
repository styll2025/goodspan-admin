# Build All Components — Complete Guide

Build all remaining views in order. Each section is ready for Cursor to implement.

---

## 1. MemberList Component

**File:** `src/components/MemberList/MemberList.tsx`

### Purpose
Display all members in the span, add new members, edit existing members.

### Props
```typescript
interface MemberListProps {
  spanId: string;
}
```

### Layout
```
Header: "Members" + "Add Member" button

Search bar (search by name/email)

Table:
  Name | Email | Pillar | Circle | Actions
  ────────────────────────────────────────
  Sofia | sofia@... | GoodSleep | Circle 1 | Edit | Delete
  Luisa | luisa@... | GoodEat | - | Edit | Delete
  ...

Modal (Add/Edit):
  Name: [text input]
  Email: [email input]
  Pillar: [dropdown: sleep/eat/move/mind]
  [Save] [Cancel]
```

### Data Flow
```typescript
// useMembers hook
const [members, setMembers] = useState<Member[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const data = db.getMembersBySpan(spanId);
  setMembers(data);
  setLoading(false);
}, [spanId]);

// Create member
const handleAdd = (data: { name, email, pillar }) => {
  db.createMember({
    id: generateId(),
    spanId,
    name: data.name,
    email: data.email,
    pillar: data.pillar,
  });
  setMembers([...members, newMember]);
};

// Edit member
const handleEdit = (memberId, data) => {
  db.updateMember(memberId, data);
  setMembers(members.map(m => m.id === memberId ? {...m, ...data} : m));
};

// Delete member
const handleDelete = (memberId) => {
  db.deleteMember(memberId);
  setMembers(members.filter(m => m.id !== memberId));
};
```

### Sub-components
- `MemberTable.tsx` — List of members with edit/delete buttons
- `MemberForm.tsx` — Modal form for add/edit
- `useMembersData.ts` — Custom hook for data

### Styling Notes
- Use Tailwind for table styling
- Modal with backdrop
- Delete confirmation dialog

---

## 2. CircleManager Component

**File:** `src/components/CircleManager/CircleManager.tsx`

### Purpose
Create circles (groups), assign members to them, show circle distribution.

### Props
```typescript
interface CircleManagerProps {
  spanId: string;
}
```

### Layout
```
Header: "Circles" + "Create Circle" button

Circles Grid (or Board):
  ┌─ Circle 1 (5 members) ─────┐
  │ Sofia (GoodSleep)          │
  │ Luisa (GoodSleep)          │
  │ [+ Add Member]             │
  └────────────────────────────┘

  ┌─ Circle 2 (4 members) ─────┐
  │ Teresa (GoodEat)           │
  │ [+ Add Member]             │
  └────────────────────────────┘

Unassigned Members:
  ┌─────────────────────────────┐
  │ Mattéo (GoodEat) - Drag here│
  │ Julia (GoodMove)            │
  └─────────────────────────────┘

Modal (Create Circle):
  Name: [text input, e.g. "Sleep Circle A"]
  [Create] [Cancel]

Modal (Add Member to Circle):
  Select member: [dropdown of unassigned]
  [Add] [Cancel]
```

### Data Flow
```typescript
const [circles, setCircles] = useState<Circle[]>([]);
const [members, setMembers] = useState<Member[]>([]);

useEffect(() => {
  const circlesData = db.getCirclesBySpan(spanId);
  const membersData = db.getMembersBySpan(spanId);
  setCircles(circlesData);
  setMembers(membersData);
}, [spanId]);

// Create circle
const handleCreateCircle = (name) => {
  const circle = db.createCircle({
    id: generateId(),
    spanId,
    name,
  });
  setCircles([...circles, circle]);
};

// Add member to circle
const handleAddMemberToCircle = (memberId, circleId) => {
  db.addMemberToCircle(memberId, circleId);
  setMembers(members.map(m => 
    m.id === memberId ? {...m, circleId} : m
  ));
};

// Remove member from circle
const handleRemoveMember = (memberId) => {
  db.removeMemberFromCircle(memberId);
  setMembers(members.map(m => 
    m.id === memberId ? {...m, circleId: null} : m
  ));
};

// Get members in circle
const getMembersInCircle = (circleId) => 
  members.filter(m => m.circleId === circleId);

const getUnassignedMembers = () => 
  members.filter(m => !m.circleId);
```

### Sub-components
- `CircleBoard.tsx` — Grid/board of circles
- `CircleCard.tsx` — Individual circle with members
- `MemberTag.tsx` — Member pill/tag (draggable)
- `useCirclesData.ts` — Custom hook

### Styling Notes
- Cards with rounded borders
- Member pills with pillar color badges
- Drag-and-drop for assigning (optional for Phase 1, can use select dropdown)
- "Unassigned" section at bottom

---

## 3. PracticeSelector Component

**File:** `src/components/PracticeSelector/PracticeSelector.tsx`

### Purpose
Select exactly 5 practices per member from 220+ practice bank.

### Props
```typescript
interface PracticeSelectorProps {
  spanId: string;
}
```

### Layout
```
Header: "Plans" (0/33 complete) + "Select Practices" button

Progress bar: [████░░░░░░] 12/33 members have practices

Table of members needing practices:
  Member | Pillar | Circle | Actions
  ─────────────────────────────────────
  Sofia | GoodSleep | Circle 1 | [Select Practices]
  Luisa | GoodSleep | Circle 1 | [View Selected] [Edit]
  ...

Modal (Select Practices):
  Member: Sofia Morazzo (GoodSleep)
  
  Search: [search box] [Filter by category]
  
  Available practices (filtered by pillar):
  ┌─────────────────────────────────────────┐
  │ ☐ Practice 1: "Consistent sleep schedule"
  │   Category: Circadian Rhythm
  │   Level: Gentle
  │   Why: Better sleep quality
  │   [Mark as starting point]
  │
  │ ☐ Practice 2: "Magnesium supplement"
  │   Category: Nutrition
  │   Level: Moderate
  │   [Mark as starting point]
  │
  │ ☑ Practice 3: "Evening wind-down routine"
  │   Category: Habits
  │   Level: Gentle
  │   ✓ SELECTED (Position: 1)
  │   ☑ Starting point
  └─────────────────────────────────────────┘
  
  Selected (5/5):
  1. Evening wind-down routine ✓
  2. Consistent sleep schedule ✓
  3. [empty slot]
  4. [empty slot]
  5. [empty slot]
  
  [Save & Next Member] [Save & Close]
```

### Data Flow
```typescript
const [members, setMembers] = useState<Member[]>([]);
const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
const [practices, setPractices] = useState<Practice[]>([]);
const [selections, setSelections] = useState<PracticeSelection[]>([]);
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  // Load members needing practices (those without 5 selections)
  const allMembers = db.getMembersBySpan(spanId);
  const allSelections = db.getPracticeSelectionsBySpan(spanId);
  
  const membersWithAllPractices = new Set(
    allSelections
      .filter(s => s.position === 5)
      .map(s => s.memberId)
  );
  
  const needingPractices = allMembers.filter(
    m => !membersWithAllPractices.has(m.id)
  );
  
  setMembers(needingPractices);
  setSelections(allSelections);
}, [spanId]);

// Get practices for member's pillar
const getAvailablePractices = (memberId) => {
  const member = members.find(m => m.id === memberId);
  if (!member) return [];
  
  let pracs = practicesLib.getByPillar(member.pillar);
  
  if (searchQuery) {
    pracs = pracs.filter(p => 
      p.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  return pracs;
};

// Get current selections for member
const getSelectionsForMember = (memberId) => 
  selections.filter(s => s.memberId === memberId)
    .sort((a, b) => a.position - b.position);

// Select a practice (add to position N)
const handleSelectPractice = (memberId, practice, position, isStartingPoint) => {
  const existing = selections.filter(s => s.memberId === memberId);
  
  // Check if already selected
  if (existing.some(s => s.practiceText === practice.text)) {
    return; // Already selected
  }
  
  const selection = db.createPracticeSelection({
    id: generateId(),
    memberId,
    spanId,
    practiceText: practice.text,
    category: practice.category,
    pillar: member.pillar,
    level: practice.level,
    position,
    isStartWithThis: isStartingPoint,
    why: practice.why,
    evidence: practice.evidence,
    references: practice.references,
  });
  
  setSelections([...selections, selection]);
};

// Remove practice
const handleRemovePractice = (selectionId) => {
  db.deletePracticeSelection(selectionId);
  setSelections(selections.filter(s => s.id !== selectionId));
};

// Save all selections for member
const handleSaveAndNext = (memberId) => {
  const memberSelections = getSelectionsForMember(memberId);
  if (memberSelections.length < 5) {
    alert('Please select 5 practices');
    return;
  }
  
  // Close modal, move to next member
  setSelectedMemberId(null);
  const nextMember = members.find(m => m.id !== memberId);
  if (nextMember) {
    setSelectedMemberId(nextMember.id);
  }
};
```

### Sub-components
- `PracticeBank.tsx` — Searchable list of practices
- `SelectedPractices.tsx` — Ordered list of 5 selected
- `PracticeCard.tsx` — Individual practice with details
- `usePracticeSelection.ts` — Custom hook

### Styling Notes
- Practice cards with category badges
- Search box with filter dropdown
- Checkboxes for selection
- Drag to reorder selected practices (optional)
- Color-code by pillar (sleep: blue, eat: green, move: orange, mind: purple)

---

## 4. PlanGenerator Component

**File:** `src/components/PlanGenerator/PlanGenerator.tsx`

### Purpose
Generate personalized PDFs for members who have 5 practices selected. Download or send via email.

### Props
```typescript
interface PlanGeneratorProps {
  spanId: string;
}
```

### Layout
```
Header: "Plans" (12/33 generated)

Filter: [All] [Generated] [Pending]

Table:
  Member | Pillar | Circle | Status | Actions
  ──────────────────────────────────────────────
  Sofia | GoodSleep | Circle 1 | ✓ Generated | [Download] [Regenerate]
  Luisa | GoodSleep | Circle 1 | ✓ Generated | [Download] [Regenerate]
  Teresa | GoodEat | Circle 2 | ⏳ Pending (no practices) | [Select Practices]
  ...

Modal (PDF Preview):
  [Close] [Download]
  ─────────────────────────────────────
  [PDF Preview iframe or embedded]
```

### Data Flow
```typescript
const [members, setMembers] = useState<Member[]>([]);
const [plans, setPlans] = useState<{ memberId: string, generated: boolean }[]>([]);
const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
const [previewPdf, setPreviewPdf] = useState<Buffer | null>(null);

useEffect(() => {
  const allMembers = db.getMembersBySpan(spanId);
  const allSelections = db.getPracticeSelectionsBySpan(spanId);
  
  // Calculate which members have 5 practices
  const membersWithPlans = new Set(
    allSelections
      .filter(s => s.position === 5)
      .map(s => s.memberId)
  );
  
  const plansData = allMembers.map(m => ({
    memberId: m.id,
    generated: membersWithPlans.has(m.id),
  }));
  
  setMembers(allMembers);
  setPlans(plansData);
}, [spanId]);

// Generate PDF for a member
const handleGeneratePdf = async (memberId) => {
  const member = db.getMember(memberId);
  const selections = db.getPracticeSelectionsByMember(memberId);
  
  // Collect practice data
  const practicesData = selections.map(s => 
    practicesLib.findPractice(s.pillar, s.category, s.practiceText)
  );
  
  // Generate PDF
  const pdfBuffer = await generatePlanPDF(member, selections, practicesData, {
    spanName: db.getSpan(spanId).name,
    spanDates: `${db.getSpan(spanId).startDate} - ${db.getSpan(spanId).endDate}`,
  });
  
  setPreviewPdf(pdfBuffer);
  setSelectedMemberId(memberId);
};

// Download PDF
const handleDownload = (memberId) => {
  const member = db.getMember(memberId);
  const filename = `${member.name.replace(/\s+/g, '_')}_Plan.pdf`;
  
  // Trigger download
  const blob = new Blob([previewPdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Get member plan status
const getMemberStatus = (memberId) => {
  const hasSelections = plans.find(p => p.memberId === memberId)?.generated;
  return hasSelections ? '✓ Ready' : '⏳ Missing practices';
};
```

### Sub-components
- `PlansList.tsx` — Table of members and plan status
- `PlanPreview.tsx` — Modal with PDF preview
- `usePlanGeneration.ts` — Custom hook

### Integration with pdf-generator.skill.ts
```typescript
// Use existing function
import { generatePlanPDF } from '../skills/pdf-generator.skill';

const pdfBuffer = await generatePlanPDF(member, selections, practices, options);
```

### Styling Notes
- Status badges (ready/pending)
- Download button styling
- PDF preview in modal (use iframe or canvas)

---

## 5. EvaluationForm Component

**File:** `src/components/EvaluationForm/EvaluationForm.tsx`

### Purpose
Collect feedback from members at end of span. Store responses.

### Props
```typescript
interface EvaluationFormProps {
  spanId: string;
}
```

### Layout
```
Header: "Evaluation" (9/33 submitted)

Progress bar: [████░░░░░░] 9/33 members

Members pending feedback:
  ┌──────────────────────────────┐
  │ Sofia Morazzo (GoodSleep)    │
  │ [View Form] [Mark Complete]  │
  └──────────────────────────────┘
  
  ┌──────────────────────────────┐
  │ Luisa Cariano (GoodSleep)    │
  │ [View Form] [Mark Complete]  │
  └──────────────────────────────┘

Modal (Feedback Form):
  Member: Sofia Morazzo
  Span: Sep 2026
  
  1. How satisfied are you with the plan? (1-5 stars)
  
  2. Which practice was most helpful?
     [dropdown with their 5 selected practices]
  
  3. Which practice was hardest to maintain?
     [dropdown with their 5 selected practices]
  
  4. Overall progress (1-10)
     [slider]
  
  5. Additional comments
     [text area]
  
  [Submit] [Cancel]
```

### Data Flow
```typescript
const [members, setMembers] = useState<Member[]>([]);
const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

useEffect(() => {
  const allMembers = db.getMembersBySpan(spanId);
  const allFeedback = db.getFeedbackBySpan(spanId);
  
  const feedbackMemberIds = new Set(allFeedback.map(f => f.memberId));
  const pendingMembers = allMembers.filter(m => !feedbackMemberIds.has(m.id));
  
  setMembers(pendingMembers);
  setFeedback(allFeedback);
}, [spanId]);

// Submit feedback
const handleSubmitFeedback = (formData) => {
  const entry = db.createFeedback({
    id: generateId(),
    memberId: selectedMemberId,
    spanId,
    satisfactionRating: formData.satisfaction,
    mostHelpful: formData.mostHelpful,
    hardestToMaintain: formData.hardest,
    overallProgress: formData.progress,
    comments: formData.comments,
    submittedAt: new Date().toISOString(),
  });
  
  setFeedback([...feedback, entry]);
  setMembers(members.filter(m => m.id !== selectedMemberId));
  setSelectedMemberId(null);
};

// Get member's practices for dropdown
const getMemberPractices = (memberId) => 
  db.getPracticeSelectionsByMember(memberId)
    .sort((a, b) => a.position - b.position);
```

### Sub-components
- `FeedbackFormModal.tsx` — Form modal
- `FeedbackList.tsx` — List of pending members
- `useFeedback.ts` — Custom hook

### Styling Notes
- Star rating component
- Slider for progress
- Dropdown with practice list

---

## 6. HistoryView Component

**File:** `src/components/HistoryView/HistoryView.tsx`

### Purpose
Show member history across all spans they've participated in.

### Props
```typescript
interface HistoryViewProps {
  spanId: string;
}
```

### Layout
```
Header: "Directory" (All Members)

Search: [search by name/email]

Member Directory:
  Sofia Morazzo
  Email: sofia@...
  ─────────────────────────────────
  Spans:
    • Sep 2026 (GoodSleep) - Circle 1 - [View Plan] - [View Feedback]
    • Jul 2026 (GoodMove) - Circle 2 - [View Plan] - No feedback yet
    • May 2026 (GoodEat) - Circle 1 - [View Plan] - [View Feedback]
  
  Luisa Cariano
  Email: luisa@...
  ─────────────────────────────────
  Spans:
    • Sep 2026 (GoodSleep) - Circle 1 - [View Plan] - [View Feedback]
    • Jun 2026 (GoodMove) - Circle 2 - No plan - [View Feedback]
```

### Data Flow
```typescript
const [allMembers, setAllMembers] = useState<Member[]>([]);
const [spans, setSpans] = useState<Span[]>([]);
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  // Get all members across ALL spans
  const allSpans = db.getAllSpans();
  const allMembersData: { [key: string]: Member & { spans: SpanHistory[] } } = {};
  
  allSpans.forEach(span => {
    const spanMembers = db.getMembersBySpan(span.id);
    spanMembers.forEach(member => {
      if (!allMembersData[member.id]) {
        allMembersData[member.id] = { ...member, spans: [] };
      }
      
      const selections = db.getPracticeSelectionsByMember(member.id)
        .filter(s => s.spanId === span.id);
      const feedback = db.getFeedbackByMember(member.id)
        .filter(f => f.spanId === span.id);
      
      allMembersData[member.id].spans.push({
        spanId: span.id,
        spanName: span.name,
        pillar: member.pillar,
        circleId: member.circleId,
        hasPlan: selections.length > 0,
        hasFeedback: feedback.length > 0,
      });
    });
  });
  
  setAllMembers(Object.values(allMembersData));
  setSpans(allSpans);
}, []);

// Filter by search
const filteredMembers = searchQuery
  ? allMembers.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : allMembers;
```

### Sub-components
- `DirectoryList.tsx` — All members list
- `MemberHistoryCard.tsx` — Member + their span history
- `useHistory.ts` — Custom hook

### Styling Notes
- Expandable member cards
- Timeline or badge-based span display
- Color by pillar

---

## Build Order

1. **MemberList** (Day 1)
   - Basic CRUD for members
   - Gets data foundation working

2. **CircleManager** (Day 1-2)
   - Assign members to groups
   - Shows circle distribution

3. **PracticeSelector** (Day 2-3)
   - Pick 5 practices per member
   - Search 220+ practices

4. **PlanGenerator** (Day 3-4) ⭐ **Your priority feature**
   - Generate PDFs
   - Download/preview
   - Most important for end users

5. **EvaluationForm** (Day 4)
   - Collect feedback
   - Basic form handling

6. **HistoryView** (Day 5)
   - Cross-span member tracking
   - Directory/reference tool

---

## Testing Checklist (Per Component)

After each component:
- [ ] Data loads correctly from database
- [ ] Add/Create works
- [ ] Edit/Update works
- [ ] Delete/Remove works (with confirmation)
- [ ] Search/Filter works
- [ ] No console errors
- [ ] Responsive layout
- [ ] Navigation back to Overview works

---

## Important Database Methods

Make sure these exist in db.skill.ts:
```typescript
db.getMembersBySpan(spanId)
db.createMember(data)
db.updateMember(memberId, data)
db.deleteMember(memberId)

db.getCirclesBySpan(spanId)
db.createCircle(data)
db.addMemberToCircle(memberId, circleId)
db.removeMemberFromCircle(memberId)

db.getPracticeSelectionsBySpan(spanId)
db.getPracticeSelectionsByMember(memberId)
db.createPracticeSelection(data)
db.updatePracticeSelection(selectionId, data)
db.deletePracticeSelection(selectionId)

db.getFeedbackBySpan(spanId)
db.getFeedbackByMember(memberId)
db.createFeedback(data)

db.getAllSpans()
db.getSpan(spanId)
```

If any are missing, add them to db.skill.ts first.

---

## Next Steps

1. Copy this file into your Cursor project
2. Open Cursor
3. Show it this guide + screenshot
4. Ask: "Build all components in order following this guide. Start with MemberList."
5. Cursor will generate the components
6. Test each with `npm run dev`
7. Commit to GitHub after each component works

Good luck!
