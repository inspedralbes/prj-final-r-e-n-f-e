## ADDED Requirements

### Requirement: Absence Status Display
The system SHALL display a detailed list of absences for the selected subject. Each entry MUST show the date, time, and one of the following statuses:
- **Justificada**: The absence is justified and accepted.
- **Pendent de revisió**: A justification has been submitted but is waiting for teacher/admin approval.
- **No justificada**: No justification has been submitted for this absence.

#### Scenario: View absence status
- **WHEN** a student views their list of absences
- **THEN** each absence entry displays its current justification status

### Requirement: Justification Management Page
The system SHALL provide a dedicated page for managing justifications. This page MUST be accessible via the sidebar navigation.

#### Scenario: Navigate to justifications page
- **WHEN** a student clicks the "Justificants" icon in the sidebar
- **THEN** the system navigates to the `/alumnes/justificants` page

#### Scenario: View justification history
- **WHEN** a student views the justifications page
- **THEN** the system displays a list of all previously submitted justifications, including:
    - Submission date
    - Justified date range (start and end)
    - Comment
    - Status (e.g., "Pendent", "Acceptat", "Rebutjat")

### Requirement: Justification Submission
The justifications page SHALL provide a "Nou Justificant" button. Clicking this button MUST open a modal or popup where the student can submit a justification for a specific date range (start date and end date), including a text description and/or file upload.

#### Scenario: Open justification modal
- **WHEN** a student clicks the "Nou Justificant" button on the justifications page
- **THEN** a modal appears with fields for start date, end date, justification text, and document upload

#### Scenario: Submit justification
- **WHEN** a student submits the justification modal with required information
- **THEN** the absence status changes to "Pendent d'acceptació" and the information is stored in the system

### Requirement: Automatic Justification Validation
The system SHALL validate that a justification has been provided before allowing the submission.

#### Scenario: Submit without justification
- **WHEN** a student attempts to submit the modal without providing a description or document
- **THEN** the system prevents submission and displays an error message
