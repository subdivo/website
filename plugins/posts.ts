import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, resolve, sep } from "node:path";
import type { Plugin } from "vite";
import { parse } from "yaml";
import type { Post } from "../src/types/post";

const moduleId = "virtual:journal-posts";
const resolvedId = `\0${moduleId}`;

/** The file name is the URL and language; frontmatter supplies display metadata. */
export function parsePostSource(
  file: string,
  source: string,
  includeDrafts = false,
): Post | null {
  const name = basename(file).match(
    /^([a-z0-9]+(?:-[a-z0-9]+)*)\.(ru|en)\.md$/,
  );
  const fail = (message: string): never => {
    throw new Error(`[journal] ${file}: ${message}`);
  };
  if (!name) return fail("use a file name like my-note.ru.md or my-note.en.md");
  const normalized = source.replace(/^\uFEFF/, "");
  const frontmatter = normalized.match(
    /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
  );
  if (!frontmatter)
    return fail("start the file with YAML frontmatter between --- lines");
  let parsed: unknown;
  try {
    parsed = parse(frontmatter[1]);
  } catch (error) {
    return fail(
      `invalid YAML: ${error instanceof Error ? error.message : "cannot parse metadata"}`,
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    return fail("frontmatter must contain named fields");
  const metadata = parsed as Record<string, unknown>;
  if (metadata.draft !== undefined && typeof metadata.draft !== "boolean")
    return fail("draft must be true or false, without quotes");
  const draft = metadata.draft === true;
  // Draft content is never serialized into a production client bundle.
  if (draft && !includeDrafts) return null;
  if (typeof metadata.title !== "string" || !metadata.title.trim())
    return fail("title is required");
  if (
    typeof metadata.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(metadata.date)
  )
    return fail("date must be YYYY-MM-DD");
  const timestamp = Date.parse(`${metadata.date}T00:00:00Z`);
  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== metadata.date
  )
    return fail("date must be a real calendar date");
  if (
    metadata.description !== undefined &&
    typeof metadata.description !== "string"
  )
    return fail("description must be plain text");
  const markdown = normalized.slice(frontmatter[0].length).trim();
  if (!markdown) return fail("the article body is empty");
  const words = markdown.split(/\s+/u).length;
  return {
    slug: name[1],
    language: name[2] as Post["language"],
    title: metadata.title.trim(),
    date: metadata.date,
    description: (metadata.description as string | undefined)?.trim() ?? "",
    markdown,
    minutes: Math.max(1, Math.ceil(words / 220)),
    draft,
  };
}

export function readPosts(directory: string, includeDrafts = false): Post[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      const post = parsePostSource(
        file,
        readFileSync(resolve(directory, file), "utf8"),
        includeDrafts,
      );
      return post ? [post] : [];
    })
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        a.slug.localeCompare(b.slug) ||
        a.language.localeCompare(b.language),
    );
}

export function postsPlugin(): Plugin {
  let directory = "";
  let development = false;
  return {
    name: "journal-posts",
    configResolved(config) {
      directory = resolve(config.root, "content/posts");
      development = config.command === "serve";
    },
    resolveId(id) {
      if (id === moduleId) return resolvedId;
    },
    load(id) {
      if (id !== resolvedId) return;
      if (!development) this.addWatchFile(directory);
      const posts = readPosts(directory, development);
      return `export default ${JSON.stringify(posts)};`;
    },
    configureServer(server) {
      server.watcher.add(directory);
      const reload = (file: string) => {
        if (!file.startsWith(`${directory}${sep}`) || !file.endsWith(".md"))
          return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher
        .on("add", reload)
        .on("change", reload)
        .on("unlink", reload);
      server.httpServer?.once("close", () => {
        server.watcher
          .off("add", reload)
          .off("change", reload)
          .off("unlink", reload);
      });
    },
  };
}
