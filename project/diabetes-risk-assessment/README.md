# AfyaTathmini — Diabetes Risk Assessment System

Mfumo kamili wa tathmini ya hatari ya kisukari: usajili/kuingia, fomu ya tathmini ya kiafya
yenye fields 12, **modeli halisi ya machine learning (XGBoost) iliyofunzwa kwa data halisi ya
wagonjwa 100,000** (angalia `src/lib/model/README.md` kwa maelezo kamili), historia ya
tathmini, kupakua ripoti kama **CSV** na **PDF**, na sehemu ya kuwasiliana na daktari
inayoambatanisha ripoti ya tathmini moja kwa moja.

## Kuanza (Getting Started)

```bash
npm install
npm run dev
```

Fungua `http://localhost:5173` kwenye browser.

Kujenga toleo la production:

```bash
npm run build
npm run preview
```

## Muundo wa Mradi (Project Structure)

```
src/
  lib/
    auth.ts           — Usajili/kuingia kwa localStorage
    storage.ts         — Historia ya tathmini + maombi kwa daktari
    prediction.ts       — Utabiri wa hatari ya kisukari (unaotumia modeli ya ML)
    model/               — Modeli halisi ya ML (XGBoost) + maelezo ya data na tathmini
    export.ts           — Kutengeneza na kupakua ripoti CSV/PDF
  components/
    AppLayout.tsx        — Sidebar layout kwa kurasa zilizolindwa
    ProtectedRoute.tsx    — Huzuia kurasa bila login
    PublicNav.tsx          — Nav bar ya kurasa za umma
    RiskDisplay.tsx         — RiskBadge na RiskRing
    Toast.tsx                — Arifa fupi (toast notifications)
    Icons.tsx                 — Inline SVG icons
  pages/
    HomePage.tsx, LoginPage.tsx, RegisterPage.tsx,
    DashboardPage.tsx, AssessmentPage.tsx, ResultPage.tsx,
    HistoryPage.tsx, DoctorPage.tsx
  router.tsx            — Routes zote
  index.css              — Design system (medical theme)
  types.ts                — TypeScript types
```

## Vipengele Vipya: Kupakua Ripoti (CSV / PDF)

Kwenye **ukurasa wa Matokeo (ResultPage)** na **Historia (HistoryPage)**, kila tathmini ina
vitufe viwili vya kupakua:

1. **CSV** (juu) — faili la jedwali linalofungua vizuri kwenye Excel/Google Sheets.
2. **PDF** (chini) — ripoti iliyopangiliwa, tayari kuchapishwa au kutumwa.

Ripoti zote mbili zina sehemu tatu, zinazotolewa na `buildReportRows()` kwenye `src/lib/export.ts`
ili data isibadilike kati ya CSV na PDF:

- **Taarifa za Usajili** — jina, barua pepe, simu, jinsia, umri (kutoka wakati wa kujisajili)
- **Taarifa za Tathmini** — majibu yote ya fomu ya tathmini (fields 12) + tarehe
- **Matokeo ya Modeli** — kiwango cha hatari, asilimia ya uhakika, alama, sababu kuu — pamoja na mapendekezo ya kiafya

## Kuwasiliana na Daktari na Ripoti Iliyoambatanishwa

Kwenye **DoctorPage**, mtumiaji hachagui tathmini gani ya kuambatanisha — mfumo huambatanisha
**moja kwa moja tathmini yake ya karibuni iliyohifadhiwa** (ile ile inayoweza kupakuliwa kama
CSV/PDF). Modal ya "Tuma Ombi la Ushauri" inaonyesha muhtasari wa ripoti itakayoambatanishwa
(tarehe, kiwango cha hatari, uhakika, jina la mgonjwa) kabla ya kutuma. Kama mtumiaji hajahifadhi
tathmini yoyote bado, mfumo humwelekeza kufanya tathmini kwanza.

Maombi yaliyotumwa yanahifadhiwa na `storage.saveDoctorRequest()` (ikiwa na `attachedAssessmentId`
inayorejelea rekodi kamili ya tathmini kwenye historia).

## Kumbuka Kuhusu Uhifadhi wa Data

Mradi huu unatumia `localStorage` ya kivinjari kama ilivyoainishwa kwenye plan ya awali (backend
haijaunganishwa bado). Data yote — akaunti, tathmini, na maombi kwa daktari — inabaki kwenye
kivinjari kilekile. Ukiwa tayari kuunganisha backend halisi (mfano database ya kweli), badilisha
tu ndani ya `src/lib/auth.ts` na `src/lib/storage.ts` bila kugusa UI.

## Teknolojia

- React 18 + TypeScript + Vite
- react-router-dom (routing)
- jsPDF (kutengeneza PDF upande wa client)
- CSS ya kawaida (design tokens, hakuna framework ya UI)
