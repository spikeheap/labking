# Contributing

:+1::+1::+1: First and foremost, thanks for helping! :+1::+1::+1:

## Issues

* Issues are appropriate for questions, bug requests, enhancement requests, pretty much anything.

## Pull Requests

* PRs should be from your fork of the project, into a feature or hotfix branch (see 'Branches' below).
* If you've added code that should be tested, add tests!
* If you've changed APIs, update the documentation.
* Ensure the test suite passes (`gulp test`).
* Make sure your code lints (`gulp lint`).
* Ensure the code you're submitting can be released under our [license](https://github.com/spikeheap/labkey-subject-view/blob/master/LICENSE.md).

## Branches

This project uses [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) branching strategy.

* `master` is reserved for releases.
* `develop` contains the latest stable development code. It is merged into master by PR to perform a release.

## Git Commit Messages

These are lifted liberally from the [Atom contributing guidelines](https://raw.githubusercontent.com/atom/atom/master/CONTRIBUTING.md).

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on Mac OS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings