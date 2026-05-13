## Why

Currently, students lack a direct way to justify their absences through the web interface. This leads to manual processes and delays in updating absence records. Providing a "Justificant" button and status indicators will streamline the justification process for both students and administrators.

## What Changes

- **New Justifications Page**: A dedicated page (`/alumnes/justificants`) for students to manage their justifications.
- **Justification History List**: A table on the new page showing all submitted justifications and their current status (Pending/Accepted/Rejected).
- **Justification Upload Popup**: A modal accessible from the new page for submitting new justifications.
- **Absence Status Indicators**: Visual markers on the main dashboard for each absence, indicating its justification status.
- **Backend Support**: API endpoints to handle justification submissions and status updates.

## Capabilities

### New Capabilities
- `absence-justification`: Covers the submission of justifications by students and the tracking of their approval status.

### Modified Capabilities
<!-- None -->

## Impact

- **Front-end**: Absence listing component and a new modal component.
- **Back-end**: New API endpoints in the Laravel/Node.js services.
- **Database**: Updates to the schema to store justification information and link it to absences.
