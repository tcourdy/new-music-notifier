// be sure to JSON.stringify the body before passing to it
export function generateFetchInitPost(body) {
  return {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: body
  };
}

export function generateFetchInitGet() {
  return {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    credentials: 'include',
  };
}
