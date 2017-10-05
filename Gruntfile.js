/**
 * @file Gruntfile.js
 *
 */

/** global includes */

const stylish = require('jshint-stylish'); // let's do it with style ;)

/**
 * Grunt tasks export
 * @param {Object} grunt itself
 */
module.exports = function (grunt) {

    /**
     * Main Grunt configuration initialization function
     * @param {Object} grunt config
     */
    grunt.initConfig({

        // read the project details and settings
        package: grunt.file.readJSON('package.json'),

        /** all Grunt configuration goes here */

        /** JSHint task configuration */
        jshint: {
            /** linting options */
            options: {
                reporter: stylish,
                esversion: 6
            },

            /** lint the Gruntfile and all JavaScripts from extension */
            build: ['Gruntfile.js', 'src/**/*.js']
        }

    });

    /** Loading all required Grunt plugins */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
};