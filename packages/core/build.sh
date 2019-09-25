#!/usr/bin/env bash

set -e

rollup -c
tsc
cp *.md dist/
cp package.json dist/
cp -a src/styles/. dist/styles
node-sass dist/styles/styles.scss > dist/styles.css
