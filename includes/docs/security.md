# Util security notes

## Direct HTTP access

Util has no web entry points. Browsers fetch only its static assets
(`javascript/`, CSS, images); every PHP file is a library for `require`.

- `util/.htaccess` denies Apache requests for any `.php`, `.php[0-9]`,
  `.phtml`, `.phar`, or `.pht` file anywhere in the package, and protects
  `.htaccess` and `web.config`. `util/web.config` does the same for IIS
  through request filtering.
- The entire `includes/` subtree is private implementation material.
  `includes/.htaccess` denies every file there recursively;
  `includes/web.config` denies all IIS users.

Do not add a PHP file meant to be requested directly; put a controller in a
domain package. A vendored library's demo or helper scripts (`test.php`,
`example.php`, compressors, proxies) are removed when the library is
imported, not left for the deny rule to catch.

Nginx and Caddy do not consume directory-local access files. Their site
configuration must deny PHP beneath `/util/` and any URI path segment named
`includes`:

### Nginx

```nginx
location ~* ^/util/.*\.(?:php[0-9]?|phtml|phar|pht)$ {
    deny all;
    return 403;
}
location ~ (^|/)includes(?:/|$) {
    deny all;
    return 403;
}
```

Place these before the generic `\.php$` FastCGI location.

### Caddy

```caddyfile
@utilPhp path_regexp utilPhp (?i)^/util/.*\.(?:php[0-9]?|phtml|phar|pht)$
respond @utilPhp 403
@packageIncludes path_regexp packageIncludes (^|/)includes(?:/|$)
respond @packageIncludes 403
```

After deployment, request `util/index.php` and a known file beneath
`includes/`, and require HTTP 403 or 404. A PHP 500 or a redirect is a failure
because it proves that the server executed a directly requested file. A
`util/javascript/*.js` file must still return 200.

## Application trust boundaries

- Request, cookie, header, upload, webhook, and API data are untrusted.
- Authentication does not imply authorization.
- Content-level access can be stricter than a global package permission.
- Identifiers must be validated before use in SQL, paths, redirects, or object
  construction.
- Secrets and credentials must remain in protected configuration, never in
  templates, responses, logs, or these documents.
- File operations must use validated storage helpers and must prevent traversal.

## Package boundary

Does not define application business models or request bootstrap order.
