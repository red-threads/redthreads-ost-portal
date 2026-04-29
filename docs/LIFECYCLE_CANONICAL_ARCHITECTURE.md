# Lifecycle Canonical Architecture

This note documents the lifecycle architecture accepted through Tranches 3A–3G
and the quarantine boundaries introduced during Tranche 4 cleanup.

## Canonical Server Chain

Canonical lifecycle source chain in `apps-script/src/Code.js`:

1. `buildPortalOrderSummary_()`
2. `buildCurrentOrderStateSummaryFromRow_()`
3. `derivePortalLifecycle_()`
4. `buildPortalLifecycleHydratedContext_()`

Canonical response/projection adapters:

1. `buildOrderActionPortalPayload_()`
2. `finalizeOrderActionResponse_()`
3. `buildDashboardProjectProjectionContext_()`
4. `deriveDashboardTimelineMeta_()`
5. `buildDashboardStatusPresentationMeta_()`
6. `buildDashboardStatusCopyMeta_()`
7. `buildDashboardPeekLifecycleMeta_()`
8. `buildTeamWorkflowActionMeta_()`
9. `assertTeamWorkflowActionAllowed_()`

Rule: new lifecycle truth should be introduced in the canonical source chain
first, then exposed through adapters. New server or client surfaces should not
bypass `derivePortalLifecycle_()` when canonical workflow context is available.

## Canonical Client Consumers

Primary client lifecycle access points in `apps-script/src/Index.html`:

1. `getPortalWorkflowContext_()`
2. `applyPortalPayloadInPlace(...)`
3. `syncOrderFlowLifecycleFromResponse_(...)`
4. Summary/Invoice control routing helpers
5. Team/admin visibility helpers

Rule: new UI decisions should prefer hydrated `workflowContext` and canonical
summary modes rather than raw `orderState`, `paymentState`, `paidAt`,
`poSubmittedAt`, or `portalState.isReadOnly`.

## Quarantined Compatibility Layers

These helpers remain intentionally quarantined during Tranche 4 cleanup.

### Server (`Code.js`)

- `deriveDashboardProjectStepFlags_(...)`
- `legacyDashboardFlags`
- `derivePortalDisplayOrderStatus_(...)`
- `isLockedPortalRow_(...)`
- `buildPortalLifecycleSurfaceInterpretations_(...)`
- `comparePortalLifecycleInterpretations_(...)`
- raw export-row fallback readers used for migration compatibility

### Client (`Index.html`)

- `legacyBuildSummary*` helpers
- `legacyQuantityStateKey(...)`
- `ORDER_FLOW_MODE === 'method'` compatibility branch
- raw order/payment/status readers inside older summary/status helpers

Rule: keep these helpers for compatibility until staged deletion passes are
backed by fixture baselines. Do not use them as the basis for new lifecycle
decisions.

## Tranche 4 Sequence

Accepted / recommended sequence:

1. **4A** Audit + quarantine markers
2. **4B** Safe client consumer consolidation onto `workflowContext`
3. **4C** Dashboard legacy reduction
4. **4D** Fixture snapshot / regression harness prerequisite
5. **4E** Lock/display compatibility review after baselines exist
6. **4F** Deletion pass only after regression coverage is in place

## Regression Requirement Before Any Deletion

No further lifecycle deletion or compatibility removal should proceed until
fixture baselines exist for the accepted lifecycle family.

Baseline work should be anchored by:

- [docs/LIFECYCLE_FIXTURES.md](/Users/Josiah/Documents/GitHub/redthreads-ost-portal/docs/LIFECYCLE_FIXTURES.md)
- [docs/LIFECYCLE_REGRESSION_HARNESS.md](/Users/Josiah/Documents/GitHub/redthreads-ost-portal/docs/LIFECYCLE_REGRESSION_HARNESS.md)
- `testcases/lifecycle-fixtures/manifest.json`
- `testcases/lifecycle-fixtures/schema.json`

Deletion/refactor approval should depend on baseline comparison, not memory or
ad hoc manual judgment.

## Minimum Accepted Fixture Family

- `1900`
- `1916`
- `1922`
- `1923`
- `1925`
- `2003`
- `2004`
- `2005`
- `2006`
- `2007`
- `2008`

## Surfaces That Must Be Covered

- dashboard status row
- dashboard peek
- Summary/Invoice document and controls
- editor / Save / Place Order gating
- card / ACH / PO / manual payment continuation
- team/admin visibility and server enforcement
- canonical lifecycle truth used by those surfaces

## Known deferred item

- shipping capture/display for manual-payment invoice flow
