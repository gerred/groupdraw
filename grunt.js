module.exports = function(grunt) {
    grunt.initConfig({
        min: {
            main: {
                src: [
                'assets/js/uuid.js',
                'assets/js/util.js',
                'assets/js/main.js',
                'assets/js/arrow.js',
                'assets/js/screenshot.js'
                ],
                dest: 'public/js/main.min.js'
            }
        },
        concat: {
            main: {
                src: [
                 'assets/js/util.js',
                 'assets/js/main.js'               
                ],
                dest: 'public/js/main.js'
            }
        },
        watch: {
            files: [
                'assets/js/*.js'
            ],
            tasks: ['min']
        }
    });

    grunt.registerTask('default', 'min');
}