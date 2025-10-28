function Invoke-GitCommitPush {
    [CmdletBinding()]
    param(
        [string]$Message,
        [string]$Remote = "origin",
        [string]$Branch
    )

    $ErrorActionPreference = "Stop"

    if (-not $Branch) {
        $Branch = (git rev-parse --abbrev-ref HEAD).Trim()
    }

    if (-not $Message) {
        do {
            $Message = Read-Host "Commit message"
        } while (-not $Message)
    }

    git add -A | Out-Null
    git diff --cached --quiet
    $hasStagedChanges = ($LASTEXITCODE -ne 0)

    if ($hasStagedChanges) {
        git commit --message $Message | Out-Null
    }
    else {
        Write-Host "No staged changes after adding. Skipping git commit."
    }

    $remoteUrl = ""
    try {
        $remoteUrl = (git remote get-url $Remote 2>$null).Trim()
    }
    catch {
        $remoteUrl = ""
    }

    if (-not $remoteUrl) {
        $newRemote = Read-Host "Remote '$Remote' not found. Enter remote URL to add (leave empty to skip push)"
        if ($newRemote) {
            git remote add $Remote $newRemote | Out-Null
            $remoteUrl = $newRemote
        }
        else {
            Write-Host "Skipping push because remote is not configured."
            return
        }
    }
    elseif ($remoteUrl -match "<.+>") {
        $newRemote = Read-Host "Current remote URL '$remoteUrl' looks like a placeholder. Enter replacement URL (leave empty to keep)"
        if ($newRemote) {
            git remote set-url $Remote $newRemote | Out-Null
            $remoteUrl = $newRemote
        }
    }

    git push $Remote $Branch | Out-Null
}

Set-Alias -Name gcp -Value Invoke-GitCommitPush
# Example usage:
# gcp -Message "Your commit message here"
