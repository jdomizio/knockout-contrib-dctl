module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bowercopy: {
            options: {
                srcPrefix: 'bower_components'
            },
            lib: {
                files: {
                    'js/lib': [
                        'knockoutjs/dist/*.{js,map}'
                    ]
                }
            }
        },

        copy: {
            'build': {
                files: [
                    {
                        cwd: 'src',
                        src: 'knockout-ctl.js',
                        dest: 'dist/',
                        expand: true
                    }
                ]
            },
            'tests': {
                files: [
                    {
                        cwd: 'dist',
                        src: '*.{js,map}',
                        dest: 'js/lib/',
                        expand: true
                    }
                ]
            }
        },

        uglify: {
            'build': {
                options: {
                    mangle: true,
                    sourceMap: true,
                    sourceMapName: 'dist/knockout-ctl.min.map',
                    sourceMapIncludeSources: true,
                    compress: true
                },
                files: {
                    'dist/knockout-ctl.min.js': [
                        'dist/knockout-ctl.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', function() {
        grunt.task.run('bowercopy:lib');
        grunt.task.run('copy:build');
        grunt.task.run('uglify:build');
        grunt.task.run('copy:tests');
    });
};