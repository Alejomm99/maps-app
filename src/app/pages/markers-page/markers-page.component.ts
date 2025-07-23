import { JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import maplibregl, { LngLatLike } from 'maplibre-gl';
import { v4 as UUIDv4 } from 'uuid';
import { environment } from '../../../environments/environment';

interface Marker {
  id: string;
  maplibMarker: maplibregl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<maplibregl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 90));

    const element = this.divElement()!.nativeElement;

    const map = new maplibregl.Map({
      container: element, // container id
      style: environment.mapbox.styleUrl, // style URL
      center: [-75.541645, 6.232852], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    // const marker = new maplibregl.Marker({
    //   draggable:false,
    //   color:'#000'
    // })
    //   .setLngLat([-75.541645, 6.232852])
    //   .addTo(map);

    this.mapListeners(map);
  }

  mapListeners(map: maplibregl.Map) {
    map.on('click', (event) => {
      this.mapClick(event);
    });
    this.map.set(map);
  }
  mapClick(event: maplibregl.MapMouseEvent) {
    if (!this.map()) return;

    const map = this.map()!;
    const coords = event.lngLat;
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const maplibMarker = new maplibregl.Marker({
      color: color,
    })
      .setLngLat(coords)
      .addTo(map);

    const newMarker: Marker = {
      id: UUIDv4(),
      maplibMarker: maplibMarker,
    };

    // this.markers.set([newMarker, ...this.markers()])
    this.markers.update((markers) => [newMarker, ...markers]);
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;

    this.map()?.flyTo({
      center: lngLat,
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;

    const map = this.map();

    marker.maplibMarker.remove();

    this.markers.set(this.markers().filter((m) => m.id != marker.id));
  }
}
