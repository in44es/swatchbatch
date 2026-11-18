$ErrorActionPreference = 'Stop'

$htmlPath = Join-Path $PSScriptRoot 'easelease.html'
if (-not (Test-Path $htmlPath)) {
    Write-Host "Erreur : fichier easelease.html introuvable dans $PSScriptRoot" -ForegroundColor Red
    exit 1
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$content = [System.IO.File]::ReadAllText($htmlPath, $utf8NoBom)

$currentMatch = [regex]::Match($content, 'https://itch\.io/embed-upload/(\d+)')
if ($currentMatch.Success) {
    Write-Host "ID d'embed actuel dans easelease.html : $($currentMatch.Groups[1].Value)" -ForegroundColor Cyan
} else {
    Write-Host "Aucun embed itch.io trouve dans easelease.html." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Collez le code <iframe> complet d'itch.io, l'URL, ou juste le nouvel ID :" -ForegroundColor White
$userInput = Read-Host "Nouvel iframe / ID"

if ([string]::IsNullOrWhiteSpace($userInput)) {
    Write-Host "Annule : aucune entree fournie." -ForegroundColor Yellow
    exit 0
}

$newId = $null
if ($userInput -match 'embed-upload/(\d+)') {
    $newId = $Matches[1]
} elseif ($userInput.Trim() -match '^(\d+)$') {
    $newId = $Matches[1]
}

if (-not $newId) {
    Write-Host "Erreur : impossible de trouver un ID d'embed itch.io valide dans votre saisie." -ForegroundColor Red
    exit 1
}

$updated = [regex]::Replace(
    $content,
    'https://itch\.io/embed-upload/\d+',
    "https://itch.io/embed-upload/$newId"
)

if ($updated -eq $content) {
    Write-Host "Aucun changement : easelease.html utilise deja l'ID $newId." -ForegroundColor Yellow
    exit 0
}

[System.IO.File]::WriteAllText($htmlPath, $updated, $utf8NoBom)
Write-Host ""
Write-Host "Succes ! easelease.html a ete mis a jour avec l'ID $newId." -ForegroundColor Green
Write-Host "Vous pouvez maintenant pousser la modification sur GitHub." -ForegroundColor Gray
