var tdSts = 0;
var start = 0;
var end = 0;
const wallArray = [];
var world = [];
var hArray = [];
var oldStart = $("#tempStart");
var oldEnd = $("#tempEnd");
var rows = 0;
var cols = 0;
var minF = 0;

function startCell() {
	tdSts = 1;
}
function wallCell() {
	tdSts = 5;
}
function endCell() {
	tdSts = 10;
}
function changeColor(obj) {
	obj = $(obj);
	if (tdSts == 1) {
		oldStart.css("background-color", "transparent");
		obj.css("background-color", "blue");
		oldStart = obj;
		start = obj;
	} else if (tdSts == 10) {
		oldEnd.css("background-color", "transparent");
		obj.css("background-color", "red");
		oldEnd = obj;
		end = obj;
	} else if (tdSts == 5) {
		obj.css("background-color", "black");
		temp = [];
		temp.push(obj.data("x"));
		temp.push(obj.data("y"));
		wallArray.push(temp);
	}
}

function findPath() {
	startX = start.data("x");
	startY = start.data("y");
	endX = end.data("x");
	endY = end.data("y");
	[worldArray, hArray] = buildWorldAndHeuristicArray(wallArray, endX, endY);
	worldArray[startX][startY] = 1;
	rows = worldArray.length;
	cols = worldArray[0].length;
	// minF = rows*cols + (Math.abs(endX-startX+endY-startY));
	// minF = Number.MAX_SAFE_INTEGER;

	// sp = shortPath(startX,startY,endX,endY);
	sp = aStarGPT(worldArray, hArray, [startX, startY], [endX, endY]);
	console.log(sp);
	for (let cell in sp){
		unit = sp[cell][1]+sp[cell][0]*rows;
		if(sp[cell][0] == startX && sp[cell][1] == startY){
			$('#unit' + (unit).toString()).css("background-color", "green").css('border', '5px solid blue');
		}
		else if(sp[cell][0] == endX && sp[cell][1] == endY){
			$('#unit' + (unit).toString()).css("background-color", "green").css('border', '5px solid red');
		}
		else{
			$('#unit' + (unit).toString()).css("background-color", "green");
		}
	}
}

function buildWorldAndHeuristicArray(wallArray, endX, endY) {
	for (let i = 0; i < 10; i++) {
		temp = [];
		temp1 = [];
		for (let j = 0; j < 10; j++) {
			temp.push(0);
			temp1.push(Math.abs(endX - i + endY - j));
		}
		world.push(temp);
		hArray.push(temp1);
	}

	wallArray.forEach((e) => {
		world[e[0]][e[1]] = 1;
	});
	worldDup = world;
	return [world, hArray];
}

g = 0;
function explore(w, h, x, y) {
	opened = [];
	if (x == 0) {
		if (y > 0 && y < cols - 1) {
			if (w[x][y + 1] != 1) {
				//right
				o = moveRight(g, h, x, y);
				opened.push(o);
			}
			if (w[x + 1][y] != 1) {
				//down
				o = moveDown(g, h, x, y);
				opened.push(o);
			}
			if (w[x][y - 1] != 1) {
				//left
				o = moveLeft(g, h, x, y);
				opened.push(o);
			}
		} else if (y == 0) {
			if (w[x][y + 1] != 1) {
				//right
				o = moveRight(g, h, x, y);
				opened.push(o);
			}
			if (w[x + 1][y] != 1) {
				//down
				o = moveDown(g, h, x, y);
				opened.push(o);
			}
		} else {
			if (w[x + 1][y] != 1) {
				//down
				o = moveDown(g, h, x, y);
				opened.push(o);
			}
			if (w[x][y - 1] != 1) {
				//left
				o = moveLeft(g, h, x, y);
				opened.push(o);
			}
		}
	} else if (x == rows - 1) {
		if (y > 0 && y < cols - 1) {
			if (w[x - 1][y] != 1) {
				//up
				o = moveUp(g, h, x, y);
				opened.push(o);
			}
			if (w[x][y - 1] != 1) {
				//left
				o = moveLeft(g, h, x, y);
				opened.push(o);
			}
			if (w[x][y + 1] != 1) {
				//right
				o = moveRight(g, h, x, y);
				opened.push(o);
			}
		} else if (y == 0) {
			if (w[x - 1][y] != 1) {
				//up
				o = moveUp(g, h, x, y);
				opened.push(o);
			}
			if (w[x][y + 1] != 1) {
				//right
				o = moveRight(g, h, x, y);
				opened.push(o);
			}
		} else {
			if (w[x - 1][y] != 1) {
				//up
				o = moveUp(g, h, x, y);
				opened.push(o);
			}
			if (w[x][y - 1] != 1) {
				//left
				o = moveLeft(g, h, x, y);
				opened.push(o);
			}
		}
	} else if (y == 0) {
		if (x > 0 && x < rows - 1) {
			if (w[x - 1][y] != 1) {
				//up
				o = moveUp(g, h, x, y);
				opened.push(o);
			}
			if (w[x + 1][y] != 1) {
				//down
				o = moveDown(g, h, x, y);
				opened.push(o);
			}
			if (w[x][y + 1] != 1) {
				//right
				o = moveRight(g, h, x, y);
				opened.push(o);
			}
		}
	} else if (y == cols - 1) {
		if (x > 0 && x < rows - 1) {
			if (w[x + 1][y] != 1) {
				//down
				o = moveDown(g, h, x, y);
				opened.push(o);
			}
			if (w[x][y - 1] != 1) {
				//left
				o = moveLeft(g, h, x, y);
				opened.push(o);
			}
			if (w[x - 1][y] != 1) {
				//up
				o = moveUp(g, h, x, y);
				opened.push(o);
			}
		}
	} else {
		if (w[x + 1][y] != 1) {
			//down
			o = moveDown(g, h, x, y);
			opened.push(o);
		}
		if (w[x][y + 1] != 1) {
			//right
			o = moveRight(g, h, x, y);
			opened.push(o);
		}
		if (w[x - 1][y] != 1) {
			//up
			o = moveUp(g, h, x, y);
			opened.push(o);
		}
		if (w[x][y - 1] != 1) {
			//left
			o = moveLeft(g, h, x, y);
			opened.push(o);
		}
	}
	g += 1;
	return opened;
}

