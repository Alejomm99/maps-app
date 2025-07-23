import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import maplibregl from 'maplibre-gl';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
})
export class MiniMapComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  zoom = input<number>(14);
  lngLat = input.required<maplibregl.LngLatLike>();

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 90));

    const element = this.divElement()!.nativeElement;

    const map = new maplibregl.Map({
      container: element, // container id
      style: environment.mapbox.styleUrl, // style URL
      center: this.lngLat(), // starting position [lng, lat]
      zoom: this.zoom(),
      interactive: false,
      pitch: 79,
    });
    new maplibregl.Marker().setLngLat(this.lngLat()).addTo(map);
    map.addControl(new maplibregl.NavigationControl());
  }
}
