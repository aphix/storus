module.exports = function(grunt) {
	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					quiet: false,
					clearRequireCache: false
				},
				src: ['test/**/*.js']
			}
		},
		watch : {
			scripts: {
				files: [
					'src/**.*',
					'test/**.*'
				],
				tasks: ['build']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.registerTask('build',['test']);
	grunt.registerTask('test',['mochaTest']);
	grunt.registerTask('build_watch',['build','watch']);
};