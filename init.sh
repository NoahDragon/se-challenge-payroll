#!/bin/bash

echo "******* NPM install under app *******"
( cd ./app && npm install )

echo "******* Copy webpack config for react-scripts *******"
( cp ./asserts/webpack.config.dev.js ./app/node_modules/react-scripts/config/webpack.config.dev.js )
( cp ./asserts/webpack.config.prod.js ./app/node_modules/react-scripts/config/webpack.config.prod.js )

echo "******* NPM install under api *******"
( cd ./api && npm install )