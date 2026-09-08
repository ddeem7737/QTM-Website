# QTM Group Website

Complete responsive corporate website for QTM Group — Quality Team Management.

## Main content files

- `app/data.ts` — structured products, suppliers, industries and news.
- `app/components/QtmSite.tsx` — navigation, pages, forms and reusable components.
- `app/globals.css` — QTM visual system and responsive layouts.
- `public/assets/` — local, non-hotlinked industrial imagery.

## Replace placeholders before public launch

Search the project for these editable values:

- `QTM_EMAIL`
- `QTM_PHONE`
- `QTM_LINKEDIN`
- `QTM_B2B_PORTAL_URL`
- `RAPPLON_OFFICIAL_URL`

The header and footer currently use a text-based QTM placeholder. Replace it with the approved files for `QTM_LOGO_DARK` and `QTM_LOGO_WHITE` in the `Logo` component.

Supplier logo blocks show their exact asset keys (`MEGADYNE_LOGO`, `CONTINENTAL_LOGO`, `AMMERAAL_LOGO`, `SAMPLA_LOGO`, `UNI_MODULAR_LOGO`, `CHALLENGE_LOGO`, and `WHM_LOGO`). Replace each block only with an official uploaded logo, preserving its aspect ratio.

## Forms

Forms include browser-side validation, file-type restrictions and success/error states. Before launch, connect `InquiryForm` to the approved QTM form or CRM endpoint. Until then, valid submissions remain safely on the page and explain that delivery is not yet connected.

## News and legal content

News entries in `app/data.ts` are clearly marked draft placeholders. Legal pages are structural placeholders and require approved legal text.

## Run locally

```bash
npm run dev
```

Build and validate:

```bash
npm run build
```
