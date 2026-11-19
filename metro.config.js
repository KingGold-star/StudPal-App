const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude non-app directories (like agent plugins, scratch, preview, git)
// from Metro crawling and watching to prevent watch-mode timeouts on Windows
config.resolver.blockList = [
  /.*[/\\]\.agents[/\\].*/,
  /.*[/\\]\.stitch[/\\].*/,
  /.*[/\\]preview[/\\].*/,
  /.*[/\\]scratch[/\\].*/,
  /.*[/\\]\.git[/\\].*/,
];

module.exports = config;
