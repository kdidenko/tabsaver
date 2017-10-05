/**
 * @file Gruntfile.js
 *
 */

/**
 * Grunt tasks export
 * @param {Object} grunt itself
 */
module.exports = function (grunt) {

    /**
     * Main Grunt configuration initialization function
     */
    grunt.initConfig({

        // read the project details and settings
        package: grunt.file.readJSON('package.json')

        // all configuration goes here

    });

    /** Loading all required Grunt plugins */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
};