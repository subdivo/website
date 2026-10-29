import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/cyrillic-600.css";
import { Link, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { useReducedMotion } from "motion/react";
import { useLanguage } from "../i18n/useLanguage";
import { findPost, postDate, postsIn } from "../lib/posts";

export function Article() {
  const { slug = "" } = useParams();
  const { language, setLanguage, t } = useLanguage();
  const reduced = useReducedMotion();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug, language]);
  const post = findPost(slug, language);
  const original = post ?? findPost(slug);
  const posts = postsIn(language);
  const index = posts.findIndex((item) => item.slug === slug);
  const earlier = posts[index + 1];
  const later = posts[index - 1];

  if (!post)
    return (
      <main className="inner-page article-page article-unavailable">
        <Link className="text-link" to="/journal">
          <ArrowLeft size={15} />
          {t.backToJournal}
        </Link>
        <span className="article-quiet-star" aria-hidden="true">
          ✧
        </span>
        <h1 className="handwritten">
          {original ? t.translationMissing : t.articleMissing}
        </h1>
        {original && (
          <button
            type="button"
            className="text-link"
            onClick={() => setLanguage(original.language)}
          >
            {original.language === "ru" ? t.readRussian : t.readEnglish}
            <ArrowRight size={15} />
          </button>
        )}
      </main>
    );

  return (
    <main className="inner-page article-page">
      <Link className="text-link article-back" to="/journal">
        <ArrowLeft size={15} strokeWidth={1} />
        {t.backToJournal}
      </Link>
      <article>
        <header className="article-heading">
          <div className="entry-metadata">
            <time dateTime={post.date}>{postDate(post.date, language)}</time>
            <span aria-hidden="true">·</span>
            <span>
              {post.minutes} {t.readingTime}
            </span>
            {post.draft && <span className="draft-label">{t.draft}</span>}
          </div>
          <h1>{post.title}</h1>
          {post.description && <p>{post.description}</p>}
        </header>
        <div className="article-prose">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeSlug, { prefix: "post-" }]]}
            skipHtml
            components={{
              h1: ({ children, id }) => <h2 id={id}>{children}</h2>,
              a: ({ href, title, children }) => {
                if (!href) return <span>{children}</span>;
                const external = /^https?:\/\//i.test(href);
                return (
                  <a
                    href={href}
                    title={title}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    onClick={(event) => {
                      if (href?.startsWith("#") && !href.startsWith("#/")) {
                        event.preventDefault();
                        let id = href.slice(1);
                        try {
                          id = decodeURIComponent(id);
                        } catch {
                          /* Keep malformed fragments harmless. */
                        }
                        const target = document.getElementById(
                          id.startsWith("post-") ? id : `post-${id}`,
                        );
                        target?.scrollIntoView({
                          behavior: reduced ? "instant" : "smooth",
                          block: "start",
                        });
                      }
                    }}
                  >
                    {children}
                  </a>
                );
              },
              img: ({ src, alt, title }) => (
                <img
                  src={src}
                  alt={alt ?? ""}
                  title={title}
                  loading="lazy"
                  decoding="async"
                />
              ),
              table: ({ children }) => (
                <div
                  className="article-table"
                  role="region"
                  aria-label={t.articleTable}
                  tabIndex={0}
                >
                  <table>{children}</table>
                </div>
              ),
            }}
          >
            {post.markdown}
          </Markdown>
        </div>
      </article>
      <div className="article-end" aria-hidden="true">
        ✧
      </div>
      {(earlier || later) && (
        <nav className="article-neighbours" aria-label={t.moreNotes}>
          {earlier ? (
            <Link to={`/journal/${earlier.slug}`}>
              <span>
                <ArrowLeft size={13} />
                {t.earlierNote}
              </span>
              <p>{earlier.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {later && (
            <Link to={`/journal/${later.slug}`}>
              <span>
                {t.laterNote}
                <ArrowRight size={13} />
              </span>
              <p>{later.title}</p>
            </Link>
          )}
        </nav>
      )}
      <Link className="text-link article-bottom-back" to="/journal">
        <ArrowLeft size={15} />
        {t.backToJournal}
      </Link>
    </main>
  );
}
