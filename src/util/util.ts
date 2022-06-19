import fs from "fs";
import Jimp = require("jimp");
import axios from 'axios';
//import axios = require("axios");
import path from 'path';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await axios ({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer'
      });
      const photo = await Jimp.read(data);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      //reject(error);
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
       const bff =  await photo.getBufferAsync(Jimp.MIME_PNG);
       console.log(bff);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    let fileFileFullPath = path.join(__dirname,'tmp/',file);
    fs.unlinkSync(fileFileFullPath);
  }
}

// Validate the URL path
export function ValidURL(str: string) {
  var regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    
    return false;
  } else {
    return true;
  }
}