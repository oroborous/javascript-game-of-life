// Table dimension (e.g. 5x5)
var dim;
var intervalId;

$(init);

function init() {
    createBoard();

    $("#start").click(start);
    $("#stop").click(stop);
    $("#createBoard").click(createBoard);
    $("#random").click(randomize);
    $("#gliderGun").click(gosperGliderGun);
}

function start() {
    stop();
    generationCount = 1;
    intervalId = setInterval(runGameOfLife, 250);
}

function stop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function createBoard() {
    stop();
    $("table").empty();

    dim = parseInt($("#dimension").val());
    // Try to fit game board on screen
    height = Math.round((window.innerHeight - 250) / dim) + "px";

    for (var row = 0; row < dim; row++) {
        // Create a new table row
        var newRow = $("<tr>");

        for (var col = 0; col < dim; col++) {
            // Add cells to the new row
            newRow.append("<td>");
        }

        // Insert the row (now full of cells) into the table
        $("table").append(newRow);
    }

    $("td").css("width", height).css("height", height).addClass("dead").click(makeAlive);
}

function makeAlive() {
    $(this).removeClass().addClass("alive");
}

function randomize() {
    for (var row = 0; row < dim; row++) {
        for (var col = 0; col < dim; col++) {
            $("tr").eq(row).find("td").eq(col).removeClass().addClass(Math.random() < 0.3 ? "alive" : "dead");
        }
    }
}

function gosperGliderGun() {
    var livingCells = [
        [1, 5], [1, 6], [2, 5], [2, 6], [11, 5], [11, 6],
        [11, 7], [12, 4], [12, 8], [13, 3], [13, 9],
        [14, 3], [14, 9], [15, 6], [16, 4], [16, 8],
        [17, 5], [17, 6], [17, 7], [18, 6], [21, 3], [21, 4],
        [21, 5], [22, 3], [22, 4], [22, 5], [23, 2], [23, 6],
        [25, 1], [25, 2], [25, 6], [25, 7],
        [35, 3], [35, 4], [36, 3], [36, 4]
    ];

    // Stop current game if running
    stop();

    // Make board 40 x 40
    $("#dimension").val(40);
    createBoard();

    for (var c = 0; c < livingCells.length; c++) {
        var livingCell = livingCells[c];
        $("tr").eq(livingCell[1]).find("td").eq(livingCell[0]).removeClass("dead").addClass("alive");
    }
}

var generationCount;

function runGameOfLife() {
    generationCount++;
    $("#genCount").text(generationCount);

    var nextGenerationGrid = [];

    // Loop through every cell
    for (var row = 0; row < dim; row++) {
        nextGenerationRow = [];
        nextGenerationGrid[row] = nextGenerationRow;

        for (var col = 0; col < dim; col++) {
            var liveNeighbors = 0;

            // Don't run off the edges of the grid
            var maxX = Math.min(row + 1, dim - 1);
            var minX = Math.max(0, row - 1);
            var maxY = Math.min(col + 1, dim - 1);
            var minY = Math.max(0, col - 1);

            // Loop through all its neighbors
            for (var x = minX; x <= maxX; x++) {
                for (var y = minY; y <= maxY; y++) {
                    var neighbor = $("tr").eq(x).find("td").eq(y);
                    // Don't count the cell itself
                    if (x != row || y != col) {
                        if (neighbor.hasClass("alive")) {
                            liveNeighbors++;
                        }
                    }
                }
            }

            if (liveNeighbors < 2 || liveNeighbors > 3) {
                nextGenerationRow[col] = "dead";
            } else if (liveNeighbors == 3) {
                nextGenerationRow[col] = "alive";
            } else {
                nextGenerationRow[col] = $("tr").eq(row).find("td").eq(col).attr("class");
            }
        }
    }

    for (var row = 0; row < dim; row++) {
        for (var col = 0; col < dim; col++) {
            $("tr").eq(row).find("td").eq(col).removeClass().addClass(nextGenerationGrid[row][col]);
        }
    }
}