import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Butterfly, FlightTrail } from "../components/Atmosphere";
import { Contacts } from "../components/Contacts";
import { TechConstellation } from "../components/TechConstellation";
import { useLanguage } from "../i18n/useLanguage";

export function About() {
  const { t } = useLanguage();
  return (
    <main className="inner-page about-page">
      <div className="page-heading">
        <span className="eyebrow">01 / {t.aboutNote}</span>
        <h1>
          {t.about}
          <span className="chalk-period">.</span>
        </h1>
      </div>
      <div className="about-intro">
        <p className="handwritten multiline">{t.aboutLead}</p>
        <p>{t.aboutBody}</p>
      </div>
      <div className="about-butterfly">
        <Butterfly />
        <FlightTrail />
      </div>
      <TechConstellation />
      <p className="about-closing handwritten multiline">{t.aboutClosing}</p>
      <Link className="text-link next-scene" to="/projects">
        {t.viewProjects} <ArrowUpRight size={16} strokeWidth={1} />
      </Link>
      <Contacts compact />
    </main>
  );
}
