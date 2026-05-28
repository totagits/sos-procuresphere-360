#!/usr/bin/env bash
# SOS ProcureSphere 360 - Google Cloud Run Deployment Script
# This script deploys the portal directly using Google Cloud Build & serverless Cloud Run.

set -euo pipefail

# Configuration Settings
PROJECT_ID="sba-msme-portal-lr"
SERVICE_NAME="sos-procuresphere-360"
REGION="europe-west1"

echo "========================================================="
echo "  SOS ProcureSphere 360 - Deployment Automation Pipeline"
echo "========================================================="
echo "Target GCP Project: ${PROJECT_ID}"
echo "Target Service:     ${SERVICE_NAME}"
echo "Target Region:      ${REGION}"
echo "---------------------------------------------------------"

# Check if gcloud CLI is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    echo "ERROR: No active gcloud session detected."
    echo "Please run: gcloud auth login"
    exit 1
fi

echo "Step 1: Setting active Google Cloud Project..."
gcloud config set project "${PROJECT_ID}"

echo "Step 2: Deploying to Google Cloud Run (Serverless Cloud Build)..."
gcloud run deploy "${SERVICE_NAME}" \
    --source . \
    --region "${REGION}" \
    --allow-unauthenticated \
    --project "${PROJECT_ID}"

echo "---------------------------------------------------------"
echo "SUCCESS: SOS ProcureSphere 360 has been deployed!"
echo "========================================================="
