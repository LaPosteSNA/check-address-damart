#!/usr/bin/env bash
#
# pre-commit suite launched by git-precommit

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
"${bin}"/check-no-alert-box.sh
[[ $? -ne 0 ]] && $errors=1

# Check no style in html before commiting
"${bin}"/check-no-style-in-css.sh
[[ $? -ne 0 ]] && $errors=1

# Launch eslint tests before commiting
"${bin}"/eslint.sh 
[[ $? -ne 0 ]] && $errors=1

# Launch build before commiting
"${bin}"/build.sh 
[[ $? -ne 0 ]] && $errors=1

exit $errors