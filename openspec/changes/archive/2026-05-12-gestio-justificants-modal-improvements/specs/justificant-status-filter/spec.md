## ADDED Requirements

### Requirement: Status filter toggle
The gestio-justificants view SHALL include a toggle control to filter justificants by status.

#### Scenario: Toggle shows all justificants by default
- **WHEN** user navigates to /gestio-justificants
- **THEN** all justificants (Pendent, Acceptada, Rebutjada) are displayed for each student

#### Scenario: Toggle filter to pending only
- **WHEN** user activates the "Només pendents" toggle
- **THEN** only justificants with estat = 'Pendent' are displayed

#### Scenario: Hide students with no pending justificants
- **WHEN** filter is active AND a student has no justificants with estat = 'Pendent'
- **THEN** that student's card is not displayed in the list

#### Scenario: Deactivate filter shows all students
- **WHEN** user deactivates the filter toggle
- **THEN** all students with any justificants are displayed again

### Requirement: Filter state persistence during session
The filter state SHALL remain active while the user stays on the page.

#### Scenario: Filter persists after closing modal
- **WHEN** user has filter active, opens a justificant modal, then closes it
- **THEN** the filter remains active and only pending justificants are shown

#### Scenario: Empty state when filter active
- **WHEN** filter is active and no students have any pending justificants
- **THEN** display empty state message "No hi ha justificants pendents"