# Integration Registry

This registry records known systems and whether the current repo can verify them.

| System | Current Detail | Verification |
| --- | --- | --- |
| GitHub repo | `red-threads/redthreads-ost-portal` | Repo verified |
| Local repo path | `/Users/Josiah/Documents/GitHub/redthreads-ost-portal` | Repo verified |
| Apps Script source root | `apps-script/src/` | Repo verified |
| Portal DB Sheet ID | `16KrxpEv8s-U5gjLX-DZK25GbrnkeKbjgInngie8Ce_c` | Repo visible in `Code.js` |
| EXPORT_LOG | Primary snapshot/export tab | Repo and prompt verified |
| PORTAL_ORDERS | Operational order/payment/production layer | Prompt/historical |
| PORTAL_ACCOUNTS | Account/payment terms/tax-exempt layer | Prompt/historical |
| USERS | Auth user layer | Prompt/historical |
| USER_SESSIONS | Session layer | Prompt/historical |
| Apps Script deployment ID | `AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw` | Prompt/historical; local clasp verification blocked |
| Public Apps Script URL | `https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec` | Prompt/historical |
| Branded wrapper | `https://www.redthreads.com/portal` | Prompt/historical |
| Historical calculator sheet | `1STzkJjn5WRoBqa5H1KdxAbn4-JCab9DCX4FuZt5HImc` | Prompt/historical |
| Historical Make scenario | `4062378` | Prompt/historical |
| Stripe Checkout | Hosted Checkout is active MVP card path | Prompt/historical |
| Cloud Run | Stripe webhook trust boundary | Prompt/historical |
| Gmail notifications | Notification channel | Prompt/historical |
| QuickBooks/Pipedrive | Downstream workflows | Prompt/historical |

Do not add secrets, webhook secrets, API keys, Script Properties, private Checkout URLs, live tokens, or raw customer payloads to this file.
