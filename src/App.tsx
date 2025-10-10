// src/App.tsx
import AppRoutes from '@/routes'; // Using @/ alias
// import {
//   Analytics,
// } from '@vercel/analytics/react';

// import {
//   SpeedInsights
// } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <AppRoutes />
      {/* <Analytics /> */}
      {/* <SpeedInsights /> */}
    </>
  );
}

export default App;
