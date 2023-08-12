export function buildAuthHeader(): HeadersInit {
  const userItem = localStorage.getItem("user");
  if (userItem && typeof userItem === "string") {
    let user = JSON.parse(userItem);
    if (user.token) {
      return { Authorization: "Bearer " + user.token };
    }
  }
  throw new Error("Unable to locate user item in local storage.");
}
