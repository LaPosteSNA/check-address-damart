module.exports = function(config) {

    config.set({
        reporters: ['spec', 'coverage'],
        specReporter: {
            maxLogLines: 5, // limit number of lines logged per test
            suppressErrorSummary: true, // do not print error summary
            suppressFailed: false, // do not print information about failed tests
            suppressPassed: false, // do not print information about passed tests
            suppressSkipped: true, // do not print information about skipped tests
            showSpecTiming: false // print the time elapsed for each spec
        },
        files: [
            "vendor/js/jquery-3.2.1.min.js",
            "vendor/js/jquery-ui.min.js",
            "src/js/jquery.serca-form.js",
            "node_modules/qunit-assert-compare/qunit-assert-compare.js",
            "test/setup.js",
            "test/spec/*"
        ],
        coverageReporter: {
            // specify a common output directory
            dir: 'coverage/reports/coverages',
            reporters: [
                // reporters not supporting the `file` property
                {
                    type: 'html',
                    subdir: 'report-html'
                },
                {
                    type: 'lcov',
                    subdir: 'report-lcov'
                },
                // reporters supporting the `file` property, use `subdir` to directly
                // output them in the `dir` directory
                {
                    type: 'lcovonly',
                    subdir: '.',
                    file: 'report-lcovonly.txt'
                },
                {
                    type: 'text',
                    subdir: '.',
                    file: 'text.txt'
                }
            ]
        },
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/**/*.js': ['coverage']
        },
        frameworks: ["qunit"],
        autoWatch: true
    });
};