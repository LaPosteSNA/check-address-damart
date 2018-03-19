module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "jquery": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "phantom": false,
        "casper": true,
        "require": true,
        "patchRequire": true,
        "CasperError": true,
        "slimer": false,
        "jquery": false,
        "QUnit": false,
        "__utils__": true
    }
};