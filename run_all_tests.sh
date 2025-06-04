#!/bin/bash

set -e

# Run backend tests
if [ -d "backend/tests" ]; then
    echo "Running backend tests with pytest (verbose)..."
    (cd backend && PYTHONPATH=. pytest -v --tb=short --maxfail=1)
else
    echo "No backend tests found."
fi

# Check backend coverage
if [ -d "backend/tests" ]; then
    echo "Checking backend test coverage..."
    (cd backend && PYTHONPATH=. pytest --cov=. --cov-report=term-missing)
fi

# Check all backend features have tests
missing_backend_tests=0
for file in backend/*.py; do
    base=$(basename "$file" .py)
    if ! ls backend/tests/test_${base}*.py 1> /dev/null 2>&1; then
        echo "WARNING: No test found for backend feature: $base"
        missing_backend_tests=1
    fi
done
if [ $missing_backend_tests -ne 0 ]; then
    echo "ERROR: Some backend features are missing tests."
    exit 1
fi

# Run frontend tests
if [ -f "frontend/package.json" ]; then
    echo "Running frontend tests with npm (verbose)..."
    (cd frontend && npm test -- --verbose)
else
    echo "No frontend test runner (package.json) found. Skipping frontend tests."
fi

# Check all frontend features have tests
missing_frontend_tests=0
for file in frontend/src/*.js frontend/src/*.jsx; do
    base=$(basename "$file")
    testfile="frontend/src/__tests__/$(echo $base | sed 's/\.[jt]sx\?$/\.test.js/')"
    if [ ! -f "$testfile" ]; then
        echo "WARNING: No test found for frontend feature: $base"
        missing_frontend_tests=1
    fi
done
if [ $missing_frontend_tests -ne 0 ]; then
    echo "ERROR: Some frontend features are missing tests."
    exit 1
fi
