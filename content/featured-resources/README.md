# Featured Resources

Resources in this folder appear in the rotating "Featured Resource" section on the homepage.

**Curation:** Featured content is strictly curator-managed. Only curators with repo access may add or edit featured resources. There is no public submission path for the homepage carousel.

## Adding a new featured resource

Create a new `.md` file with frontmatter:

```yaml
---
title: Your resource title
description: |
  Brief description. Supports [markdown links](https://example.com).
ctaLabel: Watch / Read / Listen
ctaHref: https://...
order: 3
---
```

- **title** (required): Display title
- **description** (required): Markdown-supported text
- **ctaLabel** (required): Button text (e.g. "Watch on YouTube")
- **ctaHref** (required): Link URL
- **order** (optional): Sort order (lower = first). Default 99.

## Featuring existing Knowledge Garden content

Add to any markdown file's frontmatter:

```yaml
---
featured: true
featuredDescription: Optional custom description for the homepage.
featuredCta: Read more
featuredCtaHref: /custom-url  # Optional; defaults to the page URL
featuredOrder: 5
---
```
