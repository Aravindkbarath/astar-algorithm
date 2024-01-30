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

	sp = aStar(worldArray, hArray, [startX, startY], [endX, endY]);
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

function aStar(world, hArray, start, goal) {
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