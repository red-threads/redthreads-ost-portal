# Portal Email Subject Audit

Updated: 2026-06-23

This audit records the subject-line refinement pass for portal-generated emails. Production subject builders now use short audience-aware phrases plus the centralized project suffix helper. Review mode may still prepend `[EMAIL REVIEW] {fixture label} - ` outside the production subject builder.

Review-suite owner omission maps are cleared for this pass. Emails may still skip only for real fixture/artifact safety limits.

| Email family | Recipient class | Old subject example | New production subject example | Action required | Suffix behavior | Review visibility | Runtime status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard ACH pending | Client | `ACH payment pending, production not started — Invoice EmailReview-v1` | `ACH payment pending — Project #2001` | No | Project suffix | Visible | Production |
| Standard ACH pending | Team | `ACH payment pending — Invoice EmailReview-v1` | `[Team] ACH payment pending — Project #2001` | Potential | Project suffix | Visible | Production |
| Standard ACH verification | Client | `Bank verification required before production begins — Invoice EmailReview-v1` | `Action needed: Verify your bank — Project #2002` | Yes | Project suffix | Visible | Production |
| Standard ACH verification | Team | `ACH bank verification needed — Invoice EmailReview-v1` | `[Team] ACH verification needed — Project #2002` | Potential | Project suffix | Visible | Production |
| Standard ACH verification 4-day reminder | Client | `ACH bank verification still needed — Invoice EmailReview-v1` | `Reminder: Verify your bank — Project #2002` | Yes | Project suffix | Visible | Production scheduled |
| Standard ACH verification 4-day reminder | Team | `ACH bank verification still needed — Invoice EmailReview-v1` | `[Team] ACH verification still pending — Project #2002` | Potential | Project suffix | Visible | Production scheduled |
| Standard ACH receipt | Client | `ACH payment received, production started — Receipt for Invoice EmailReview-v1` | `Payment received — production started — Project #2003` | No | Project suffix | Visible | Production |
| Standard ACH receipt | Team | `ACH payment received — Receipt for Invoice EmailReview-v1` | `[Team] ACH payment received — Project #2003` | Action/Potential by lifecycle | Project suffix | Visible | Production |
| Standard ACH failed | Client | `ACH payment issue, production cannot proceed — Invoice EmailReview-v1` | `Action needed: ACH payment issue — Project #2004` | Yes | Project suffix | Visible | Production |
| Standard ACH failed | Team | `ACH payment issue, production cannot proceed — Invoice EmailReview-v1` | `[Team] ACH payment issue — Project #2004` | Potential | Project suffix | Visible | Production |
| AP payment link | AP | `Red Threads ACH payment page — Invoice EmailReview-v1` | `Action needed: Complete payment — Project #2105` | Yes | Project suffix | Visible | Production |
| AP ACH pending | AP | `ACH Payment Pending — Invoice EmailReview-v1` | `ACH payment pending — Project #2105` | No | Project suffix | Visible | Production |
| AP ACH pending | Team | `AP ACH payment pending — Invoice EmailReview-v1` | `[Team] AP ACH payment pending — Project #2105` | Potential | Project suffix | Visible | Production |
| AP ACH receipt | AP | `Payment received, production started — Receipt for Invoice EmailReview-v1` | `Payment received — order started — Project #2105` | No | Project suffix | Visible | Production |
| AP ACH receipt | Team | `AP ACH payment received — Receipt for Invoice EmailReview-v1` | `[Team] AP payment received — Project #2105` | Action/Potential by lifecycle | Project suffix | Visible | Production |
| AP ACH failed | AP | `AP ACH payment issue, production cannot proceed — Invoice EmailReview-v1` | `Action needed: ACH payment issue — Project #2105` | Yes | Project suffix | Visible | Production |
| AP ACH failed | Team | `AP ACH payment issue, production cannot proceed — Invoice EmailReview-v1` | `[Team] AP ACH payment issue — Project #2105` | Potential | Project suffix | Visible | Production |
| Card paid | Client | `Payment Received, Production Started — Receipt for Invoice EmailReview-v1` | `Payment received — production started — Project #2005` | No | Project suffix | Visible | Production |
| Card paid | Team | `Card payment received — Receipt for Invoice EmailReview-v1` | `[Team] Card payment received — Project #2005` | Action/Potential by lifecycle | Project suffix | Visible | Production |
| Card failed | Client | `Action needed — Credit card payment issue, production cannot proceed — Invoice EmailReview-v1` | `Action needed: Card payment issue — Project #2005` | Yes | Project suffix | Visible | Production |
| Card failed | Team | `Card payment issue, production cannot proceed — Invoice EmailReview-v1` | `[Team] Card payment issue — Project #2005` | Potential | Project suffix | Visible | Production |
| Manual payment pending | Client | `Red Threads Invoice EmailReview-v1 — Order Placed, Payment Required to Begin Production` | `Action needed: Payment needed — Project #2006` | Yes | Project suffix | Visible | Production |
| Manual payment pending | Team | `Physical payment pending — Invoice EmailReview-v1` | `[Team] Physical payment pending — Project #2006` | Yes | Project suffix | Visible | Production |
| Manual payment received | Client | `Payment received, production started — Receipt for Invoice EmailReview-v1` | `Payment received — production started — Project #2006` | No | Project suffix | Visible | Production |
| Manual payment received | Team | `Manual payment received — Receipt for Invoice EmailReview-v1` | `[Team] Manual payment received — Project #2006` | Action/Potential by lifecycle | Project suffix | Visible | Production |
| PO submitted | Client | `Purchase Order #EMAIL-REVIEW-PO submitted, production started — Invoice EmailReview-v1` | `Purchase order received — production started — Project #2014` | No | Project suffix | Visible | Production |
| PO submitted | Team | `Purchase Order #EMAIL-REVIEW-PO received — Invoice EmailReview-v1` | `[Team] Purchase order received — Project #2014` | Yes | Project suffix | Visible | Production |
| PO payment received | Client | `PO #EMAIL-REVIEW-PO payment received — Receipt for Invoice EmailReview-v1` | `PO payment received — Project #2106` | No | Project suffix | Visible | Production |
| PO payment received | Team | `PO #EMAIL-REVIEW-PO payment received — Receipt for Invoice EmailReview-v1` | `[Team] PO payment received — Project #2106` | Action/Potential by lifecycle | Project suffix | Visible | Production |
| PO payment received after production complete | Client | `PO #EMAIL-REVIEW-PO payment received, order complete — Receipt for Invoice EmailReview-v1` | `PO payment received — order complete — Project #2108` | No | Project suffix | Visible | Production |
| PO payment received after production complete | Team | `PO #EMAIL-REVIEW-PO payment received, order complete — Receipt for Invoice EmailReview-v1` | `[Team] PO payment received — order complete — Project #2108` | No | Project suffix | Visible | Production |
| PO reminder 5 business days before due | Client | `PO #EMAIL-REVIEW-PO Payment reminder - due in 5 business days — Invoice EmailReview-v1` | `Reminder: PO due in 5 business days — Project #2014` | Yes | Project suffix | Visible | Production scheduled |
| PO reminder 1 business day before due | Client | `PO #EMAIL-REVIEW-PO Payment reminder - due in 1 business day — Invoice EmailReview-v1` | `Action needed: PO due tomorrow — Project #2014` | Yes | Project suffix | Visible | Production scheduled |
| PO payment past due | Client | `PO #EMAIL-REVIEW-PO payment past due — Invoice EmailReview-v1` | `Action needed: PO payment past due — Project #2014` | Yes | Project suffix | Visible | Production scheduled |
| PO late fee notice | Client | `PO #EMAIL-REVIEW-PO payment late-fee notice — Invoice EmailReview-v1` | `Action needed: PO late fee notice — Project #2014` | Yes | Project suffix | Visible | Production scheduled |
| PO 60-day escalation | Team | `PO #EMAIL-REVIEW-PO payment 60-day escalation — Invoice EmailReview-v1` | `[Team] PO 60-day escalation — Project #2014` | Potential | Project suffix | Visible | Production scheduled |
| Production complete shipping | Client | `Your Red Threads order is complete and shipping is in progress - Fixture - Production Complete - Invoice EmailReview-v1` | `Order complete — shipping in progress — Project #2108` | No | Project suffix | Visible | Production |
| Production complete shipping | Team | `Project complete - ready to ship - Fixture - Production Complete - Invoice EmailReview-v1` | `[Team] Order complete — ready to ship — Project #2108` | No | Project suffix | Visible | Production |
| Production complete pickup | Client | `Your Red Threads project is ready for pickup - Fixture - Production Complete - Invoice EmailReview-v1` | `Order ready for pickup — Project #2108` | Yes | Project suffix | Visible | Production |
| Production complete pickup | Team | `Project complete - ready for pickup - Fixture - Production Complete - Invoice EmailReview-v1` | `[Team] Order complete — ready for pickup — Project #2108` | No | Project suffix | Visible | Production |
| PO invoice prepared | Client | `Red Threads Invoice EmailReview-v1` | `Action needed: Submit your PO — Project #2014` | Yes | Project suffix | Visible | Production |
| Locked-order resend | Client | `Red Threads order confirmation — Invoice EmailReview-v1` | `Order confirmation — Project #2007` | No/Yes by lifecycle | Project suffix | Visible | Production |
| Locked-order resend | Team | `Team operational resend review — Invoice EmailReview-v1` | `[Team] Order confirmation resent — Project #2007` | Potential | Project suffix | Visible | Review/support send |
| Summary/estimate explicit send | Client/entered recipient | `Red Threads - Project 1900 - Estimate Copy` | `Estimate copy — Project #1900` | No | Project suffix | Visible | Production utility |
| Chat digest client to team | Team | `New client portal messages (2) - Fixture - Chat Review` | `[Team] New client portal messages (2) — Project #2008` | Potential | Project suffix/name fallback | Visible | Production digest |
| Chat digest team to client | Client | `New Red Threads portal messages (1) - Fixture - Chat Review` | `New portal message from Red Threads — Project #2008` | No | Project suffix/name fallback | Visible | Production digest |
| Credit terms source PDF | Client/entered recipient | `Red Threads Credit Terms PDF` | `Credit terms application — Red Threads` | Yes | Document-only label | Visible | Production utility |
| Tax exemption source PDF | Client/entered recipient | `Michigan Sales Tax Exemption PDF` | `Sales tax exemption form — Red Threads` | Yes | Document-only label | Visible | Production utility |
| Credit terms submitted | Team | `Team review required — Credit terms application` | `[Team] Review credit terms application` | Yes | No suffix | Visible | Production |
| Tax exempt submitted | Team | `Team review required — Michigan sales tax exemption form` | `[Team] Review sales tax exemption form` | Yes | No suffix | Visible | Production |
| Credit terms approved | Client | `Credit terms application approved` | `Credit terms approved` | No | No suffix | Visible | Production |
| Tax exempt approved | Client | `Michigan sales tax exemption form approved` | `Sales tax exemption approved` | No | No suffix | Visible | Production |
| Credit terms approved | Team | `Credit terms application approved` | `[Team] Credit terms approved` | No | No suffix | Visible | Production |
| Tax exempt approved | Team | `Michigan sales tax exemption form approved` | `[Team] Sales tax exemption approved` | No | No suffix | Visible | Production |
| Credit terms denied | Client | `Credit terms application needs attention` | `Action needed: Credit terms need attention` | Yes | No suffix | Visible | Production |
| Tax exempt denied | Client | `Michigan sales tax exemption form needs attention` | `Action needed: Sales tax exemption needs attention` | Yes | No suffix | Visible | Production |
| Credit terms reset | Client | `Credit terms application reset` | `Action needed: Complete credit terms application` | Yes | No suffix | Visible | Production |
| Tax exempt reset | Client | `Michigan sales tax exemption form reset` | `Action needed: Complete sales tax exemption form` | Yes | No suffix | Visible | Production |
| Submitted tax-form copy | Client | `Copy of your completed tax exemption form` | `Copy of your sales tax exemption form` | No | No suffix | Visible when artifact exists | Production utility |
| Password reset | Client | `Reset your Red Threads portal password` | `Reset your Red Threads portal password` | Yes | No suffix | Visible | Production utility |

## Helper Strategy

- `buildPortalEmailSubjectSuffix_()` resolves project number first, then short project name, then document label.
- `buildPortalEmailSubject_()` appends the suffix and excludes review fixture labels from suffix selection.
- `buildTeamSubject_()` is the only team prefix helper and renders `[Team]`.
- `buildActionNeededSubject_()` renders `Action needed:` only for recipient-action subjects.
- Lifecycle subject builders pass existing lifecycle/email context into the subject helper; no separate lifecycle state engine was added.
