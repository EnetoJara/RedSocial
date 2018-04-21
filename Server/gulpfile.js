'use strict'

const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const jsFiles = ['*.js', './**/*.js']

gulp.task('debug', [], () => {
	let options = {
		exec: 'node --inspect ',
		script: 'api.js',
		delayTime: 1,
		env: { 'PORT': 3000, 'NODE_ENV': 'dev' },
		watch: jsFiles
	}
	return nodemon(options).on('restart', () => console.log('restarting....'))
})