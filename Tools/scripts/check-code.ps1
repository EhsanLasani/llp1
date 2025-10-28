# Always operate from the project root
Set-Location "C:\Dev\llp1"

$errorsDir = "Errors"
if (!(Test-Path $errorsDir)) { New-Item -ItemType Directory -Path $errorsDir }
Remove-Item "$errorsDir\*.txt" -ErrorAction SilentlyContinue

# Record git status and diff
git status > "$errorsDir\Check-Code.txt"
git diff >> "$errorsDir\Check-Code.txt"

# Run ESLint and TypeScript type-check if installed
npx eslint . 2>&1 | Tee-Object "$errorsDir\Lint-Errors.txt"
npx tsc --noEmit 2>&1 | Tee-Object "$errorsDir\Type-Errors.txt"

# Run tests (if set up)
npm test 2>&1 | Tee-Object "$errorsDir\Test-Results.txt"

Write-Host "Lint, type, and test results saved in $errorsDir!"

# Add, commit, and push error logs
git add $errorsDir
git commit -m "Add code, lint, type, and test check logs [auto]"
git push

Write-Host "All logs committed and pushed for your assistant!"
