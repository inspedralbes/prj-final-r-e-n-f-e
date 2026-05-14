## ADDED Requirements

### Requirement: E2E User Flow Validation
The system SHALL be validated using Cypress E2E tests that simulate real user interactions across the front-end and back-end.

#### Scenario: Full attendance marking flow
- **WHEN** a user logs in, navigates to the attendance list, and marks a student as "Falta"
- **THEN** the UI SHALL update to reflect the change.
- **AND** the back-end database SHALL contain the corresponding attendance record.
