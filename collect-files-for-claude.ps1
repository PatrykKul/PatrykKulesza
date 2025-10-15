#!/usr/bin/env pwsh
# collect-files-for-claude.ps1
# Zbiera wszystkie pliki potrzebne dla Claude w jeden output

Write-Host "===========================================`n" -ForegroundColor Cyan
Write-Host "📦 ZBIERANIE PLIKÓW DLA CLAUDE`n" -ForegroundColor Yellow
Write-Host "===========================================`n" -ForegroundColor Cyan

$output = ""

# Funkcja do dodawania pliku
function Add-File {
    param(
        [string]$FilePath,
        [string]$Label
    )
    
    if (Test-Path $FilePath) {
        Write-Host "✅ $Label" -ForegroundColor Green
        $content = Get-Content $FilePath -Raw
        $output += "`n`n"
        $output += "=========================================="
        $output += "`nFILE: $Label"
        $output += "`n=========================================="
        $output += "`n$content"
        return $output
    }
    else {
        Write-Host "❌ NIE ZNALEZIONO: $Label" -ForegroundColor Red
        return $output
    }
}

# 1. Prompt (najważniejszy!)
$output = Add-File "CLAUDE_PROMPT_GLOBAL_SEARCH.md" "CLAUDE_PROMPT_GLOBAL_SEARCH.md"

Write-Host "`n--- PLIKI GOTOWE (nie modyfikuj) ---`n" -ForegroundColor Yellow

# 2. Search Registry
$output = Add-File "src/data/searchRegistry.ts" "src/data/searchRegistry.ts"

# 3. Search Context
$output = Add-File "src/contexts/SearchContext.tsx" "src/contexts/SearchContext.tsx"

Write-Host "`n--- PLIKI DO MODYFIKACJI ---`n" -ForegroundColor Yellow

# 4. GlobalSearch (placeholder)
$output = Add-File "src/components/GlobalSearch.tsx" "src/components/GlobalSearch.tsx"

# 5. Header (refaktoryzacja)
$output = Add-File "src/sections/header.tsx" "src/sections/header.tsx"

# 6. Chatbot (integracja)
$output = Add-File "src/components/chatbot/Chatbot.tsx" "src/components/chatbot/Chatbot.tsx"

# 7. Layout (providers)
$output = Add-File "src/app/layout.tsx" "src/app/layout.tsx"

# Zapisz do pliku
$outputFile = "CLAUDE_INPUT.txt"
$output | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "`n===========================================`n" -ForegroundColor Cyan
Write-Host "✅ GOTOWE! Plik zapisany: $outputFile`n" -ForegroundColor Green
Write-Host "📋 Skopiuj zawartość CLAUDE_INPUT.txt i wyślij do Claude`n" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "" 
Write-Host "Teraz po prostu wklej (Ctrl+V) w konwersacji z Claude." -ForegroundColor Cyan
Write-Host ""
