<!-- ThemeSelector.svelte -->
<script>
  import { theme } from "../store/themeStore";

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  function changeTheme(event) {
    theme.set(event.target.value);
  }
</script>
<select id="themeSelector" class="select select-bordered select-sm w-xs max-w-xs" bind:value={$theme} on:change={changeTheme}>
  {#each themes as theme}
    <option value={theme}>{theme}</option>
  {/each}
</select>

<style>
  /* Style your theme selector as needed */
</style>
