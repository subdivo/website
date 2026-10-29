import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parsePostSource, readPosts } from "../plugins/posts";

const article = (metadata = "", body = "A small **Markdown** note.") =>
  `---\ntitle: "A note: with a colon"\ndate: 2026-10-30\n${metadata}\n---\n\n${body}`;

describe("Markdown publishing", () => {
  test("reads YAML, language and a stable URL from the file name", () => {
    const post = parsePostSource(
      "a-small-note.ru.md",
      article('description: "Two words."'),
    );
    expect(post).toMatchObject({
      slug: "a-small-note",
      language: "ru",
      title: "A note: with a colon",
      date: "2026-10-30",
      description: "Two words.",
      draft: false,
      minutes: 1,
    });
    expect(post?.markdown).toBe("A small **Markdown** note.");
  });
  test("accepts Windows newlines and a UTF-8 BOM", () => {
    expect(
      parsePostSource(
        "a-note.en.md",
        "\uFEFF" + article().replaceAll("\n", "\r\n"),
      )?.language,
    ).toBe("en");
  });
  test("drafts are excluded from production but available for local preview", () => {
    const source = article("draft: true", "PRIVATE_DRAFT_BODY");
    expect(parsePostSource("a-note.ru.md", source)).toBeNull();
    expect(parsePostSource("a-note.ru.md", source, true)?.draft).toBe(true);
    expect(parsePostSource("a-note.ru.md", source, true)?.markdown).toBe(
      "PRIVATE_DRAFT_BODY",
    );
  });
  test("rejects misleading metadata rather than accidentally publishing a draft", () => {
    expect(() =>
      parsePostSource("note.ru.md", article('draft: "true"')),
    ).toThrow("draft must be true or false");
    expect(() =>
      parsePostSource("note.ru.md", article("description: [not, text]")),
    ).toThrow("description must be plain text");
  });
  test("rejects impossible dates and empty articles with a useful file name", () => {
    expect(() =>
      parsePostSource(
        "bad-date.ru.md",
        article().replace("2026-10-30", "2026-02-30"),
      ),
    ).toThrow("[journal] bad-date.ru.md: date must be a real calendar date");
    expect(() => parsePostSource("note.en.md", article("", ""))).toThrow(
      "article body is empty",
    );
  });
  test("reports invalid file names and malformed frontmatter", () => {
    expect(() => parsePostSource("note.md", article())).toThrow(
      "my-note.ru.md",
    );
    expect(() => parsePostSource("note.en.md", "# Just a heading")).toThrow(
      "frontmatter",
    );
    expect(() =>
      parsePostSource("note.en.md", "---\ntitle: [\n---\nBody"),
    ).toThrow("invalid YAML");
  });
  test("publishes newest first and never serializes draft titles or bodies", () => {
    const directory = mkdtempSync(join(tmpdir(), "subdivo-posts-"));
    try {
      writeFileSync(
        join(directory, "older.en.md"),
        article().replace("2026-10-30", "2026-01-01"),
      );
      writeFileSync(join(directory, "newer.ru.md"), article());
      writeFileSync(
        join(directory, "secret.ru.md"),
        article("draft: true").replace(
          "A note: with a colon",
          "PRIVATE_DRAFT_TITLE",
        ),
      );
      writeFileSync(join(directory, ".gitkeep"), "");
      const published = readPosts(directory);
      expect(published.map((post) => post.slug)).toEqual(["newer", "older"]);
      expect(JSON.stringify(published)).not.toContain("PRIVATE_DRAFT_TITLE");
      expect(readPosts(directory, true)).toHaveLength(3);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
