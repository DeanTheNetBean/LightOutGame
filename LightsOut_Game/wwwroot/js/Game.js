// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
window.onload = function () {
    btn = document.getElementById("button");
    if (btn.innerHTML == "Give Up") {
        canv = document.getElementById("gc");
        ctx = canv.getContext("2d");
        document.addEventListener("click", gameOptionsSwitch);
        gameOptions = new gameOptions();
        gameStart();
    }
    else
        return;
}

function gameOptions() {
    this.gridsize_x = 5;
    this.gridsize_y = 5;
    this.blocksize = 101;
    this.blockmargin = 1;
    this.offColor = "Green";
    this.onColor = "Lime";
}

function gameStart() {
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, canv.width, canv.height);
    getLights();
}

function gameOptionsSwitch(e) {

    if (e.target.id != "gc")
        return;
    //Block clicked
    var closestX = Math.floor(e.offsetX / 100) * 100;
    var closestY = Math.floor(e.offsetY / 100) * 100;

    var blockX = gameOptions.blockmargin + ((closestX / 100) * gameOptions.blocksize);
    var blockY = gameOptions.blockmargin + ((closestY / 100) * gameOptions.blocksize);

    var data = {
        "Id": 1,
        "Toggle": true,
        "PositionX": closestX / 100,
        "PositionY": closestY / 100
    };

    $.post({
        url: "/api/game",
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8'
    })
        .done(function (data) {
            $.each(data, function (index) {
                toggleBlock(gameOptions.blockmargin + (data[index].positionX * gameOptions.blocksize), gameOptions.blockmargin + (data[index].positionY * gameOptions.blocksize));
            });
            //Check if game is won 
            var lightsOff = 0;
            for (var x = 0; x < gameOptions.gridsize_x; x++) {
                for (var y = 0; y < gameOptions.gridsize_y; y++) {
                    var color = ctx.getImageData(gameOptions.blockmargin + (x * gameOptions.blocksize), gameOptions.blockmargin + (y * gameOptions.blocksize), 1, 1);
                    if (color.data[1] == 128)
                        lightsOff++;
                }
            }
            if (lightsOff == 25)
                winGame();
        });
}

function toggleBlock(x, y) {
    var toggleColor;
    var color = ctx.getImageData(x, y, 1, 1);

    if (color.data[1] == 128) {
        toggleColor = gameOptions.onColor
    }
    else if (color.data[1] == 255) {
        toggleColor = gameOptions.offColor
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

function getLights() {
    $.get("/api/game", function (data) {
        $.each(data, function (index) {
            if (data[index].toggle == true)
                ctx.fillStyle = gameOptions.onColor;
            else if (data[index].toggle == false)
                ctx.fillStyle = gameOptions.offColor;
            ctx.fillRect(gameOptions.blockmargin + (data[index].positionX * gameOptions.blocksize), gameOptions.blockmargin + (data[index].positionY * gameOptions.blocksize), 100, 100);
        });
    });
}