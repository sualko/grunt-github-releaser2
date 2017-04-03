/* jshint latedef: nofunc */
/*
 * grunt-github-releaser2
 * https://github.com/sualko/grunt-github-releaser2
 *
 * Copyright (c) 2017 sualko
 * Licensed under the MIT license.
 */

'use strict';

var GithubClient = require('github');
var Q = require('q');

module.exports = function(grunt) {

    var github = new GithubClient({
        debug: grunt.option('debug'),
        protocol: "https",
        host: "api.github.com",
        headers: {
            "user-agent": "grunt github releaser 2 for " + grunt.file.readJSON('package.json').name
        },
        Promise: Q.Promise,
        timeout: 5000
    });

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('github_releaser2', 'Create release on github.', function() {
        var done = this.async();

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            repository: '',
            authentication: {}
        });

        options.release = Object.assign({
            tag_name: grunt.file.readJSON('package.json').version
        }, options.release);


        var repository = options.repository.split('/');

        if (repository.length !== 2) {
            grunt.fail.fatal('You have to define which repository I should use.');
        }

        var owner = repository[0];
        var repo = repository[1];
        var auth = new Authentication(options.authentication);

        var files = filterMissingFiles(this.filesSrc);

        auth.auth();
        options.release.owner = owner;
        options.release.repo = repo;
        var release = github.repos.createRelease(options.release);

        release.then(function(res) {
            grunt.log.ok('Released, see ' + res.data.html_url);
            grunt.verbose.writeln('Release was published. Now I will try to upload your assets.');

            var uploadPromises = [];

            files.forEach(function(filepath) {
                var filename = filepath.split('/');
                filename = filename[filename.length - 1];

                grunt.verbose.writeln('Uploading ' + filename + ' (' + filepath + ')');

                auth.auth();
                var promise = github.repos.uploadAsset({
                    owner: owner,
                    repo: repo,
                    id: res.data.id,
                    filePath: filepath,
                    name: filename
                });

                uploadPromises.push(promise);
            });

            return Q.all(uploadPromises);
        }).then(function(responses) {
            responses.forEach(function(res) {
                grunt.log.ok('Uploaded: ' + res.data.name);
            });

            done();
        }).catch(function(err) {
            grunt.verbose.error(err);

            var errorObject = {};

            try {
                errorObject = JSON.parse(err);
            } catch (err) {}

            grunt.log.error('An error occured: ' + errorObject.message);

            errorObject.errors.forEach(function(e) {
                if (e.code === 'already_exists') {
                    grunt.log.error('A release with this ' + e.field + ' already exists. I aborted.');
                } else {
                    grunt.log.error(e);
                }
            });

            done(false);
        });
    });

    function filterMissingFiles(files) {
        files = files.filter(function(filepath) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
                grunt.fail.warn(filepath + ' not found.');
                return false;
            } else {
                return true;
            }
        });

        return files;
    }

    function Authentication(options) {
        this.options = options;
    }

    Authentication.prototype.auth = function() {
        if (this.options.type) {
            grunt.verbose.writeln('I will try to authenticate you on github.');

            github.authenticate(this.options);
        }
    };

};
