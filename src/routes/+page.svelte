<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { login } from "$lib/auth";
  import { deleteNote } from "../lib/notesActions";
  let notes = [];
  let isLoading = false;
  let isError = false;

  const accessToken = localStorage.getItem("access_token");
  let isLoggedIn = accessToken !== null;

  if (!isLoggedIn) {
    goto("/login"); 
  }

  onMount(async () => {
    if (isLoggedIn) {
      try {
        isLoading = true;
        const response = await fetch(
          "https://notes-api.kasimsaifi.tech/api/notes",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        notes = data;
        isLoading = false;
      } catch (error) {
        console.error("Error fetching data:", error);
        isLoading = false;
        isError = true;
      }
    }
  });
  let isDeleting = false;

  async function handleDelete(noteId) {
    isDeleting = true;
    await deleteNote(accessToken, noteId);
    window.location.reload(); // Reload the page after deletion
  }
</script>

<!-- Rest of your template code -->

{#if isLoading}
  <div class="flex justify-center items-center h-[80vh]">
    <span class="loading loading-spinner loading-lg" />
  </div>
{/if}
{#if isError}
  <div class="flex justify-center items-center h-[80vh]">
    <div
      class="w-full max-w-md p-6 bg-red-500 rounded-xl shadow-lg flex flex-col items-center space-y-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <span class="">Oops! Something went wrong.</span>
      <button
        class="px-3 py-2 rounded-full shadow-md"
        on:click={() => window.location.reload()}
      >
        <iconify-icon icon="material-symbols:refresh" class="text-3xl" />
      </button>
    </div>
  </div>
{/if}
{#if notes.length > 0}
  <h1>There is no notes <a href="/new">Create one</a></h1>
{/if}
{#if notes.length === 0}
<div class="flex justify-center items-center h-[70vh]">
  <div class="text-center">
    <h1 class="text-2xl font-bold mb-4">No notes created.</h1>
    <a href="/new" class="text-blue-500 underline">Create one</a>
  </div>
</div>
{:else}
<div class="container mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

    {#each notes as note}
      <div class="card bg-base-100 shadow-xl card-bordered">
        <div class="card-body">
          <a href={`/note/${note._id}`} class="note-link">
            <h2 class="card-title">{note.title}</h2>
            <span class="card bg-base-100 shadow-xl card-bordered" />
            <div class="overflow-hidden h-24">
              <p>{note.content}</p>
            </div>
          </a>

          <div class="btn-group mt-2 flex justify-end">
            <button class="btn btn-sm">Edit</button>
            <button class="btn btn-sm" on:click={handleDelete(note._id)}
              >Delete</button
            >
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
{/if}