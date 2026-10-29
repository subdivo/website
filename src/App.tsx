import { MotionConfig } from "motion/react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Atmosphere } from "./components/Atmosphere";
import { Header } from "./components/Header";
import { Cursor } from "./components/Cursor";
import { PageTransition } from "./components/PageTransition";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Journal } from "./pages/Journal";
import { Projects } from "./pages/Projects";
import { useCinema } from "./hooks/useCinema";
import { useLanguage } from "./i18n/useLanguage";

export function App() {
  const location = useLocation();
  const { t } = useLanguage();
  useCinema();
  return (
    <MotionConfig reducedMotion="user">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        {t.skip}
      </a>
      <Atmosphere />
      <Header />
      <Cursor />
      <PageTransition>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="*"
            element={
              <main className="not-found">
                <h1 className="handwritten">{t.notFound}</h1>
                <Link className="text-link" to="/">
                  {t.returnHome} ↗
                </Link>
              </main>
            }
          />
        </Routes>
      </PageTransition>
    </MotionConfig>
  );
}
