## ADDED Requirements

### Requirement: Authenticated Feature Testing
The back-end SHALL verify that all protected API endpoints correctly enforce authentication and authorization policies using Sanctum.

#### Scenario: Accessing protected endpoint with actingAs
- **WHEN** a feature test uses `Sanctum::actingAs($user)` before making a GET request to `/api/v1/assistencies`
- **THEN** the system SHALL return a 200 OK response with the expected data.

#### Scenario: Unauthorized access to protected endpoint
- **WHEN** a feature test makes a GET request to `/api/v1/assistencies` without authentication
- **THEN** the system SHALL return a 401 Unauthorized response.
