<script lang="ts">
  import customIcon from '$lib/shared/leaflet/custom-icon';
  import { markerStore } from '$lib/shared/store/marker.store';
  import L, { type LatLngBoundsExpression } from 'leaflet';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import MapPopup from './MapPopup.svelte';
  import type Marker from '$lib/types/marker.model';
  import { PUBLIC_THUNDERFOREST_API_KEY } from '$env/static/public';

  let map: L.Map | null = null;
  let transportLayer: L.TileLayer | null = null;
  let showTransport: boolean = false;

  const legendItems = [
    { icon: '/gyros.jpg', text: 'Restaurants' },
    { icon: '/red-dot-icon.svg', text: 'You' }
  ];

  onMount(() => {
    map = L.map('map').setView([47.4979, 19.0402], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    transportLayer = L.tileLayer(
      `https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${PUBLIC_THUNDERFOREST_API_KEY}`,
      {
        attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, OpenStreetMap contributors'
      }
    );

    if (!map) return;

    var budapestBounds: LatLngBoundsExpression = [
      [47.6133, 18.8967],
      [47.3325, 19.3333]
    ];

    map.setMaxBounds(budapestBounds);

    map.on('drag', () => map!.panInsideBounds(budapestBounds, { animate: false }));

    get(markerStore).markers.forEach((markerData: Marker) => {
      L.marker([markerData.latlng[0], markerData.latlng[1]], { icon: customIcon })
        .addTo(map as L.Map)
        .bindPopup(`<b>${markerData.title}</b><br>${markerData.description}`);
    });

    // Check if geolocation is available
    if (map && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map && addCurrentLocationMarker(map, position.coords.latitude, position.coords.longitude);
        },
        () => map && addCurrentLocationMarker(map, 47.4979, 19.0402)
      );
    } else {
      map && addCurrentLocationMarker(map, 47.474539, 19.062141);
    }

    map.on('click', (e) => {
      const container = document.createElement('div');

      const _ = new MapPopup({ target: container, props: { map, latlng: [e.latlng.lat, e.latlng.lng] } });

      const newMarker = L.marker(e.latlng, { icon: customIcon })
        .addTo(map as L.Map)
        .bindPopup(container)
        .openPopup();

      newMarker.on('popupclose', () => (map as L.Map).removeLayer(newMarker));
    });
  });

  const addCurrentLocationMarker = (map: L.Map, lat: number, lng: number) => {
    if (!map) return;

    const icon = L.icon({
      iconUrl: '/red-dot-icon.svg',
      iconSize: [38, 38],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76]
    });

    L.marker([lat, lng], { icon: icon }).addTo(map).bindPopup('You are here!');
  };

  const toggleTransport = () => {
    if (!map || !transportLayer) return;

    if (showTransport) {
      map.removeLayer(transportLayer);
      showTransport = false;
    } else {
      transportLayer.addTo(map);
      showTransport = true;
    }
  };

  const deleteMarkers = () => localStorage.removeItem('markers');
</script>

<div class="flex h-full w-full flex-col gap-3">
  <div class="flex items-center gap-3">
    <button class="rounded-md bg-white px-3 py-2 text-black transition-all active:scale-95" on:click={deleteMarkers}
      >Delete Markers</button
    >
    <button class="rounded-md bg-white px-3 py-2 text-black transition-all active:scale-95" on:click={toggleTransport}
      >{showTransport ? 'Hide Transport' : 'Show Transport'}</button
    >
  </div>

  <div class="relative flex h-full w-full">
    <div class="absolute right-2 top-2 z-[999] rounded-md border border-black bg-white p-4 text-black">
      <h4 class="mb-4 text-lg font-bold">Legend</h4>
      <div class="flex flex-col gap-2">
        {#each legendItems as { icon, text }}
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center">
              <img src={icon} alt={icon} class="aspect-square w-6" />
            </div>
            <span>{text}</span>
          </div>
        {/each}

        {#if showTransport}
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center">
              <span class="h-1 w-6 bg-[#EE6666]"></span>
            </div>
            <span>Transport</span>
          </div>
        {/if}
      </div>
    </div>

    <div id="map" class="h-full w-full"></div>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
  </div>
</div>
