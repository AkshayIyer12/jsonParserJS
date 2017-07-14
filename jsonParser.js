var fs = require('fs')
var input = fs.readFileSync('example2.txt', 'utf-8')

function objectParser (input) {
  if (input[0] !== '{') return null
  var objPar = {}
  input = input.slice(1)
  var nth
  while (input[0] !== '}') {
    input = (nth = spaceParser(input)) ? nth[1] : input
    input = (nth = spaceParser(input)) ? nth[1] : input
    input = (nth = spaceParser(input)) ? nth[1] : input
    input = (nth = spaceParser(input)) ? nth[1] : input
    input = (nth = spaceParser(input)) ? nth[1] : input
    input = (nth = spaceParser(input)) ? nth[1] : input

    let result = stringParser(input)
    if (!result) return null
    let id = result[0]

    result[1] = (nth = spaceParser(result[1])) ? nth[1] : result[1]

    result = colonParser(result[1].slice())

    if (!result) return null
    result[1] = (nth = spaceParser(result[1])) ? nth[1] : result[1]

    result = basicParser(result[1].slice())

    result[1] = (nth = spaceParser(result[1])) ? nth[1] : result[1]

    if (!result) return null
    objPar[id] = result[0]

    input = result[1].slice()

    result = commaParser(input)

    if (result) { input = result[1].slice() }

    input = (nth = spaceParser(input)) ? nth[1] : input
  }
  return [objPar, input.slice(1)]
}
const colonParser = (input) => {
  let Index = input.search(/:?/g)
  if (Index === -1) { return '' }
  return ([input.slice(Index, Index + 1), input.slice(Index + 1, input.length)])
}

// fails in using space parser
function arrayParser (input) {
  if (input[0] !== '[') return null
  var arr = []
  var result
  let spaceFound
  input = input.slice(1)
  input = (spaceFound = spaceParser(input)) ? spaceFound[1] : input
  while (input.length) {
    result = basicParser(input)
    if (result === null) return null
    arr.push(result[0])
    input = result[1].slice()

    input = (spaceFound = spaceParser(input)) ? spaceFound[1] : input

    if (input[0] === ']') { return [arr, input.slice(1)] }
    result = commaParser(input)

    if (result === null) return null
    input = result[1].slice()
  }
}

const nullParser = (input) => {
  let spaceFound
  input = (spaceFound = spaceParser(input)) ? spaceFound[1] : input

  if (input.slice(0, 4) === 'null') {
    return ([null, input.slice(4, input.length)])
  }
}

const numberParser = (input) => {
  let spaceFound
  let regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/
  input = (spaceFound = spaceParser(input)) ? spaceFound[1] : input
  let data = regex.exec(input)
  if (data) return [parseFloat(data[0]), input.substring(data[0].length, input.length)]
}

const boolParser = (input) => {
  let spaceFound
  input = (spaceFound = spaceParser(input)) ? spaceFound[1] : input
  if (input.slice(0, 4) === 'true') { return ([true, input.slice(4, input.length)]) } if (input.slice(0, 5) === 'false') { return ([false, input.slice(5, input.length)]) } return null
}

const stringParser = (input) => {
  let i = 0
  let spaceFound
  let data
  data = (spaceFound = spaceParser(input)) ? spaceFound[1] : input

  if (data[0] === '"') {
    data = data.substring(1, data.length)
    i = data.search('"')
    return ([data.substring(0, i), data.slice(i + 1, data.length)])
  }
  return null
}

const spaceParser = (input) => {
  let Index = input.search(/(^\s)+/)

  if (Index === -1) { return '' } else { return [input.slice(Index, Index + 1), input.slice(Index + 1, input.length)] }
}

const commaParser = (input) => {
  if (input[0] === ',') return [input.slice(0, 1), input.slice(1)]
  return null
}
const squareBracketParser = (input) => {
  let i = 0
  if (input[i] === '[') {
    if (input[i + 1] === ']') { return ([input.slice(i, i + 2), input.slice(i + 2, input.length)]) } else { return null }
  } else { return null }
}

const paranthesisParser = (input) => {
  let i = 0
  if (input[i] === '{') {
    if (input[i + 1] === '}') { return ([input.slice(i, i + 2), input.slice(i + 2, input.length)]) } else { return null }
  } else { return null }
}
function basicParser (input) {
  if (nullParser(input)) return nullParser(input)
  if (numberParser(input)) return numberParser(input)
  if (boolParser(input)) return boolParser(input)
  if (squareBracketParser(input)) return squareBracketParser(input)
  if (paranthesisParser(input)) return paranthesisParser(input)
  if (stringParser(input)) return stringParser(input)
  if (arrayParser(input)) return arrayParser(input)
  if (objectParser(input)) return objectParser(input)
  return null
}
console.log(basicParser(input))
