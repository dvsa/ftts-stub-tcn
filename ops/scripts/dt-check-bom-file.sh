#!/bin/bash

# Script can be used in Azure Cli task as it use 'az account' tool.
#
# The "bearer" is deliberatively in the header not "Bearer" due to unknown incompatibility issue between Azure EasyAuth and DependencyTrack (x-api-key looks to be stripped off).


dtrackAppId=$1
dtrackApiKey=$2

npm install -g @cyclonedx/bom 
cyclonedx-bom -o bom.xml
token=$(az account get-access-token --resource ${dtrackAppId}/.default  --query accessToken --output tsv)
cat > payload.json <<__HERE__
{
    "project": "$(cat dt-project-id.conf)",
    "bom": "$(cat bom.xml | base64 -w 0 -)"
}
__HERE__
      
curl -s -S -X "PUT" "https://dsukspfmdtrack001.azurewebsites.net/api/v1/bom" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: ${dtrackApiKey}" \
    -H "Authorization: bearer $token" \
    -d @payload.json