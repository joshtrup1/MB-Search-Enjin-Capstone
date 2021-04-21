const express = require('express');
const router = express.Router();
const { createWorker } = require('tesseract.js');
const fs = require('fs');
var ffmpeg = require('ffmpeg');
const { json } = require('express');
const test = {}
var dir = './temp/videos/'
var dir2 = './temp/imgs/'
// const TESSDATA_PREFIX= 'D:\\Tesseract\\tessdata'

// main route 
router.get('/', (req,res) => {
   fs.readdir(dir, (err, data) => {
       console.log(data)
       res.render('parse', {data: data});
   })
    
});

//route to check if the json file was saving to the file system
router.get('/check', (req,res) => {

    fs.readdir('./public/js/', (err,files) =>{
        let data = fs.readFileSync('./public/js/' + files)
        let dd = JSON.parse(data)
        console.log(dd)
        res.send(dd)
    })
     
});

router.get('/:f', async (req,res) => {
    console.log(req.params.f)


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

//function for parsing frames 
//takes in 'a' for video file and 'b' for timestamp
function extractFrames(a, b){
    try {
        var process = new ffmpeg(a);
        
        ts = b
        process.then(function (video) {
            let temp = video.metadata.duration.seconds/b
            // console.log(video)
            temp = Math.round(temp)
            // video.addCommand('-ss', '00:00:10')
            // Callback mode
            video.fnExtractFrameToJPG('./temp/imgs/', {
                number : temp,
                every_n_seconds: ts,
                file_name : ``
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

//parse the image/images using tesseract ocr
function parseImage(files){
    count = 1;
    const worker = createWorker();

    (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        for (const file of files) {
            const { data: { text } } = await worker.recognize(dir2+file);
            let ss = file.replace(/[^0-9]/g, '')
            
            // console.log(text)
            parseText(text, ss*60)
            console.log(count)
            count++

            if(count == files.length){
                console.log("parsing DONE")
                console.log(test)
                fs.writeFile("./public/js/temp.json", JSON.stringify(test), () =>{});
                deleteFiles()
            }
        }
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
function parseText(text, ts){
    
    let raw = text
    raw = raw.replace(/\n/g, " ").toLowerCase()
    // raw = raw.replace(/\s\s+/g," ");
    raw = raw.replace(/[^0-9A-Za-z ]/g, "")
    let x = raw.split(" ")
    
    for(var i = 0; i<x.length; i++){
        // if length of the word is 3 characters or less, don't include it
        if(x[i].length > 3){

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
    
    }
}


module.exports = router;