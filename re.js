var oFace = 0,
    colorBlack = "#191919",
    colorGreen = "#659b41",
    colorYellow = "#ffcf33",
    colorBrown = "#986928",
    colorCyan = "#1aa8a5",
    colorGrey = "#999999",
    colorWhite = "#f2f2f2",
    colorRed = "#ff0330",
    curColor = colorBlack,
    curTool = "marker",
    curSize = "huge",
    colors = [colorBlack, colorBrown, colorGrey, colorWhite, colorRed, colorYellow, colorCyan, colorGreen, "eraser", "huge", "large", "normal", "small"],
    mediumStartX = 18,
    mediumStartY = 9,
    drawingAreaWidth = document.getElementById('justtrash').offsetWidth,
    drawingAreaHeight = document.getElementById('justtrash').offsetHeight,
    mediumImageWidth = drawingAreaHeight / 10,
    mediumImageHeight = drawingAreaHeight / 20,
    drawingAreaX = 26 + drawingAreaHeight / 10,
    drawingAreaY = 1,
    //drawingAreaWidth = document.getElementById('justtrash').offsetWidth,
    //drawingAreaHeight = document.getElementById('justtrash').offsetHeight,
    s = 0;
    //lastScreen = TakeScreenshot();

var drawingApp = (function() {

    "use strict";

    var canvas,
        context,
        canvasWidth = document.getElementById('justtrash').offsetWidth,
        canvasHeight = document.getElementById('justtrash').offsetHeight,
        outlineImage = new Image(),
        markerImage = new Image(),
        eraserImage = new Image(),
        smallImage = new Image(),
        normalImage = new Image(),
        largeImage = new Image(),
        hugeImage = new Image(),
        onFace = new Image(),
        saveButton = new Image(),
        markerBackgroundImage = new Image(),
        nonColors = [eraserImage, hugeImage, largeImage, normalImage, smallImage, onFace, saveButton],
        clickX = [],
        clickY = [],
        clickColor = [],
        clickTool = [],
        clickSize = [],
        clickDrag = [],
        paint = false,
        totalLoadResources = 10,
        curLoadResNum = 0,


        // Clears the canvas.
        clearCanvas = function() {

            context.clearRect(0, 0, canvasWidth, canvasHeight);
        },

        // Redraws the canvas.
        redraw = function() {

            var locX,
                locY,
                radius,
                i,
                selected,


                drawMarker = function(x, y, color, selected) {
                    if (selected) {
                        x = x + 8;
                    } 
                    context.fillStyle = color;
                    context.fillRect(x, y, mediumImageWidth, mediumImageHeight);
                    context.fill();
                };


            // Make sure required resources are loaded before redrawing


            clearCanvas();

            if (oFace === 0) {

                // Draw the marker tool background
                //context.drawImage(markerBackgroundImage, 0, 0, canvasWidth, canvasHeight);
                locX = 18;
                locY = 9;
                //draw colors
                for (i = 0; i < 8; i++) {
                    selected = (curColor === colors[i]);
                    drawMarker(locX, locY, colors[i], selected);
                    locY += canvasHeight / 20;
                }
                //draw tools
                for (i = 0; i < 7; i++) {
                    context.drawImage(nonColors[i], locX, locY, mediumImageWidth, mediumImageHeight);
                    locY += canvasHeight / 20;
                }





            } else if (oFace === 1) {
                document.getElementById('canvasDiv1').style.display = 'inline';
            }
            // Keep the drawing in the drawing area
            context.save();
            context.beginPath();
            context.clearRect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
            context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
            context.clip();

            // For each point drawn
            for (i = 0; i < clickX.length; i += 1) {

                // Set the drawing radius
                switch (clickSize[i]) {
                    case "small":
                        radius = 10;
                        break;
                    case "normal":
                        radius = 25;
                        break;
                    case "large":
                        radius = 50;
                        break;
                    case "huge":
                        radius = 100;
                        break;
                    default:
                        break;
                }

                // Set the drawing path
                context.beginPath();
                // If dragging then draw a line between the two points
                if (clickDrag[i] && i) {
                    context.moveTo(clickX[i - 1], clickY[i - 1]);
                } else {
                    // The x position is moved over one pixel so a circle even if not dragging
                    context.moveTo(clickX[i] - 1, clickY[i]);
                }
                context.lineTo(clickX[i], clickY[i]);

                // Set the drawing color
                if (clickTool[i] === "eraser") {
                    context.globalCompositeOperation = "destination-out"; // To erase instead of draw over with white
                    context.strokeStyle = 'white';
                } else {
                    context.globalCompositeOperation = "source-over"; // To erase instead of draw over with white
                    context.strokeStyle = clickColor[i];
                }
                context.lineCap = "round";
                context.lineJoin = "round";
                context.lineWidth = radius;
                context.stroke();
            }
            context.closePath();
            context.globalCompositeOperation = "source-over"; // To erase instead of draw over with white
            context.restore();

            // Draw the outline image
            context.drawImage(outlineImage, (drawingAreaWidth / 2) - (drawingAreaHeight / 3.6), (drawingAreaHeight / 2) - (drawingAreaHeight / 2.4), (drawingAreaHeight / 1.8), (drawingAreaHeight / 1.2));
        },

        // Adds a point to the drawing array.
        // @param x
        // @param y
        // @param dragging
        addClick = function(x, y, dragging) {

            clickX.push(x);
            clickY.push(y);
            clickTool.push(curTool);
            clickColor.push(curColor);
            clickSize.push(curSize);
            clickDrag.push(dragging);
        },

        // Add mouse and touch event listeners to the canvas
        createUserEvents = function() {

            var press = function(e) {
                    // Mouse down location
                    var sizeHotspotStartX,
                        rect = canvas.getBoundingClientRect(),
                        mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - rect.left,
                        mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - rect.top;

                    if (mouseX < drawingAreaX) { // Left of the drawing area
                        if (mouseX > mediumStartX) {

                            var start = mediumStartY
                            var end = mediumStartY + mediumImageHeight * 14;
                            var height = (end - start) / 14;
                            var index = Math.floor((mouseY - start)/height);
                            if (index >= 0 && index <= 7) {
                                curColor = colors[index];
                                curTool = "marker"
                            } else if (index == 8) {
                                curTool = "eraser"
                            } else if (index >=9 && index <= 12) {
                                curSize = colors[index]
                            }
                            
                            if (mouseY > mediumStartY + mediumImageHeight * 13 && mouseY < mediumStartY + mediumImageHeight * 14) {
                                oFace = 1;
                            } else if (mouseY > mediumStartY + mediumImageHeight * 14 && mouseY < mediumStartY + mediumImageHeight * 15) {
                                var currScreen = TakeScreenshot();
                                if (!s){
                                    var lastScreen = currScreen;
                                    console.log(lastScreen);
                                    s++;
                                }
                                if (lastScreen != currScreen){
                                    lastScreen = currScreen;
                                    console.log(lastScreen);
                                }
                                
                            }

                        }
                    }

                    paint = true;
                    addClick(mouseX, mouseY, false);
                    redraw();
                },

                drag = function(e) {

                    var rect = canvas.getBoundingClientRect(),
                        mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - rect.left,
                        mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - rect.top;


                    if (paint) {
                        addClick(mouseX, mouseY, true);
                        redraw();
                    }
                    // Prevent the whole page from dragging if on mobile
                    e.preventDefault();
                },

                release = function() {
                    paint = false;
                    redraw();
                },

                cancel = function() {
                    paint = false;
                };

            // Add mouse event listeners to canvas element
            canvas.addEventListener("mousedown", press, false);
            canvas.addEventListener("mousemove", drag, false);
            canvas.addEventListener("mouseup", release);
            canvas.addEventListener("mouseout", cancel, false);

            // Add touch event listeners to canvas element
            canvas.addEventListener("touchstart", press, false);
            canvas.addEventListener("touchmove", drag, false);
            canvas.addEventListener("touchend", release, false);
            canvas.addEventListener("touchcancel", cancel, false);
        },

        // Calls the redraw function after all neccessary resources are loaded.
        resourceLoaded = function() {

            curLoadResNum += 1;
            if (curLoadResNum === totalLoadResources) {
                redraw();
                createUserEvents();
            }
        },

        // Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
        init = function() {

            // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
            canvas = document.createElement('canvas');
            canvas.setAttribute('width', canvasWidth);
            canvas.setAttribute('height', canvasHeight);
            canvas.setAttribute('id', 'canvas');
            document.getElementById('canvasDiv').appendChild(canvas);
            if (typeof G_vmlCanvasManager !== "undefined") {
                canvas = G_vmlCanvasManager.initElement(canvas);
            }
            context = canvas.getContext("2d"); // Grab the 2d canvas context
            // Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
            //     context = document.getElementById('canvas').getContext("2d");

            // Load images


            markerImage.onload = resourceLoaded;
            markerImage.src = "images/marker-outline.png";

            smallImage.onload = resourceLoaded;
            smallImage.src = "images/small.png";

            normalImage.onload = resourceLoaded;
            normalImage.src = "images/normal.png";

            largeImage.onload = resourceLoaded;
            largeImage.src = "images/large.png";

            hugeImage.onload = resourceLoaded;
            hugeImage.src = "images/huge.png";

            eraserImage.onload = resourceLoaded;
            eraserImage.src = "images/eraser-outline.png";

            markerBackgroundImage.onload = resourceLoaded;
            markerBackgroundImage.src = "images/marker-background.png";

            outlineImage.onload = resourceLoaded;
            outlineImage.src = "images/watermelon-duck-outline.png";

            onFace.onload = resourceLoaded;
            onFace.src = "images/onface.png";

            saveButton.onload = resourceLoaded;
            saveButton.src = "images/save.png";
        };

    return {
        init: init
    };
}());