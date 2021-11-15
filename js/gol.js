// Righe e colonne della tabella (mondo)
var rows;
var cols;
// 2D arrays
var currGen;
var nextGen;
// Viene settata a true quando viene avviata l'evoluzione
var started = false;
// Util per il loop di evoluzione
var timer;
// Durata del ciclo di evoluzione
var evolutionSpeed;
var settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'), {
	backdrop: 'static',
	keyboard: false
});

// Settaggio delle variabili principali utilizzando i valori della form di configurazione
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
	// Toggle viva o morta
	if (this.className === 'alive') {
		this.setAttribute('class', 'dead');
		currGen[row][col] = 0;
	} else {
		this.setAttribute('class', 'alive');
		currGen[row][col] = 1;
	}
}

// Creazione mondo (tabella)
function createWorld() {
	let world = document.querySelector('#world');
	world.innerHTML = '';
	world.classList.add('table-responsive');
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

// Creazione generazioni (corrente e nuova)
function createGenArrays() {
	for (let i = 0; i < rows; i++) {
		currGen[i] = new Array(cols);
		nextGen[i] = new Array(cols);
	}
}

// Creazione array dimensionali
function initGenArrays() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let ramdonValue = Math.round(Math.random() * 1);
			currGen[i][j] = ramdonValue;
			nextGen[i][j] = ramdonValue;
		}
	}
}

function getNeighborCount(row, col) {
	let count = 0;
	let nrow = Number(row);
	let ncol = Number(col);

	// SE NO prima riga
	if (nrow - 1 >= 0) {
		// Check cella sopra
		if (currGen[nrow - 1][ncol] == 1) {
			count++;
		}
		// SE NO prima colonna
		if (ncol - 1 >= 0) {
			// Check cella in alto sinistra
			if (currGen[nrow - 1][ncol - 1] == 1) {
				count++;
			}
		}

		// SE NO ultima colonna
		if (ncol + 1 < cols) {
			// Check cella in alto a destra
			if (currGen[nrow - 1][ncol + 1] == 1) {
				count++;
			}
		}
	}

	// SE NO ultima riga
	if (nrow + 1 < rows) {
		// Check cella sotto
		if (currGen[nrow + 1][ncol] == 1) {
			count++;
		}
		// SE NO prima colonna
		if (ncol - 1 >= 0) {
			// Check cella in basso a sinistra
			if (currGen[nrow + 1][ncol - 1] == 1) {
				count++;
			}
		}

		// SE NO ultima colonna
		if (ncol + 1 < cols) {
			// Check cella in basso a destra
			if (currGen[nrow + 1][ncol + 1] == 1) {
				count++;
			}
		}
	}

	// SE NO prima colonna
	if (ncol - 1 >= 0) {
		// Check cella a sinistra
		if (currGen[nrow][ncol - 1] == 1) {
			count++;
		}
	}

	// SE NO ultima colonna
	if (ncol + 1 < cols) {
		// Check cella a destra
		if (currGen[nrow][ncol + 1] == 1) {
			count++;
		}
	}

	return count;
}

function createNextGen() {
	for (row in currGen) {
		for (col in currGen[row]) {
			let neighbors = getNeighborCount(row, col);
			// Regole
			if (currGen[row][col] == 1) {
				// SE la cella è viva
				if (neighbors < 2) {
					nextGen[row][col] = 0;
				} else if (neighbors == 2 || neighbors == 3) {
					nextGen[row][col] = 1;
				} else if (neighbors > 3) {
					nextGen[row][col] = 0;
				}
			} else if (currGen[row][col] == 0) {
				// SE la cella è morta
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
			// Aggiornamento la generazione corrente con i dati della nuova
			currGen[row][col] = nextGen[row][col];
			// Reset della nuova generazione
			nextGen[row][col] = 0;
		}
	}
}

// Aggiornamento del mondo (tabella) sulla base della generazione corrente
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
	// Applicazione delle regole
	createNextGen();
	// Aggiornamento della generazione corrente sulla base della nuova
	updateCurrGen();
	// Aggiornamento del mondo (tabella)
	updateWorld();
	if (started) {
		// Set del loop di evoluzione
		timer = setTimeout(evolve, evolutionSpeed);
	}
}

// Start e Stop dell'evoluzione
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
	// SE l'evoluzione è in corso
	if (started) {
		// STOP
		startStopGol();
	}
	// Reset generazioni (corrente e nuova)
	createGenArrays();
	// Creazione array dimensionali
	initGenArrays();
	// Aggiornamento del mondo (tabella) sulla base della generazione corrente
	updateWorld();
}

function reloadWorld() {
	// Caricamento variabili di evoluzione
	loadSetting();
	// Creazione del mondo (tabella)
	createWorld();
	// Reset delle generazioni ed eventuale stop dell'evoluzione in corso
	resetWorld();
}

// Gestione degli eventi
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
