# Design: Attendance Percentages and Trimester Filtering

## Architecture

### Backend (Laravel)

#### Trimester Detection
The `AssistenciaController` will include logic to:
1.  Fetch the `Periode` where `actiu = true`.
2.  Compare `now()` with `trimestre_1_ini/fi`, `trimestre_2_ini/fi`, and `trimestre_3_ini/fi`.
3.  Set the `data_inici` and `data_fi` variables based on the current trimester.

#### Percentage Calculation
In `assistenciaPerAlumne($alumneId)`:
-   Filter `assistencies` query with `whereBetween('data', [$data_inici, $data_fi])`.
-   For each subject and the total:
    -   `total_records = count(all assistencies in range)`
    -   `unjustified_absences = count(records with 'Falta' that are not justified)`
    -   `percentatge = (total_records > 0) ? round(((total_records - unjustified_absences) / total_records) * 100, 2) : 100.00`
-   Include `percentatge` in the returned objects.

### Frontend (Angular)

#### Data Model
Update `assistenciaPerUsuari` interface:
```typescript
export interface assistenciaPerUsuari {
  nom_assignatura: { nom: string }[];
  retards: number;
  faltes: number;
  justificades: number;
  percentatge: number;
}
```

#### UI Updates
-   **Overall Average:** A new card or section in the student dashboard showing the `Total` percentage.
-   **Subject Details:** Add a fourth counter card for "Attendance %" alongside Retards, Faltes, and Justificades.
-   **Visual Feedback:** Use colors based on the percentage (e.g., green for >90%, yellow for 80-90%, red for <80%).

## UI Sketch (ASCII)

```
+-----------------------------------------------------------+
| [Sidebar]       Portal d'Alumnes                          |
|                                                           |
|  +---------------------------+  +----------------------+  |
|  | Assistència Mitjana       |  | Estat                |  |
|  |        94.5%              |  | [Actiu]              |  |
|  +---------------------------+  +----------------------+  |
|                                                           |
|  [Veure faltes per assignatura]                           |
|                                                           |
|  Matemàtiques                                             |
|  +---------+  +---------+  +--------------+  +---------+  |
|  | Retards |  | Faltes  |  | Justificades |  |  % Ass. |  |
|  |    2    |  |    1    |  |      1       |  |   92%   |  |
|  +---------+  +---------+  +--------------+  +---------+  |
+-----------------------------------------------------------+
```
