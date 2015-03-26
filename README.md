# LabKing :crown:
_Rule over your subjects in LabKey_

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


## License

This project is [MIT licensed](https://github.com/spikeheap/labkey-subject-view/blob/master/LICENSE.md).

## Contributing

We'd love to get your feedback, pull requests and contributions. There are [some notes on contributing](https://github.com/spikeheap/labkey-subject-view/blob/master/CONTRIBUTING.md).