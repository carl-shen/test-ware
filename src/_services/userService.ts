import { buildAuthHeader } from "_helpers";
import config from "_configs/configs.json";
import { User } from "_types/user";

export const userService = {
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete,
};

function login(username: string, password: string) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  return fetch(`${config.apiUrl}/users/authenticate.php`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      // Store user details and JWT token in local storage to keep user logged in between page refreshes.
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    });
}

function logout() {
  // Remove user from local storage to log out.
  localStorage.removeItem("user");
}

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: buildAuthHeader(),
  };

  return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id: string) {
  const requestOptions = {
    method: "GET",
    headers: buildAuthHeader(),
  };

  return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function register(user: User) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/users/register.php`, requestOptions).then(
    handleResponse
  );
}

function update(user: User) {
  const requestOptions = {
    method: "PUT",
    headers: { ...buildAuthHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(
    handleResponse
  );
}

// The keyword delete is reserved in js, use _detele instead.
function _delete(id: string) {
  const requestOptions = {
    method: "DELETE",
    headers: buildAuthHeader(),
  };

  return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function handleResponse(response: Response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // Auto logout if 401 response returned from the API.
        logout();
        Location.prototype.reload();
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
