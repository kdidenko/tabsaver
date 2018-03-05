/**
 * A module that defines the configuration and registers both 
 * defaults and globals for the project's Grunt tasks
 * @module tabsaver/grunt
 * @author Kostyanntyn Didenko <kdidenko@ito-global.com>
 * @since 1.2.0
 * 
 * @todo: 1. define module:tabsaver.grunt.uglify tasks using `grunt-contrib-uglify` plug-in 
 * @todo: 2. define module:tabsaver.grunt.watch tasks using `grunt-contrib-watch` plug-in 
 * @todo: 3. define module:tabsaver.grunt.cssmin tasks using `grunt-contrib-cssmin` plug-in 
 * */

/**
 * @function
 * Creates the initial Grunt configuration, loads the rest of Grunt tasks
 * and registeres Grunt's global tasks 
 * 
 * @param {IGrunt} grunt - instance itself
 * @returns void
 */
module.exports = function (grunt) {
	'use strict';

	// init Grunt project configuration
	grunt.initConfig({
		/** 
		 * @readonly 
		 * read and store the project's metadata and settings
		 */
		package: grunt.file.readJSON('package.json'),
		/** 
		 * @readonly
		 * @enum enumerates main paths for current project
		 */
		paths: {
			src: 'src/',
			build: 'build/',
			tests: 'test/',
			grunt: {
				file: 'Gruntfile.js',
				tasks: 'grunt/'
			}
		},
		/** 
		 * @readonly
		 * @enum enumerates main matching globs for project files
		 */
		globs: {
			js: {
				flat: '*.js',
				deep: '**/*.js'
			}
		}
	});
	/** 
	 * @external 
	 * load and marge external Grunt tasks into current configuration
	 */
	grunt.loadTasks(grunt.config('paths.grunt.tasks'));
	/**
	 * @global
	 * register Grunt project global tasks
	 * @requires module:tabsaver.grunt.jshint 
	 */
	grunt.registerTask('build', ['jshint-all']);
	/**
	 * @default
	 * register Grunt project default task 
	 */
	grunt.registerTask('default', ['build']);
};