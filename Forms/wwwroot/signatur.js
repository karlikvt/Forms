

var zkSignature = (function () {

    var empty = true;
    var isEditingEnabled = true;
    var initialized = false;

    /*window.onresize = resizeCanvas;
    function resizeCanvas() {
        if (initialized) {
            dataURL = getDataURL()();
            this.clear();
            this.capture(zkSignature.isEditingEnabled);
            this.imageToCanvas(dataURL);
        }
        return dataURL;
    }*/

    return {
        //public functions
        capture: function (editingEnabled) {
            isEditingEnabled = editingEnabled;

            initialized = true;
            var parent = document.getElementById("canvas");
            while (parent.childElementCount > 0) {
                lastChild = parent.lastChild;
                parent.removeChild(lastChild);
            }
           

            parent.childNodes[0].nodeValue = "";

            var canvasArea = document.createElement("canvas");
            canvasArea.setAttribute("id", "newSignature");
            parent.appendChild(canvasArea);

            

            var canvas = document.getElementById("newSignature");
            var context = canvas.getContext("2d");

            if (!context) {
                throw new Error("Failed to get canvas' 2d context");
            }

            screenwidth = window.innerWidth;

            if (screenwidth < 10080) {
                canvas.width = screenwidth - 80;
                canvas.height = (canvas.width / 3.1);
            } else {
                canvas.width = 465;
                canvas.height = 150;
            }



            context.fillStyle = "#fff";
            context.strokeStyle = "#444";
            context.lineWidth = 1.2*canvas.width * 1.0 / 465;
            context.lineCap = "round";

            context.fillRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = "#3a87ad";
            context.strokeStyle = "#444";
            context.lineWidth = 1 * canvas.width * 1.0 / 465;
            context.moveTo((canvas.width * 0.042), (canvas.height * 0.9));
            context.lineTo((canvas.width * 0.958), (canvas.height * 0.9));
            context.stroke();
            

            context.fillStyle = "#fff";
            context.strokeStyle = "#444";

            var disableSave = true;
            var pixels = [];
            var cpixels = [];
            var xyLast = {};
            var xyAddLast = {};
            var calculate = false;
            var widthOld = 1;
            var distanceHist = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3];
            var lastCanvasWidth = -1;
            var lastDataUrl;
            window.onresize = function resizeCanvas() {
                if (initialized && window.innerWidth != screenwidth) {
                    if (lastCanvasWidth < window.innerWidth-80) {
                        lastDataUrl = getDataURL();
                        lastCanvasWidth = canvas.width;
                    }
                    screenwidth = window.innerWidth;                    
                    canvas.width = screenwidth - 80;
                    canvas.height = (canvas.width / 3.1);
                    imageToCanvas(lastDataUrl);
                    distanceHist = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3];
                    }
                }
            //functions
            {
                

                function imageToCanvas(dataURL) {
                    if (dataURL !== undefined && dataURL !== null) {
                        var image, imageData;
                        image = new Image();
                        context.imageSmoothingQuality = 'high';
                        image.addEventListener('load', function () {
                            context.drawImage(image, 0, 0, canvas.width, canvas.height);
                            //how do i return this?
                        }, false);
                        image.src = dataURL;
                    }
                }
                function getDataURL(){
                    return canvas.toDataURL("image/png");
                }

                function remove_event_listeners() {
                    canvas.removeEventListener('mousemove', on_mousemove, false);
                    canvas.removeEventListener('mouseup', on_mouseup, false);
                    canvas.removeEventListener('touchmove', on_mousemove, false);
                    canvas.removeEventListener('touchend', on_mouseup, false);
                    document.body.removeEventListener('mouseup', on_mouseup, false);
                    document.body.removeEventListener('touchend', on_mouseup, false);
                }

                function get_board_coords(e) {
                    var x, y;

                    if (e.changedTouches && e.changedTouches[0]) {
                        var offsety = canvas.offsetTop || 0;
                        var offsetx = canvas.offsetLeft || 0;

                        x = e.changedTouches[0].pageX - offsetx;
                        y = e.changedTouches[0].pageY - offsety;
                    } else if (e.layerX || 0 == e.layerX) {
                        x = e.layerX;
                        y = e.layerY;
                    } else if (e.offsetX || 0 == e.offsetX) {
                        x = e.offsetX;
                        y = e.offsetY;
                    }

                    return {
                        x: x,
                        y: y
                    };
                };

                function on_mousedown(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    canvas.addEventListener('mousemove', on_mousemove, false);
                    canvas.addEventListener('mouseup', on_mouseup, false);
                    canvas.addEventListener('touchmove', on_mousemove, false);
                    canvas.addEventListener('touchend', on_mouseup, false);

                    document.body.addEventListener('mouseup', on_mouseup, false);
                    document.body.addEventListener('touchend', on_mouseup, false);

                    empty = false;
                    var xy = get_board_coords(e);
                    context.beginPath();
                    pixels.push('moveStart');
                    context.moveTo(xy.x, xy.y);
                    pixels.push(xy.x, xy.y);
                    xyLast = xy;
                };

                function on_mousemove(e, finish) {
                    e.preventDefault();
                    e.stopPropagation();

                    var xy = get_board_coords(e);
                    var xyAdd = {
                        x: (xyLast.x + xy.x) / 2,
                        y: (xyLast.y + xy.y) / 2
                    };

                    if (calculate) {
                        var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
                        var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
                        pixels.push(xLast, yLast);
                    } else {
                        calculate = true;
                    }
                    distanceCurr = Math.sqrt(Math.pow(xyLast.x - xyAdd.x, 2) * 1.0 + Math.pow(xyLast.y - xyAdd.y, 2) * 1.0);
                    distSum = distanceCurr;

                    for (var i = 1; i < distanceHist.length; i++) {
                        distanceHist[i] = distanceHist[i - 1];
                        distSum += distanceHist[i];
                    }
                    distanceHist[0] = distanceCurr;
                    distance = distSum / distanceHist.length;
                    lineWidth = 1;
                    if (distance > 3) {
                        lineWidth = 2;
                    }
                    else if (distance < 1) {
                        lineWidth = 4;
                    }
                    else {
                        lineWidth = 5 - distance;
                    }

                    context.lineWidth = lineWidth * canvas.width * 1.0 / 465;
                    context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
                    pixels.push(xyAdd.x, xyAdd.y);
                    context.stroke();
                    context.beginPath();
                    context.moveTo(xyAdd.x, xyAdd.y);
                    xyAddLast = xyAdd;
                    xyLast = xy;

                };

                function on_mouseup(e) {
                    remove_event_listeners();
                    disableSave = false;
                    context.stroke();
                    pixels.push('e');
                    calculate = false;
                    lastCanvasWidth = -1;
                    distanceHist = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3];
                };

            }
            if (editingEnabled) {
                canvas.addEventListener('mousedown', on_mousedown, false);
                canvas.addEventListener('touchstart', on_mousedown, false);
            }
            else {
                remove_event_listeners();
            }

        }
        
        ,



        save: function () {
            var canvas = document.getElementById("newSignature");
            // save canvas image as data url (png format by default)
            var dataURL = canvas.toDataURL("image/png");
            document.getElementById("saveSignature").src = dataURL;
        }
        ,
        maximize: function () {

            var canvas = document.getElementById("newSignature");
            if (canvas.webkitRequestFullScreen) {
                canvas.webkitRequestFullScreen();
            }
            else {
                canvas.mozRequestFullScreen();
            }
        }

        ,
        clear: function () {

            var parent = document.getElementById("canvas");
            var child = document.getElementById("newSignature");
            parent.removeChild(child);
            empty = true;
            //this.capture();

        }
        ,
        send: function () {

            if (empty == false) {

                var canvas = document.getElementById("newSignature");
                var dataURL = canvas.toDataURL("image/png");
                document.getElementById("saveSignature").src = dataURL;
                var sendemail = document.getElementById('sendemail').value;
                var replyemail = document.getElementById('replyemail').value;

                var dataform = document.createElement("form");
                document.body.appendChild(dataform);
                dataform.setAttribute("action", "upload_file.php");
                dataform.setAttribute("enctype", "multipart/form-data");
                dataform.setAttribute("method", "POST");
                dataform.setAttribute("target", "_self");
                dataform.innerHTML = '<input type="text" name="image" value="' + dataURL + '"/>' + '<input type="email" name="email" value="' + sendemail + '"/>' + '<input type="email" name="replyemail" value="' + replyemail + '"/>' + '<input type="submit" value="Click me" />';
                dataform.submit();

            }
        }

    }

})()

var zkSignature;
