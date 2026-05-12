## Context

The `/gestio-justificants` view displays a list of students with their justificants. Each justificant has three possible states: Pendent, Acceptada, Rebutjada. The document field stores the file path (e.g., `storage/private/justificants/11/CAT - TonyMartinMarin_CV.pdf`).

Currently:
- The modal preview only uses `<img>` tag, which doesn't render PDFs
- All justificants are shown regardless of status
- All student cards are shown even if they have no pending justificants

## Goals / Non-Goals

**Goals:**
- Display any file type (PDF, images) in the modal document preview
- Add toggle to filter and show only "Pendent" justificants
- Hide student cards that have no pending justificants when filter is active

**Non-Goals:**
- Backend changes (API already returns the document path)
- Database changes
- Download functionality (viewing only)
- Bulk actions on justificants

## Decisions

### 1. Document Viewer Implementation
**Decision:** Use conditional rendering with `<embed>` for PDFs and `<img>` for images.

**Rationale:**
- Simple implementation without external dependencies
- Native browser support for both formats
- Alternative considered: Use PDF.js library - adds dependency overhead for simple use case

**Implementation:**
```typescript
// Detect file type from extension
const isPdf = (url: string | null): boolean => {
  if (!url) return false;
  return url.toLowerCase().endsWith('.pdf');
};
```

### 2. Filter Toggle Placement
**Decision:** Add toggle in the header section of the view, next to the title.

**Rationale:**
- Standard pattern for list filters
- Visible without scrolling
- Alternative considered: Filter inside each student card - too cluttered

### 3. Filtering Logic
**Decision:** Filter at two levels:
- Student level: Only show student cards that have at least one "Pendent" justificants when filter is active
- Justificant level: Show only "Pendent" justificants within each student's list

**Rationale:**
- Cleaner UX - professors see only what needs action
- Alternative considered: Show all students but filter justificants - leaves empty student cards

## Risks / Trade-offs

- **PDF viewing in modal**: Some browsers may block embedded PDFs due to sandbox restrictions → Mitigation: Add fallback link to download
- **File path format**: Assumes file extension is reliable indicator of type → Mitigation: Check extension, provide generic viewer as fallback
- **Large PDF files**: Embedded PDFs may be slow to load → Mitigation: Add loading state, user can still see justificants info without document

## Open Questions

- Should the filter state persist across page navigation? (Not implemented - simple session-only toggle)
- Do we need to handle other file types besides PDF and images? (Not in scope - current requirements only mention these two)