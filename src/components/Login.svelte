<!-- Login.svelte -->
<script>
    export let login;
  
    let email = '';
    let password = '';
  
    async function handleLogin() {
      const success = await login(email, password);
      if (success) {
        // Redirect or perform action after login
      }
    }
  </script>
  
  <div>
    <h2>Login</h2>
    <form on:submit|preventDefault={handleLogin}>
      <label>
        Email:
        <input type="email" bind:value={email} />
      </label>
      <label>
        Password:
        <input type="password" bind:value={password} />
      </label>
      <button type="submit">Login</button>
    </form>
  </div>
  