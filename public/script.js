var socket = io.connect();
socket.on('connect', function() {
    console.log("Connected");
});
            
window.addEventListener('load', function() {

    let video = document.getElementById('myvideo');
    let canvas = document.getElementById('mycanvas');
    let canvasShow = document.getElementById('mycanvasShow');
    let context = canvas.getContext('2d');
    let contextShow = canvasShow.getContext('2d');
    let shot1 = document.getElementById("shot1");
    let shot2 = document.getElementById("shot2");
    let shot3 = document.getElementById("shot3");

    // Constraints - what do we want?
    let constraints = { audio: false, video: true };

    // Prompt the user for permission, get the stream
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        /* Use the stream */
        
        // Attach to our video object
        video.srcObject = stream;
        
        // Wait for the stream to load enough to play
        video.onloadedmetadata = function(e) {
            video.play();
            draw();
        };
    })
    .catch(function(err) {
        /* Handle the error */
        alert(err);  
    });

    shot1.addEventListener("click", function(){
        draw1();
    });
    shot2.addEventListener("click", function(){
        draw2();
    });
    shot3.addEventListener("click", function(){
        draw3();
    });

    

    function draw(){
        contextShow.drawImage(video, 0, 0, canvas.width, canvas.height);
        contextShow.beginPath();
        contextShow.moveTo(0, canvas.height/3);
        contextShow.lineTo(canvas.width, canvas.height/3);
        contextShow.moveTo(0, canvas.height/3*2);
        contextShow.lineTo(canvas.width, canvas.height/3*2);
        contextShow.stroke();
        window.requestAnimationFrame(draw);
    }

    let count = 0;

    function draw1() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height/3, 0, 0, canvas.width, canvas.height/3);
        socket.emit('image', canvas.toDataURL());
    }

    function draw2(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, canvas.height/3, canvas.width, canvas.height/3, 0, canvas.height/3, canvas.width, canvas.height/3);
        socket.emit('image', canvas.toDataURL());
    }

    function draw3(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, canvas.height/3*2, canvas.width, canvas.height/3, 0, canvas.height/3*2, canvas.width, canvas.height/3);
        socket.emit('image', canvas.toDataURL());
    }
    
    
    
    // Receive a message
    socket.on('image', function(data) {
        
        let ni = new Image(); // HTML5 Image object
        ni.src = data; // Attach the data to it
        let imgBox = document.getElementById("imgBox");
        imgBox.appendChild(ni);

    });

});