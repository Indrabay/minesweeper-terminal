const readline = require("readline-sync")
const NEIGHBOR = [
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: 1 },
  { row: 1, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: -1 },
  { row: 0, col: -1 },
]

function initBoard(length, width) {
  let board = []
  for (let i = 0; i < length; i++) {
    board[i] = []
    for (let j = 0; j < width; j++) {
      board[i].push({
        isBomb: false,
        number: 0,
        isOpen: false,
        showBoard: "-",
        showCheat: "-"
      })
    }
  }

  return board
}

function initBomb(board, bombs) {
  let row = Math.floor(Math.random() * board.length)
  let col = Math.floor(Math.random() * board[0].length)
  while (bombs > 0) {
    if (board[row][col].isBomb == false) {
      board[row][col].isBomb = true
      board[row][col].showCheat = "*"
      bombs--
    } else {
      row = Math.floor(Math.random() * board.length)
      col = Math.floor(Math.random() * board[0].length)
    }
  }
}

function checkTile(board, row, col, isLoop = false) {
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
    return isLoop ? 1 : console.log("di luar papan")
  }

  if (board[row][col].isOpen === true) {
    return isLoop ? 1 : console.log("sudah dibuka")
  }

  if (board[row][col].isBomb === true) {
    return 4
  }

  let bombCount = 0
  NEIGHBOR.forEach(elm => {
    let newRow = row + elm.row
    let newCol = col + elm.col
    if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
      if (board[newRow][newCol].isBomb === true) {
        bombCount++
      }
    }
  })
  board[row][col].showBoard = bombCount
  board[row][col].isOpen = true
  if (bombCount !== 0) {
    return 1
  } else {
    NEIGHBOR.forEach(elm => {
      checkTile(board, row + elm.row, col + elm.col, true)
    })
  }

  return 1
}

function checkInitBoard(length, width) {
  return length >= 1 && width >= 1
}

function checkInitBomb(board, bombs) {
  return board.length * board[0].length - 2 >= bombs
}

function printBoard(board) {
  let stringToPrint = "$".padEnd(3, " ")
  for (let i = 0; i < board[0].length; i++) {
    stringToPrint += `${i + 1}`.padEnd(3, " ")
  }
  stringToPrint += "\n"
  for (let i = 0; i < board.length; i++) {
    stringToPrint += `${i + 1}`.padEnd(3, " ")
    for (let j = 0; j < board[0].length; j++) {
      stringToPrint += `${board[i][j].showBoard}`.padEnd(3, " ")
    }
    stringToPrint += "\n"
  }

  console.log(stringToPrint)
}

function countOpened(board) {
  let opened = 0
  board.forEach(elm => {
    elm.forEach(inElm => {
      if (inElm.isOpen === true) {
        opened++
      }
    })
  })

  return opened
}

function main() {
  // initialization game
  let boardBound = readline.question("Masukkan ukuran papan panjang, lebar: ")
  boardBound = boardBound.split(",")
  let statusBoard = checkInitBoard(Number(boardBound[0]), Number(boardBound[1]))
  // loop init board
  while (statusBoard === false) {
    boardBound = readline.question("Masukkan ukuran papan panjang, lebar: ")
    boardBound = boardBound.split(",")
    statusBoard = checkInitBoard(Number(boardBound[0]), Number(boardBound[1]))
  }
  let board = initBoard(Number(boardBound[0]), Number(boardBound[1]))

  let bombQuantity = readline.question("Masukkan jumlah bomb: ")
  let statusBomb = checkInitBomb(board, Number(bombQuantity))
  // loop init bomb
  while (statusBomb === false) {
    bombQuantity = readline.question("Masukkan jumlah bomb: ")
    statusBomb = checkInitBomb(board, Number(bombQuantity))
  }
  initBomb(board, Number(bombQuantity))

  // main loop
  let notEnd = true
  let bombs = Number(bombQuantity)
  while (notEnd) {
    printBoard(board)
    let coordinat = readline.question("Masukkan koordinat baris,colom: ")
    coordinat = coordinat.split(",")
    let statusTile = checkTile(board, Number(coordinat[0]), Number(coordinat[1]))
    if (statusTile === 4) {
      notEnd = false
      console.log("kalah")
    } else if (statusTile === 1) {
      let openedTile = countOpened(board)
      if (board.length * board[0].length - openedTile === bombs) {
        notEnd = false
        console.log("menang")
      }
    }
  }
}

let app = { initBoard, initBomb, checkInitBoard, checkInitBomb, countOpened, main }
module.exports = app