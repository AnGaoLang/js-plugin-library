module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    parser: 'eslint-plugin-typescript',
    plugins: [
        'typescript'
    ],
    "extends": "eslint:recommended",
    // "globals": {
    //     "Atomics": "readonly",
    //     "SharedArrayBuffer": "readonly"
    // },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
    }
};