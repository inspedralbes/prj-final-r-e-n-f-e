## Context

The current system tracks student absences but does not provide a way for students to justify them directly. Absence summaries are shown in the student portal, but detailed records and justification status are missing from the UI. The backend already has a `Justificant` model and controller, but they need to be integrated into the student's workflow.

## Goals / Non-Goals

**Goals:**
- Allow students to see a detailed list of their absences.
- Display the status of each absence: "Justificada", "Pendent d'acceptació", or "No justificada".
- Provide a UI for students to upload justifications (text and documents).
- Integrate with existing backend justification logic.

**Non-Goals:**
- Administrator approval UI (out of scope for this change, assuming it exists or will be handled separately).
- Editing or deleting existing justifications by students.

## Decisions

### 1. Augment Existing API Endpoint
Instead of creating a new endpoint, we will modify `GET /v1/assistencies/alumne/{alumneId}` (method `assistenciaPerAlumne` in `AssistenciaController`).
- **Rationale**: Reduces API calls and reuses existing logic that already iterates over all absences.
- **Behavior**: Each subject object in the returned array will now include a `detalls` array containing individual records of absences and late arrivals.

### 2. Status Calculation Logic (included in API)
For each record in the `detalls` array, we will include a `status_justificacio`:
- **Justificada**: If `estat === 'Justificada'`.
- **Pendent**: If `estat === 'Falta'` and a record exists in `justificants` table linking to this absence (or covering its date) but `acceptada` is false.
- **No justificada**: If `estat === 'Falta'` and no justification exists.

### 3. Frontend: Dedicated Justifications Page
Instead of a modal in the main dashboard, we will implement a new page: `AlumnesJustificantsComponent` at `/alumnes/justificants`.
- **Rationale**: Keeps the main panel clean and provides a clear history of all submitted justifications.
- **Sidebar**: Add a new navigation item for "Justificants".
- **Functionality**:
    - **History Table**: Shows all justifications created by the student (Date range, Comment, Status).
    - **Submit Button**: Opens the modal to create a new justification.

### 4. Backend: List of Justifications
We will implement a new endpoint `GET /v1/justificants/alumne/{alumneId}` to fetch the history for the student.
- **JustificantsSeeder**: Will be updated to provide sample data for this list.

## Risks / Trade-offs

- **[Risk] Date Range Overlap**: A student might upload multiple justifications for overlapping dates.
- **[Mitigation]**: The status calculation will check for *any* matching justification.
- **[Trade-off] Performance**: Calculating status for many absences might be slow.
- **[Mitigation]**: Limit the detailed list to the last X months or paginate if necessary.
