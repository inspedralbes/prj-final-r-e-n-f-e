## ADDED Requirements

### Requirement: Automated Verification of Letter Generation
The system SHALL have automated tests to ensure the absence letter generation logic works correctly, including the auto-resolution of tutors.

#### Scenario: Testing letter generation API
- **WHEN** a feature test sends a POST request to `/api/v1/carta-faltes/generar` with valid student and absence data
- **THEN** the system SHALL return a successful response containing the generated document metadata.
