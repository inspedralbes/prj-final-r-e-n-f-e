## ADDED Requirements

### Requirement: Database Factories
The back-end SHALL include Laravel factories for all core models to allow for consistent and automated test data generation.

#### Scenario: Creating a student with related data
- **WHEN** the `Inscrit` factory is called with a state for a specific student and class
- **THEN** the system SHALL create the student, the class, and the enrollment record in the testing database.
