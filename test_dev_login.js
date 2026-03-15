const apiUrl = "https://3000-i3bhuhmeb11739upgd28g-a3809ea0.us1.manus.computer";
const endpoint = "/api/dev/login";

console.log("Testing dev login endpoint...");
console.log("URL:", apiUrl + endpoint);

fetch(apiUrl + endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    email: "test@example.com",
    name: "Test User",
  }),
})
  .then(res => {
    console.log("Response status:", res.status, res.statusText);
    console.log("Response headers:", res.headers);
    return res.json();
  })
  .then(data => {
    console.log("Response data:", data);
  })
  .catch(err => {
    console.error("Error:", err);
  });
