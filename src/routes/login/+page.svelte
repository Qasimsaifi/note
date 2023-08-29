<script>
  import { login } from "$lib/auth";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let logging = false;
  // Check if the user is already logged in
  let isLoggedIn = localStorage.getItem("access_token") !== null;

  // If already logged in, redirect to the main application page
  if (isLoggedIn) {
    goto("/");
  }

  async function handleLogin() {
    try {
      logging = true;
      const accessToken = await login(email, password);
      console.log(accessToken);

      // Store the access token securely in localStorage
      localStorage.setItem("access_token", accessToken);

      // Redirect the user to the main application page
      logging = false;
      window.location.reload();

      goto("/");
    } catch (error) {
      // Handle login error
      console.error(error.message);
    }
  }
</script>

{#if !isLoggedIn}
  <div class="flex justify-center items-center h-[70vh]">
    <div class=" p-8 shadow-lg rounded-lg w-80">
      <h1 class="text-center text-2xl font-bold mb-4">Login</h1>
      <form on:submit|preventDefault={handleLogin}>
        <div class="mb-4">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block font-semibold mb-2">Email</label>
          <input
            type="email"
            bind:value={email}
            class="w-full p-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block font-semibold mb-2">Password</label>
          <input
            type="password"
            bind:value={password}
            class="w-full p-2 border rounded"
          />
        </div>

        <button class="btn w-full" type="submit">       
            {#if logging}
            <span class="loading loading-spinner loading-lg" />
            {:else}
            Login
            {/if}
        </button>
      </form>
      <p class="text-center text-xs pt-1">
        Don't have an account?{" "}
        <a href="/register" class="text-blue-500 underline"> Register here </a>
      </p>
    </div>
  </div>
{:else}
  <p>You are already logged in. Redirecting...</p>
{/if}
