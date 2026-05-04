## Why

The project currently lacks automated testing for both the Angular frontend and the Laravel backend. To ensure reliability and prevent regressions, especially during deployment, it is essential to have a testing suite that runs automatically in the CI/CD pipeline. Adding basic tests for development and production environments will improve code quality and deployment confidence.

## What Changes

- **Frontend Testing**: Implementation of Cypress for end-to-end (E2E) testing in the Angular application.
- **Backend Testing**: Implementation of PHPUnit tests in the Laravel API.
- **Environment-Specific Tests**: Configuration of basic tests targeting both Dev and Prod environments.
- **CI/CD Integration**: Updating the GitHub Actions workflow (`deploy.yml`) to:
  - Clone the repository.
  - Setup the environment (Node, PHP, Database).
  - Seed the database with initial data.
  - Execute frontend and backend tests before proceeding with deployment.

## Capabilities

### New Capabilities
- `testing-framework-setup`: Setup of Cypress for Angular and PHPUnit for Laravel.
- `basic-e2e-tests`: Basic Cypress tests for frontend validation in Dev and Prod.
- `basic-api-tests`: Basic PHPUnit tests for API endpoint validation.
- `ci-cd-test-integration`: Integration of testing and seeding into the GitHub Actions deployment process.

### Modified Capabilities
- (None)

## Impact

- `front/`: Addition of Cypress configuration and test files. `package.json` scripts update.
- `back/laravel-api/`: Addition of PHPUnit tests and potentially environment configuration for testing.
- `.github/workflows/deploy.yml`: Significant updates to include testing steps and environment setup.
- CI/CD execution time will increase due to the addition of testing and seeding steps.
