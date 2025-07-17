const { createCanvas } = require('canvas');
const fs = require('fs');

function drawIcon(canvas, size) {
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#667eea';
  ctx.fillRect(0, 0, size, size);
  
  // Rounded corners (approximate)
  const cornerRadius = size * 0.125;
  
  // Card background
  ctx.fillStyle = 'white';
  const cardMargin = size * 0.167;
  const cardWidth = size * 0.667;
  const cardHeight = size * 0.5;
  const cardX = cardMargin;
  const cardY = cardMargin * 1.5;
  
  // Draw rounded rectangle for card
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, size * 0.042);
  ctx.fill();
  
  // Text lines
  ctx.fillStyle = '#667eea';
  const textY = cardY + cardMargin * 0.5;
  const textHeight = size * 0.083;
  const textWidth = cardWidth * 0.75;
  ctx.fillRect(cardX + cardMargin * 0.5, textY, textWidth, textHeight);
  
  // Smaller text lines
  ctx.fillStyle = '#a8a8a8';
  const smallTextHeight = size * 0.042;
  ctx.fillRect(cardX + cardMargin * 0.5, textY + textHeight * 1.5, textWidth * 0.83, smallTextHeight);
  ctx.fillRect(cardX + cardMargin * 0.5, textY + textHeight * 2.5, textWidth * 0.67, smallTextHeight);
  
  // Green dot (flip indicator)
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.arc(cardX + cardWidth - cardMargin * 0.5, textY + textHeight * 0.5, size * 0.042, 0, 2 * Math.PI);
  ctx.fill();
}

// Generate 192x192 icon
const canvas192 = createCanvas(192, 192);
drawIcon(canvas192, 192);
const buffer192 = canvas192.toBuffer('image/png');
fs.writeFileSync('public/pwa-192x192.png', buffer192);

// Generate 512x512 icon
const canvas512 = createCanvas(512, 512);
drawIcon(canvas512, 512);
const buffer512 = canvas512.toBuffer('image/png');
fs.writeFileSync('public/pwa-512x512.png', buffer512);

console.log('PWA icons generated successfully!');
