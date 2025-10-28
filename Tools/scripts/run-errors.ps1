Set-Location "C:\Dev\llp1"

$errorsDir = "Errors"
if (!(Test-Path $errorsDir)) { New-Item -ItemType Directory -Path $errorsDir }
Remove-Item "$errorsDir\*.txt" -ErrorAction SilentlyContinue

# Run app and capture output/errors
npm run dev 2>&1 | Tee-Object "$errorsDir\Run-Errors.txt"
Write-Host "Run errors output written to $errorsDir\Run-Errors.txt"

git add $errorsDir
git commit -m "Add run error log [auto]"
git push

Write-Host "Errors folder committed and pushed!"
