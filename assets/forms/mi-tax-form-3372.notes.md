# Michigan Form 3372 Overlay Notes

This repo change adds the first-pass overlay manifest only. The page PNG binaries are not stored in the repo yet so we can keep the portal repo lightweight and continue referencing the source imagery from Drive while the overlay model settles.

Page 1 is the interactive target because it is the actual certificate. Page 2 is read-only because it contains instructions, business-type codes, and required-field guidance rather than editable certificate inputs.

All stored field coordinates in the manifest are normalized (`x`, `y`, `w`, `h` in a 0-1 range, top-left origin). Most page 1 coordinates were derived from the official PDF's AcroForm widget rectangles; a few portal-only composite fields are intentionally approximate for MVP and should be refined during UI implementation.

This is a first-pass manifest intended to be buildable, not final pixel polish. The most likely coordinate refinements later are:

- `government_entity_type`
- `type_of_business_other_text`
- `certification_acknowledgment`
- group hitboxes for the large radio sections

Source references:

- Official PDF URL: <https://www.michigan.gov/-/media/Project/Websites/taxes/Forms/SUW/3372.pdf?rev=ac6cc85e6c4f41fb8212b9811ed94656>
- Drive PDF mirror: `1YFX3fr9KQezRY_zkPrI8_A-qTlNnOxTc`
- Page 1 PNG Drive file ID: `15mx_j0YXlnfdBFkQdc_xpeH8XIXusyf3`
- Page 2 PNG Drive file ID: `1Z-IshS3TP2wdiywBdRx0xqFczg2wIzW4`

Form assumptions captured in the manifest:

- All mandatory fields must be completed.
- Page 2 is read-only.
- A handwritten signature is not required when the certificate is provided electronically.
