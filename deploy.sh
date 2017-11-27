#!/bin/bash

rm -r build
rm -r docs

yarn run build
mv build docs

echo "qap.kndrck.co" >> ./docs/CNAME

git add .
git commit -m "deploy"
git push origin master