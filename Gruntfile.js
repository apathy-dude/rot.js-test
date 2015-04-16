module.exports = function(grunt) {
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            clean: {
                build: {
                    src: ['bin']
                }
            },
            jshint: {
                files: [ 'Gruntfile.js', 'src*/**/*.js', 'tests/**/*.js' ]
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
                compile1: {
                    options: {
                        baseUrl: 'src1/',
                        out: 'bin/<%= pkg.name %>.1.js',
                        mainConfigFile: 'src1/config.js',
                        include: ['game'],
                        insertRequire: ['game'],
                        findNestedDependencies: true,
                        preserveLicenseComments: false,
                        wrap: true
                    }
                },
                compile2: {
                    options: {
                        baseUrl: 'src2/',
                        out: 'bin/<%= pkg.name %>.2.js',
                        mainConfigFile: 'src2/config.js',
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
                dist: {
                    files: {
                        'bin/<%= pkg.name %>.1.min.js': ['bin/<%=pkg.name%>.1.js'],
                        'bin/<%= pkg.name %>.2.min.js': ['bin/<%=pkg.name%>.2.js'],
                    }
                }
            },
            watch: {
                build: {
                    files: [ 'src*/**/*.js' ],
                    tasks: [ 'test' ]
                }
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
