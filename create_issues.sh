#!/bin/bash

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI (gh) is not installed. Please install it first: https://cli.github.com/"
    exit 1
fi

# Declare issues in the format: "Title|Body|Labels"
declare -a issues=(
  "🚉 Set up project structure|Initialize React frontend with routing\nSet up Flask backend with REST API\nConnect frontend and backend locally\nDeploy both to Heroku or preferred host|setup,backend,frontend"
  "📍 User location and system inference|Use browser geolocation to infer user's area\nMatch location to known systems\nFallback to manual selection|frontend,geolocation"
  "🗺️ Transit system selection|Create endpoint to fetch supported systems\nAdd UI for selecting transit system|frontend,api"
  "🚏 Stop selection interface|UI for origin and destination stops\nAPI endpoint for stops list|frontend,api"
  "🚪 Car positioning logic|Design data structure for car placement\nReturn best car and explanation via API|backend,logic"
  "🧠 Local storage + recent trips|Store recent trips in localStorage\nDisplay recent trip list on homepage|frontend,UX"
  "📁 Set up schema for system/stop/position data|Design models or JSON format\nSeed with example data (e.g., GO Lakeshore East)|backend,data"
  "🔌 API routes|/api/transit_systems\n/api/stops?system=X\n/api/best_car?origin=Y&destination=Z|api,backend"
  "📱 Basic UI components|System selector\nStop pickers\nResults display|frontend,UI"
  "📲 Mobile-first styling|Responsive layout\nMinimal styling with CSS or lightweight framework|frontend,UI"
  "✅ Basic test coverage|Unit tests for backend logic\nFrontend integration tests|testing"
  "🚀 Deployment|Deploy frontend and backend\n(Optionally) set up CI/CD|deployment"
)

# Create issues
for issue in "${issues[@]}"
do
  IFS="|" read -r title body labels <<< "$issue"
  echo "Creating issue: $title"
  gh issue create --title "$title" --body "$body" --label "$labels"
done

echo "✅ All labeled issues created!"
