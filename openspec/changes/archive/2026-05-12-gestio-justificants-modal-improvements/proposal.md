## Why

The current /gestio-justificants view has two usability issues:
1. The document preview in the modal only supports images, but the backend stores both PDF and image files. Users cannot view PDF documents uploaded by students.
2. The view shows all justificants regardless of status, making it difficult for professors to focus on pending requests. When there are many resolved justificants, the pending ones get buried.

## What Changes

- **Add universal document viewer in modal**: Display both PDF and image files in the justificants detail modal. Use an iframe/embed for PDFs and img tag for images.
- **Add status filter toggle**: Add a toggle to show/hide resolved justificants (Acceptada/Rebutjada). When enabled, only show justificants with 'Pendent' status.
- **Hide empty student cards**: When filter is active and a student has no pending justificants, don't display their card at all.

## Capabilities

### New Capabilities
- `justificant-document-viewer`: Universal document viewer component for displaying both PDF and image files in the modal
- `justificant-status-filter`: Toggle functionality to filter justificants by status (Pendent only vs all)

### Modified Capabilities
- None

## Impact

- Frontend: Modify `justificants.component.html` and `justificants.component.ts` to add document viewer logic and filter toggle
- No backend changes required
- No database changes required