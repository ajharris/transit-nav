#!/bin/bash

set -e

# Run backend tests
if [ -d "backend/tests" ]; then
    echo "Running backend tests with pytest..."
    (cd backend && PYTHONPATH=. pytest)
else
    echo "No backend tests found."
fi

# Run frontend tests
if [ -f "frontend/package.json" ]; then
    echo "Running frontend tests with npm..."
    (cd frontend && npm test)
else
    echo "No frontend test runner (package.json) found. Skipping frontend tests."
fi
