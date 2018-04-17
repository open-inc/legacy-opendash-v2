module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "globals": {
        "angular": true,
        "Highcharts": true,
    },
    "rules": {
        "indent": [
            "error",
            4,
        ],
        "eol-last": [
            "error",
            "always",
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 1,
                "maxEOF": 1,
            },
        ],
        "linebreak-style": [
            "error",
            "unix",
        ],
        "semi": [
            "error",
            "always",
        ],
        "quotes": [
            "error",
            "single",
        ],
        "no-var": [
            "error",
        ],
        "comma-dangle": [
            "error",
            "always-multiline",
        ],
        "keyword-spacing": [
            "error",
            {
                "before": true,
                "after": true,
            },
        ],
        "no-unused-vars": [
            "error",
            {
                "args": "none",
            },
        ],
    }
};
