var tdSts = 0;
var start = 0;
var end = 0;
var wallArray = [];
var world = [];
var hArray = [];
var oldStart = $("#tempStart");
var oldEnd = $("#tempEnd");
var rows = 0;
var cols = 0;

function generateTable() {
	tdSts = 0;
	wallArray = [];
	world = [];
	hArray = [];
	$("#worldTable").html("");
	rows = $("#rows").val();
	cols = $("#cols").val();
	html = "";
	for (let i = 0; i < rows; i++) {
		rowHtml = $("<tr>", { class: "tr" });
		for (let j = 0; j < cols; j++) {
			colHtml = $("<td>", {
				class: "square-cell",
				onclick: "changeColor(this)",
				id: "unit" + (j + cols * i),
				'data-x': i, 
				'data-y': j, 
			});
			rowHtml.append(colHtml);
		}
		$("#worldTable").append(rowHtml);
	}
}

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
	lowTurn = $('#lowTurn').prop("checked");
	if(lowTurn)
		// sp = aStarLowTurn(worldArray, hArray, [startX, startY], [endX, endY]);
		// sp = aStar3(worldArray, hArray, [startX, startY], [endX, endY]);
		sp = aStar4(worldArray, hArray, [startX, startY], [endX, endY]);
	else
		sp = aStar(worldArray, hArray, [startX, startY], [endX, endY]);
	console.log(sp);
	for (let cell in sp) {
		unit = parseInt(sp[cell][1]) + parseInt(sp[cell][0] * cols);
		if (sp[cell][0] == startX && sp[cell][1] == startY) {
			$("#unit" + unit.toString()).css("background-color", "rgb(151 247 65)").css('border','3px solid blue');
		} else if (sp[cell][0] == endX && sp[cell][1] == endY) {
			$("#unit" + unit.toString()).css("background-color", "rgb(151 247 65)").css('border','3px solid red');
		} else {
			$("#unit" + unit.toString()).css("background-color", "rgb(151 247 65)");
		}
	}
}

