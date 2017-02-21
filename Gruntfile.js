/*
 * grunt-github-releaser2
 * https://github.com/sualko/grunt-github-releaser2
 *
 * Copyright (c) 2017 sualko
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        github_releaser2: {
            options: {
                repository: 'sualko/grunt-github-releaser2',
                authentication: {
                    type: 'token',
                    token: grunt.file.readJSON('.github.json').token
                }
            },
            release: {}
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('release', ['default', 'github_releaser2']);
};
