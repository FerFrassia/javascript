//Image spliting into blocks
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var blockMatrix;
var lastID = 0;
var factor = 0.8;
var offsetX = 0;
var offsetY = 0;
var blockCount = 5;
var blockDist = 2;
var freeX = 0;
var freeY = 0;

var img = new Image();
img.onload = function() {
	if(window.innerWidth / img.width < window.innerHeight / img.innerHeight) { factor *= (window.innerHeight / img.height); }
	else { factor *= (window.innerHeight / img.height); }
	
	offsetX = (Math.abs(window.innerWidth - img.width * factor) - blockCount * blockDist) / 2;
	offsetY = (Math.abs(window.innerHeight - img.height * factor) - blockCount * blockDist) / 2;
	splitImg(img, blockCount);
	suffleBlockMatrix(blockCount);
	blockMatrixDraw(img, blockCount);
}
var pokemon = Math.floor(Math.random() * 9 + 1).toString();
while(pokemon.length < 3) {
	pokemon = "0" + pokemon;
}
img.src = "images/"+ pokemon + ".png";

function makeBlock(X, Y, Width, Height) {
	var block = {ID: lastID * factor, x: X, y: Y, width: Width, height: Height}
	lastID++;

	return block;
}

function splitImg(Image, Blocks) {
	blockMatrix = new Array();

	for(var i = 0; i < Blocks; i++) {
		blockMatrix[i] = new Array();

		for(var j = 0; j < Blocks; j++) {
			blockMatrix[i][j] = makeBlock(Image.width / Blocks * i, Image.height / Blocks * j, Image.width / Blocks, Image.height / Blocks);
		}

		j = 0;
	}

	return blockMatrix;
}

function blockMatrixDraw(Image, Blocks) {
	for(var i = 0; i < Blocks; i++) {

		for(var j = 0; j < Blocks; j++) {
			if(i != freeX || j != freeY) {
				blockDraw(Image, blockMatrix[i][j], i, j);
			}
			else {
				ctx.fillStyle = "#000";
				ctx.fillRect(
					blockMatrix[i][j].width * factor * i + blockDist * i + offsetX,
					blockMatrix[i][j].height * factor * j + blockDist * j + offsetY,
					blockMatrix[i][j].width * factor,
					blockMatrix[i][j].height * factor
				);
			}
		}

		j = 0;
	}
}

function blockDraw(Image, Block, I, J) {
	ctx.drawImage(Image, Block.x, Block.y, Block.width, Block.height,
		(I * Block.width * factor + blockDist * I + offsetX),
		(J * Block.height * factor + blockDist * J + offsetY),
		Block.width * factor, Block.height * factor);
}

function suffleBlockMatrix(Blocks) {
	for(var i = 0; i < 300; i++) {
		var randomKey = randomIntFromInterval(0,3);
		if (randomKey == 0 && freeX < blockCount - 1)
  			{ freeX = freeX + 1 % blockCount; swapBlocks(freeX, freeY, freeX - 1, freeY); }
  		else if (randomKey == 1 && freeX > 0) 	
  			{ freeX = freeX - 1 % blockCount; swapBlocks(freeX, freeY, freeX + 1, freeY); }
  		else if (randomKey == 2 && freeY > 0)
  			{ freeY = freeY - 1 % blockCount; swapBlocks(freeX, freeY, freeX, freeY + 1); }
  		else if (randomKey == 3 && freeY < blockCount - 1)
  			{ freeY = freeY + 1 % blockCount; swapBlocks(freeX, freeY, freeX, freeY - 1); }

	}
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function swapBlocks(I1, J1, I2, J2) {
	var tBlock = blockMatrix[I1][J1];
	blockMatrix[I1][J1] = blockMatrix[I2][J2];
	blockMatrix[I2][J2] = tBlock;
}

//aca se mueve el bloque (no esta terminado)
setInterval(update, 1000 / 60);

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	blockMatrixDraw(img, blockCount);
}

function onKey(evt) {
  if (evt.keyCode == 37 && freeX < blockCount - 1)
  	{ freeX = freeX + 1 % blockCount; swapBlocks(freeX, freeY, freeX - 1, freeY); }
  else if (evt.keyCode == 39 && freeX > 0) 	
  	{ freeX = freeX - 1 % blockCount; swapBlocks(freeX, freeY, freeX + 1, freeY); }
  else if (evt.keyCode == 40 && freeY > 0)
  	{ freeY = freeY - 1 % blockCount; swapBlocks(freeX, freeY, freeX, freeY + 1); }
  else if (evt.keyCode == 38 && freeY < blockCount - 1)
  	{ freeY = freeY + 1 % blockCount; swapBlocks(freeX, freeY, freeX, freeY - 1); }
}

document.addEventListener("keydown", onKey);