function Get-RandomHex {
    param(
        [int] $Bits = 256
    )
    $bytes = new-object 'System.Byte[]' ($Bits/8)
    (new-object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
    (new-object System.Runtime.Remoting.Metadata.W3cXsd2001.SoapHexBinary @(,$bytes)).ToString()
}

function Write-Key {
    param (
        [string] $key,
        [string] $to_replace,
        [string] $file_path
    )
    # Reading the file content.
    $file_content = Get-Content -Path $file_path
    # Placing the key inside the appropriate place.
    $modified_content = $file_content -replace $to_replace, $key
    # Writing new content into the file
    $modified_content | Set-Content -Path $file_path
}

Write-Output "[CONFIG] - Starting project's configuration... "

$POSTGRES_KEY = Get-RandomHex
$REDIS_KEY = Get-RandomHex
$JWT_AUTH_KEY = Get-RandomHex
$JWT_REFRESH_KEY = Get-RandomHex

Write-Output "[CONFIG] - Copying files... "

Copy-Item .\\examples\\init_db.sql.example .\\init_db.sql 
Copy-Item .\\examples\\.env.example .\\.env

Write-Output "[CONFIG] - Installing keys ..."

# PostgreSQL key
Write-Key -key $POSTGRES_KEY -to_replace "postgres_key_to_replace" -file_path '.\.env'
Write-Key -key $POSTGRES_KEY -to_replace "postgres_key_to_replace" -file_path '.\init_db.sql'

# Redis key
Write-Key -key $REDIS_KEY -to_replace "redis_key_to_replace" -file_path '.\.env'

# JWT Keys
Write-Key -key $JWT_AUTH_KEY -to_replace "jwt_auth_key_to_replace" -file_path '.\.env'
Write-Key -key $JWT_REFRESH_KEY -to_replace "jwt_refresh_key_to_replace" -file_path '.\.env'

Write-Output "[CONFIG] - Configuration done !"

