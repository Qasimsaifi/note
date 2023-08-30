<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";
  const isAutoSave = writable(false);
  let EditorJS,
    List,
    Header,
    SimpleImage,
    Checklist,
    Quote,
    Warning,
    Marker,
    CodeTool,
    Delimiter,
    InlineCode,
    LinkTool,
    Embed,
    Table;
  let note = null;
  let error = null;
  let noteId = $page.params.noteId;
  let accessToken = localStorage.getItem("access_token");
  let saving = false;
  let isDeleting = false;
  let editorInstance = null;

  async function fetchNote() {
    try {
      const response = await fetch(
        `https://notes-api.kasimsaifi.tech/api/notes/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        note = await response.json();
        initializeEditor();
      } else {
        error = "Failed to fetch note";
      }
    } catch (err) {
      error = err;
    }
  }

  function initializeEditor() {
    editorInstance = new EditorJS({
      holder: "editorjs",
      tools: {
        header: Header,
        image: SimpleImage,
        list: List,
        checklist: Checklist,
        quote: Quote,
        warning: Warning,
        marker: Marker,
        code: CodeTool,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        linkTool: LinkTool,
        embed: Embed,
        table: Table,
      },
      data: JSON.parse(note.content), // Parse the JSON content from the API
      placeholder: "Content",
      onChange: (api, event) => {
        autoSave();
      },
    });
    editorInstance.isReady
      .then(() => {
        editorInstance.addEventListener("change", () => {
          if ($isAutoSave) {
            saveNote();
          }
        });
      })
      .catch((error) => {
        console.error("EditorJS initialization error:", error);
      });
  }

  async function saveNote() {
    const savedData = await editorInstance.save();
    const requestData = {
      title: note.title,
      content: JSON.stringify(savedData),
    };

    try {
      saving = true;
      const response = await fetch(
        `https://notes-api.kasimsaifi.tech/api/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );
      if (response.ok) {
        // console.log("Note saved successfully");
        saving = false;
      } else {
        // console.error("Failed to save note");
      }
    } catch (err) {
      // console.error("An error occurred while saving the note");
    }
  }

  console.log($isAutoSave);
  function autoSave() {
    console.log("auto save called");
    if ($isAutoSave) {
      console.log("called from if");
      saveNote();
    }
  }

  async function deleteNote() {
    let confirmCount = 0;

    while (confirmCount < 2) {
      let confirmMessage =
        confirmCount === 0
          ? "Are you sure you want to delete this note? This action cannot be undone."
          : "This is your last chance. Deleting this note will permanently remove it. Are you absolutely sure?";

      if (confirm(confirmMessage)) {
        confirmCount++;
      } else {
        break; // Exit the loop if the user cancels
      }
    }

    if (confirmCount === 2) {
      try {
        isDeleting = true;
        const response = await fetch(
          `https://notes-api.kasimsaifi.tech/api/notes/${noteId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          isDeleting = false;
          // Redirect to a different page or show a success message
          goto("/"); // You can use the appropriate routing mechanism here
        } else {
          console.error("Failed to delete note");
        }
      } catch (err) {
        console.error("An error occurred while deleting the note");
      }
    }
  }
  let showTooltip = false;

  function toggleTooltip() {
    showTooltip = !showTooltip;
  }
  onMount(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    EditorJS = (await import("@editorjs/editorjs")).default;
    List = (await import("@editorjs/list")).default;
    Header = (await import("@editorjs/header")).default;
    SimpleImage = (await import("@editorjs/simple-image")).default;
    Checklist = (await import("@editorjs/checklist")).default;
    Quote = (await import("@editorjs/quote")).default;
    Warning = (await import("@editorjs/warning")).default;
    Marker = (await import("@editorjs/marker")).default;
    CodeTool = (await import("@editorjs/code")).default;
    Delimiter = (await import("@editorjs/delimiter")).default;
    InlineCode = (await import("@editorjs/inline-code")).default;
    LinkTool = (await import("@editorjs/link")).default;
    Embed = (await import("@editorjs/embed")).default;
    Table = (await import("@editorjs/table")).default;

    fetchNote();
  });
</script>

{#if error}
  <p class="text-red-500">{error}</p>
{:else if note}
  <div class="flex justify-between items-center mt-2 ml-4 mr-4">
    <div class="btn-group flex">
      {#if saving}
        <button class="px-4 py-2 btn btn-sm">Saving..</button>
      {:else}
        <button on:click={saveNote} class="px-4 py-2 btn btn-sm">Save</button>
      {/if}
      {#if isDeleting}
        <button class="px-4 py-2 btn btn-error btn-sm">Deleting..</button>
      {:else}
        <button on:click={deleteNote} class="px-4 py-2 btn btn-error btn-sm">
          Delete
        </button>
      {/if}
    </div>
    <div class="flex items-center"> <!-- Adjusted this line -->
      <label for="toggle" class="mr-1">Auto save</label> <!-- Adjusted this line -->
      <input type="checkbox" name="toggle" id="toggle" class="toggle" bind:checked={$isAutoSave} />
    </div>
  </div>

  <div class="mt-4 flex justify-center">
    <div class="relative input-wrapper">
      <input
        type="text"
        id="title"
        bind:value={note.title}
        on:input={autoSave}
        class="px-2 py-1 w-full sm:w-full  lg:w-[42vw] sm:mx-2 focus:outline-none text-2xl input"
        placeholder="Title"
        on:mouseenter={toggleTooltip}
        on:mouseleave={toggleTooltip}
      />
      {#if showTooltip}
        <div
          class="tooltip bg-primary"
          style="top: 100%; transform: translateY(5px);"
        >
          {note.title}
        </div>
      {/if}
    </div>
  </div>
  <div class="px-2">

    <div id="editorjs" />
  </div>
{:else}
  <div class="flex justify-center items-center h-[70vh]">
    <span class="loading loading-spinner loading-lg" />
  </div>
{/if}

<style>
  .tooltip {
    display: none;
    position: absolute;
    padding: 5px;
    z-index: 10;
  }

  .input-wrapper:hover .tooltip {
    display: block;
  }
</style>
