const pictures = ["images/basket.jpg", "images/shampoo.jpg", "images/water bottle.jpg", "images/basket.jpg", "images/basket.jpg"];
const image_width = 300;
const image_height = 300;
const column_max = 1;

function resize(width, height) {
    // Takes in width and height, and returns new width, height, starting x, starting y to fit within the set width and height, but maintain image original ratio for dimensions
    // We also need to center image so it's appearing in the middle of the canvas
    var canvas_x = 0;
    var canvas_y = 0;
    if (width > height) {
        width = image_width;
        height = height * image_width / width;
        var canvas_y = (image_height - height) / 2;
    } else {
        width = width * image_height / height;
        height = image_height;
        var canvas_x = (image_width - width) / 2;
    }
    return [canvas_x, canvas_y, width, height];
}

function createImage(imageNum) {
    // Takes in path to image, and creates image on canvas
    // Create div
    var imageName = pictures[imageNum];
    var div = document.createElement("div"); // var element keeps declared variables within the scope of just this function
    div.className = "item"; // Uses CSS folder to determine div styling

    document.getElementById("main").appendChild(div); // Adds div into grid which takes care of placement
    
    // Create canvas
    var canvas = document.createElement("canvas");
    canvas.width = image_width;
    canvas.height = image_height;
    div.appendChild(canvas);
    var context = canvas.getContext("2d"); // Get context of canvas so we can manipulate it

    // Create and scale image to correct size, then add it to canvas
    var image = document.createElement("img"); // Create img element
    image.src = imageName // Load image into img element
    image.onload = function() {
        dimensions = resize(this.width, this.height);
        context.drawImage(image, dimensions[0], dimensions[1], dimensions[2], dimensions[3]);
    }

    // Create textual description of object
    var paragraph = document.createElement("p");
    var text = document.createTextNode(imageName.substring(7, imageName.length - 4)); // Parse name of item from address of image
    paragraph.appendChild(text)
    div.appendChild(paragraph);
}


// Returns iterator (e.g. img = 0, 1, 2...)
for (img in pictures) {
    createImage(img);
}
