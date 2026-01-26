#!/bin/bash

# Script to update hajj_qurea application
# Place this file in your home directory

# Display header
echo "===== hajj_qurea Update Script ====="
echo "Starting update process..."
echo ""

# Stop all instances of hajj_qurea by name
echo "Stopping all hajj_qurea processes..."
pm2 delete hajj_qurea 2>/dev/null
echo "All hajj_qurea processes stopped."

# Navigate to project directory
echo ""
echo "Navigating to project directory..."
cd ~/hajj_qurea

# Pull latest changes from git
echo ""
echo "Pulling latest changes from repository..."
git pull


#install dependenc
echo "installing"
npm install


#build

echo "Buildng "
npm run build

# Start the application
echo ""
echo "Starting hajj_qurea application..."
pm2 start ecosystem.config.cjs

# Show current PM2 status
echo ""
echo "Current PM2 processes:"
pm2 list

echo ""
echo "===== Update complete! ====="
echo "To view logs, run: pm2 logs hajj_qurea"
