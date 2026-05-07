## ADDED Requirements

### Requirement: Testing Framework Setup
The system MUST have Cypress installed and configured in the `front/` directory and PHPUnit configured in the `back/laravel-api/` directory.

#### Scenario: Verify Cypress Installation
- **WHEN** running `npx cypress --version` in the `front/` directory
- **THEN** it returns the installed version of Cypress

#### Scenario: Verify PHPUnit Installation
- **WHEN** running `./vendor/bin/phpunit --version` in the `back/laravel-api/` directory
- **THEN** it returns the installed version of PHPUnit

### Requirement: Basic E2E Tests
The frontend SHALL have at least one Cypress test that verifies the main page loads correctly in both Dev and Prod environments.

#### Scenario: Homepage loads in Dev
- **WHEN** Cypress runs against the local development URL
- **THEN** the page title or a key element is visible

#### Scenario: Homepage loads in Prod
- **WHEN** Cypress runs against the production URL
- **THEN** the page title or a key element is visible

### Requirement: Basic API Tests
The Laravel API SHALL have at least one PHPUnit test that verifies the health of the API or a basic endpoint.

#### Scenario: API Health Check
- **WHEN** making a GET request to `/api/health` or a basic public endpoint
- **THEN** it returns a 200 OK status

### Requirement: CI/CD Test Integration
The GitHub Actions workflow MUST include steps to setup the environment, seed the database, and run both frontend and backend tests before deployment.

#### Scenario: CI Pipeline Failure on Test Error
- **WHEN** a test fails during the GitHub Actions execution
- **THEN** the workflow stops and does not proceed to the deployment step

#### Scenario: CI Pipeline Success
- **WHEN** all tests pass and database seeding is successful
- **THEN** the workflow proceeds to deploy the application to the server
