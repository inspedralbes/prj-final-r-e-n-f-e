# Proposal: Attendance Percentages and Trimester Filtering

## Problem
Currently, students can see their count of absences and delays, but they cannot see their overall attendance percentage or their percentage per subject. Additionally, the data is not filtered by trimester, which is the standard evaluation period.

## Solution
1.  **Backend:** Update the attendance API to automatically filter by the current active trimester and calculate attendance percentages.
2.  **Frontend:** Update the student dashboard to display the overall average attendance and the specific percentage for each subject.

## Scope
-   Backend logic to detect current trimester based on active period dates.
-   Calculation of attendance percentage per subject and total.
-   Frontend UI updates to show percentages in the student portal.

## Non-Goals
-   Changing how attendance is recorded.
-   Adding trimester selection (will focus on current trimester for now).
-   Modifying teacher views.
