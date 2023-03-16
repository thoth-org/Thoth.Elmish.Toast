# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 4.0.0 - 2023-03-16

### Changed

* Update to Elmish 4.0

## 3.0.0 - 2021-04-17

### Removed

* Remove the `Toast.addInput` API.

    It was never really supported and the implementation doesn't fill solied

* Remove properties and code related to `ProgressBar`.

    It was never released and was just some relicat from experimentation

### Changed

* Update all the doc comments to use XML style doc comments
* Format the library code using my new formatting style
* Remove unnecessary `boxing` and `option` type when creating the event to dispatch
* Use a literal string for the passing the event name

### Added

## 2.1.0 - 2019-09-10

### Changed

* Prevents adding an extra div (by @alfonsogarciacaro)

## 2.0.0 - 2019-04-23

### Changed

* Release stable version

## 2.0.0-beta-003 - 2019-04-01

### Changed

* Upgrade to Fable.Core v3

## 2.0.0-beta-002

### Changed

* Don't inject variables in production mode - reduce bundle size (by @alfonsogarciacaro)

## 2.0.0-beta-001

### Changed

* Elmish 3.0 compat

## 1.1.0

### Changed

* Don't inject variables in production mode - reduce bundle size (by @alfonsogarciacaro)

## 1.0.0

### Added

* Release stable

## 1.0.0-beta-005

### Fixed

* Fix HMR support

## 1.0.0-beta-004

### Fixed

* Fix typos in doc comments

## 1.0.0-beta-003

### Fixed

* Fix package to include css files too

## 1.0.0-beta-002

### Added

* Add doc comments

### Changed

* Mark some part of the API as private

### Removed

* Disable progress bar support

## 1.0.0-beta-001

### Added

* Initial release
