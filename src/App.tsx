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

export function App() {
  return (
    <BrowserRouter>
      <Routes>
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
