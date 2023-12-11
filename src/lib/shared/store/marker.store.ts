import type Marker from '$lib/types/marker.model';
import { writable } from 'svelte/store';

type MarkerStore = {
  markers: Marker[];
};

const loadMarkers = (): Marker[] => {
  const markers = localStorage.getItem('markers');

  return markers ? JSON.parse(markers) : [];
};

const createMarkerStore = () => {
  const { subscribe, update } = writable<MarkerStore>({ markers: loadMarkers() });

  const saveMarker = (newMarker: Marker): void =>
    update((store) => {
      const markers = [...store.markers, newMarker];

      localStorage.setItem('markers', JSON.stringify(markers));

      return { ...store, markers };
    });

  const deleteMarker = (id: string): void =>
    update((store) => {
      const newArr = store.markers.filter((marker) => marker.id !== id);
      localStorage.setItem('markers', JSON.stringify(newArr));

      return { ...store, markers: newArr };
    });

  return {
    subscribe,
    saveMarker,
    deleteMarker
  };
};

export const markerStore = createMarkerStore();
