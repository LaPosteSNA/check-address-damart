#!/bin/sh

# Don't allow alert() statements to be committed.
#

readonly bin="$(realpath ${0%/*})"

count=`grep -iRe 'alert(' -iRe 'alert (' -iRe 'Alert(' -iRe 'Alert (' ${bin}/../src/js/jquery.serca-form.js | wc -l | awk '{print $1}'`
if [[ "$count" -ge 1 ]]; then 
  echo "    \033[41mCheck FAILED:\033[0m Please remove all alert() statements in javascript sources"
  exit 1
fi

count=`grep -iRe 'alert(' -iRe 'alert (' -iRe 'Alert(' -iRe 'Alert (' ${bin}/../index.html | wc -l | awk '{print $1}'`
if [[ "$count" -ge 1 ]]; then 
  echo "    \033[41mCheck FAILED:\033[0m Please remove all alert() statements in javascript sources"
  exit 1
fi