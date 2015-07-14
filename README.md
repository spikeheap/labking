# LabKing :crown:
_Rule over your subjects in LabKey_

[![Build Status](https://travis-ci.org/spikeheap/labking.svg)](https://travis-ci.org/spikeheap/labking)
[![Coverage Status](https://coveralls.io/repos/spikeheap/labking/badge.svg?branch=develop&service=github)](https://coveralls.io/github/spikeheap/labking?branch=develop)

## Building the project

The build process does a few things:

1. Compiles your ES6 JavaScript into a single ES5-compatible file in the web resources directory (this is what you reference in your HTML).
2. Copies your HTML over into the target.
2. Generates a `module.xml` file for LabKey.
3. Generates WebParts and View XML files based on the `webParts` and `webViews` attributes in `package.json`.

* `npm build` builds the module
* `npm test` runs the test suite
* `npm watch` watches for changes and builds each time

These are really just wrappers for Gulp (`gulp`, `gulp test`, and `gulp watch` respectively).

## Creating Web Parts

1. Create a WebPart definition in `package.json`, e.g. for `sample.html`:
    ```json
        "webParts": [
            { "name": "WebPart Friendly Name",  "htmlFilePrefix": "sample" }
        ]
    ```

2. Create `views/sample.html`:
    ```html
    <div>
    <h1>Hello World!</h1>
    </div>
    ```


## Browser requirements

LabKing is unapologetically built for the modern world. You'll need IE9+, or a reasonably up-to-date version of Chrome, Firefox, Opera, or similar to make the most of it. You *may* find it works on IE8, and we'd love to hear your experiences to flesh out the documentation. More than that, we'd love for you to upgrade to a modern browser for general happiness :cocktail: :beers: :wine_glass:.

## License

This project is [MIT licensed](https://github.com/spikeheap/labkey-subject-view/blob/master/LICENSE.md).

## Contributing

We'd love to get your feedback, pull requests and contributions. There are [some notes on contributing](https://github.com/spikeheap/labkey-subject-view/blob/master/CONTRIBUTING.md).
