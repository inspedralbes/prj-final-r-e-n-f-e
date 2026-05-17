## 1. Backend Testing Setup (Laravel)

- [x] 1.1 Verify PHPUnit installation in `back/laravel-api/` and create `tests/Feature/HealthCheckTest.php`.
- [x] 1.2 Configure `phpunit.xml` for testing environment (SQLite in-memory or separate test DB).
- [x] 1.3 Implement a basic health check endpoint and test case.

## 2. Frontend Testing Setup (Angular)

- [x] 2.1 Install Cypress in `front/` directory.
- [x] 2.2 Configure Cypress (`cypress.config.ts`) with base URLs for Dev and Prod.
- [x] 2.3 Create a basic E2E test in `front/cypress/e2e/home.cy.ts` to verify page load.
- [x] 2.4 Add `npm run test:e2e` and `npm run test:e2e:prod` scripts to `front/package.json`.

## 3. Database Seeding & Environment

- [x] 3.1 Review existing Laravel seeders and ensure they are sufficient for basic testing.
- [x] 3.2 Create a `docker-compose.test.yml` (or adapt existing) for running the stack in CI.

## 4. CI/CD Integration (GitHub Actions)

- [x] 4.1 Update `.github/workflows/deploy.yml` to include a `test` job before the `deploy` job.
- [x] 4.2 Add steps to the `test` job: Checkout, Setup PHP/Node, Install dependencies, Start Docker stack, Run migrations/seeders.
- [x] 4.3 Add steps to run Laravel tests and Cypress tests in the CI pipeline.
- [x] 4.4 Configure the `deploy` job to depend on the successful completion of the `test` job.
