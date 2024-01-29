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
		temp = []
		temp.push(obj.data('x'))
		temp.push(obj.data('y'))
		wallArray.push(temp);
	}
}

function findPath() {
	startX = start.data("x");
	startY = start.data("y");
	endX = end.data("x");
	endY = end.data("y");
	[worldArray,hArray] = buildWorldAndHeuristicArray(wallArray,endX,endY);
	worldArray[startX][startY] = 1;
	rows = worldArray.length;
	cols = worldArray[0].length;
	// minF = rows*cols + (Math.abs(endX-startX+endY-startY));
	// minF = Number.MAX_SAFE_INTEGER;
	sp = shortPath(startX,startY,endX,endY);
}


function buildWorldAndHeuristicArray(wallArray,endX,endY) {
	world = [];
	hArray = [];
	for(let i=0;i<10;i++){
		temp = [];
		temp1 = [];
		for(let j=0;j<10;j++){
			temp.push(0);
			temp1.push(Math.abs(endX-i+endY-j));
		}
		world.push(temp);
		hArray.push(temp1);
	}

	wallArray.forEach(e => {
		world[e[0]][e[1]] = 1;
	});
	worldDup = world;
	return [world,hArray];
}

g = 0;
function explore(w,h,x,y){
	opened = [];
	if (x == 0){
		if (y>0 && y<cols-1){
			if( w[x][y+1] != 1 ){		//right
				o = moveRight(g,h,x,y);
				opened.push(o);
			}
			if( w[x+1][y] != 1 ){		//down
				o = moveDown(g,h,x,y);
				opened.push(o);
			}
			if( w[x][y-1] != 1 ){		//left
				o = moveLeft(g,h,x,y);
				opened.push(o);
			}
		}
		else if(y == 0){
			if( w[x][y+1] != 1 ){		//right
				o = moveRight(g,h,x,y);
				opened.push(o);
			}
			if( w[x+1][y] != 1 ){		//down
				o = moveDown(g,h,x,y);
				opened.push(o);
			}
		}
		else{
			if( w[x+1][y] != 1 ){		//down
				o = moveDown(g,h,x,y);
				opened.push(o);
			}
			if( w[x][y-1] != 1 ){		//left
				o = moveLeft(g,h,x,y);
				opened.push(o);
			}
		}
	}
	else if(x==rows-1){
		if (y>0 && y<cols-1){
			if( w[x-1][y] != 1 ){		//up
				o = moveUp(g,h,x,y);
				opened.push(o);
			}
			if( w[x][y-1] != 1 ){		//left
				o = moveLeft(g,h,x,y);
				opened.push(o);
			}
			if( w[x][y+1] != 1 ){		//right
				o = moveRight(g,h,x,y);
				opened.push(o);
			}
		}
		else if(y==0){
			if( w[x-1][y] != 1 ){		//up
				o = moveUp(g,h,x,y);
				opened.push(o);
			}
			if( w[x][y+1] != 1 ){		//right
				o = moveRight(g,h,x,y);
				opened.push(o);
			}
		}
		else{
			if( w[x-1][y] != 1 ){		//up
				o = moveUp(g,h,x,y);
				opened.push(o);
			}
			if( w[x][y-1] != 1 ){		//left
				o = moveLeft(g,h,x,y);
				opened.push(o);
			}
		}
	}
	else if(y==0){
		if (x>0 && x<rows-1){
			if( w[x-1][y] != 1 ){		//up
				o = moveUp(g,h,x,y);
				opened.push(o);
			}
			if( w[x+1][y] != 1 ){		//down
				o = moveDown(g,h,x,y);
				opened.push(o);
			}
			if( w[x][y+1] != 1 ){		//right
				o = moveRight(g,h,x,y);
				opened.push(o);
			}
		}
	}
	else if(y==cols-1){
		if (x>0 && x<rows-1){
			if( w[x+1][y] != 1 ){		//down
				o = moveDown(g,h,x,y);
				opened.push(o);
			}
			if( w[x][y-1] != 1 ){		//left
				o = moveLeft(g,h,x,y);
				opened.push(o);
			}
			if( w[x-1][y] != 1 ){		//up
				o = moveUp(g,h,x,y);
				opened.push(o);
			}
		}
	}
	else{
		if( w[x+1][y] != 1 ){		//down
			o = moveDown(g,h,x,y);
			opened.push(o);
		}
		if( w[x][y+1] != 1 ){		//right
			o = moveRight(g,h,x,y);
			opened.push(o);
		}
		if( w[x-1][y] != 1 ){		//up
			o = moveUp(g,h,x,y);
			opened.push(o);
		}
		if( w[x][y-1] != 1 ){		//left
			o = moveLeft(g,h,x,y);
			opened.push(o);
		}
	}
	g+=1;
	return opened;
}

function moveRight(g,h,x,y){
	o = {}
	o['g'] = g+1; 
	o['h'] = h[x][y+1]; 
	o['f'] = o['g']+o['h']; 
	o['x'] = x;
	o['y'] = y + 1;
	o['v'] = 0;
	o['fromX'] = x;
	o['fromY'] = y;
	console.log('moved Right');
	return o;
}
function moveLeft(g,h,x,y){
	o = {};
	o['g'] = g+1; 
	o['h'] = h[x][y-1]; 
	o['f'] = o['g']+o['h']; 
	o['x'] = x;
	o['y'] = y - 1;
	o['v'] = 0;
	o['fromX'] = x;
	o['fromY'] = y;
	console.log('moved Left');
	return o;
}
function moveUp(g,h,x,y){
	o={}
	o['g'] = g+1; 
	o['h'] = h[x-1][y]; 
	o['f'] = o['g']+o['h']; 
	o['x'] = x-1;
	o['y'] = y;
	o['v'] = 0;
	o['fromX'] = x;
	o['fromY'] = y;
	console.log('moved Up');
	return o;
}
function moveDown(g,h,x,y){
	o = {}
	o['g'] = g+1; 
	o['h'] = h[x+1][y]; 
	o['f'] = o['g']+o['h']; 
	o['x'] = x+1;
	o['y'] = y;
	o['v'] = 0;
	o['fromX'] = x;
	o['fromY'] = y;
	console.log('moved Down');
	return o;
}

var br = 1;
var open2 = [];
var tempCell = {};
var iter = 0;
function shortPath(x,y,endX,endY){
	console.log(open2);
	if(x==endX && y==endY){
		br = 0;
	}
	if(br){
		explored = explore(worldDup,hArray,x,y);
		explored.forEach(e=>{
			open2.push(e);
		});
		console.log(open2);
		i = open2.indexOf(tempCell);
		open2.splice(i,1);
		if(iter==1)
			br = 0;
		// open2 = open2.filter(function(val, i) {
		// 	return val['x']!=tempCell['x'] && val['y']!=tempCell['y'];
		// })
		
		minF = Number.MAX_SAFE_INTEGER;
		open2.forEach(e => {
			if(e['f']<minF){
				tempCell = e;
				minF = e['f']
			}
			worldDup[e['x']][e['y']] = e;
		});
		tempCell['v'] = 1;
		worldDup[tempCell['x']][tempCell['y']] = 1;
		iter+=1;
		// shortPath(tempCell['x'],tempCell['y'],endX,endY);
	}
	
}