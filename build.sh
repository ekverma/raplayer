#!/usr/bin/env bash

set -e

VERSION=$(node -p -e "require('./package.json').version")
CURRENT_BRANCH="$(git symbolic-ref --short -q HEAD)"

success() {
  echo  "\033[32;1m$1"
}

error() {
  echo "\033[31;1m$1"
}

if [ -z "$VERSION" ]; then
  error "Unable to get current npm version of this package"
  exit 1
fi


git tag -a $VERSION -m "release $VERSION"
git push --set-upstream origin $CURRENT_BRANCH
git push --tags

success "pushed $VERSION tag to GitHub"