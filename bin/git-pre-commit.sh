#!/usr/bin/env bash
#
# A git pre-commit hook for node.js projects to 
#   * lint JavaScript files with [eslint](https://eslint.org/)
#
# Install 
# cp ./bin/git-pre-commit.sh .git/hooks/pre-commit

set -euo pipefail
IFS=$'\n\t'

# Exit if npm is not installed
which npm &> /dev/null
if [[ "$?" == 1 ]]; then
  echo 'npm must be installed.'
  exit 1
fi

readonly bin="$(realpath ${0%/*})"

errors=0

# Check no alert box before commiting
"${bin}"/../../bin/git-pre-commit-suite.sh
[[ $? -ne 0 ]] && $errors=1

exit $errors