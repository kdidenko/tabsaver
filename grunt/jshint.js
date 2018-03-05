/**
 * A module that defines Grunt's JSHint linting task configuration
 * @module tabsaver/grunt/jshint
 * @author Kostyanntyn Didenko <kdidenko@ito-global.com>
 * @since version 1.2.0
 */

/**
 * @function
 * When executed, loads the JSHint Grunt task plug-in, defines its configuration
 * and registers it as a Grunt's global task
 * 
 * @param {IGrunt} grunt - instance itself
 * @returns void
 */
module.exports = function (grunt) {
	'use strict';

	// load the JSHint plug-in
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// define the JSHint task configuration
	grunt.config('jshint', {
		// task-level linting options for JSHint
		options: {
			reporter: require('jshint-stylish'), // let's do it with style ;)
			esversion: 6
		},
		/** @exports jshint:grunt */
		grunt: {
			/** 
			 * @override 
			 * target-level options overrides
			 */
			options: {
				force: true,
				node: true
			},
			src: [
				'<%= paths.grunt.file %>',
				'<%= paths.grunt.tasks %><%= globs.js.deep %>'
			]
		},
		/** @exports jshint:tests */
		tests: {
			/** 
			 * @override 
			 * target-level options overrides
			 */
			options: {
				force: true,
				node: true
			},
			src: ['<%= paths.tests %><%= globs.js.deep %>']
		},
		/** @exports jshint:build */
		build: {
			/** 
			 * @override 
			 * target-level options overrides
			 */
			options: { force: false },
			src: ['<%= paths.src %><%= globs.js.deep %>']
		}
	});
	/** 
	 * @global
	 * register additional `jshint-all` task for current module
	 */
	grunt.registerTask('jshint-all', ['jshint:grunt', 'jshint:tests', 'jshint:build']);
};
