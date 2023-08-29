// noteUtils.js
export async function deleteNote(accessToken, noteId) {
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
  