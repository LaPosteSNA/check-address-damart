module.exports = function(grunt) {

    grunt.initConfig({

        // Import package manifest
        pkg: grunt.file.readJSON("package.json"),

        // Banner definitions
        meta: {
            banner: "/*\n" +
                " *  Services adresses <%= pkg.author %>\n" +
                " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %> (<%= pkg.homepage %>)\n" +
                " *  <%= pkg.description %>\n" +
                " *  Copyright 2017-<%= (new Date()).getFullYear() %> <%= pkg.author %>\n" +
                " *  Licensed under <%= pkg.license %> (https://github.com/LaposteSNA/<%= pkg.name %>/blob/master/LICENSE)\n" +
                " */\n"
        },

        // Lint definitions
        jshint: {
            files: ["src/js/jquery.serca-form.js", "tests/**/*", "tests/*"],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        eslint: {
            files: ["src/js/jquery.serca-form.js", "tests/**/*", "tests/*"],
            options: {
                configFile: '.eslintrc.js'
            }
        },

        // Minify JS
        uglify: {
            latest: {
                src: ["src/js/jquery.serca-form.js"],
                dest: "dist/js/jquery.serca-form.min.js",
            },
            version: {
                src: ["src/js/jquery.serca-form.js"],
                dest: "dist/js/jquery.serca-form.<%= pkg.version %>.min.js",
            },
            options: {
                banner: "<%= meta.banner %>",
                sourceMap: true
            }
        },

        // Minify css
        cssmin: {
            options: {
                banner: "<%= meta.banner %>"
            },
            latest: {
                src: 'src/css/jquery.serca-form.css',
                dest: 'dist/css/jquery.serca-form.min.css'
            },
            version: {
                src: 'src/css/jquery.serca-form.css',
                dest: 'dist/css/jquery.serca-form.<%= pkg.version %>.min.css'
            },
            latest_colissimo: {
                src: 'src/css/colissimo.css',
                dest: 'dist/css/colissimo.min.css'
            },
            version_colissimo: {
                src: 'src/css/colissimo.css',
                dest: 'dist/css/colissimo.<%= pkg.version %>.min.css'
            }
        },

        // Minify css
        casperjs: {
            options: {
                casperjsOptions: []
            },
            files: ['test/functionnal_tests.js']
        },


        // //coverall
        // coveralls: {
        //     options: {
        //         debug: true,
        //         coverageDir: 'coverage',
        //         dryRun: true,
        //         force: true,
        //         recursive: true
        //     }
        // },

        // karma test runner
        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true,
                browsers: ["PhantomJS"]
            },

            //continuous integration mode: run tests once in PhantomJS browser.
            travis: {
                configFile: "karma.conf.js",
                singleRun: true,
                browsers: ["PhantomJS"]
            }
        },

        // watch for changes to source
        // Better than calling grunt a million times
        // (call 'grunt watch')
        watch: {
            files: ["src/*/*", "test/*", "test/*/*"],
            tasks: ["default"]
        }

    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-css");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-casperjs");
    // grunt.loadNpmTasks('grunt-karma-coveralls');

    grunt.registerTask("travis", ["eslint", "karma:travis"]);
    grunt.registerTask("lint", ["jshint", "eslint"]);
    grunt.registerTask("test", ["karma:unit"]);
    grunt.registerTask("build", ["uglify", "cssmin"]);
    grunt.registerTask("default", ["lint", "build", "karma:unit"]);
};