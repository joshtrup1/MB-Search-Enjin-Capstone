const express = require('express');
const router = express.Router();
const { createWorker } = require('tesseract.js');
const fs = require('fs');
var ffmpeg = require('ffmpeg');
const test = {}
var dir = './temp/videos/'
var dir2 = './temp/imgs/'


router.get('/', (req,res) => {

   fs.readdir(dir, (err, data) => {
       console.log(data)
       res.render('parse', {data: data});
   })
    
});

router.get('/:f', async (req,res) => {
    console.log(req.params.f)

    // fs.readFile(`./temp/imgs/120.jpg` , (err,data) => {
    //     // console.log(err, data)
    //     if(err) return console.log("this is your error ", err)
    // });
    

    fs.readdir(dir2, (err, files) => {
        if (err) throw err;
        // for (const file of files) {
        
        // }
        if(files.length > 1){
            console.log("PARSING")
            parseImage(files)
        }
        else{
            console.log("EXTRACTING")
            extractFrames(dir+req.params.f, 60)
        }
     
    });

});

function extractFrames(a, b){
    try {
        var process = new ffmpeg(a);
        ts = b
        process.then(function (video) {
            let temp = video.metadata.duration.seconds/b
            temp = Math.round(temp)
            // console.log(temp)
            // Callback mode
            video.fnExtractFrameToJPG('./temp/imgs/', {
                number : temp,
                every_n_seconds: ts,
                file_name : `ex`
            }, function (error, files) {
                if (!error)
                    console.log("Extracting Done");
            });
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }

}

function parseImage(files){
    count = 1;

    for (const file of files) {        
        const worker = createWorker();
        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(dir2+file);
            parseText(text, count*60)
            await worker.terminate();
        })();   
        count++;
        // if(count-1 == files.length){
        //     console.log("PARSING DONE")
        //     deleteFiles()
        // }
    }
}

function deleteFiles(){
        fs.readdir(dir2, (err, files) => {
        if (err) throw err;
            for (const file of files) {
                fs.unlink(dir2+file, err => {
                    if (err) throw err;
                });
            }
            // fs.unlink('./eng.traineddata', err => {
            //     if (err) throw err;
            // });
        
    });
          
}

function parseText(text, ts){
    
    let raw = text
    raw = raw.replace(/\n/g, " ").toLowerCase()
    // raw = raw.replace(/\s\s+/g," ");
    raw = raw.replace(/[^0-9A-Za-z ]/g, "")
    console.log(raw)
    let x = raw.split(" ")
    
    for(var i = 0; i<x.length; i++){
        // if word exists in index then we increment occurences and push new page
        if(test[x[i]]){
            test[x[i]].occurences++
            test[x[i]].timestamp.push(ts)
        }
        //if word doesn't exist in index
        else{
            let item = {occurences: 1, timestamp:[ts]}
            test[x[i]] = item
        }
    }
    
  
//    fs.writeFile("index.json", JSON.stringify(test), () =>{});

}


module.exports = router;