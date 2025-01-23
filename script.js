function Gameboard() {
	// Setup for width and height of board
	const rows = 3
	const columns = 3
	const board = []

	// create array of Cell objects
	for (let x = 0;x < rows;x++) {
		board[ x ] = []
		for (let y = 0;y < columns;y++) {
			board[ x ].push(Cell())
		}
	}

	const getBoard = () => board

	// output whole board to console
	const outputBoard = () => {
		const printedBoard = board.map((row) => row.map((cell) => cell.getValue()))
		console.log(printedBoard)
	}

	const addMarker = (row, column, playerMarker) => {
		const chosenCell = board[ row ][ column ]

		if (chosenCell.getValue() === "") {
			chosenCell.setValue(playerMarker)
			return true
		} else {
			return false
		}

	}

	return {
		getBoard,
		outputBoard,
		addMarker
	}
}

function Cell() {
	let value = ""

	// set value of cell
	const setValue = (player) => {
		value = player
	}

	// get value of cell
	const getValue = () => value

	return {
		getValue,
		setValue
	}
}

const GameController = (function (player1, player2) {
	// create player objects Array
	const players = [
		{
			name: player1,
			marker: "X"
		},
		{
			name: player2,
			marker: "O"
		}
	]

	const board = Gameboard()

	let activePlayer = players[ 0 ]

	// swap players
	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[ 0 ] ? players[ 1 ] : players[ 0 ]
	}

	const getActivePlayer = () => activePlayer

	// play round and switch active player if move was available
	const playRound = (row, column) => {
		if (board.addMarker(row, column, activePlayer.marker)) {
			switchActivePlayer()
		}



		board.outputBoard()
	}
	return {
		getActivePlayer,
		playRound
	}
})("Player 1", "Player 2")

