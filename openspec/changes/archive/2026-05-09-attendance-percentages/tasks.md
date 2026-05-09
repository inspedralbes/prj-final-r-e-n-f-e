# Tasks: Attendance Percentages and Trimester Filtering

## Phase 1: Backend Implementation
- [x] Implement trimester detection logic in `AssistenciaController`.
- [x] Update `assistenciaPerAlumne` to filter by trimester date range.
- [x] Update `assistenciaPerAlumne` to calculate and return `percentatge`.
- [ ] Verify API response via manual check or temporary route.

## Phase 2: Frontend Implementation
- [x] Update `assistenciaPerUsuari` interface in `alumnes.component.ts`.
- [x] Update `alumnes.component.html` to display the "Total" percentage prominently.
- [x] Add the "Attendance %" counter card for individual subjects in `alumnes.component.html`.
- [x] Update `alumnes.component.css` to accommodate the four-counter layout.

## Phase 3: Validation
- [ ] Test with a student account to ensure percentages are correct.
- [ ] Verify that only current trimester data is counted.
- [ ] Check responsive layout with 4 counters.
