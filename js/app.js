	var map;

    var markers = [];

    var populatedMarkers = [];

    function filterMarkers(area) {
    	var filteredArea = area;
           for (var i = 0; i < populatedMarkers.length; i++) {
              if(area == 'all') {
                populatedMarkers[i].setMap(map);
              }
              else if(populatedMarkers[i].region != area) {
                populatedMarkers[i].setMap(null);
              }
              else {
                populatedMarkers[i].setMap(map);
              }
          }
        }
				
	function initMap() {

  		map = new google.maps.Map(document.getElementById('map'), {
    		zoom: 8,
    		center: {lat: 34.489471, lng: -111.539270}
  		});

  		var largeInfowindow = new google.maps.InfoWindow();

		for (var i = 0; i < markers[0].length; i++) {
        	// Get the position from the location array.
          	var position = markers[0][i].location;
          	var title = markers[0][i].title;
          	var content = markers[0][i].content;
            var region = markers[0][i].region;
            var temp = markers[0][i].temp;
          	// Create a marker per location, and put into markers array.
          	var marker = new google.maps.Marker({
            	position: position,
            	title: title,
            	animation: google.maps.Animation.DROP,
            	map: map,
            	content: content,
                region: region,
                temp: temp,
            	id: 'marker' + i
          	});

          	marker.addListener('click', function(){
            	for (var i = 0; i < populatedMarkers.length; i++) {
                	populatedMarkers[i].setAnimation(null);
                 }
          			populateInfoWindow(this, largeInfowindow);	
          			this.setAnimation(google.maps.Animation.BOUNCE);
          	});

            populatedMarkers.push(marker);

      	}

      	var populateInfoWindow = function(marker, infowindow) {
      		if(infowindow.marker != marker) {
      			infowindow.marker = marker;
      			infowindow.setContent('<h3>' + marker.title + '</h3>' + '<strong>Elevation:</strong> ' + marker.content + '<br><strong>Current temperature:</strong> ' + marker.temp);
      			infowindow.open(map, marker);
      			infowindow.addListener('closeclick', function(){
      				marker.setAnimation(null);
      			});
      		}
      	};

		function toggleBounce() {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
  			} else {
    			marker.setAnimation(google.maps.Animation.BOUNCE);
  			}
		}
	};

	// Fetch example coding grabbed from https://davidwalsh.name/fetch
    var grabInfo = function(){
    	// Grab weather info from API
 		fetch(`http://api.openweathermap.org/data/2.5/group?id=4580599,5309135,5294810,5321098,5308938,5291033,5309842,5314943,5308305,5308164&units=imperial&appid=f30cffcda93575e8806bbe078ad1c70d`).then(function(response) { 
			return response.json();
		// Go through locations array and add current weather data
		}).then(function(data) {
			for (let i = 0; i < data.list.length; i++) {
				let currentTemp = data.list[i].main.temp;  
				locations[i]["temp"] = currentTemp + "°F";
			}
		// Initialize the map when the data from the API has been added to the locations array
		}).then(function(){
			initMap();
		// If there's an error, display an alert to the user and add "Not available" as the current temperature value in each locations array object, then initialize the map as normal
		}).catch(function(err) {
			alert("Temperature information could not be loaded. Please refresh or try again later.");
			for (let i = 0; i < locations.length; i++) {
				locations[i]["temp"] = "Not available";
			}
			initMap();
		});
		
	};
 
 	// All of the locations on our map
	let locations = [
        {title: 'Greer', content: '8,356 ft (2,547 m)', location: {lat: 34.010226, lng: -109.458579}, id: 0, region: 'east',},
        {title: 'Pinetop-Lakeside', content: '6,804 ft (2,074 m)', location: {lat: 34.142212, lng: -109.960963}, id: 1, region: 'east'},
        {title: 'Flagstaff', content: '6,910 ft (2,106 m)', location: {lat: 35.200755, lng: -111.663980}, id: 2, region: 'north'},
        {title: 'Williams', content: '6,766 ft (2,062 m)', location: {lat: 35.250340, lng: -112.191982}, id: 3, region: 'north'},
        {title: 'Pine', content: '5,369 ft (1,636 m)', location: {lat: 34.382255, lng: -111.462997}, id: 4, region: 'central'},
        {title: 'Cottonwood', content: '3,314 ft (1,010 m)', location: {lat: 34.739189, lng: -112.00988}, id: 5, region: 'central'},
        {title: 'Prescott', content: '5,368.23 ft (1,636 m)', location: {lat: 34.54002, lng: -112.468498}, id: 6, region: 'central'},
        {title: 'Snowflake', content: '5,682 ft (1,732 m)', location: {lat: 34.513371, lng: -110.078453}, id: 7, region: 'east'},
        {title: 'Payson', content: '4,890 ft (1,490 m)', location: {lat: 34.230869, lng: -111.325142}, id: 8, region: 'central'},
        {title: 'Parks', content: '7,079 ft (2,158 m)', location: {lat: 35.260571, lng: -111.948769}, id: 9, region: 'north'}
    ];

const ViewModel = function() {

	// Expand or retract sidebar
	this.expandSidebar = function(){
		let element = document.getElementById('sidebar');
          	if (element.classList.contains('show') == false) {
          		element.classList.add('show');
          	}
    		else {
    			element.classList.remove('show');
    		}
    };

    const self = this;

    // Creates an array to store markers that will be added/subtracted by the filters, make it an observable to monitor those changes
    self.visibleLocations = ko.observableArray();

    // Makes all points available again when a filter is applied, so the proper markers will always show up
    function resetArray(){
    	self.visibleLocations.splice.apply(self.visibleLocations, [0]);
    	self.visibleLocations.splice.apply(self.visibleLocations, [0, 0].concat(locations));
    };
   
   	// Grab location data from locations array and push it to the markers array to create map markers
    self.populateLocations = ko.computed(function(){
    	let points = locations.slice();
		markers.push(points);
    }, this);
  
    this.setLocation = function(id) {
    	google.maps.event.trigger(populatedMarkers[id], 'click');
    };

    // Controls options that appear in the drop-down menu
    this.changeArea = ko.observableArray(['All', 'Central Arizona', 'Eastern Arizona', 'Northern Arizona']);

    // Monitors which option is selected from the drop-down menu
    this.selectedArea = ko.observable();

    // Controls the filter function; shows or hides markers depending on their "region" values
    this.displayArea = ko.computed(function(){
    	let area;
    	if(this.selectedArea() == 'Central Arizona'){
            area = 'central';
			filterMarkers(area);
			resetArray();
			self.visibleLocations.remove(function (item) { return item.region != area; });
      	}
      	else if (this.selectedArea() == 'Eastern Arizona'){
      		area = 'east';
			filterMarkers(area);
			resetArray();
			self.visibleLocations.remove(function (item) { return item.region != area; });
      	} 
      	else if (this.selectedArea() == 'Northern Arizona'){
      		area = 'north';
			filterMarkers(area);
			resetArray();
			self.visibleLocations.remove(function (item) { return item.region != area; });
      	} 
      	else {
      		area = 'all';
			filterMarkers(area);
			resetArray();
      	}
      }, this);
}

ko.applyBindings(new ViewModel());



