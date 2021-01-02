window.pdf = new jsPDF("p", "mm", "a4");
window.exampleJsFunctions = {

    populateDiv: function (element) {
        popupJsFunctions.getHTML('https://localhost:44382/Counter',
            function (response) {
                element.innerHTML = response.documentElement.innerHTML;
            });
    },
    // From:
    // https://gomakethings.com/getting-html-asynchronously-from-another-page/
    getHTML: function (url, callback) {
        // Feature detection
        if (!window.XMLHttpRequest) return;
        // Create new request
        var xhr = new XMLHttpRequest();
        // Setup callback
        xhr.onload = function () {
            if (callback && typeof (callback) === 'function') {
                callback(this.responseXML);
            }
        };
        // Get the HTML
        xhr.open('GET', url);
        xhr.responseType = 'document';
        xhr.send();
    },

    showConfirmMessage: function (text,title) {
        return confirm(text, title);
    },

    showPrompt: function (text) {
        return prompt(text, 'Type your name here');
    },
    displayWelcome: function (welcomeMessage) {
        document.getElementById('welcome').innerText = welcomeMessage;
    },
    returnArrayAsyncJs: function () {
        DotNet.invokeMethodAsync('BlazorSample', 'ReturnArrayAsync')
            .then(data => {
                data.push(4);
                console.log(data);
            });
    },
    sayHello: function (dotnetHelper) {
        return dotnetHelper.invokeMethodAsync('SayHello')
            .then(r => console.log(r));
    },

    createPDF: function ()
    {
        window.pdf = new jsPDF("p", "mm", "a4");
    },
    
    addText: function (text, fontSize, linespace, x, y, align, maximalWidth) {
        pdf.setLineHeightFactor(linespace);
        pdf.setFontSize(fontSize);
        pdf.text(text, x, y, {align:align, maxWidth: maximalWidth });
        
    },

    addRect: function (x, y, w, h, style){
        pdf.rect(x, y, w, h, style);
    },

    addCheckBox: function (x, y, w, h, checked) {
        pdf.rect(x, y, w, h, "S");
        if (checked) {
            pdf.line(x, y, x + w, y + h);
            pdf.line(x, y + h, x + w, y);
        } 
    },

    addSignature: function (x, y, w, h) {
        var canvas = document.getElementById("newSignature");
        var dataURL = canvas.toDataURL("image/png");
        pdf.addImage(dataURL, "PNG", x, y, w, h, "signature", "FAST", 0);
    },

    addSignatureWithDataURL: function (dataURL, x, y, w, h) {
        var canvas = document.getElementById("newSignature");
        pdf.addImage(dataURL, "PNG", x, y, w, h, "signature", "FAST", 0);
    },

    imageToCanvas: function (dataURL) {
        var canvas = document.getElementById("newSignature");
        if (dataURL !== undefined && dataURL !== null) {
            var canvas, context, image, imageData;
            context = canvas.getContext('2d');
            image = new Image();

            image.addEventListener('load', function () {
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                //how do i return this?
            }, false);
            image.src = dataURL;

            return imageData;
        }
    },

    signatureToImage: function () {
        var canvas = document.getElementById("newSignature");
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    },


    addLogo: function (x, y, w, h) {
        pdf.addImage(document.getElementById("imgLogo"), "PNG", x, y, w, h, "logo", "FAST", 0);
    },


    savePDF: function (fileName) {
        pdf.save(fileName);
    },

    signatureToFullScreen: function () {
        var elem = document.getElementById("wrapper");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    },

    doNothing: function ()
    {
    }



};