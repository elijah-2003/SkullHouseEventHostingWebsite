const path = require('path');

module.exports = {
    entry: './src/index.js', // Entry point of your application
    output: {
        filename: 'bundle.js', // Output bundle filename
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    resolve: {
        fallback: {
            "http": require.resolve("stream-http"), // Add the http fallback
        },
    },
    // ... other configuration options ...
};