#!/usr/bin/env bash

set -e

rollup -c
tsc
cp *.md dist/
cp package.json dist/
cp -a src/styles/. dist/styles
node-sass --include-path ../../node_modules dist/styles/styles.scss > dist/styles.css
node-sass --include-path ../../node_modules src/styles/styles-g10.scss > dist/styles-g10.css
node-sass --include-path ../../node_modules src/styles/styles-g10.scss > dist/styles-g10.min.css --output-style compressed
node-sass --include-path ../../node_modules src/styles/styles-g90.scss > dist/styles-g90.css
node-sass --include-path ../../node_modules src/styles/styles-g90.scss > dist/styles-g90.min.css --output-style compressed
node-sass --include-path ../../node_modules src/styles/styles-g100.scss > dist/styles-g100.css
node-sass --include-path ../../node_modules src/styles/styles-g100.scss > dist/styles-g100.min.css --output-style compressed
