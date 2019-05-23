module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "extends": "eslint:recommended",
    "parserOptions": {
        "project": "./tsconfig.json",
        "ecmaVersion": 2018
    },
    "rules": {
      "@typescript-eslint/restrict-plus-operands": "warn",
      "no-console": 'off',
    }
};