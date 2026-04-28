# Lifecycle Canonical Architecture

This note documents the lifecycle architecture accepted through Tranches 3A–3G
and the quarantine boundaries introduced in Tranche 4A.

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

These helpers remain intentionally quarantined during Tranche 4 cleanup:

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

Rule: keep these helpers for compatibility until the staged Tranche 4 deletion
passes. Do not use them as the basis for new lifecycle decisions.

## Tranche 4 Sequence

Recommended staged refactor sequence:

1. **4A** Audit + quarantine markers
2. **4B** Safe client consumer consolidation onto `workflowContext`
3. **4C** Dashboard legacy reduction
4. **4D** Summary legacy reduction
5. **4E** Lock/display compatibility review
6. **4F** Deletion pass after regression coverage

## Regression Focus Before Any Deletion

Minimum lifecycle fixture coverage:

- `1900`
- `1916`
- `1922`
- `1923`
- `1925`
- `2003`
- `2004`

Surfaces to verify:

- Dashboard status row
- Dashboard peek
- Summary/Invoice document and controls
- Editor / Save / Place Order gating
- Card / ACH / PO / manual payment continuation
- Team/admin visibility and server enforcement

Known deferred item:

- Shipping capture/display for manual-payment invoice flow
