@ECHO OFF
REM Call pre-commit hook
"C:\Program Files\Git\git-cmd.exe" --no-cd --command=usr/bin/bash.exe -l -i .git/hooks/git-pre-commit.sh
EXIT /B %ERRORLEVEL%
