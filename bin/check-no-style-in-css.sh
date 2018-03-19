#!/bin/sh

# Don't allow alert() statements to be committed.
#
readonly bin="$(realpath ${0%/*})"


# Check no style in html before commiting

echo "## Checking css style in html" 
count=`grep -iRe 'style=' -iRe 'style =' -iRe 'Style=' -iRe 'Style =' ${bin}/../src/js/jquery.serca-form.js | wc -l | awk '{print $1}'`
if [[ "$count" -ge 1 ]]; then 
  echo "    \033[41mCheck FAILED:\033[0m Please remove all style in html (jquery.serca-form.js), use only css"
  exit 3
fi

count=`grep -iRe 'style=' -iRe 'style =' -iRe 'Style=' -iRe 'Style =' ${bin}/../index.html | wc -l | awk '{print $1}'`
if [[ "$count" -ge 1 ]]; then 
  echo "    \033[41mCheck FAILED:\033[0m Please remove all style in html (index.html), use only css"
  exit 3
fi