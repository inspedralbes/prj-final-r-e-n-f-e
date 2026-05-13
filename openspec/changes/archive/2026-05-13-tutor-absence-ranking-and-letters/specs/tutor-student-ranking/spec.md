## ADDED Requirements

### Requirement: Class Absence Ranking API
The back-end SHALL provide an endpoint to retrieve a ranking of students with the highest number of absences for a specific class, aggregated across ALL subjects.

#### Scenario: Successful retrieval of class student ranking
- **WHEN** a GET request is made to `/api/v1/assistencies/classe/{idClasse}/ranking`
- **THEN** the system returns a list of students in that class.
- **AND** for each student, it provides the total count of 'Falta' records across all their enrolled subjects.
- **AND** the list is sorted by the total number of absences descending.

### Requirement: Conditional Tutor Mode Toggle
The front-end SHALL only display the "Mode Tutor" toggle if the authenticated teacher is a tutor of at least one class.

#### Scenario: Teacher is a tutor
- **WHEN** the `llista-faltes` page loads for a teacher who IS a tutor
- **THEN** the system SHALL display the toggle to switch between "Ranking Professor" and "Ranking Tutor".

#### Scenario: Teacher is NOT a tutor
- **WHEN** the `llista-faltes` page loads for a teacher who is NOT a tutor
- **THEN** the system SHALL NOT display the toggle and SHALL only show the "Ranking Professor".
