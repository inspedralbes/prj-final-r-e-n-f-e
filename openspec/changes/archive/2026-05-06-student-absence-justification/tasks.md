## 1. Test Data (Seeders)

- [x] 1.1 Update `back/laravel-api/database/seeders/UsuarisSeeder.php` to include specific test users (Student and Teacher).
- [x] 1.2 Update `back/laravel-api/database/seeders/JustificantsSeeder.php` to include sample justifications (pending and accepted) for the test student.
- [x] 1.3 Create `TestDataSeeder.php` and update `DatabaseSeeder.php` to enroll the test student and add absences.

## 2. Backend Enhancement

- [x] 2.1 Modify `assistenciaPerAlumne` method in `AssistenciaController` to include detailed absence/late records in the response.
- [x] 2.2 Implement status calculation logic (Justified/Pending/Not Justified) within the loop for detailed records.
- [x] 2.3 Implement `GET /v1/justificants/alumne/{alumneId}` in `JustificantController` to return all justifications for a student.
- [x] 2.4 Verify that the existing summary dashboard still works correctly with the augmented response.

## 3. Frontend Service Updates

- [x] 3.1 Update `front/src/app/shared/services/inscrits/inscrits-manager.service.ts` to include a method for fetching detailed absences.
- [x] 3.2 Create a service (or update existing) to fetch the list of justifications for the current student.

## 4. UI Implementation

- [x] 4.1 Create `AlumnesJustificantsComponent` and register the route `/alumnes/justificants` in `app.routes.ts`.
- [x] 4.2 Add navigation to "Justificants" in `front/src/app/shared/components/sidebar/alumnes/sidebarAlumne.component.html`.
- [x] 4.3 Move the justification modal and submission logic from `AlumnesComponent` to `AlumnesJustificantsComponent`.
- [x] 4.4 Implement the justification history table in `AlumnesJustificantsComponent`.
- [x] 4.5 Clean up `AlumnesComponent` to remove the justification button and modal, keeping it focused on the absence summary and status indicators.

## 5. Verification

- [x] 5.1 Verify the end-to-end flow: Uploading a justification should immediately update the absence status in the UI to "Pendent d'acceptació".
- [x] 5.2 Ensure the "Justificada" status is correctly reflected after a justification is accepted in the database.
- [x] 5.3 Validate that file uploads are correctly stored on the server.
