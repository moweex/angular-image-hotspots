import {
  Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild
} from '@angular/core';

@Component({
  selector: 'img-map',
  styles: [
    '.img-map { position: relative; }',
    '.img-map svg { z-index: 10; }',
    '.img-map svg, .img-map img { position: absolute; top: 0; left: 0; }',
    '.img-map img { display: block; height: auto; max-width: 100%; }'
  ],
  template: `
    <div
      class="img-map"
      #container
      (window:resize)="onResize($event)"
    >
    <svg id="svgMarkers"></svg>
      <img
        #image
        [src]="src"
        (load)="onLoad($event)"
      >
    </div>
  `
})
export class ImgMapComponent {


  /**
   * Container element.
   */
  @ViewChild('container')
  private container: ElementRef;

  /**
  * SVG element.
  */
  @ViewChild('svg')
  private svg: ElementRef;

  /**
   * Image element.
   */
  @ViewChild('image')
  private image: ElementRef;

  /**
 * Whether to position markers in percentage or pixel values
 */
  @Input()
  isPercentage: boolean;


  @Input('urls')
  set setUrls(urls: string[]) {
    this.urls = urls;
    this.draw();
  }

  @Input('markers')
  set setMarkers(markers: number[][]) {
    this.markers = markers;
    this.draw();
  }

  @Input('titles')
  set setTitles(titles: string[]) {
    this.titles = titles;
    this.draw();
  }

  /**
   * Radius of the markers.
   */
  @Input()
  markerRadius: number;

  /**
   * Image source URL.
   */
  @Input()
  src: string;


  /**
   * Collection of markers.
   */
  private markers: number[][] = [];

  /**
   * Collection of titles.
   */
  private titles: string[] = [];


  /**
   * Collection of URLs
   */
  private urls: string[] = [];

  /**
   * Index of the hover state marker.
   */
  private markerHover: number = null;

  /**
   * Pixel position of markers.
   */
  private pixels: number[][] = [];

  /**
   * Index of the active state marker.
   */

  constructor(private renderer: Renderer) { }


  /**
   * Draw a marker.
   */
  private drawMarker(pixel: number[], title: string, url: string): void {
    const image: HTMLImageElement = this.image.nativeElement;
    const svg = document.getElementById('svgMarkers');
    const hyperlink = document.createElementNS('http://www.w3.org/2000/svg', 'a');
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svg.setAttribute('width', image.clientWidth + 'px');
    svg.setAttribute('height', image.clientHeight + 'px');

    if (this.isPercentage) {
      shape.cx.baseVal.value = pixel[0];
      shape.cy.baseVal.value = pixel[1];
      text.setAttribute('x', (pixel[0] + 15).toString());
      text.setAttribute('y', (pixel[1] + 5).toString());

    } else {
      shape.cx.baseVal.value = (pixel[0] / image.naturalWidth) * 100;
      shape.cy.baseVal.value = (pixel[1] / image.naturalHeight) * 100;
      text.setAttribute('x', ((pixel[0] / image.naturalWidth) * 100 + 15).toString());
      text.setAttribute('y', ((pixel[1] / image.naturalHeight) * 100 + 5).toString());
    }


    hyperlink.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url);
    svg.appendChild(hyperlink);

    shape.r.baseVal.value = this.markerRadius;
    shape.setAttribute('fill', 'red');
    hyperlink.appendChild(shape);

    text.setAttribute('fill', 'red');
    text.textContent = title;
    hyperlink.appendChild(text);
  }


  /**
   * Check if a position is inside a marker.
   */
  private insideMarker(pixel: number[], coordinate: number[]): boolean {
    return Math.sqrt(
      (coordinate[0] - pixel[0]) * (coordinate[0] - pixel[0])
      + (coordinate[1] - pixel[1]) * (coordinate[1] - pixel[1])
    ) < this.markerRadius;
  }

  /**
   * Convert a percentage position to a pixel position.
   */
  private markerToPixel(marker: number[]): number[] {
    const image: HTMLImageElement = this.image.nativeElement;

    return [
      (image.clientWidth / 100) * marker[0],
      (image.clientHeight / 100) * marker[1]
    ];
  }

  /**
   * Convert a pixel position to a percentage position.
   */
  private pixelToMarker(pixel: number[]): number[] {
    const image: HTMLImageElement = this.image.nativeElement;
    return [
      (pixel[0] / image.clientWidth) * 100,
      (pixel[1] / image.clientWidth) * 100
    ];
  }


  /**
   * Sets the marker pixel positions.
   */
  private setPixels(): void {
    this.pixels = [];
    this.markers.forEach(marker => {
      if (this.isPercentage) {
        this.pixels.push(this.markerToPixel(marker));
      } else {
        this.pixels.push(this.markerToPixel(marker));
      }
    });
  }

  /**
   * Clears the svg and draws the markers.
   */
  draw(): void {
    const container: HTMLDivElement = this.container.nativeElement;
    const image: HTMLImageElement = this.image.nativeElement;
    const height = image.clientHeight;
    const width = image.clientWidth;
    this.renderer.setElementStyle(container, 'height', `${height}px`);
    const svg = document.getElementById('svgMarkers');
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.firstChild);
    }
    this.setPixels();
    this.pixels.forEach((pixel, index) => {
      this.drawMarker(pixel, this.titles[index], this.urls[index]);
    });
  }

  onLoad(event: UIEvent): void {
    this.draw();
  }

  onResize(event: UIEvent): void {
    this.draw();
  }

}
