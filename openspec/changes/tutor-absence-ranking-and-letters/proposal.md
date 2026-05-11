## Why

Tutors need a dedicated view to monitor the absences of their assigned students and a streamlined way to generate official absence notification letters. Currently, the absence ranking is generic for all teachers, and generating letters requires manual entry of tutor information, which is redundant as the system already knows who the tutor for a class is.

## What Changes

- **Conditional Tutor Mode in Absence List**: Added a new view/toggle in the `llista-faltes` page. This toggle is ONLY visible if the teacher is a tutor of a class.
- **Cross-Subject Absence Ranking**: In "Tutor Mode", the ranking will show the total absences for the tutor's students across ALL their subjects, providing a holistic view of their attendance.
- **Automated Tutor Identification**: The back-end will now automatically identify the tutor of a student when generating an absence letter. The `id_tutor` will no longer be required (or sent) from the front-end.
- **Student-specific Letter Generation**: Tutors can now trigger the letter generation process for a specific student directly from the ranking list.
- **Absence Threshold Selection**: A new UI component (popup) to select between 30, 60, or 90 absences when generating a letter.

## Capabilities

### New Capabilities
- `tutor-student-ranking`: Provides an API and UI to view an aggregated absence ranking for students assigned to a specific tutor.
- `absence-letter-threshold-selection`: UI interaction to select the absence count threshold for document generation.

### Modified Capabilities
- `absence-letter-generation`: Updated the letter generation process to automatically resolve the tutor based on the student's class.

## Impact

- **Back-end**: `CartaFaltesController`, `AssistenciaController`, and `api.php`.
- **Front-end**: `LlistaFaltesComponent`, `AssistenciesManagerService`, and potentially a new modal/popup component.