function buildWorldAndHeuristicArray(wallArray, endX, endY) {
	for (let i = 0; i < rows; i++) {
		temp = [];
		temp1 = [];
		for (let j = 0; j < cols; j++) {
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

function aStar(worldAr, hArr, start, goal) {
	const openSet = [
		{
			row: start[0],
			col: start[1],
			g: 0,
			h: hArr[start[0]][start[1]],
			f: hArr[start[0]][start[1]],
		},
	];
	const closedSet = [];

	while (openSet.length > 0) {
		//node with lowest F and remove from openSet and add to closeSet
		const currentNode = openSet.reduce(
			(minNode, node) => (node.f < minNode.f ? node : minNode),
			openSet[0]
		);
		openSet.splice(openSet.indexOf(currentNode), 1);
		closedSet.push(currentNode);

		// if goal
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

		// neighbors for the current node
		const neighbors = [
			{ row: currentNode.row - 1, col: currentNode.col, g: currentNode.g + 1 },
			{ row: currentNode.row + 1, col: currentNode.col, g: currentNode.g + 1 },
			{ row: currentNode.row, col: currentNode.col - 1, g: currentNode.g + 1 },
			{ row: currentNode.row, col: currentNode.col + 1, g: currentNode.g + 1 },
		];

		// Filter out invalidNeighbors like walls
		const validNeighbors = neighbors.filter(
			(neighbor) =>
				neighbor.row >= 0 &&
				neighbor.row < worldAr.length &&
				neighbor.col >= 0 &&
				neighbor.col < worldAr[0].length &&
				worldAr[neighbor.row][neighbor.col] !== 1
		);

		for (const neighbor of validNeighbors) {
			// Skip if the neighbor is in the closed set
			if (
				closedSet.some(
					(node) => node.row === neighbor.row && node.col === neighbor.col
				)
			) {
				continue;
			}

			// Check if the neighbor is in the openSet
			const existingNode = openSet.some(
				(node) => node.row === neighbor.row && node.col === neighbor.col
			);
			if (!existingNode) {
				// Add the neighbor to the openSet
				neighbor.h = hArr[neighbor.row][neighbor.col];
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.parent = currentNode;
				openSet.push(neighbor);
			}
		}
	}

	// No path found
	return null;
}

function aStarLowTurn(worldAr, hArr, start, goal) {
	const openSet = [
		{
			row: start[0],
			col: start[1],
			g: 0,
			h: hArr[start[0]][start[1]],
			f: hArr[start[0]][start[1]],
			t: 0,
		},
	];
	openSet[0].parent = {
		row: -1,
		col: -1,
	};
	const closedSet = [];

	while (openSet.length > 0) {
		//node with lowest F and remove from openSet and add to closeSet
        // lowest turn too
		const currentNode = openSet.reduce(
			(minNode, node) => ( ((node.f <= minNode.f) && (node.t < minNode.t)) ? node : minNode),
			openSet[0]
		);
		openSet.splice(openSet.indexOf(currentNode), 1);
		closedSet.push(currentNode);

		// if goal
		if (currentNode.row === goal[0] && currentNode.col === goal[1]) {
			// Reconstruct the path from goal to start
			const path = [];
			let current = currentNode;
			// while ( !((current.row == -1) && (current.col == -1)) ) {   //while reached start point's parent -1,-1
			while ( !((current.row == start[0]) && (current.col == start[1])) ) {   //while reached start point's parent -1,-1
				path.unshift([current.row, current.col]);
				current = current.parent;
			}
			path.unshift(start);

			return path;
		}

		// neighbors for the current node
		const neighbors = [
			{ row: currentNode.row - 1, col: currentNode.col, g: currentNode.g + 1 },
			{ row: currentNode.row + 1, col: currentNode.col, g: currentNode.g + 1 },
			{ row: currentNode.row, col: currentNode.col - 1, g: currentNode.g + 1 },
			{ row: currentNode.row, col: currentNode.col + 1, g: currentNode.g + 1 },
		];

		// Filter out invalidNeighbors like walls
		const validNeighbors = neighbors.filter(
			(neighbor) =>
				neighbor.row >= 0 &&
				neighbor.row < worldAr.length &&
				neighbor.col >= 0 &&
				neighbor.col < worldAr[0].length &&
				worldAr[neighbor.row][neighbor.col] !== 1
		);

		for (const neighbor of validNeighbors) {
			// Skip if the neighbor is in the closed set
			if (
				closedSet.some(
					(node) => node.row === neighbor.row && node.col === neighbor.col
				)
			) {
				continue;
			}

			// Check if the neighbor is in the openSet
			const existingNode = openSet.some(
				(node) => node.row === neighbor.row && node.col === neighbor.col
			);
			if (!existingNode) {
				// Add the neighbor to the openSet
				neighbor.h = hArr[neighbor.row][neighbor.col];
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.t = currentNode.t;
				if((currentNode.parent).row != neighbor.row && (currentNode.parent).col != neighbor.col)
					neighbor.t = currentNode.t + 1;
				neighbor.parent = currentNode;
				openSet.push(neighbor);
			}
		}
		console.log(JSON.stringify(openSet,null,4))
	}

	// No path found
	return null;
}

function aStar3(worldAr, hArr, start, goal) {
	const openSet = [
		{
			row: start[0],
			col: start[1],
			g: 0,
			h: hArr[start[0]][start[1]],
			f: hArr[start[0]][start[1]],
		},
	];
	openSet[0].parent = {
		row: openSet[0].row-1,
		col: openSet[0].col,
	};
	const closedSet = [];

	while (openSet.length > 0) {
		//node with lowest F and remove from openSet and add to closeSet
		const currentNode = openSet.reduce(
			(minNode, node) => (node.f < minNode.f ? node : minNode),
			openSet[0]
		);
		openSet.splice(openSet.indexOf(currentNode), 1);
		closedSet.push(currentNode);
		console.log(openSet);

		// if goal
		if (currentNode.row === goal[0] && currentNode.col === goal[1]) {
			// Reconstruct the path from goal to start
			const path = [];
			let current = currentNode;
			while ( !((current.row == start[0]) && (current.col == start[1])) ) {
				path.unshift([current.row, current.col]);
				current = current.parent;
				// console.log(path)
			}
			path.unshift(start);
			return path;
		}

		// neighbors for the current node
		const neighbors = [
			{ row: currentNode.row - 1, col: currentNode.col, g: currentNode.g + 1 },
			{ row: currentNode.row + 1, col: currentNode.col, g: currentNode.g + 1 },
			{ row: currentNode.row, col: currentNode.col - 1, g: currentNode.g + 1 },
			{ row: currentNode.row, col: currentNode.col + 1, g: currentNode.g + 1 },
		];

		// Filter out invalidNeighbors like walls
		const validNeighbors = neighbors.filter(
			(neighbor) =>
				neighbor.row >= 0 &&
				neighbor.row < worldAr.length &&
				neighbor.col >= 0 &&
				neighbor.col < worldAr[0].length &&
				worldAr[neighbor.row][neighbor.col] !== 1
		);

		for (const neighbor of validNeighbors) {
			// Skip if the neighbor is in the closed set
			if (
				closedSet.some(
					(node) => node.row === neighbor.row && node.col === neighbor.col
				)
			) {
				continue;
			}

			// Check if the neighbor is in the openSet
			const existingNode = openSet.some(
				(node) => node.row === neighbor.row && node.col === neighbor.col
			);
			if (!existingNode) {
				// Add the neighbor to the openSet
				neighbor.h = hArr[neighbor.row][neighbor.col];
				if((currentNode.parent).row != neighbor.row && (currentNode.parent).col != neighbor.col)
					neighbor.g = neighbor.g + 0.5;
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.parent = currentNode;
				openSet.push(neighbor);
			}
		}
	}

	// No path found
	return null;
}


function aStar4(worldAr, hArr, start, goal) {
	const openSet = [
		{
			row: start[0],
			col: start[1],
			g: 0,
			h: hArr[start[0]][start[1]],
			f: hArr[start[0]][start[1]],
			dir : 2				//up-1, down-2, left-3, right-4
		},
	];
	openSet[0].parent = {
		row: openSet[0].row-1,
		col: openSet[0].col,
	};
	const closedSet = [];

	while (openSet.length > 0) {
		//node with lowest F and remove from openSet and add to closeSet
		const currentNode = openSet.reduce(
			(minNode, node) => (node.f < minNode.f ? node : minNode),
			openSet[0]
		);
		openSet.splice(openSet.indexOf(currentNode), 1);
		closedSet.push(currentNode);
		console.log(openSet);

		// if goal
		if (currentNode.row === goal[0] && currentNode.col === goal[1]) {
			// Reconstruct the path from goal to start
			const path = [];
			let current = currentNode;
			while ( !((current.row == start[0]) && (current.col == start[1])) ) {
				path.unshift([current.row, current.col]);
				current = current.parent;
				// console.log(path)
			}
			path.unshift(start);
			return path;
		}

		// neighbors for the current node
		const neighbors = [
			{ row: currentNode.row - 1, col: currentNode.col, g: currentNode.g + 1, dir: 1 },  // up
			{ row: currentNode.row + 1, col: currentNode.col, g: currentNode.g + 1, dir: 2 },  // down
			{ row: currentNode.row, col: currentNode.col - 1, g: currentNode.g + 1, dir: 3 },  // left
			{ row: currentNode.row, col: currentNode.col + 1, g: currentNode.g + 1, dir: 4 },  // right
		];

		// Filter out invalidNeighbors like walls
		const validNeighbors = neighbors.filter(
			(neighbor) =>
				neighbor.row >= 0 &&
				neighbor.row < worldAr.length &&
				neighbor.col >= 0 &&
				neighbor.col < worldAr[0].length &&
				worldAr[neighbor.row][neighbor.col] !== 1
		);

		for (const neighbor of validNeighbors) {
			// Skip if the neighbor is in the closed set
			if (
				closedSet.some(
					(node) => node.row === neighbor.row && node.col === neighbor.col
				)
			) {
				continue;
			}

			// Check if the neighbor is in the openSet
			const existingNode = openSet.some(
				(node) => node.row === neighbor.row && node.col === neighbor.col
			);
			if (!existingNode) {
				// Add the neighbor to the openSet
				neighbor.h = hArr[neighbor.row][neighbor.col];
				// if((currentNode.parent).row != neighbor.row && (currentNode.parent).col != neighbor.col)
				if(neighbor.dir != currentNode.dir)
					neighbor.g = neighbor.g + 0.5;
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.parent = currentNode;
				openSet.push(neighbor);
				unit = parseInt(neighbor.col) + parseInt(neighbor.row * cols);
				$("#unit" + unit.toString()).text(neighbor.g + ' , ' + neighbor.h)
			}
		}
	}

	// No path found
	return null;
}

function calculate_turns(current, next_position, goal){
    // Calculate direction from current to next position
	// current[0] = current[0]==-1 ? 0 : current[0];
	// current[1] = current[1]==-1 ? 0 : current[1];
    let dx1 = next_position[0] - current[0]
    let dy1 = next_position[1] - current[1]

    // Calculate direction from next position to the goal
    let dx2 = goal[0] - next_position[0]
    let dy2 = goal[1] - next_position[1]

    // Calculate the dot product of the directions
    let dot_product = dx1 * dx2 + dy1 * dy2

    // If dot product is negative, it means we have to take a turn
    // Otherwise, we're continuing straight
    if (dot_product > 0)
		num_turns = 0 
	else
		num_turns = 1
	
    return num_turns;
}

