# Design reference (extracted from the XD file)

Everything here was extracted **once**, in step 1a, from `design/InkSpills_UI_Revamp_2026.xd`.
Do not unpack the XD file again (CLAUDE.md). Use these files instead.

## Where things went

| What | Where |
| --- | --- |
| Colours, type scale, radii, shadows, spacing | `src/styles/tokens.scss` |
| Breakpoint mixins | `src/styles/_breakpoints.scss` (`@use 'breakpoints' as bp;`) |
| Logo (icon + outlined Goudy wordmark, no font needed) | `public/assets/logo.svg`, `logo-on-dark.svg` (footer), `logo-mark.svg` (icon only, favicon) |
| Book and About us photos (resized to 1200 px max, JPEG) | `public/assets/images/books/<slug>.jpg`, `public/assets/images/about/*.jpg` |
| UI icons (XD vector paths) | `src/app/shared/ui/icon/icons.ts` |
| Sample books, authors, genres, reviews, Home rails | `src/app/data/sample/catalog.json` |
| Sample account, cart, order, purchases, rentals | `src/app/data/sample/account.json` |
| Page copy (ebook wording applied) | `src/app/data/sample/copy.json` |
| Layout of every artboard | `docs/design/artboards/*.json` (below) |

## Artboard specs

`artboards/<artboard>.json` is a flattened list of every layer on a 1440 px artboard, one per line, in
paint order. Coordinates are in px relative to the artboard's top-left corner.

```jsonc
{"type":"rect","x":80,"y":890,"name":"cover","group":"Section: New arrivals","w":237,"h":316,"radius":6,"fill":"#F3F6FC"}
{"type":"rect", ..., "image":"/assets/images/books/harry-potter.jpg"}   // image fill (object-fit: cover)
{"type":"text","x":80,"y":1259,"text":"Harry Potter","font":"Newsreader","weight":"Medium","size":20,"color":"#0F1B33"}
{"type":"path","x":284.5,"y":912.9,"name":"Icon","d":"M 5.3,10 ...","stroke":{"color":"#0F1B33","width":1.28}}
{"type":"group","name":"Section: Best sellers","depth":1}               // marks where a group starts
```

- Text `y` is the **baseline**, not the top of the text box.
- `letterSpacing` is in em; `shadow` lists `dx`, `dy`, `blur` and `color`. Colours with alpha use `#RRGGBB/alpha`.
- The artboards: style guide, log in, log in with invalid email, sign up, home, book details,
  book details with added-to-cart toast, about us, cart, checkout, order completed, personal details,
  purchased books, rented books, logging out.

## Differences from the XD, on purpose

- Ebook copy: "Ships in 2 days" → "Read instantly in your browser", "Due back" / "Rented until" → "Access until",
  "Ship to this address too" removed, format "Paperback" → "EPUB".
- The wordmark font (Goudy Bookletter 1911, a stand-in for Poor Richard) is outlined into the SVG and never loaded.
- Fonts are self-hosted with `@fontsource-variable/newsreader` and `@fontsource-variable/inter`.
