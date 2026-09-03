# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning].

This change log follows the format documented in [Keep a CHANGELOG].

[semantic versioning]: http://semver.org/
[keep a changelog]: http://keepachangelog.com/

## v0.3.5 - 2026-08-12

### Fixed

- Properly use glob patterns when calling Oxfmt.

## v0.3.4 - 2026-08-12

### Fixed

- Fixed compatibility with the latest Oxfmt requiring explicit paths.

## v0.3.3 - 2026-08-12

### Fixed

- Fixed the `bin` field in the published package to point to the correct `bin.js` file.

## v0.3.2 - 2026-08-09

### Fixed

- Moved `vitest.config.ts` to the correct `config` dir.

## v0.3.1 - 2026-08-09

### Fixed

- Fixed the package `files` field to include all files.

## v0.3.0 - 2026-08-09

### Added

- Included TS configs in the published package.

- Added default Oxfmt and Oxlint configs.

- Added default Vitest config.

- Added basic root-level mise config with task templates.

- Made `jsd build` copy static assets in the src directory (`md`, `json`, `toml`, `kdl`, `yaml`, `yml`) to the dist dir.

## v0.2.1 - 2026-07-23

### Fixed

- Fixed published package.

## v0.2.0 - 2026-07-23

### Added

- Added support for symlinks to the package build command.

## v0.1.1 - 2026-07-22

Initial version
