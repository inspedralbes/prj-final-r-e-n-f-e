## 1. Document Viewer Implementation

- [x] 1.1 Add `isPdf()` helper function in justificants.component.ts to detect file type from URL
- [x] 1.2 Add `getFullDocumentUrl()` helper function to construct full URL for document path
- [x] 1.3 Update document-preview section in justificants.component.html to use conditional rendering (embed for PDF, img for images)
- [x] 1.4 Add fallback handling for unsupported file types in document preview

## 2. Status Filter Toggle Implementation

- [x] 2.1 Add `mostrarNomésPendents` signal in justificants.component.ts
- [x] 2.2 Create filteredJustificants computed property that filters justificants by Pendent status
- [x] 2.3 Add toggle HTML element in header section of justificants.component.html
- [x] 2.4 Implement logic to hide student cards with no pending justificants when filter is active

## 3. Testing and Verification

- [ ] 3.1 Test PDF document display in modal
- [ ] 3.2 Test image document display in modal
- [ ] 3.3 Test filter toggle shows only pending justificants
- [ ] 3.4 Test empty state when no pending justificants exist
- [ ] 3.5 Verify existing functionality (accept/reject buttons) still works