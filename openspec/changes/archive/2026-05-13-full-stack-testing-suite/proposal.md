## Why

The project currently lacks a comprehensive testing suite for both the Laravel back-end and Angular front-end. Implementing these tests is essential to ensure code quality, prevent regressions, and enable reliable automated validation through the existing GitHub Actions CI/CD workflow. This is especially important for protected routes using Sanctum, where authentication logic needs systematic verification.

## What Changes

- **Back-end (Laravel):**
    - Create Factories for key models: `Usuari`, `Assistencia`, `Inscrit`, `Horari`, `Classe`, `Assignatura`.
    - Implement Feature tests for `AssistenciaController` and `CartaFaltesController` with Sanctum authentication.
    - Implement Unit tests for core business logic in Models or Services.
- **Front-end (Angular):**
    - Implement Unit tests for critical services like `AssistenciesManagerService` using Vitest.
    - Enhance Cypress E2E tests to cover a full user flow (Login -> Dashboard -> Marking Attendance).
- **CI/CD:**
    - Update `tests.yml` to include Angular unit tests (`npm test`).
    - Ensure all tests (back and front) run successfully in the CI environment.

## Capabilities

### New Capabilities
- `backend-model-factories`: Standardized data generation for testing Laravel models.
- `sanctum-authenticated-api-tests`: Verifying protected API endpoints using user simulation or real tokens.
- `frontend-service-unit-testing`: Isolating and testing Angular service logic with Vitest.
- `e2e-user-workflow-validation`: Comprehensive testing of UI flows including authentication and data interaction.

### Modified Capabilities
- `absence-letter-generation`: Adding requirements for automated testing of this feature.
- `tutor-student-ranking`: Adding requirements for automated testing of the ranking and tutor mode.

## Impact

- **Laravel API:** New test files in `tests/Feature` and `tests/Unit`, and new factories in `database/factories`.
- **Angular App:** New `.spec.ts` files in `src/app`.
- **Cypress:** Updated `cypress/e2e` tests.
- **GitHub Workflows:** Updated `.github/workflows/tests.yml`.
