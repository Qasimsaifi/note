export async function login(email, password) {
  const response = await fetch("https://notes-api.kasimsaifi.tech/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
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
export function logout() {
  localStorage.removeItem('access_token');
}



export async function register(email, username, password) {
  const response = await fetch("https://notes-api.kasimsaifi.tech/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      username,
      password
    })
  });

  if (response.ok) {
    // console.log("Registration successful");
  } else {
    // throw new Error("Registration failed");
  }
}
