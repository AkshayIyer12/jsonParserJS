var fs = require('fs')
var input = fs.readFileSync('example.txt', 'utf-8')

function objectParser(input) {
	
	if(input[0] !== '{') return null
	var obj_par = {} 
	input = input.slice(1)
	while(input[0] !== '}') {
		
		let res = stringParser(input)
		
		if(!res) return null
		let id = res[0]
		
		res = colonParser(res[1].slice())
		
		if(!res) return null
		res = basic_parser(res[1].slice())
		
		if(!res) return null
		obj_par[id] = res[0]
		console.log(obj_par)
		input = res[1].slice()
		
		res = commaParser(input)
		
		if(res)
			input = res[1].slice()
	}
	return [obj_par, input.slice(1)]
}
const colonParser = (input) => {
	let Index = input.search(/:?/g);
	if(Index === -1)
		return "";
	return ([input.slice(Index,Index+1), input.slice(Index+1,input.length)]);
}

//fails in using space parser
function arrayParser (input) {
	if(input[0] !== "[") return null
	var arr = []
	var res
	let commaFound
	let spaceFound
	input = input.slice(1)
	while(input.length){
		res = basic_parser(input)
		if(res === null) return null
		arr.push(res[0])
		input = res[1].slice()

		input = (spaceFound = spaceParser(input))? spaceFound[1] : input;
		

		if(input[0] === "]")
			return [arr, input.slice(1)]
		res = commaParser(input)
		

		
		if(res === null) return null
		input = res[1].slice()
	}
}

const nullParser = (input) => { 
	let spaceFound
	input = (spaceFound = spaceParser(input))? spaceFound[1] : input

	if(input.slice(0,4) === "null") { 
		return ([null, input.slice(4,input.length)])
	}
}

const numberParser = (input) => {
	let spaceFound;
	let data_length;
	let num;
	let regex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/
	input = (spaceFound = spaceParser(input))? spaceFound[1] : input
	let data = regex.exec(input)
	 if(data) return [parseFloat(data[0]), input.substring(data[0].length, input.length)] 
 } 
	
const boolParser = (input) => {
	let spaceFound
	input = (spaceFound = spaceParser(input))? spaceFound[1] : input
	if(input.slice(0,4) === "true")
		return ([true, input.slice(4,input.length)])
	else if(input.slice(0,5) === "false")
		return ([false, input.slice(5,input.length)])
	else
		return null;
}

const stringParser = (input) => {
	let i = 0
	let spaceFound
	input = (spaceFound = spaceParser(input))? spaceFound[1] : input
	if(input[0] === '"'){
		input = input.substring(1, input.length)
		i = input.search('"')
		return ([input.substring(0, i), input.slice(i+1, input.length)])
	}
	else
		return null
}

const spaceParser = (input) => { 
	let Index = input.search(/\s/);
	if(Index === -1)
		return ""
	else
		return [input.slice(Index, Index+1), input.slice(Index+1, input.length)]
}

const commaParser = (input) => {

	if(input[0] === ',') {
		return [input.slice(0,1), input.slice(1)]
	}
	else
		return null;
}
const squareBracketParser = (input) => {
	let i = 0;
	if(input[i] === '[')
		if(input[i+1] === ']')
			return ([input.slice(i, i+2), input.slice(i+2, input.length)])
		else
			return null;
	else
		return null;
}

const paranthesisParser = (input) => {
	let i = 0;
	if(input[i] === '{')
		if(input[i+1] === '}')
			return ([input.slice(i, i+2), input.slice(i+2, input.length)])
		else
			return null;
	else
		return null;
}

function basic_parser(input) {
	let parser
	if(parser = nullParser(input))
		return parser
	if(parser = numberParser(input))
		return parser
	if(parser = boolParser(input))
		return parser
	if(parser = squareBracketParser(input))
		return parser;
	if(parser = paranthesisParser(input))
		return parser;
	if(parser =  stringParser(input))
		return parser
	if(parser = arrayParser(input))
		return parser;
	if(parser = objectParser(input))
		return parser;
	else
		return null
}
console.log(objectParser(input));