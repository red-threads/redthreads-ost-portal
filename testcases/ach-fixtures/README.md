# ACH Fixtures

This directory documents the ACH regression fixture shape without committing private access data.

Private captures, disposable token notes, raw webhook payloads, row dumps, customer data, and Checkout URLs must not be tracked.

## Synthetic Fixture Families

- ACH first-time Checkout created
- ACH order placed and payment pending
- ACH pending without production authorization
- ACH pending with account-level production authorization
- ACH payment succeeded
- ACH payment failed
- ACH dispute or late return
- ACH setup session created
- ACH setup succeeded with saved bank summary
- ACH setup failed
- Duplicate webhook replay skipped

## Safe Fields

Fixtures may contain synthetic IDs, state names, timestamps, boolean flags, and redacted placeholders. Do not include real tokens, customer names, organization names, email addresses, full bank account numbers, routing numbers, microdeposit values, raw webhook JSON, or raw Sheet rows.

