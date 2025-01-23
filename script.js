function Gameboard() {
	// Setup for width and height of board
	const rows = 3
	const columns = 3
	const board = []

	// create array of Cell objects
	for (let x = 0; x < rows; x++) {
		board[x] = []
		for(let y = 0; y < columns; y++) {
			board[x].push(Cell())
		}
	}
	
	const getBoard = () => board

	const outputBoard = () => {
		const printedBoard = board.map((row) => row.map((cell) => cell.getValue()))
		console.log(printedBoard);
	}

	return {
		getBoard,
		outputBoard
	}
}

function Cell() {
	let value = " "

	// get value of cell
	const getValue = () => value 

	// set value of cell
	const setValue = (player) => {
		value = player
	}

	return {
		getValue,
		setValue
	}
}

Gameboard().outputBoard()

