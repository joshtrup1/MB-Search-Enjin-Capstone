const express = require('express');
const { createWorker } = require('tesseract.js');
const fs = require('fs');
var ffmpeg = require('ffmpeg');
const { json } = require('express');

var dir = './temp/videos/'
var dir2 = './temp/imgs/'
const path = require('path');
module.exports = {

    start:function startScript(){
        fs.readdir(dir, (err, data) => {

            if(data.length > 0){
                for (item in data){
                    // console.log(data[item])
                    extractFrames(dir+data[item], 60, data[item])
                }
            }
            else if(data.length === 0){
                console.log('No videos to parse')
            }
        })
    }
}



//function for parsing frames 
//takes in 'a' for video file and 'b' for timestamp
function extractFrames(a, b, c){
    // console.log(a)
    try {
        var process = new ffmpeg(a);
        
        ts = b
        c = path.parse(c).name;
        process.then(function (video) {
            let temp = video.metadata.duration.seconds/b
            // console.log(video)
            temp = Math.round(temp)
            // video.addCommand('-ss', '00:00:10')
            // Callback mode
            video.fnExtractFrameToJPG('./temp/imgs/', {
                number : temp,
                every_n_seconds: ts,
                file_name : `${c}`
            }, function (error, files) {
                if (!error)
                    console.log("Extracting Done");
                    
                    parseImage(dir2+c, c, temp)
            });
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }

}

//parse the image/images using tesseract ocr
function parseImage(files, fileName, temp){
    count = 1;
    const worker = createWorker();

    (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        console.log(temp)
        let tempIndex = {};
        for(var i = 1; i<=temp; i++){
            const { data: { text } } = await worker.recognize(dir2+fileName+`_${i}.jpg`);
            // console.log(text)
            // let ss = file.replace(/[^0-9]/g, '')
            parseText(text, i*60, fileName, tempIndex)
            count++

            if(i === temp){
                console.log(fileName)
                console.log(tempIndex)
                fs.writeFile(`./public/js/${fileName}.json`, JSON.stringify(tempIndex), () =>{});
            }
        }
        // for (const file of files) {
        //     const { data: { text } } = await worker.recognize(dir2+file);
        //     let ss = file.replace(/[^0-9]/g, '')
            
        //     // console.log(text)
        //     parseText(text, ss*60)
        //     console.log(count)
        //     count++

        //     // if(count == files.length){
        //     //     console.log("parsing DONE")
        //     //     console.log(tempIndex)
        //     //     fs.writeFile(`./public/js/${fileName}.json`, JSON.stringify(tempIndex), () =>{});
        //     //     // deleteFiles()
        //     // }
        // }
        await worker.terminate();

      })();
}

//delete files after the parsing is done 
function deleteFiles(){
        fs.readdir(dir2, (err, files) => {
        if (err) throw err;
            for (const file of files) {
                fs.unlink(dir2+file, err => {
                    if (err) throw err;
                });
            }
    });
}

//parse the text from each image
function parseText(text, ts, fileName, tempIndex){
    
    let raw = text
    raw = raw.replace(/\n/g, " ").toLowerCase()
    // raw = raw.replace(/\s\s+/g," ");
    raw = raw.replace(/[^0-9A-Za-z ]/g, "")
    let x = raw.split(" ")
    
    for(var i = 0; i<x.length; i++){
        // if length of the word is 3 characters or less, don't include it
        if(x[i].length > 3){

            // if word exists in index then we increment occurences and push new page
            if(tempIndex[x[i]]){
                tempIndex[x[i]].occurences++
                tempIndex[x[i]].timestamp.push(ts)
            }
            //if word doesn't exist in index
            else{
                let item = {occurences: 1, timestamp:[ts], fileName: fileName}
                tempIndex[x[i]] = item
            }
        }
    
    }
}



