<script>
  // If you had any script logic, you could place it here

  import ThemeSelector from "./ThemeSelector.svelte";
  import { logout } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';

  const accessToken = localStorage.getItem('access_token');
  const isLoggedIn = accessToken !== null;

  // Create a writable store to hold the login status
  const loginStatus = writable(isLoggedIn);

  function handleLogout() {
    logout();
    loginStatus.set(false); // Update the login status upon logout
    goto("/login"); // Redirect to the login page after logout
  }
</script>

<div class="navbar bg-base-100 w-full fixed z-50">
  <div class="navbar-start">
    <div class="dropdown">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <a href="/notes">All Notes</a>
        </li>
        <li>
          <a href="/new">Add Note</a>
        </li>
      </ul>
    </div>
    <a class="btn btn-ghost normal-case text-xl" href="/"> Notes Desk </a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li>
        <a href="/notes">All Notes</a>
      </li>
      <li>
        <a href="/new">Add Note</a>
      </li>
    </ul>
  </div>
  <div class="navbar-end">
      {#if $loginStatus}
        <button class="btn btn-sm" on:click={handleLogout}>
          Logout
        </button>
      {:else}
        <a class="btn btn-sm" href="/login">
          Login
        </a>
      {/if}
      <ThemeSelector />
  </div>
</div>
<hr />
