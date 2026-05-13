## 1. Back-end Enhancements

- [x] 1.1 Update `CartaFaltesController@generar` to remove `id_tutor` requirement and auto-resolve it from the student's class.
- [x] 1.2 Implement `rankingFaltesClasse($idClasse)` in `AssistenciaController` to aggregate ALL absences per student for a specific class (cross-subject).
- [x] 1.3 Register the new route `GET /assistencies/classe/{idClasse}/ranking` in `back/laravel-api/routes/api.php`.

## 2. Front-end Service Layer

- [x] 2.1 Update `AssistenciesManagerService.ts` to include a method for fetching the class ranking from the new API.
- [x] 2.2 Update `generarInformeFaltes` in `AssistenciesManagerService.ts` to remove the `id_tutor` parameter.
- [x] 2.3 Add a method to `ClasseService` (or similar) to check if a user is a tutor.

## 3. Front-end UI Components

- [x] 3.1 Modify `LlistaFaltesComponent` to check tutor status on load.
- [x] 3.2 Conditionally display the "Mode Tutor" toggle in `LlistaFaltesComponent.html` only for tutors.
- [x] 3.3 Implement the "Mode Tutor" view showing students with their total cross-subject absences.
- [x] 3.4 Add a "Generar Carta" button and threshold selection popup to the Tutor Mode ranking.

## 4. Verification & Testing

- [ ] 4.1 Manually verify the `/carta-faltes/generar` endpoint without `id_tutor`.
- [ ] 4.2 Verify the new ranking API returns correct data for a tutor.
- [ ] 4.3 End-to-end test of letter generation from the new Tutor Mode UI.
