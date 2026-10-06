# Mubarakan Admin

Web admin for Mubarakan, built with React, Vite and React Router. All data is sample data in `src/data/`.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

## Structure

```
src/
  App.jsx                 routes
  context/                global state (role, filters, toasts, dialogs)
  hooks/                  useAdmin, useNavigation, useActions, useDetailTab
  data/                   sample data, selectors, constants, icons, image urls
  components/
    layout/               sidebar, top bar, search, notifications, role menu
    common/               buttons, cards, pills, toggles, popovers, dialogs, toasts
    list/                 DataList: search, filters, sort, bulk actions, pages
    detail/               DetailView and its blocks
    dashboard/            chart, funnel, mini tables
  pages/                  one file per section
    details/              one file per record type
```

Switch roles from the avatar menu in the top right to see what each team member can reach.
