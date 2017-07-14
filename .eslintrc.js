module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
        "comma-dangle": 0,
        "arrow-parens": 0,
        "no-param-reassign": 0,
        "no-mixed-operators": "off",
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
        "indent": ["error", 2],
        "no-plusplus": [2, { allowForLoopAfterthoughts: true }],
        "import/no-unresolved": 0,
        "import/no-extraneous-dependencies": 0,
        "import/extensions": 0,
    },
    "globals": {
        "window": true,
        "document": true,
        "requestAnimationFrame": true,
        "navigator": true,
        "WebSocket": true,
        "CHESS_SOCKET_API_URL": true,
        "XMLHttpRequest": true,
    },
};
