import { element } from 'protractor';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { ImgMapComponent } from './ng2-img-map';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  results;
  hotspots;
  markersTitles: string[] = [];
  markersPositions: number[][] = [];
  markersUrls: string[] = ['#', '#', '#'];

  @ViewChild('imgMap')
  imgMap: ImgMapComponent;

  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.http.get('./assets/response.json').subscribe(data => {
      this.results = data;
      this.hotspots = this.results.data.content.hotspots.areas;
      this.hotspots.forEach(hotspot => {
        this.markersPositions.push([parseInt(hotspot.coords.slice(0, 3)), parseInt(hotspot.coords.slice(4, 7))]);
        this.markersTitles.push(hotspot.title);

      });
      this.imgMap.draw();
    },
      err => {
        console.log(err);
      });
  }

}
