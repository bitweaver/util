# Util library selection guide

Util is a library collection, not one cohesive runtime service. Before changing
a file, determine whether it is first-party Bitweaver code, a bundled upstream
library, a compatibility copy, or generated/test material.

## First-party integration utilities

Notable package-owned entry points include:

| Area | Primary files/directories |
|---|---|
| Archive helpers | `zip_lib.php`, `tar.class.php`, `pclzip_lib.php` |
| Mail integration | `phpmailer/`, `mailman_lib.php` |
| MIME helpers | `mime_lib.php`, `mimetypes.php` |
| Text conversion | `parsedown/` (Parsedown 1.8.0), `markdown.php` (legacy PHP Markdown 1.0.1n), `diff.php`, `htmlparser/` |
| Async/process helper | `PHPAsync.php` |
| Browser detection | `BrowserDetection.php` |
| Spreadsheets | `bitexcel/` |
| Geography/datasets | `geocalc/`, `datasets/`, `phpcoord/` |
| Browser assets | `javascript/` |

Some directories are third-party libraries even when Bitweaver wraps or patches
them. Check file headers and repository history before treating an API as owned.

## Selection rules

1. Search for an existing framework/package wrapper before including a library
   file directly.
2. Prefer the smallest utility that satisfies the need.
3. Do not create domain persistence or business objects in Util.
4. Keep optional extension checks close to the adapter.
5. Use package path constants rather than relative paths from the caller.
6. Document licenses and upstream provenance when adding a library.

## Bundled library changes

Avoid broad style or namespace rewrites in vendored code. When a security or PHP
compatibility patch is necessary:

- Record the upstream version/provenance.
- Keep the patch narrowly reviewable.
- Check whether a maintained upstream replacement exists.
- Test all package call sites, not only the library's own examples.
- Preserve license and copyright files.

## File and archive safety

Archive and upload-related helpers operate across trust boundaries:

- Reject traversal (`../`), absolute paths, drive prefixes, and unsafe links.
- Apply decompressed-size and file-count limits.
- Never extract directly into executable/public locations.
- Validate destination containment after normalization.
- Treat MIME type and extension as hints, not proof.

## Mail safety

Callers own recipient authorization and message content. Utilities must:

- Prevent header injection.
- Keep credentials out of logs/errors.
- Escape or sanitize HTML appropriately.
- Bound attachments.
- Distinguish transport failure from business success.

## Async/process safety

Background helpers must not interpolate untrusted shell arguments. Close the
session before long work, record actionable failure state, and design retry
behavior to avoid duplicate side effects.

## Browser-side assets

jQuery and jQuery UI are not bundled: Themes loads them from the Google CDN
(`BitThemes::loadAjax('jquery')`, defaults `jquery_version` 3.7.1 and
`jquery_ui_version` 1.14.1, overridable per site in `kernel_config`) together
with Bootstrap 3 from `config/themes/bootstrap`. What `javascript/` still
bundles, and who uses it:

| Path | Library | Used by |
|---|---|---|
| `bitweaver.js` | first-party `BitBase` helpers | every page (Themes) |
| `dropzonejs/` | Dropzone 6.3.5 (upstream `dist/`, unmodified) | designer photo upload, prints grid and template editor; products PDF wizard |
| `multifile.js` | multiple-file input helper | liberty attachments when `liberty_attachment_style=multiple` |
| `jquery/plugins/colorbox/` | Colorbox 1.6.4 | designer, products, bookstore, contests, create (lightbox) |
| `jquery/plugins/cropper/` | Cropper 1.6.3 + jquery-cropper 1.0.2 | products cover/PDF tools, designer |
| `jquery/plugins/magnify/` | magnify 2.1.0 | products image zoom |
| `jquery/plugins/zoom/` | zoom 1.7.20 | designer image zoom |
| `jquery/plugins/touch-punch/` | jQuery UI Touch Punch | touch drag in designer, chatgpt |
| `jquery/plugins/acisortable/` | acisortable 1.6.0 | liberty |
| `jquery/plugins/bootstrap-datetimepicker/` | bootstrap-datetimepicker 2.0 | bookstore stats only |
| `jquery/plugins/cm_pageflip/` | page-flip viewer | products `pageflip.php` (designer preview) |

Removed and not to be re-added: Flash players (`flv_player`, `fspp`,
`pdfviewer`), MochiKit, FancyZoom, Fancybox, the kruse and dynarch calendars
(use `<input type="date">` / `datetime-local`), local jQuery copies, the
JavaScript packer and `jscompressor.php`, and the second Dropzone copy that
`dzupload` loaded on every page. Media plays in `<video>`, `<audio>`
and the browser PDF viewer.

Dropzone is replaced as upstream's `dist/` files (`dropzone-min.js`, its map,
`dropzone.css`, `LICENSE`) so the bytes can be compared with the npm release.
Pages load `dropzone-min.js` themselves (it is not in the persistent bundle).
Every `dropzone.css` rule is scoped to the `.dropzone` class, and no upload
area here uses that class, so callers style their own zones and need not load
it. Use `new Dropzone( element, {...} )`; Dropzone 6 has no `autoDiscover`.

Before adding a library:

- Check whether Themes already loads it, and never load a second version.
- Pin an exact version and record it in the table above.
- Remove its demo, test and example files (no PHP may sit under util; see
  [security.md](security.md)).
- Prefer package-scoped initialization over global mutation.

## Dependency direction

Domain packages may depend on Util. Util must not acquire dependencies on
optional domain packages. If a helper needs domain knowledge, it belongs in the
domain package even when several controllers use it.
