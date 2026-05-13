## ADDED Requirements

### Requirement: Automated Verification of Tutor Ranking
The system SHALL have automated tests to verify the tutor ranking API and the conditional display of the tutor mode toggle in the UI.

#### Scenario: Testing tutor ranking endpoint
- **WHEN** a feature test makes a GET request to `/api/v1/assistencies/classe/{id}/ranking` for a class assigned to the authenticated tutor
- **THEN** the system SHALL return the correct ranking of students sorted by absences.
