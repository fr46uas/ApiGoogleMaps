import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var google;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  @ViewChild('mapa', { static: false }) mapaElement: ElementRef;

  directionsService: any;
  directionsDisplay: any;

  map: any;

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {

        this.loadMap(position);
      });
    } else {
      alert('Ya la hemos liado');
    }
  }

  loadMap(position) {

    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();

    const mapProps = {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.HYBRID // ROADMAP, SATELLITE, TERRAIN
    };

    this.map = new google.maps.Map(document.getElementById('mapId'), mapProps);

    this.directionsDisplay.setMap(this.map);

    const marker = new google.maps.Marker({
      position: mapProps.center,
      title: 'Holiii'
    });

    marker.setMap(this.map);

    google.maps.event.addListener(this.map, 'click', (event) => {
      const newMarker = new google.maps.Marker({
        position: event.latLng,
        animation: google.maps.Animation.BOUNCE

      });
      newMarker.setMap(this.map);
    });

    let options = {

      types: ['address']
    };

    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('inputPlaces', options));

    autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace();
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());

      this.map.setCenter(place.geometry.location);

      const markerPlace = new google.maps.Marker({
        position: place.geometry.location
      });
      markerPlace.setMap(this.map);

    }.bind(this));

  }

  manejarClick() {
    let options = {
      origin: 'madrid, es',
      destination: 'sevilla, es',
      travelMode: google.maps.TravelMode.WALKING
    };

    this.directionsService.route(options, function (result, status) {
      console.log(result);

      this.directionsDisplay.setDirections(result);
    }.bind(this));
  }
}
