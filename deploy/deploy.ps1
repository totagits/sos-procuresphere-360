# SOS ProcureSphere 360 - Windows PowerShell Deployment Script
# Deploys the portal to Google Cloud Run using local gcloud authentication context.

$ErrorActionPreference = "Stop"

$PROJECT_ID = "sba-msme-portal-lr"
$SERVICE_NAME = "sos-procuresphere-360"
$REGION = "europe-west1"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  SOS ProcureSphere 360 - Windows Deployment Pipeline" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Target GCP Project: $PROJECT_ID"
Write-Host "Target Service:     $SERVICE_NAME"
Write-Host "Target Region:      $REGION"
Write-Host "---------------------------------------------------------"

# Check auth
Write-Host "Step 1: Setting active Google Cloud Project..."
gcloud config set project $PROJECT_ID

Write-Host "Step 2: Starting Google Cloud Run deployment..."
gcloud run deploy $SERVICE_NAME `
    --source . `
    --region $REGION `
    --allow-unauthenticated `
    --project $PROJECT_ID

Write-Host "---------------------------------------------------------" -ForegroundColor Green
Write-Host "SUCCESS: SOS ProcureSphere 360 deployed to Cloud Run!" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
