import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Butterfly } from "../components/Atmosphere";
import { useLanguage } from "../i18n/useLanguage";
import { postDate, postsIn } from "../lib/posts";

export function Journal() {
  const { language, t } = useLanguage();
  const posts = postsIn(language);
  return (
    <main className="inner-page journal-page">
      <div className="page-heading">
        <span className="eyebrow">02 / {t.journalNote}</span>
        <h1>
          {t.journal}
          <span className="chalk-period">.</span>
        </h1>
      </div>
      {posts.length ? (
        <section className="diary" aria-label={t.journalEntries}>
          <div className="diary-thread" aria-hidden="true" />
          {posts.map((post, index) => (
            <motion.article
              className="diary-entry"
              key={post.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: Math.min(index * 0.08, 0.3) }}
            >
              <Link className="diary-entry-link" to={`/journal/${post.slug}`}>
                <span className="diary-leaf" aria-hidden="true">
                  <i />
                  {index % 2 === 0 ? "✧" : "☾"}
                </span>
                <div className="diary-entry-copy">
                  <div className="entry-metadata">
                    <time dateTime={post.date}>
                      {postDate(post.date, language)}
                    </time>
                    {post.draft && (
                      <span className="draft-label">{t.draft}</span>
                    )}
                  </div>
                  <h2>{post.title}</h2>
                  {post.description && <p>{post.description}</p>}
                </div>
                <ArrowUpRight
                  className="diary-entry-arrow"
                  size={23}
                  strokeWidth={1}
                />
              </Link>
            </motion.article>
          ))}
          <div className="diary-end" aria-hidden="true">
            ✧
          </div>
        </section>
      ) : (
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
      )}
    </main>
  );
}
