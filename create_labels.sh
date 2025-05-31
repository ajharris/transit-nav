#!/bin/bash

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI (gh) is not installed. Please install it first: https://cli.github.com/"
    exit 1
fi

# Format: name|color|description
declare -a labels=(
  "setup|0366d6|Initial project configuration and scaffolding"
  "backend|d73a4a|Server-side logic and API development"
  "frontend|a2eeef|Client-side interface and components"
  "geolocation|5319e7|User location services and inference"
  "api|0e8a16|Endpoints and request/response handling"
  "logic|cfd3d7|App-specific logic and algorithm design"
  "UX|fbca04|User experience and flow improvements"
  "data|006b75|Database schemas, seeds, and data modeling"
  "UI|bfdadc|Styling and layout components"
  "testing|e4e669|Test coverage and verification"
  "deployment|5319e7|Hosting, CI/CD, and deployment tasks"
)

for label in "${labels[@]}"
do
  IFS="|" read -r name color desc <<< "$label"
  echo "Creating label: $name"
  gh label create "$name" --color "$color" --description "$desc"
done

echo "✅ All labels created!"
