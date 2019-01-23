var fs = require('fs');
var file = 'big.txt';
var request = require('request');
var url = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-ru&text=';
var initialisePromise;
fs.readFile(file, 'utf8', function (err, data) {

  if (err) throw err;

  var wordsArray = splitWords(data);
  var wordsMap = createWordMap(wordsArray);
  var wordsArr = sortByCount(wordsMap);
 console.log("The top 10 words with maximum occurrences are: ")
	for(var i=0;i<11;i++){
		//there is an error collecting details for was from the API, hence we are ignoring the value
		if(wordsArr[i].name=='was'){continue;}
	initialisePromise = fetchValue(wordsArr[i]);
	initialisePromise.then(function(result){
		console.log(result)
	},function(err){
		console.log(err)
	})
   }
 });


function splitWords (text) {
  // split string by spaces (including spaces, tabs, and newlines)
  var wordsArray = text.split(/\s+/);
  return wordsArray;
}


function createWordMap (wordsArray) {

  // create map for word counts
  var wordsMap = {};
  wordsArray.forEach(function (key) {
    if (wordsMap.hasOwnProperty(key)) {
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;

}


function sortByCount (wordsMap) {

  // sort by count in descending order
  var wordsArr = [];
  wordsArr = Object.keys(wordsMap).map(function(key) {
    return {
      name: key,
      total: wordsMap[key]
    };
  });

  wordsArr.sort(function(a, b) {
    return b.total - a.total;
  });

  return wordsArr;

}

function fetchValue(value){
	console.log(value)
	return new Promise(function(resolve,reject){
		//request to get the details from the dictionary
	request(url+value.name, function (error, response, body) {
		if(error) throw error
		else{
			let result = JSON.parse(body);
			let obj = {
				"word" : value.name,
				"totalCount" : value.total,
				"partOfSpeech" : result.def[0].pos,
				"synonym" : JSON.stringify(result.def[0].tr[0].mean)
			}
			resolve(obj);
			
		}
	})
	})
}
   

