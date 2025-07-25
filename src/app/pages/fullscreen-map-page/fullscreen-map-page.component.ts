import { DecimalPipe, JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
  div {
    width: 100vw;
    height: calc( 100vh - 64px);
  }

  #controls{
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 36px;
      right: 11px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgb(0,0,0,0.1);
      border:1px solid #e2e8f0;
      width:250px;
    }
  
  `,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<maplibregl.Map | null>(null);

  zoom = signal(14);
  coordinates = signal({
    lng: -74.5,
    lat: 40,
  });

  zoomEffect = effect(() => {
    if (!this.map()) return;
    this.map()?.setZoom(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 90));

    const element = this.divElement()!.nativeElement;
    const { lng, lat } = this.coordinates();

    const map = new maplibregl.Map({
      container: element, // container id
      style: environment.mapbox.styleUrl, // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });
    this.mapListeners(map);
  }

  mapListeners(map: maplibregl.Map) {
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set(center);
    });

    map.addControl(new maplibregl.FullscreenControl());
    map.addControl(new maplibregl.NavigationControl());
    map.addControl(new maplibregl.ScaleControl());
    this.map.set(map);
  }
}
