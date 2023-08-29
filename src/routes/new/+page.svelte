<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
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
  let title;
  let accessToken = localStorage.getItem("access_token");
  console.log(accessToken);

  let isSaving = false;
  let editorInstance = null;

  async function saveData() {
    if (isSaving) return;

    isSaving = true;
    try {
      const savedData = await editorInstance.save();

      const requestData = {
        title: title,
        content: JSON.stringify(savedData),
      };

      const response = await fetch("https://notes-api.kasimsaifi.tech/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const responseData = await response.json(); // Use await to access the JSON data
        goto(`/note/${responseData._id}`)
        
      } else {
        console.error("Failed to send data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      isSaving = false;
    }
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
      placeholder: "Content",
    });
  });
</script>

<div class="mt-4 flex justify-center">
  <input
    type="text"
    id="title"
    bind:value={title}
    class="px-2 py-1 w-full sm:w-full lg:w-[52vw] sm:mx-2 focus:outline-none text-2xl input"
    placeholder="Title"
  />
</div>

<div id="editorjs" class="w-screen"></div>

<div class="mt-4 flex justify-center">
  <button on:click={saveData} class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    {#if isSaving}
      Saving...
    {:else}
      Save
    {/if}
  </button>
</div>

<style>
  #editorjs {
    width: 90vw !important;
  }
</style>
