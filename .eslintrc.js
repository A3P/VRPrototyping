module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
        "eol-last": 0,
        "comma-dangle": 0,
        "arrow-parens": 0,
        "no-param-reassign": 0,
        "no-mixed-operators": "off"
    },
    "globals": {
        "window": true,
        "document": true,
        "requestAnimationFrame": true,
        "navigator": true,
        "WebSocket": true,
    },
};
