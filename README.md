# js-fns

> [!CAUTION]
> The current branch represents the v3 version that is a complete revamp of the library. See [the `v2` branch](https://github.com/kossnocorp/js-fns/tree/v2) for the previous version.

A JS utility library.

Unlike other utility libraries like Lodash or date-fns, which are solely focused on low-level abstractions, js-fns packs code on a wider range, from day-to-day utilities you wish were in the standard library and type-only TypeScript utilities to higher-level abstractions a la "batteries included."

It is set to solve the following problems:

- The `package.json` bloat with countless small packages.
- Deep dependency trees that duplicate code and open up for security vulnerabilities.
- Runtime & bundle size overhead from dependencies that try to cover 100% of use cases when 90% could've been solved with ⅒ of the code.
- Dependencies that you add just for a single function.
- JavaScript fatigue from major version upgrades with breaking changes.

The js-fns functionality can be pulled into your project in two ways:

- Installing `js-fns` as a dependency using a package manager.
- Pulling small parts of the library (vendoring) straight into your repo with the help of the `js` CLI.

> [!CAUTION]
> 🚧 Work in progress, the library is still being shaped and might never be released. If you are interested, have feedback, or want to contribute, feel free to [reach out to @kossnocorp at X](https://x.com/kossnocorp).

## Changelog

See [the changelog](./CHANGELOG.md).

## License

[MIT © Sasha Koss](https://koss.nocorp.me/mit/)
