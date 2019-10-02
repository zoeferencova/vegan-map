var map;

const searchURL = 'https://www.vegguide.org/search/by-lat-long/'

//initializing map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 40.7128, lng: -74.0060},
	  zoom: 15
	});
	getDistanceAndCenter();
}

//getting location information from Vegguide API
function getLocations(distance, center) {
	fetch(`${searchURL}${center}?unit=mile;distance=${Math.ceil(distance)}`)
		.then(response => response.json())
		.then(responseJson => console.log(responseJson))
		.catch(err => {
			console.log(err)
		});
}

//calculating coordinates of map boundaries
function getDistanceAndCenter() {
	google.maps.event.addListener(map, 'bounds_changed', function() {
		//getting distance
		const bounds =  map.getBounds();
	  	const NE = bounds.getNorthEast();
		const SW = bounds.getSouthWest();
		const coordinates = [`${SW}`, `${NE}`];
		const fixed = coordinates.map(e => e.replace(/[{()}]/g, '')).map(e => e.split(', ')).flat();
		const arr = fixed.map(e => parseFloat(e));
		const latDistance = getDistanceFromCoordinatesToMiles(arr[2], arr[1], arr[0], arr[1]);
		const lonDistance = getDistanceFromCoordinatesToMiles(arr[0], arr[3], arr[0], arr[1]);
		let distance = ''
		if (latDistance >= lonDistance) {
			distance = latDistance;
		} else if (lonDistance > latDistance) {
			distance = lonDistance;
		}
		//getting center
		const latitude = map.getCenter().lat();
		const longitude = map.getCenter().lng();
		const center = `${latitude},${longitude}`
		getLocations(distance, center);
	})
}

//calculating distance in miles from coordinates
function getDistanceFromCoordinatesToMiles(lat1,lon1,lat2,lon2) {
  var R = 3963; // Radius of the earth in mi
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in mi
  return d;
}

//calculating radius from degrees for getDistanceFromLatLonInMiles function
function deg2rad(deg) {
  return deg * (Math.PI/180)
}



