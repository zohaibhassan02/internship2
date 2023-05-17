const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.use(express.json());

app.get("/video", function (req, res) {
    let range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    else{
        // console.log(range);
        const videoPath = "clip.mp4";
        const videoSize = fs.statSync("clip.mp4").size;
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.replace(/\D/g, "")); //replaces every non digit character with empty space
        // so we only get the number from range: bytes=14113131-
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1); //calculating the end point by adding the chunk size 
        //to start, using min function so that the end point does not end up being greater than the video size
        const contentLength = end - start + 1;  //content length is from start to end
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,  //finding out how far along is the content
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);

        // videoStream.on('data', (chunk) => {
        //     if(videoStream.isPaused()){
        //         videoStream.resume();
        //     }
        // })
        //cons of this entire project: the client keeps on requesting data from the server
        //and the data is not being saved anywhere on a frontend
        // so you may end up requesting more than the actual size of the original video, heavy load on the server
    }
});

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});