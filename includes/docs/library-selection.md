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

Many JavaScript directories contain legacy libraries. Before using one:

- Check whether Themes already loads it.
- Avoid loading multiple versions.
- Verify browser/CSP compatibility.
- Prefer package-scoped initialization over global mutation.

## Dependency direction

Domain packages may depend on Util. Util must not acquire dependencies on
optional domain packages. If a helper needs domain knowledge, it belongs in the
domain package even when several controllers use it.
