import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogData } from '@models/general/dialog-data';

@Component({
  selector: 'app-work-location',
  templateUrl: './work-location.component.html',
  styleUrl: './work-location.component.scss'
})
export class WorkLocationComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  mapZoom = 14;
  mapCenter!: google.maps.LatLng;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  markerInfoContent = '';
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }

  ngOnInit(): void {
    if(this.data) {
      console.log(this.data);
      const point: google.maps.LatLngLiteral = {
        lat: this.data.userLocation[0],
        lng: this.data.userLocation[1],
      };
      console.log(point);
  
      this.mapCenter = new google.maps.LatLng(point);
      //this.map.panTo(point);
  
      // this.markerInfoContent = "I'm here!";
  
      this.markerOptions = {
        draggable: false,
        animation: google.maps.Animation.DROP,
      };
    }
    
  }
}
