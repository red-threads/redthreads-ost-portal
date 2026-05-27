# Lifecycle Fixtures

This directory documents the lifecycle regression fixture family without committing private access data.

## Accepted Fixture Family

- 1900 fresh estimate / reset
- 1916 quantities entered / artwork pending
- 1922 ready to order
- 1923 PO initiated / awaiting submission
- 1925 PO submitted unpaid / production active
- 2003 PO submitted unpaid / jobs complete
- 2004 PO submitted paid / print incomplete
- 2005 PO submitted paid / complete
- 2006 manual payment pending
- 2007 manual payment received / print incomplete
- 2008 manual payment received / complete

## Private Captures

Private captures belong in `testcases/lifecycle-fixtures/private/`. Only `private/.keep` may be tracked.

Never commit live tokens, tokenized URLs, raw `snapshotJson`, raw `portalStateJson`, raw `submittedStateJson`, raw sheet dumps, customer names, org names, emails, invoice numbers, PO numbers, chat content, or secrets.
