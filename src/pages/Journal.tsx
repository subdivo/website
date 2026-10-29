import { Butterfly } from "../components/Atmosphere";
import { useLanguage } from "../i18n/useLanguage";

export function Journal() {
  const { t } = useLanguage();
  return (
    <main className="inner-page journal-page">
      <div className="page-heading">
        <span className="eyebrow">02 / {t.journalNote}</span>
        <h1>
          {t.journal}
          <span className="chalk-period">.</span>
        </h1>
      </div>
      <div className="journal-canvas">
        <div className="journal-thread" aria-hidden="true" />
        <article className="paper-note">
          <span className="paper-pin" aria-hidden="true" />
          <span className="note-number">{t.firstPage}</span>
          <h2>{t.blankPage}</h2>
          <p className="multiline">{t.journalBody}</p>
          <span className="note-doodle" aria-hidden="true">
            ✧
          </span>
        </article>
        <div className="journal-butterfly">
          <Butterfly />
        </div>
        <p className="journal-caption handwritten multiline">
          {t.journalCaption}
        </p>
      </div>
    </main>
  );
}
