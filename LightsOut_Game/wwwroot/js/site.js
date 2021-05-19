// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
window.onload = function () {
    btn = document.getElementById("button");
    if (btn.innerHTML == "Give Up") {
        canv = document.getElementById("gc");
        ctx = canv.getContext("2d");
        document.addEventListener("click", lightSwitch);
        grid = new lightGrid();
        light = new light();

        gameStart();
    }
    else
        return;
}

function lightGrid() {
    this.gridsize_x = 5;
    this.gridsize_y = 5;
    this.blocksize = 101;
    this.blockmargin = 1;
}

function light() {
    this.offColor = "Green";
    this.onColor = "Lime";
}

function gameStart() {
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, canv.width, canv.height);
    populateGrid();
}

function populateGrid() {

    var lightsOn = new Array();
    //Randomize number of lights that are on
    var totalLightsOn = Math.floor(Math.random() * 3) + 1;
    var coordinates;

    //Randomize the coordinates where the on-lights appear
    for (var i = 0; i < totalLightsOn; i++) {
        coordinates = { x_coord: Math.floor(Math.random() * 5), y_coord: Math.floor(Math.random() * 5) }
        lightsOn.push(coordinates);
    }

    for (var x = 0; x < grid.gridsize_x; x++) {
        for (var y = 0; y < grid.gridsize_y; y++) {
            if (lightsOn.find(el => el.x_coord === x && el.y_coord === y)) {
                ctx.fillStyle = light.onColor;
            }
            else {
                ctx.fillStyle = light.offColor;
            }
            ctx.fillRect(grid.blockmargin + (x * grid.blocksize), grid.blockmargin + (y * grid.blocksize), 100, 100);
        }
    }
}

function lightSwitch(e) {

    if (e.target.id != "gc")
        return;
    //Block clicked
    var closestX = Math.floor(e.offsetX / 100) * 100;
    var closestY = Math.floor(e.offsetY / 100) * 100;

    var blockX = grid.blockmargin + ((closestX / 100) * grid.blocksize);
    var blockY = grid.blockmargin + ((closestY / 100) * grid.blocksize);

    toggleBlock(blockX, blockY);

    //Adjacent blocks
    var adjBlockX;
    var adjBlockY;

    //Right block
    adjBlockX = blockX + grid.blocksize;
    adjBlockY = blockY;
    toggleBlock(adjBlockX, adjBlockY);

    //Left block
    adjBlockX = blockX - grid.blocksize;
    adjBlockY = blockY;
    toggleBlock(adjBlockX, adjBlockY);

    //Top block
    adjBlockX = blockX;
    adjBlockY = blockY - grid.blocksize;
    toggleBlock(adjBlockX, adjBlockY);

    //Bottom block
    adjBlockX = blockX;
    adjBlockY = blockY + grid.blocksize;
    toggleBlock(adjBlockX, adjBlockY);

    //Check if game is won
    var lightsOff = 0;
    for (var x = 0; x < grid.gridsize_x; x++) {
        for (var y = 0; y < grid.gridsize_y; y++) {
            var color = ctx.getImageData(grid.blockmargin + (x * grid.blocksize), grid.blockmargin + (y * grid.blocksize), 1, 1);
            if (color.data[1] == 128)
                lightsOff++;
        }
    }

    if (lightsOff == 25)
        winGame();
}

function toggleBlock(x, y) {
    var toggleColor;
    var color = ctx.getImageData(x, y, 1, 1);

    if (color.data[1] == 128) {
        toggleColor = light.onColor
    }
    else if (color.data[1] == 255) {
        toggleColor = light.offColor
    }
    else
        return;

    ctx.fillStyle = toggleColor;
    ctx.fillRect(x, y, 100, 100);
}

function winGame() {
    document.getElementById("game").innerHTML = "<h1>Congratulations! You Won!</h1>";
    document.getElementById("button").innerHTML = "Continue";
}