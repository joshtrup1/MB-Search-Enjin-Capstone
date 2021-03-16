const express = require('express');
const app = express();
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegPath);

const extractFrames = require('ffmpeg-extract-frames')
var ffmpeg = require('ffmpeg');

// extractFrames({
//   input: 'https://www.youtube.com/watch?v=31HfP81oWDI',
//   output: './store/frame-%d.jpg',
//   offsets: [
//     1000,
//     2000,
//     3000
//   ]
// })

try {
	var process = new ffmpeg('./implication.mp4');
	process.then(function (video) {
		// Callback mode
		video.fnExtractFrameToJPG('./test', {
			frame_rate : 1,
			number : 10,
			every_n_seconds:60,
			file_name : 'my_frame_%t_%s'
		}, function (error, files) {
			if (!error)
				console.log('Frames: ' + files);
		});
	}, function (err) {
		console.log('Error: ' + err);
	});
} catch (e) {
	console.log(e.code);
	console.log(e.msg);
}




app.set("view engine","ejs");
app.use(express.static("public"));



//root route
app.get('/', async function(req, res) {
 
  res.render('home' );
});

//page 1 route
app.get('/page1', async function(req, res) {

  res.render('page1' );
});

//page 2 route
app.get('/page2', async function(req, res) {

  res.render('page2' );
});


app.listen(3000, () => {
  console.log('server started');
});


//Google API key: AIzaSyAhu_Juf2lfJuo6EdYxozRB_aQd9ojWzsY
