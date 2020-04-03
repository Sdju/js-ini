module.exports = {
    env: {
        "browser": true,
        "es6": true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "project": "tsconfig.eslint.json",
        "sourceType": "module",
    },
    extends: ['airbnb-typescript/base'],
    rules: {
        'no-iterator': 0,
        'no-restricted-syntax': 0,
        'no-continue': 0,
    },
};
