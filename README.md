# grunt-github-releaser2

This plugin creates a release on github and uploads your corresponding assets. It depends heavily on the [node.js wrapper for GitHub API](https://github.com/mikedeboer/node-github).

## Getting Started
This plugin requires Grunt `~1.0.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-github-releaser2 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-github-releaser2');
```

## The "github_releaser2" task

### Overview
In your project's Gruntfile, add a section named `github_releaser2` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  github_releaser2: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.repository
Type: `String`
Default value: `null`

Your GitHub repository url segment (e.g. `sualko/grunt-github-releaser2`).

#### options.authentication
Type: `Object`
Default value: `{}`

Any authentication option from [node-github](https://github.com/mikedeboer/node-github#authentication).

#### options.release
Type: `Object`
Default value: `{}`

##### options.release.tag_name
Type: `String`
Default value: `NPM VERSION FIELD`

String of the tag.

##### options.release.target_commitish
Type: `String`
Default value: `default branch`

Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA.

##### options.release.name
Type: `String`
Default value: ``

Name (headline) of the release.

##### options.release.body
Type: `String`
Default value: ``

Release description.

##### options.release.draft
Type: `Boolean`
Default value: `false`

`true` to create a draft (unpublished) release, `false` to create a published one.

##### options.release.prerelease
Type: `Boolean`
Default value: `false`

`true` to identify the release as a prerelease. `false` to identify the release as a full release.


### Examples

#### Minimal options

```js
grunt.initConfig({
  github_releaser2: {
     options: {
        repository: 'sualko/grunt-github-releaser2',
        authentication: {
            type: 'token',
            token: 'YOUR_TOKEN'
        }
    }
  },
});
```

#### Extended options

```js
grunt.initConfig({
  github: grunt.file.readJSON('.github.json'),
  github_releaser2: {
     options: {
        repository: 'sualko/grunt-github-releaser2',
        authentication: {
            type: 'token',
            token: '<%= github.token %>'
        },
        release: {
          body: 'Foo bar'
        }
    },
    release: {
      src: ['release.zip']
    },
    prerelease: {
      options: {
         release: {
            prerelease: true
         }
      }
      src: ['prerelease.zip']
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
Please see the CHANGELOG.md.
