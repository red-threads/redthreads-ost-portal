# EXPORT_LOG Wide Schema - Locked

Column A:
- token

Then in order:

1. dealNumber
2. dealId
3. dealTitle
4. personName
5. personId
6. personEmail
7. orgName
8. orgId
9. projectName
10. sentBy
11. internalNotes
12. status
13. contractVersion
14. calculatorVersion
15. source
16. exportedAt
17. snapshotId
18. baseUrl
19. snapshotJson
20. portalStateJson
21. submittedStateJson
22. submittedAt
23. submittedByName
24. submittedByEmail
25. grandTotal
26. specialPricingRequired

Lifecycle rules:
- snapshotJson is immutable once written.
- portalStateJson is mutable UI/client/order state.
- submittedStateJson is immutable submitted/order state when applicable.
- JSON columns must be stored as plain text in Sheets.

Compatibility notes:
- Token lookup is by Column A only.
- A token is not a project number.
- Do not reorder or reinterpret this wide schema without an approved versioned migration.
