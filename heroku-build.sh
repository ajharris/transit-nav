#!/bin/sh
# Build React frontend before Python build
cd frontend
npm install
npm run build
cd ..
