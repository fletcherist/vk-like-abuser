module.exports = {
    extends: "standard",
    rules: {
        'no-return-await': 0,
        'no-return-assign': 0,
        'space-before-function-paren': ["error", {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
        }],
        'no-undef': 0
    }
}