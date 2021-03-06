module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    ui: 'tdd',
                    timeout: 5000
                },
                src: ['test/*.js']
            }
        },
        watch: {
            src: {
                files: ['test/*', 'index.js', 'middleware/*', 'config/*', 'lib/*'],
                tasks: ['mochaTest'],
                option: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('default', ['mochaTest']);
}
