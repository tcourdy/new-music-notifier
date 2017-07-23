export default class Utils {
  // be sure to JSON.stringify the body before passing to it
  generateFetchInit(method, body) {
    return {
      method: method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: body
    };
  }
}
