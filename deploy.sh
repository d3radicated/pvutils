#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd dist

git init
git config user.email john.ryan.camatog@gmail.com
git add -A
git commit -m 'Deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f jrcGithub:d3radicated/pvutils.git master:gh-pages

cd -
