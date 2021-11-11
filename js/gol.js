var rows;
var cols;
var currGen;
var nextGen;
var started = false;
var timer;
var evolutionSpeed = 500;
var settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'), {
	backdrop: 'static',
	keyboard: false
});

function loadSetting() {
	rows = document.getElementById('rows').value;
	cols = document.getElementById('cols').value;
	currGen = [rows];
	nextGen = [rows];
	evolutionSpeed = document.getElementById('evolutionSpeed').value;
}

function cellClick() {
	let loc = this.id.split("_");
	let row = Number(loc[0]);
	let col = Number(loc[1]);
	if (this.className === 'alive') {
		this.setAttribute('class', 'dead');
		currGen[row][col] = 0;
	} else {
		this.setAttribute('class', 'alive');
		currGen[row][col] = 1;
	}
}

function createWorld() {
	let world = document.querySelector('#world');
	world.innerHTML = '';
	world.classList.add('table-responsive');
	world.classList.add('mt-3');
	let tbl = document.createElement('table');
	tbl.setAttribute('id', 'worldGridTable');
	tbl.setAttribute('class', 'table');
	let tbo = document.createElement('tbody');
	for (let i = 0; i < rows; i++) {
		let tr = document.createElement('tr');
		for (let j = 0; j < cols; j++) {
			let cell = document.createElement('td');
			cell.setAttribute('id', i + '_' + j);
			cell.setAttribute('class', 'dead');
			cell.addEventListener('click', cellClick);
			tr.appendChild(cell);
		}
		tbo.appendChild(tr);
	}
	tbl.appendChild(tbo);
	world.appendChild(tbl);
}

function createGenArrays() {
	for (let i = 0; i < rows; i++) {
		currGen[i] = new Array(cols);
		nextGen[i] = new Array(cols);
	}
}

function initGenArrays() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			currGen[i][j] = 0;
			nextGen[i][j] = 0;
		}
	}
}

function getNeighborCount(row, col) {
	let count = 0;
	let nrow = Number(row);
	let ncol = Number(col);
	if (nrow - 1 >= 0) {
		if (currGen[nrow - 1][ncol] == 1) {
			count++;
		}
	}
	if (nrow - 1 >= 0 && ncol - 1 >= 0) {
		if (currGen[nrow - 1][ncol - 1] == 1) {
			count++;
		}
	}
	if (nrow - 1 >= 0 && ncol + 1 < cols) {
		if (currGen[nrow - 1][ncol + 1] == 1) {
			count++;
		}
	}
	if (ncol - 1 >= 0) {
		if (currGen[nrow][ncol - 1] == 1) {
			count++;
		}
	}
	if (ncol + 1 < cols) {
		if (currGen[nrow][ncol + 1] == 1) {
			count++;
		}
	}
	if (nrow + 1 < rows && ncol - 1 >= 0) {
		if (currGen[nrow + 1][ncol - 1] == 1) {
			count++;
		}
	}
	if (nrow + 1 < rows && ncol + 1 < cols) {
		if (currGen[nrow + 1][ncol + 1] == 1) {
			count++;
		}
	}
	if (nrow + 1 < rows) {
		if (currGen[nrow + 1][ncol] == 1) {
			count++;
		}
	}
	return count;
}

function createNextGen() {
	for (row in currGen) {
		for (col in currGen[row]) {
			let neighbors = getNeighborCount(row, col);
			if (currGen[row][col] == 1) {
				if (neighbors < 2) {
					nextGen[row][col] = 0;
				} else if (neighbors == 2 || neighbors == 3) {
					nextGen[row][col] = 1;
				} else if (neighbors > 3) {
					nextGen[row][col] = 0;
				}
			} else if (currGen[row][col] == 0) {
				if (neighbors == 3) {
					nextGen[row][col] = 1;
				}
			}
		}
	}
}

function updateCurrGen() {
	for (row in currGen) {
		for (col in currGen[row]) {
			currGen[row][col] = nextGen[row][col];
			nextGen[row][col] = 0;
		}
	}
}

function updateWorld() {
	let cell = '';
	for (row in currGen) {
		for (col in currGen[row]) {
			cell = document.getElementById(row + '_' + col);
			if (currGen[row][col] == 0) {
				cell.setAttribute('class', 'dead');
			} else {
				cell.setAttribute('class', 'alive');
			}
		}
	}
}

function evolve() {
	createNextGen();
	updateCurrGen();
	updateWorld();
	if (started) {
		timer = setTimeout(evolve, evolutionSpeed);
	}
}

function startStopGol() {
	let startstop = document.querySelector('#startStopButton');
	if (!started) {
		started = true;
		startstop.value = 'Stop Reproducing';
		evolve();
	} else {
		started = false;
		startstop.value = 'Start Reproducing';
		clearTimeout(timer);
	}
}

function resetWorld() {
	if (started) {
		startStopGol();
	}
	initGenArrays();
	updateWorld();
}

function reloadWorld() {
	loadSetting();
	createWorld();
	createGenArrays();
	resetWorld();
}

document.querySelector('#startStopButton').addEventListener('click', startStopGol);
document.querySelector('#resetButton').addEventListener('click', resetWorld);
document.querySelector('#settingsButton').addEventListener('click', function() {
	settingsModal.show();
});
document.querySelector('#changeSettingsButton').addEventListener('click', function() {
	reloadWorld();
	settingsModal.hide();
});
window.onload = () => {
	reloadWorld();
}
