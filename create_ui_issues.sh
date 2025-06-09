#!/bin/bash

# Define array of issue titles and bodies
issues=(
  # UI/UX Improvements
  "Title:Add welcome message for new users
Body:Display a clear, friendly welcome message on the landing page that explains what the app does in one sentence. Add a 'Start Here' button for first-time users."

  "Title:Add tooltips and inline help
Body:Every button, field, or input should have a small info icon or tooltip explaining what it does. Use plain English — no jargon."

  "Title:Highlight the next action
Body:Make it visually obvious what the user should do next at all times. Use a highlighted button or modal that says something like 'Next Step: Enter your station name.'"

  "Title:Input validation and error feedback
Body:Ensure every user input has clear validation and immediate, non-technical feedback. E.g., if a station name is invalid, say 'Sorry, we couldn't find that station.'"

  "Title:Add loading indicators and progress feedback
Body:When an action is processing (like finding the best exit), show a loading spinner or 'Finding best exit...' message so users know it’s working."

  "Title:Make the UI mobile-first and touch-friendly
Body:All buttons should be large enough for touch, inputs should be easy to use on small screens, and layout should adapt to phone displays."

  "Title:Add one-click 'Test it for me' demo
Body:Include a simple demo button that runs through a sample scenario so users can see how it works without entering any data."

  "Title:Create a persistent help icon
Body:Add a floating help button (bottom right corner) that opens a guide or FAQ in a sidebar or modal."

  "Title:Improve accessibility and contrast
Body:Ensure the UI works for users with vision impairments — test contrast ratios, keyboard navigation, and screen reader compatibility."

  "Title:Reduce text — use icons and visuals
Body:Where possible, replace blocks of instructional text with icons, visual cues, or short labels. Show rather than tell."

  "Title:Add 'Why it works this way' explanations
Body:Include links or toggles for curious users to learn the logic behind the recommendations, but hide them by default."

  # Transit Map Infrastructure
  "Title:Add mechanism to store transit system maps by line and device
Body:Design a system to save a different map for each transit system, line, and device type (e.g., mobile vs desktop). Each combination should have its own version for optimal display."

  "Title:Create admin tool to upload graphic maps for transit systems
Body:Create a backend route and basic frontend interface for uploading SVG or image maps for each transit system and line. Allow uploads to specify line name, system name, and screen format."

  "Title:Implement automatic loading of correct map based on user context
Body:On app load, detect the user's transit system, line, and device type, then fetch and display the appropriate map. Fall back to a default if none is found."

  "Title:Persist maps in CDN or database for efficient delivery
Body:Store uploaded map assets in a CDN (preferred) or database. Ensure they are cached and served quickly, especially for mobile devices."

  "Title:Fallback system for missing or outdated maps
Body:If a graphic map is missing or out-of-date, show a graceful fallback (e.g., generic map or text) with an error log or admin alert."

  "Title:Add visual transit map overlay
Body:Embed a transit map or route visualization that shows users their chosen station and surrounding area. Make it zoomable and mobile friendly."

  "Title:Auto-detect location and system
Body:Use browser geolocation and a simple 'Guess my transit system' button that automatically fills in the user's region and nearest station."

  # Advanced Mapping Features
  "Title:Add map annotation tools in admin panel
Body:Create tools for admins to draw directly on uploaded maps (e.g., circles, arrows, exit icons) and save annotations to a structured format."

  "Title:Implement version control for uploaded maps
Body:Keep history of uploaded maps. Allow admins to revert to previous versions. Store metadata like upload date, who uploaded, and change notes."

  "Title:Support interactive SVG map overlays
Body:Use SVG maps with clickable elements (stations, exits). Add JS support to highlight or zoom into map regions based on logic or user input."

  "Title:Handle responsive layout variants for maps
Body:Detect screen width and serve vertically optimized maps for phones and horizontally optimized maps for tablets/desktops."

  # Bonus (Optional)
  "Title:Organize issues into GitHub Projects or milestones
Body:Group issues into MVP, Admin Tools, Mapping System, and UX Polish milestones. Helps track development focus and progress visually."
)

# Loop through and create each issue
for issue in "${issues[@]}"; do
  IFS=$'\n' read -r title body <<<"$issue"
  gh issue create --title "$title" --body "$body"
done
