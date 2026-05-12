## ADDED Requirements

### Requirement: Universal document viewer in justificants modal
The modal for viewing justificant details SHALL display any uploaded document file (PDF or image) inline.

#### Scenario: Display PDF document
- **WHEN** user opens a justificant modal where `document` field ends with `.pdf`
- **THEN** the modal displays an `<embed>` element rendering the PDF content

#### Scenario: Display image document
- **WHEN** user opens a justificant modal where `document` field ends with `.jpg`, `.jpeg`, `.png`, or `.gif`
- **THEN** the modal displays an `<img>` element showing the image

#### Scenario: No document attached
- **WHEN** user opens a justificant modal where `document` field is null or empty
- **THEN** the modal displays a placeholder message "No hi ha document adjuntat"

#### Scenario: Unknown file type
- **WHEN** user opens a justificant modal where `document` field has an unrecognized extension
- **THEN** the modal displays a fallback message indicating the file cannot be previewed

### Requirement: Document path resolution
The viewer SHALL correctly resolve the document path from the database to a valid URL for display.

#### Scenario: Construct correct URL for document
- **WHEN** the database stores path `storage/private/justificants/11/file.pdf`
- **THEN** the frontend constructs URL as `http://localhost:8000/back/storage/private/justificants/11/file.pdf`

#### Scenario: Empty document field
- **WHEN** `document` field is null or empty string
- **THEN** viewer shows no-document placeholder