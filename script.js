const turnInfoEl = document.querySelector("#turninfo")
const restartBtn = document.querySelector("#restartBtn")

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

	let board = Gameboard()

	let round = 1
	let activePlayer = players[ 0 ]
	let roundOver = false

	// swap players
	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[ 0 ] ? players[ 1 ] : players[ 0 ]
	}

	const getActivePlayer = () => activePlayer

	const setPlayerName = (index, name) => {
		players[index].name = name
	}

	// play round and switch active player if move was available
	const playRound = (row, column) => {
		const move = board.addMarker(row, column, activePlayer.marker)

		if (!move) {
			return
		}

		const boardArray = board.getBoard()

		// test every row if one is one marker
		boardArray.forEach((row) => {
			if (row.every(cell => cell.getValue() !== "" && cell.getValue() === row[ 0 ].getValue())) {
				roundOver = true
				playerWon(activePlayer)
				return
			}
		})

		// loop over each column to test if player has won
		for (let col = 0;col < boardArray[ 0 ].length;col++) {
			const column1 = boardArray[ 0 ][ col ].getValue()
			const column2 = boardArray[ 1 ][ col ].getValue()
			const column3 = boardArray[ 2 ][ col ].getValue()

			if (column1 === column2 && column1 === column3) {
				if (column1 === "" || column2 === "" || column3 === "") break
				roundOver = true
				playerWon(activePlayer)
				return
			}
		}

		// test if diagonals are same
		if (boardArray[ 1 ][ 1 ].getValue() === boardArray[ 0 ][ 0 ].getValue() && boardArray[ 1 ][ 1 ].getValue() === boardArray[ 2 ][ 2 ].getValue() && boardArray[ 1 ][ 1 ].getValue() !== "") {
			roundOver = true
			playerWon(activePlayer)
			return
		} else if (boardArray[ 1 ][ 1 ].getValue() === boardArray[ 0 ][ 2 ].getValue() && boardArray[ 1 ][ 1 ].getValue() === boardArray[ 2 ][ 0 ].getValue() && boardArray[ 1 ][ 1 ].getValue() !== "") {
			roundOver = true
			playerWon(activePlayer)
			return
		}

		// test if round is a tie
		if(round === 9 && !roundOver) {
			roundOver = true
			tieInfo()
			return
		}
		
		round++
		switchActivePlayer()
	}

	const renderBoard = () => {
		const gameTarget = document.querySelector("#game")
		gameTarget.innerHTML = ""
		board.getBoard().forEach((row, indexRow) => {
			const rowVisual = document.createElement("div")
			rowVisual.classList.add("row")

			row.forEach((cell, indexColumn) => {
				const cellVisual = document.createElement("div")
				cellVisual.classList.add("cell")
				if (cell.getValue() === "X") {
					cellVisual.classList.add("cross")
				} else if (cell.getValue() === "O") {
					cellVisual.classList.add("circle")
				}
				cellVisual.dataset.row = indexRow
				cellVisual.dataset.column = indexColumn
				cellVisual.addEventListener("click", (event) => { setMarker(event) })
				rowVisual.appendChild(cellVisual)
			})
			gameTarget.appendChild(rowVisual)
		})
	}

	const getGameStatus = () => roundOver

	const restartGame = () => {
		board = Gameboard()
		roundOver = false
		round = 1
		activePlayer = players[ 0 ]
		restartBtn.classList.add("hidden")
		turnInfo(activePlayer)
		renderBoard()
	}
	return {
		getActivePlayer,
		getGameStatus,
		playRound,
		renderBoard,
		setPlayerName,
		restartGame
	}
})("Player 1", "Player 2")



function setMarker(event) {
	if (GameController.getGameStatus()) return
	GameController.playRound(event.currentTarget.dataset.row, event.currentTarget.dataset.column)
	GameController.renderBoard()

	if (GameController.getGameStatus() === false) {
		turnInfo(GameController.getActivePlayer())
	} 
}

// render Board and show turn info once
GameController.renderBoard()
turnInfo(GameController.getActivePlayer())

// functions for showing turn/Win information
function turnInfo(player) {
	turnInfoEl.innerHTML = `It's ${player.name}'s ( ${player.marker} ) turn`
}
function tieInfo() {
	turnInfoEl.innerHTML = `It's a tie!`
	toggleRestartBtn()
}
function playerWon(player) {
	turnInfoEl.innerHTML = `${player.name} won the game!`
	toggleRestartBtn()
}

// inputlistener for playername-fields
document.querySelector("#player1Name").addEventListener("input", (event) => {
	GameController.setPlayerName(0, event.currentTarget.value)
	turnInfo(GameController.getActivePlayer())
})
document.querySelector("#player2Name").addEventListener("input", (event) => {
	GameController.setPlayerName(1, event.currentTarget.value)
	turnInfo(GameController.getActivePlayer())
})


// toggle class to hide/show restart button
function toggleRestartBtn() {
	restartBtn.classList.toggle("hidden")
}

restartBtn.addEventListener("click", () => {
	GameController.restartGame()
})
