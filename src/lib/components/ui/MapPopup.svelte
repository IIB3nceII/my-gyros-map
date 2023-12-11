<script lang="ts">
  import customIcon from '$lib/shared/leaflet/custom-icon';
  import { markerStore } from '$lib/shared/store/marker.store';
  import type Marker from '$lib/types/marker.model';
  import { v4 as uuidv4 } from 'uuid';
  import L from 'leaflet';

  export let map: L.Map | null = null;
  export let latlng: [number, number] = [0, 0];

  let title: string = '';
  let description: string = '';
  let rating: number = 0;

  const onSaveMarker = (): void => {
    const newMarker: Marker = {
      id: uuidv4(),
      title,
      description,
      rating,
      latlng
    };

    markerStore.saveMarker(newMarker);

    (map as L.Map).removeLayer(newMarker as any);

    L.marker([latlng[0], latlng[1]], { icon: customIcon })
      .addTo(map as L.Map)
      .bindPopup(`<b>title</b><br>description`);
  };
</script>

<form class="flex flex-col gap-3 pt-4" on:submit={onSaveMarker}>
  <input class="border border-slate-200 p-1" type="text" placeholder="Name" bind:value={title} />
  <textarea class="border border-slate-200 p-1" placeholder="How was it?" bind:value={description}></textarea>
  <div class="flex items-center flex-col gap-3">
    <div class="flex items-center gap-2">
      {#each Array.from(Array(5)) as _, i}
        <button
          class="flex items-center justify-center rounded-md bg-yellow-400 p-2 text-white"
          type="button"
          on:click={() => (rating = i + 1)}
          class:active={rating === i + 1}
          class:opacity-50={rating < i + 1}
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {#if rating > i}
              <!-- Star SVG path -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              ></path>
            {:else}
              <!-- Star SVG path with reduced opacity -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                class="opacity-50"
              ></path>
            {/if}
          </svg>
        </button>
      {/each}
    </div>

    <button
      class="flex items-center justify-center w-full rounded-md bg-blue-600 p-2 text-white disabled:cursor-not-allowed disabled:bg-blue-200"
      type="submit"
      disabled={!title || !description || rating === 0}>Save</button
    >
  </div>
</form>
