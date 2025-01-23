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
		const move = board.addMarker(row, column, activePlayer.marker)
		if (!move) {
			return
		}
		const boardArray = board.getBoard()

		// test every row if one is one marker
		boardArray.map((row) => {
			if (row.every(cell => cell.getValue() !== "" && cell.getValue() === row[ 0 ].getValue())) {
				playerWon()
			}
		})

		// loop over each column to test if player has won
		for (let col = 0; col < boardArray[ 0 ].length;col++) {
			const column1 = boardArray[ 0 ][ col ].getValue()
			const column2 = boardArray[ 1 ][ col ].getValue()
			const column3 = boardArray[ 2 ][ col ].getValue()
			
			if (column1 === column2 && column1 === column3 ) {
				if (column1 === "" || column2 === "" || column3 === "") break
				playerWon()
			}
		}

		// test if diagonals are same
		if (boardArray[0][0].getValue() === boardArray[1][1].getValue() && boardArray[0][0].getValue() === boardArray[2][2].getValue() && boardArray[1][1].getValue() !== "") {
			console.log("diagonal down");
			
			playerWon()
		}
		if (boardArray[0][2].getValue() === boardArray[1][1].getValue() && boardArray[0][2].getValue() === boardArray[0][2].getValue() && boardArray[1][1].getValue() !== "") {
			console.log("diagonal up");
			playerWon()
		}
		switchActivePlayer()
		board.outputBoard()
	}

	const playerWon = () => {
		console.log("player won");
		
	}
	return {
		getActivePlayer,
		playRound
	}
})("Player 1", "Player 2")

