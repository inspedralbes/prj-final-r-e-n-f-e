## ADDED Requirements

### Requirement: Automated Tutor Resolution
The back-end SHALL automatically resolve the tutor ID for an absence letter. The `id_tutor` field MUST NOT be required in the request.

#### Scenario: Letter generation without id_tutor
- **WHEN** a POST request is made to `/api/v1/carta-faltes/generar` with `id_alumne` and `faltes`
- **THEN** the system SHALL find the tutor of the class the student belongs to.
- **AND** generate the letter using that tutor's information.
- **AND** return an error if the student is not assigned to a class or the class has no tutor.
