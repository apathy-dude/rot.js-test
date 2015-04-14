module.exports = function(grunt) {
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            clean: {
                build: {
                    src: ['bin']
                }
            },
            jshint: {
                files: [ 'Gruntfile.js', 'src/game.js', 'tests/**/*.js' ]
            },
            mochaTest: {
                test: {
                    options: {
                        reporter: 'spec'
                    },
                    src: ['tests/**/*.js']
                }
            },
            requirejs: {
                compile: {
                    options: {
                        baseUrl: 'src/',
                        out: 'bin/<%= pkg.name %>.js',
                        mainConfigFile: 'src/config.js',
                        include: ['game'],
                        insertRequire: ['game'],
                        findNestedDependencies: true,
                        preserveLicenseComments: false,
                        wrap: true
                    }
                },
            },
  //          toArray: {},
            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                dist: {
                    files: {
                        'bin/<%= pkg.name %>.min.js': ['bin/<%=pkg.name%>.js']
                    }
                }
            },
            watch: {
            }
    });
    
    require('load-grunt-tasks')(grunt);

    grunt.registerMultiTask('toArray', 'Put Files into proper format', function() {
        var data = [];

        var options = this.options();

        this.files.forEach(function(file) {
            file.src.filter(function(filepath) {
                if(options.getFiles && options.getFolders)
                    return true;

                var isFile = grunt.file.isFile(filepath);

                return (options.getFiles && isFile) || (options.getFolders && !isFile);
            }).map(function(filepath) {
                data.push('"' + filepath + '"');
                grunt.log.ok(filepath);
            });

            grunt.file.write(file.dest, 'module.exports = [' + data + ' ];');
        });
    });

    grunt.registerTask('default', [ /*'toArray',*/ 'jshint', 'mochaTest', 'clean', 'requirejs', 'uglify' ]);
    grunt.registerTask('test', [ 'jshint', 'mochaTest' ]);
};
