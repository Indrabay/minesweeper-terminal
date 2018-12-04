let app = require("./minesweeper")

test("check init board return true when length and width more than 0", () => {
  let actual = app.checkInitBoard(1,1)
  expect(actual).toEqual(true)
})

test("check init board return false when length is less than 1", () => {
  let actual = app.checkInitBoard(0,1)
  expect(actual).toEqual(false)
})

test("check init board return false when width is less than 1", () => {
  let actual = app.checkInitBoard(1, 0)
  expect(actual).toEqual(false)
})