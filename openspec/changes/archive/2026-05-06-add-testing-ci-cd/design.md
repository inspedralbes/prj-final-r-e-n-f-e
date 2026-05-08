## Context

The current project has a frontend (Angular) and a backend (Laravel API) deployed via GitHub Actions to a remote server. The deployment process involves cloning the repository on the server, building Docker images, and starting containers. There are no automated tests running in the pipeline, which leads to a lack of verification of the deployed code.

## Goals / Non-Goals

**Goals:**
- Implement basic E2E tests for the Angular frontend using Cypress.
- Implement basic unit/feature tests for the Laravel API using PHPUnit.
- Integrate these tests into the existing GitHub Actions workflow.
- Ensure the database is seeded with necessary data before running tests in CI.
- Support testing for both development (local/dev) and production environments.

**Non-Goals:**
- Achieving 100% test coverage.
- Implementing complex integration tests between all services (e.g., node sensors).
- Setting up a separate staging environment (tests will run in the CI runner against a temporary setup).

## Decisions

- **Cypress for Frontend**: Chosen for its developer-friendly API and robust E2E testing capabilities for Angular.
- **PHPUnit for Backend**: The standard and built-in testing framework for Laravel, providing seamless integration.
- **CI Test Execution**: Tests will run in the GitHub Actions runner environment using `docker compose` to spin up a temporary instance of the stack. This ensures isolation and avoids polluting the production environment.
- **Seeding in CI**: Use Laravel's `db:seed` to populate the temporary database with known test data.
- **Basic Tests**: Initially focusing on "smoke tests" (e.g., homepage loads, API health check) to establish the pipeline.

## Risks / Trade-offs

- **[Risk] CI Execution Time** → **[Mitigation]** Use lightweight images and cache dependencies (npm, composer) to minimize overhead.
- **[Risk] Flaky E2E Tests** → **[Mitigation]** Keep tests simple and use Cypress's automatic retries and wait mechanisms.
- **[Risk] Sensitive Data in Tests** → **[Mitigation]** Use dummy data and environment variables for secrets.
