# Releasing LabKing

The release process broadly follows the Git Flow process.

First, make sure your local copy is up-to-date:

```
git checkout master && git pull
git checkout develop && git pull
```

Then do the Git Flow release:

```
LK_VERSION=0.0.5
git flow release start $LK_VERSION

# Bump the version in package.json now!
jq ".version = \"${LK_VERSION}\"" package.json > package.json.new && mv package.json.new package.json
git add package.json
git commit -m "Update package version number to $LK_VERSION"

git flow release finish $LK_VERSION
```

The above `jq` command relies on `jq`, which is available through HomeBrew or [manual download](http://stedolan.github.io/jq/download/). Alternatively you can just update the version number by hand.

Now we need to push the release commits and tags to GitHub:

```
git checkout master && git push
git checkout develop && git push
git push --tags
```

### Uploading the release & assets to GitHub

To create the release in the [LabKing project releases](https://github.com/spikeheap/labking/releases) page, we can use the [`hub`](https://github.com/github/hub) command.

First lets clean our development environment and get the released version:

```
git checkout master
rm -rf dist
```

Then we can build the project:

```
gulp
```

We need a distribution zip file with `labking` as the base directory:

```
mv dist labking
zip -r labking_$LK_VERSION.zip labking
```

Finally we can push this up to GitHub and NPM using the following:

```
hub release create -a labking_$LK_VERSION.zip -m "Preview release of participant search, view and record creation" $LK_VERSION
npm publish
```

If you've added the changes, you can use the changelog instead:

```
hub release create -a labking_$LK_VERSION.zip -f CHANGELOG.md $LK_VERSION
npm publish
```
