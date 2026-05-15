## Context

Teachers who are tutors need to efficiently track their students' absences and generate official notification letters. The current system requires manual entry of the tutor's ID for letter generation, which is inefficient. Tutors also lack a prioritized ranking of their own students' absences.

## Goals / Non-Goals

**Goals:**
- Add a "Tutor Mode" to the `llista-faltes` page for teachers who are tutors.
- Implement a back-end ranking for students of a specific tutor.
- Automate tutor identification in the letter generation process.
- Provide a UI for selecting absence thresholds (30/60/90).

**Non-Goals:**
- Modifying the generic teacher ranking (it remains available).
- Changing the PDF conversion logic (Node.js API).
- Adding new roles to the system.

## Decisions

- **API Extension**: A new endpoint `GET /assistencies/classe/{idClasse}/ranking` will be added. It will:
    1. Get all students in the class with `id = idClasse`.
    2. Count ALL 'Falta' records for each student across ALL subjects.
- **Controller Refactor**: `CartaFaltesController@generar` will be updated to remove `id_tutor` from its validation rules. It will resolve the tutor by looking up the `id_tutor` field in the `Classe` model associated with the student.
- **Front-end Component Update**: `LlistaFaltesComponent` will:
    1. Check if the current user is a tutor using the existing `GET /classes/tutor/{idTutor}` endpoint.
    2. Conditionally show the toggle between "Ranking Professor" and "Ranking Tutor".
    3. Use the new API for the "Ranking Tutor" view.

## Risks / Trade-offs

- **[Risk]** A student might not be assigned to a class. → **[Mitigation]** The back-end will return a 400 error explaining that the student has no class/tutor.
- **[Risk]** A class might have no tutor assigned. → **[Mitigation]** Similar to above, return an informative error.
- **[Risk]** Redundant data if `id_classe` is used for teachers. → **[Decision]** We will primarily rely on the `id_tutor` field in the `classes` table as it is the source of truth for the tutor-class relationship.
