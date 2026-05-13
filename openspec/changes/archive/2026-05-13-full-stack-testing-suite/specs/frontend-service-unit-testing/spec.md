## ADDED Requirements

### Requirement: Service Isolation Testing
The front-end SHALL include unit tests for all business logic residing in Angular services, isolating them from components and APIs using mocks.

#### Scenario: Fetching assistance data in service
- **WHEN** the `AssistenciesManagerService.getAssistencies()` method is called in a test
- **THEN** the service SHALL call the `HttpClient.get()` method with the correct URL.
- **AND** return an observable containing the mocked data.
