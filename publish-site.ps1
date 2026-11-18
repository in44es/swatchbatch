$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host "=== Publication de easy4cc.com sur GitHub ===" -ForegroundColor Cyan
Write-Host "Compte local configure : $(git config --local user.name) -> $(git remote get-url origin)" -ForegroundColor Gray
Write-Host ""

$status = git status -s
if (-not $status) {
    Write-Host "Aucune modification locale detectee. Verification d'un push en attente..." -ForegroundColor Yellow
    git push origin main
    exit $LASTEXITCODE
}

Write-Host "Fichiers modifies :" -ForegroundColor White
$status | ForEach-Object { Write-Host "  $_" }
Write-Host ""

# Mise a jour automatique de la date dans sitemap.xml
$sitemapPath = Join-Path $PSScriptRoot 'sitemap.xml'
if (Test-Path $sitemapPath) {
    $today = Get-Date -Format 'yyyy-MM-dd'
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    $sitemap = [System.IO.File]::ReadAllText($sitemapPath, $utf8NoBom)
    $updatedSitemap = [regex]::Replace($sitemap, '<lastmod>\d{4}-\d{2}-\d{2}</lastmod>', "<lastmod>$today</lastmod>")
    if ($updatedSitemap -ne $sitemap) {
        [System.IO.File]::WriteAllText($sitemapPath, $updatedSitemap, $utf8NoBom)
    }
}

$msg = Read-Host "Message de mise a jour (laissez vide pour 'Mise a jour du site')"
if ([string]::IsNullOrWhiteSpace($msg)) {
    $msg = "Mise a jour du site"
}

git add -A
git commit -m $msg
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors du commit." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Synchronisation avec GitHub..." -ForegroundColor Cyan
git pull --rebase origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de la synchronisation avec GitHub." -ForegroundColor Red
    exit 1
}

Write-Host "Envoi vers GitHub (si une fenetre s'ouvre, connectez-vous avec in44es)..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Succes ! Le site easy4cc.com va se mettre a jour d'ici 1 a 2 minutes." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Echec du push. Verifiez la connexion au compte in44es." -ForegroundColor Red
    exit 1
}
