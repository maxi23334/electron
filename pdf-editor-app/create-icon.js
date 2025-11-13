// Simple script to create a placeholder icon
const fs = require('fs');
const path = require('path');

// Create a simple 1x1 PNG as placeholder
// This is a valid 1x1 transparent PNG in base64
const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

const iconPath = path.join(__dirname, 'assets', 'icon.png');

// Only create if it doesn't exist
if (!fs.existsSync(iconPath)) {
  const buffer = Buffer.from(base64PNG, 'base64');
  fs.writeFileSync(iconPath, buffer);
  console.log('✓ Created placeholder icon.png');
  console.log('Note: Replace assets/icon.png with your own 512x512 PNG icon for better results');
} else {
  console.log('✓ icon.png already exists');
}
