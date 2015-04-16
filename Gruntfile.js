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
                compile3: {
                    options: {
                        baseUrl: 'src3/',
                        out: 'bin/<%= pkg.name %>.3.js',
                        mainConfigFile: 'src3/config.js',
                        include: ['game'],
                        insertRequire: ['game'],
                        findNestedDependencies: true,
                        preserveLicenseComments: false,
                        wrap: true
                    }
                },
            },
            toArray: {
                states3: {
                    options: {
                        getFiles: true
                    },
                    files: {
                        'src3/states.js': ['src3/states/**/*.js']
                    }
                }
            },
            uglify: {
                dist: {
                    files: {
                        'bin/<%= pkg.name %>.1.min.js': ['bin/<%=pkg.name%>.1.js'],
                        'bin/<%= pkg.name %>.2.min.js': ['bin/<%=pkg.name%>.2.js'],
                        'bin/<%= pkg.name %>.3.min.js': ['bin/<%=pkg.name%>.3.js'],
                    }
                }
            },
            watch: {
                test: {
                    files: [ 'src*/**/*.js' ],
                    tasks: [ 'test' ]
                }
            }
    });
    
    require('load-grunt-tasks')(grunt);

    grunt.registerMultiTask('toArray', 'Put Files into proper format', function() {
        var data = [];

        var options = this.options();
        var states = this.target.slice(0, 6) === 'states';

        this.files.forEach(function(file) {
            file.src.filter(function(filepath) {
                if(options.getFiles && options.getFolders)
                    return true;

                var isFile = grunt.file.isFile(filepath);

                return (options.getFiles && isFile) || (options.getFolders && !isFile);
            }).map(function(filepath) {
                if(states) {
                    var state = filepath.split('/');
                    state = state[state.length - 1].split('.')[0];

                    data.push(state);
                }
                else {
                    data.push('"' + filepath + '"');
                }

                grunt.log.ok(filepath);
            });

            if(states) {
                var dataString = '';
                var stateList = [];
                for(var d in data) {
                    var state = data[d];
                    stateList.push('"./states/' + state + '"');
                    dataString += 'game.state.add("' + state + '",' + state + ');';
                }

                grunt.file.write(file.dest, 'define([' + stateList + '], function(' + data + ') {' + dataString + '});');
            }
            else {
                grunt.file.write(file.dest, 'define(function() { return [' + data + ' ]; });');
            }
        });
    });

    grunt.registerTask('default', [ 'toArray', 'jshint', 'mochaTest', 'clean', 'requirejs', 'uglify' ]);
    grunt.registerTask('test', [ 'toArray', 'jshint', 'mochaTest' ]);
};
