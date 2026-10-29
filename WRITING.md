# Adding a note

Copy `content/templates/post.ru.md` to `content/posts/my-note.ru.md`.
For an English version, use `my-note.en.md`. The shared name connects the translations.

The top of the file looks like this:

```yaml
---
title: "A title for this note"
date: "2026-10-30"
description: "A short thought about what's inside."
draft: true
---
```

Change the title, date and description. Write your Markdown below the second `---`.
The description is optional. Use the date format `YYYY-MM-DD`; newest notes appear first.

Run `bun run dev` to read it locally. Drafts have a small label there.
When it's ready, set `draft: false`, commit and push. The note appears after the next
site build; a connected host such as Vercel can do that automatically on push.

Drafts are left out of production builds entirely, including their titles and text.
They can still be seen in the source if you push them to a public GitHub repo.

Write headings with `##`, code inside triple backticks, and links as `[text](https://example.com)`.
Tables and task lists work too. Raw HTML isn't rendered.

Put images in `public/posts/my-note/` and use `![A description](/posts/my-note/image.png)`.
Heading links such as `[Jump to this part](#a-small-heading)` work within a note.

Each language only lists its own notes. If someone switches language while reading
a note without a translation, they'll get a link to the available version.

The file name becomes the URL: `my-note.ru.md` lives at `/#/journal/my-note`.
To unpublish a note, set `draft: true` (or delete the file), then rebuild and deploy.
