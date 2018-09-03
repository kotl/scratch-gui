var http = require('http');
var https = require('https');
var fs = require('fs');
var md5 = require('md5');

function loadAssets(filename) {
  let rawdata = fs.readFileSync('../src/lib/libraries/' + filename);  
  return JSON.parse(rawdata);   
}

var assets = [];
var backdrops = loadAssets('backdrops.json');
var costumes = loadAssets('costumes.json');
var sounds = loadAssets('sounds.json');
var sprites = loadAssets('sprites.json');
assets.push(...backdrops, ...costumes, ...sounds, ...sprites);

let assetIndex = 0;
let downloads = 0;
let skips = 0;

function withoutExtension(filename) {
  return filename.split('.').slice(0, -1).join('.');
}

function downloadAsset(asset, callback) {
  let assetFilename = asset.md5;
  let url = "https://cdn.assets.scratch.mit.edu/internalapi/asset/" + assetFilename + "/get/";
  let fileExists = fs.existsSync(assetFilename);
  if (fileExists) {
    const md5value = withoutExtension(assetFilename);
    const md5sum = md5(fs.readFileSync(assetFilename));
    if (md5sum != md5value) {
      fs.unlinkSync(assetFilename);
      fileExists = false;
    }
  }
  if (!fileExists) {
    downloads++;
    console.log("Downloading " + asset.name + " (" + asset.md5+ ")");
    let file = fs.createWriteStream(assetFilename);
    let request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', () => {
        callback(callback);        
      });
    });
  } else {
    skips++;
    // console.log("Skipping " + asset.name + " (" + asset.md5+ ")");
    callback(callback);
  }
}

downloadAsset(assets[0], (f) => {
  assetIndex++;
  if (assetIndex < assets.length) {
    downloadAsset(assets[assetIndex],f);
  } else {
    console.log("Skipped:" + skips +", Downloaded:" + downloads);
    if (skips != assets.length) {
      console.log("Rerunning...");
      assetIndex = 0;
      downloads = 0;
      skips = 0;
      downloadAsset(assets[assetIndex],f);
    }
  }
});
