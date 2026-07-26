import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { LeistungenPage } from './pages/LeistungenPage'
import { PartnerPage } from './pages/PartnerPage'
import { UeberUnsPage } from './pages/UeberUnsPage'
import { TerminAnfragenPage } from './pages/TerminAnfragenPage'
import { NotfallPage } from './pages/NotfallPage'
import { ImpressumPage } from './pages/ImpressumPage'
import { DatenschutzPage } from './pages/DatenschutzPage'
import { KalenderRedirectPage } from './pages/KalenderRedirectPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Outside Layout: calendar short links from Terminanfrage emails */}
        <Route path="/k" element={<KalenderRedirectPage />} />
        <Route path="/k/:start/:end" element={<KalenderRedirectPage />} />
        {/* Legacy base64 / query links still resolve via /k */}
        <Route path="/k/:payload" element={<KalenderRedirectPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/leistungen" element={<LeistungenPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/ueber-uns" element={<UeberUnsPage />} />
          <Route path="/termin-anfragen" element={<TerminAnfragenPage />} />
          <Route path="/notfall" element={<NotfallPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
