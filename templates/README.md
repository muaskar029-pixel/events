# Radova Events Templates & Metadata Standard

## URL & Folder Structure

- `/events/` -> `index.html`
- `/events/workshop/` -> `workshop/index.html`
- `/events/bootcamp/` -> `bootcamp/index.html`
- `/events/<type>/<slug>/` -> `<type>/<slug>/index.html`
- `/events/<type>/page/<n>/` -> `<type>/page/<n>/index.html`
- any missing URL -> `404.html` (uses absolute `/events/assets/` paths)

Shared assets live in `assets/` and page templates live in `templates/`.

Edit the readable sources `assets/site.css` and `assets/site.js`, then run `./build.sh` to regenerate `assets/css/events.bundle.css` and `assets/js/events.bundle.js` (the files pages load).

## `<meta name="radova:<field>">` Specification

Every event detail page (`events/<type>/<slug>/index.html`) must declare these `<meta>` tags in `<head>`:

| Field | Required | Format / Allowed Values | Example |
|---|---|---|---|
| `title` | Yes | Plain text event title | `HTML-First Web with HTMX` |
| `slug` | Yes | URL-safe kebab-case matching folder name | `sample-workshop` |
| `type` | Yes | `workshop` \| `bootcamp` | `workshop` |
| `summary` | Yes | 1–2 sentence plain-text summary | `Build fast static pages with HTMX.` |
| `tags` | Yes | Comma-separated lowercase tags | `html,htmx,pico-css` |
| `speaker` | Yes | Mentor/speaker name(s) | `Radova Team` |
| `level` | Yes | `beginner` \| `intermediate` \| `advanced` | `beginner` |
| `quota` | Yes | Integer capacity | `30` |
| `price` | Yes | `Free` or IDR amount | `Rp 150.000` |
| `start_time` | Yes | ISO 8601 in WIB (`+07:00`) | `2026-12-05T09:00:00+07:00` |
| `end_time` | Yes | ISO 8601 in WIB (`+07:00`) | `2026-12-05T12:00:00+07:00` |
| `location` | Yes | Venue or `Online` | `Online (Zoom)` |
| `register_url` | Yes | Registration link (`https://...`) | `https://radova.example/register/sample-workshop` |
| `status` | Yes | `upcoming` \| `ongoing` \| `completed` \| `cancelled` | `upcoming` |

## Minimal `<head>` Example

```html
<meta name="radova:title" content="Sample Workshop: Static HTML &amp; HTMX">
<meta name="radova:slug" content="sample-workshop">
<meta name="radova:type" content="workshop">
<meta name="radova:summary" content="Hands-on session building Lynx-ready static pages with HTMX.">
<meta name="radova:tags" content="html,htmx,static">
<meta name="radova:speaker" content="Radova Team">
<meta name="radova:level" content="beginner">
<meta name="radova:quota" content="30">
<meta name="radova:price" content="Free">
<meta name="radova:start_time" content="2026-12-05T09:00:00+07:00">
<meta name="radova:end_time" content="2026-12-05T12:00:00+07:00">
<meta name="radova:location" content="Online">
<meta name="radova:register_url" content="https://radova.example/register/sample-workshop">
<meta name="radova:status" content="upcoming">
```
