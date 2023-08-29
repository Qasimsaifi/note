<script>
  import "./app.css";
  import 'iconify-icon'
  import { onMount } from "svelte";
  import { theme } from "../store/themeStore";
  import Navbar from "../components/Navbar.svelte";
  let isThemeLoaded = false;
  let isDataLoaded = false; // Add this flag for data loading
  export const ssr = false;

  onMount(() => {
    // Simulating data loading delay
    setTimeout(() => {
      isDataLoaded = true;
    }, 1000);

    theme.subscribe((currentTheme) => {
      document.documentElement.setAttribute("data-theme", currentTheme);
      isThemeLoaded = true;
    });
  });
</script>

<html lang="en" class="min-h-screen">
  {#if isThemeLoaded && isDataLoaded}
    <div class="mb-24">
      <Navbar />
    </div>
    <slot />
  {:else}
    <!-- Show a loading indicator or fallback content while theme or data is loading -->
    <div class="flex justify-center items-center h-screen">
      <span class="loading loading-spinner loading-lg" />
    </div>
  {/if}
</html>
