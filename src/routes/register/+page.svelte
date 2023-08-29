<script>
  import { login, register } from "$lib/auth";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let username = "";

  let isProcess = false;
  let isLoggedIn = localStorage.getItem("access_token") !== null;

  // If already logged in, redirect to the main application page
  if (isLoggedIn) {
    goto("/");
  }

  async function handleRegister() {
    try {
      isProcess = true;
      await register(email, username, password);

      // Log in the user after successful registration
      const accessToken = await login(email, password);
      localStorage.setItem("access_token", accessToken);

      // Redirect the user to the main application page
      isProcess = false;
      window.location.reload();
      // Redirect to the main application page after login
      goto("/");
    } catch (error) {
      console.error(error.message);
    }
  }
</script>

{#if !isLoggedIn}
  <div class="flex justify-center items-center h-[70vh]">
    <div class=" p-8 shadow-lg rounded-lg w-80">
      <h1 class="text-center text-2xl font-bold mb-4">Register</h1>
      <form on:submit|preventDefault={handleRegister}>
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
          <label class="block font-semibold mb-2">Username</label>
          <input
            type="text"
            bind:value={username}
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
          {#if isProcess}
            <span class="loading loading-spinner loading-lg" />
          {:else}
            Register
          {/if}
        </button>
      </form>
      <p class="text-center text-xs pt-1">
        Already have an account?{" "}
        <a href="/login" class="text-blue-500 underline"> Login here </a>
      </p>
    </div>
  </div>
{:else}
  <p>You are already logged in. Redirecting...</p>
{/if}
