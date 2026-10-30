# Adding a note

## Публикация через GitHub

1. Открой https://github.com/subdivo/website/tree/main/content.
2. Нажми **Add file → Create new file** и задай путь `posts/my-note.ru.md`.
   Имя заметки — латиницей, слова через дефис; для английской версии используй `.en.md`.
3. Скопируй шаблон ниже, укажи заголовок и дату, напиши текст на Markdown.
4. Поставь `draft: false` и сохрани файл коммитом в ветку `main`.

```markdown
---
title: "Моя заметка"
date: "2026-10-30"
description: "Короткое описание"
draft: false
---

Текст заметки.
```

VPS проверяет GitHub каждую минуту и автоматически собирает сайт. Обычно заметка
появляется на https://subdivo.xyz/#/journal через 1–2 минуты после коммита.
Если сборка не удалась, продолжает работать предыдущая версия сайта.
Чтобы изменить или удалить заметку, отредактируй или удали файл на GitHub и
сохрани коммит в `main`. Отдельная панель управления и доступ к VPS не нужны.

## Local writing

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
site build. The VPS automatically checks GitHub main every minute and publishes
successful builds.

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
