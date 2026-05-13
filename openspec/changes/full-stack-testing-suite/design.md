## Context

The current project has minimal automated testing. While some infrastructure exists (PHPUnit, Vitest, Cypress), it is not actively used to verify core business logic or protected API endpoints. The Laravel API uses Sanctum for authentication, which requires specific handling in tests.

## Goals / Non-Goals

**Goals:**
- Provide a robust testing foundation with Laravel Factories.
- Ensure all protected API routes are covered by feature tests using Sanctum.
- Implement unit tests for key Angular services.
- Establish a complete E2E flow in Cypress that integrates with the CI/CD pipeline.
- Update GitHub Actions to fail if any test (front or back) fails.

**Non-Goals:**
- 100% code coverage (focus on critical paths first).
- Testing third-party libraries (Google OAuth, etc.).
- Performance testing or stress testing.

## Decisions

### 1. Back-end: Using `Sanctum::actingAs()` for Feature Tests
- **Rationale:** Simulating an authenticated user is faster and less brittle than performing a full login flow for every API test. It allows us to test authorization logic (Policies) directly.
- **Alternative:** Using real tokens obtained from a mock login. *Rejected* due to increased complexity and slower test execution.

### 2. Back-end: Comprehensive Model Factories
- **Rationale:** To test complex relationships (e.g., Assistance -> Enrollment -> Student/Subject), we need factories that can automatically handle these dependencies.
- **Decision:** Every model involved in the core attendance flow will have a factory with realistic fake data.

### 3. Front-end: Vitest for Unit Testing Services
- **Rationale:** Vitest is already configured and provides a modern, fast testing experience for Angular logic that doesn't require DOM rendering.
- **Decision:** Focus unit tests on `AssistenciesManagerService` and logic-heavy services.

### 4. Front-end: Cypress for E2E flows
- **Rationale:** Cypress is ideal for verifying that the front-end and back-end work together correctly.
- **Decision:** Create a new "Happy Path" test that covers login, navigation, and attendance marking.

## Risks / Trade-offs

- **[Risk]** Data persistence in tests → **Mitigation**: Use `RefreshDatabase` trait in Laravel and SQLite in-memory database.
- **[Risk]** Slow CI/CD pipeline → **Mitigation**: Keep E2E tests focused on high-level flows and rely on unit/feature tests for edge cases.
- **[Risk]** Fragile E2E tests → **Mitigation**: Use data-cy attributes where possible and avoid relying on specific CSS classes.