function moveRight(g, h, x, y) {
	o = {};
	o["g"] = g + 1;
	o["h"] = h[x][y + 1];
	o["f"] = o["g"] + o["h"];
	o["x"] = x;
	o["y"] = y + 1;
	o["v"] = 0;
	o["fromX"] = x;
	o["fromY"] = y;
	console.log("moved Right");
	return o;
}
function moveLeft(g, h, x, y) {
	o = {};
	o["g"] = g + 1;
	o["h"] = h[x][y - 1];
	o["f"] = o["g"] + o["h"];
	o["x"] = x;
	o["y"] = y - 1;
	o["v"] = 0;
	o["fromX"] = x;
	o["fromY"] = y;
	console.log("moved Left");
	return o;
}
function moveUp(g, h, x, y) {
	o = {};
	o["g"] = g + 1;
	o["h"] = h[x - 1][y];
	o["f"] = o["g"] + o["h"];
	o["x"] = x - 1;
	o["y"] = y;
	o["v"] = 0;
	o["fromX"] = x;
	o["fromY"] = y;
	console.log("moved Up");
	return o;
}
function moveDown(g, h, x, y) {
	o = {};
	o["g"] = g + 1;
	o["h"] = h[x + 1][y];
	o["f"] = o["g"] + o["h"];
	o["x"] = x + 1;
	o["y"] = y;
	o["v"] = 0;
	o["fromX"] = x;
	o["fromY"] = y;
	console.log("moved Down");
	return o;
}

var br = 1;
var tempCell = {};
var iter = 0;
open2 = [];
closed = [];
function shortPath(x, y, endX, endY) {
	if (x == endX && y == endY) {
		br = 0;
	}
	if (br) {
		explored = explore(worldDup, hArray, x, y);
		explored.forEach((e) => {
			open2.push(e);
		});
		i = open2.indexOf(tempCell);
		console.log(tempCell);
		if (i != -1) {
			open2.splice(i, 1);
			// closed.push(tempCell);
		}
		// if(iter==1)
		// 	br = 0;

		minF = Number.MAX_SAFE_INTEGER;
		open2.forEach((e) => {
			if (e["f"] < minF) {
				tempCell = e;
				minF = e["f"];
			}
			worldDup[e["x"]][e["y"]] = e;
		});
		tempCell["v"] = 1;
		world[tempCell["x"]][tempCell["y"]] = 1;
		iter += 1;
		shortPath(tempCell["x"], tempCell["y"], endX, endY);
	}
	return 1;
}

function aStarGPT(world, hArray, start, goal) {
	const openSet = [
		{
			row: start[0],
			col: start[1],
			g: 0,
			h: hArray[start[0]][start[1]],
			f: hArray[start[0]][start[1]],
		},
	];
	const closedSet = [];

	while (openSet.length > 0) {
		// Find the node with the lowest f value in the open set
		const currentNode = openSet.reduce(
			(minNode, node) => (node.f < minNode.f ? node : minNode),
			openSet[0]
		);

		// Remove the current node from the open set
		openSet.splice(openSet.indexOf(currentNode), 1);

		// Add the current node to the closed set
		closedSet.push(currentNode);

		// Check if the current node is the goal
		if (currentNode.row === goal[0] && currentNode.col === goal[1]) {
			// Reconstruct the path from goal to start
			const path = [];
			let current = currentNode;
			while (typeof current != "undefined") {
				path.unshift([current.row, current.col]);
				current = current.parent;
			}
			return path;
		}

		// Generate neighbors for the current node
		const neighbors = [
			{ row: currentNode.row - 1, col: currentNode.col, g: currentNode.g + 1 },
			{ row: currentNode.row + 1, col: currentNode.col, g: currentNode.g + 1 },
			{ row: currentNode.row, col: currentNode.col - 1, g: currentNode.g + 1 },
			{ row: currentNode.row, col: currentNode.col + 1, g: currentNode.g + 1 },
		];

		// Filter out neighbors outside the world or on obstacles
		const validNeighbors = neighbors.filter(
			(neighbor) =>
				neighbor.row >= 0 &&
				neighbor.row < world.length &&
				neighbor.col >= 0 &&
				neighbor.col < world[0].length &&
				world[neighbor.row][neighbor.col] !== 1
		);

		// Iterate through neighbors
		for (const neighbor of validNeighbors) {
			// Skip if the neighbor is in the closed set
			if (
				closedSet.some(
					(node) => node.row === neighbor.row && node.col === neighbor.col
				)
			) {
				continue;
			}

			// Check if the neighbor is in the open set or has a lower g score
			const existingNode = openSet.find(
				(node) => node.row === neighbor.row && node.col === neighbor.col
			);
			if (!existingNode || neighbor.g < existingNode.g) {
				// Update or add the neighbor to the open set
				if (!existingNode) {
					neighbor.h = hArray[neighbor.row][neighbor.col];
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.parent = currentNode;
					openSet.push(neighbor);
				} else {
					existingNode.g = neighbor.g;
					existingNode.f = neighbor.g + existingNode.h;
					existingNode.parent = currentNode;
				}
			}
		}
	}

	// No path found
	return null;
}
