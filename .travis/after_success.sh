#!/bin/bash
set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not releasing"
  exit 0
fi

if [[ $TRAVIS_BRANCH == 'master' ]]; then
  npm run semantic-release

  mkdir pages
  echo "charts.carbondesignsystem.com" > pages/CNAME

  # bundle core demo
  cd packages/core
  npm run demo:build
  cp -a demo/bundle/. ../../pages

  cd ../angular/demo
  npm run build-storybook
  cp -a storybook-dist/. ../../../pages/angular
fi
