var express = require('express');
var request =  require('request');
var app = express();

var router = express.Router();

router.get('/', function(req, res){
	request.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',function(error, response, body){
		//res.json(body);
		let featureData= [];
		//console.log(err, res, body);
		let data = JSON.parse(body);
		for (let i = 0; i < data.features.length; i++){
			if(data.features[i].properties.place.slice(-2) === 'CA'){
				featureData.push(data.features[i]);
			}
		}
		res.render('index.jade',{'data':quickSort(featureData,0,(featureData.length-1)), 'moment':require('moment')});
	})
});


function quickSort(arr, left, right){
   var len = arr.length, 
   pivot,
   partitionIndex;


  if(left < right){
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right);
    
   //sort left and right
   quickSort(arr, left, partitionIndex - 1);
   quickSort(arr, partitionIndex + 1, right);
  }
  return arr;
}
function partition(arr, pivot, left, right){
   var pivotValue = arr[pivot].properties.time,
       partitionIndex = left;

   for(var i = left; i < right; i++){
    if(arr[i].properties.time < pivotValue){
      swap(arr, i, partitionIndex);
      partitionIndex++;
    }
  }
  swap(arr, right, partitionIndex);
  return partitionIndex;
}
function swap(arr, i, j){
   var temp = arr[i].properties.time;
   arr[i].properties.time = arr[j].properties.time;
   arr[j].properties.time = temp;
}



app.use('/', router);


var PORT = process.env.port || 3001;

app.listen(PORT,function(){
    console.log('Server is running on PORT'+PORT);
})