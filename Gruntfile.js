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
                compile4: {
                    options: {
                        baseUrl: 'src4/',
                        out: 'bin/<%= pkg.name %>.4.js',
                        mainConfigFile: 'src4/config.js',
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
                },
                tiles3: {
                    options: {
                        getFiles: true
                    },
                    files: {
                        'src3/tile.js': ['src3/tile/**/*.js']
                    }
                },
                entity3: {
                    options: {
                        getFiles: true
                    },
                    files: {
                        'src3/entity.js': ['src3/entity/**/*.js']
                    }
                },
                states4: {
                    options: {
                        getFiles: true
                    },
                    files: {
                        'src4/states.js': ['src4/states/**/*.js']
                    }
                },
                tiles4: {
                    options: {
                        getFiles: true
                    },
                    files: {
                        'src4/tile.js': ['src4/tile/**/*.js']
                    }
                },
                entity4: {
                    options: {
                        getFiles: true
                    },
                    files: {
                        'src4/entity.js': ['src4/entity/**/*.js']
                    }
                }
            },
            uglify: {
                dist: {
                    files: {
                        'bin/<%= pkg.name %>.1.min.js': ['bin/<%=pkg.name%>.1.js'],
                        'bin/<%= pkg.name %>.2.min.js': ['bin/<%=pkg.name%>.2.js'],
                        'bin/<%= pkg.name %>.3.min.js': ['bin/<%=pkg.name%>.3.js'],
                        'bin/<%= pkg.name %>.4.min.js': ['bin/<%=pkg.name%>.4.js'],
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
                var state = filepath.split('/');
                state = state[state.length - 1].split('.')[0];

                data.push(state);

                grunt.log.ok(filepath);
            });

            var dataString = '';
            var itemList = [];
            if(states) {
                for(var d in data) {
                    var state = data[d];
                    itemList.push('"./states/' + state + '"');
                    dataString += 'game.state.add("' + state + '",' + state + ');';
                }

                grunt.file.write(file.dest, 'define([' + itemList + '], function(' + data + ') {' + dataString + '});');
            }
            else {
                var path = file.src[0].split('/')[1];
                for(var i in data) {
                    var item = data[i];
                    var upper = item.charAt(0).toUpperCase() + item.slice(1);
                    itemList.push('"./' + path + '/' + item + '"');
                    dataString += upper + ': ' + item + ', ';
                }
                grunt.file.write(file.dest, 'define([' + itemList + '], function(' + data + ') { return { ' + dataString + '}; });');
            }
        });
    });

    grunt.registerTask('default', [ 'toArray', 'jshint', 'mochaTest', 'clean', 'requirejs', 'uglify' ]);
    grunt.registerTask('test', [ 'toArray', 'jshint', 'mochaTest' ]);
};
