export async function login(email, password) {
  const response = await fetch("https://notes-api.kasimsaifi.tech/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (response.ok) {
    const data = await response.json();
    const accessToken = data.access;
    return accessToken;
  } else {
    throw new Error("Login failed");
  }
}
// auth.js

// ... (your previous code)

export function logout() {
  // Clear the access token from localStorage
  localStorage.removeItem('access_token');
}
