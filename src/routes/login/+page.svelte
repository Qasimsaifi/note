<script>
  import { login } from "$lib/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  let logging = false;
  let isLoggedIn = localStorage.getItem("access_token") !== null;

  let loginError = "";

  if (isLoggedIn) {
    goto("/");
  }

  async function handleLogin() {
    // Reset previous errors
    loginError = "";

    let isValid = true;

    if (!email) {
      loginError = "Email is required";
      isValid = false;
    }

    if (!password) {
      loginError = "Password is required";
      isValid = false;
    }

    if (isValid) {
      try {
        logging = true;
        const accessToken = await login(email, password);
        console.log(accessToken);

        localStorage.setItem("access_token", accessToken);
        window.location.reload();
        goto("/");
      } catch (error) {
        // console.error(error.message);

        if (error.message === "Unauthorized") {
          loginError = "Invalid email or password"; // Or a more appropriate message
        } else {
          loginError =
            "An error occurred during login. Please try again later.";
        }
      } finally {
        logging = false;
      }
    }
  }
</script>

{#if !isLoggedIn}
  <div class="flex justify-center items-center h-[70vh]">
    <div class="p-8 shadow-lg rounded-lg w-80">
      <h1 class="text-center text-2xl font-bold mb-4">Login</h1>
      <form on:submit|preventDefault={handleLogin}>
        <div class="mb-4">
          <label class="block font-semibold mb-2">Email</label>
          <input
            type="email"
            bind:value={email}
            class="w-full p-2 border rounded"
          />
          {#if loginError && !email}
            <p class="text-red-500 text-sm mt-1">{loginError}</p>
          {/if}
        </div>
        <div class="mb-4">
          <label class="block font-semibold mb-2">Password</label>
          <input
            type="password"
            bind:value={password}
            class="w-full p-2 border rounded"
          />
          {#if loginError && !password}
            <p class="text-red-500 text-sm mt-1">{loginError}</p>
          {/if}
        </div>

        <button class="btn w-full" type="submit">
          {#if logging}
            <span class="loading loading-spinner loading-lg" />
          {:else}
            Login
          {/if}
        </button>
        {#if loginError && (email || password)}
          <p class="text-red-500 text-sm mt-1">{loginError}</p>
        {/if}
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
