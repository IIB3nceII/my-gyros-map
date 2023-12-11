<script lang="ts">
  import Header from '$lib/components/ui/Header.svelte';
  import History from '$lib/components/ui/History.svelte';
  import Map from '$lib/components/ui/Map.svelte';
</script>

<svelte:head>
  <title>My Gyros Map | Map</title>
</svelte:head>

<main
  class="flex h-screen w-screen max-w-[2520px] flex-col gap-6 bg-[#262A7A] px-8 py-8 text-white lg:flex-row lg:px-16"
>
  <div class="flex flex-col gap-3 rounded-2xl border-4 border-[#4456A6] p-4 lg:w-1/2">
    <Header />
    <History />
  </div>

  <Map />
</main>
