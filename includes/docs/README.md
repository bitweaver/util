# Util package documentation

> Engineering documentation derived from the source in this package. No PHP
> file in this package may be requested directly over HTTP, and the
> `includes/` directory is denied entirely; see [Security](security.md).

## Purpose

Util is the shared library package for mail, archives, parsing, media inspection, data conversion, and browser-side helpers.

## Responsibility

Owns reusable utilities and bundled compatibility libraries that do not belong to a domain package.

## Dependencies

kernel; individual libraries may have optional PHP extensions.

Dependency direction matters: this package may depend on the packages above;
the dependencies do not thereby depend on this package.

## Boundary

Does not define application business models or request bootstrap order.

## Documentation map

- [Architecture](architecture.md) — initialization, components, and request flow.
- [Source reference](source-reference.md) — source-derived files, classes,
  controllers, schema artifacts, plugins, and templates.
- [Development guide](development.md) — safe change workflow, extension points,
  validation, and maintenance guidance.
- [Security](security.md) — trust boundaries and direct-HTTP access requirements.
- [Library selection guide](library-selection.md) — first-party utilities,
  bundled third-party code, ownership boundaries, and safe reuse.
