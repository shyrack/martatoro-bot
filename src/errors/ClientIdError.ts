export class ClientIdError extends Error {
  constructor() {
    super("No valid client id could be found.");
  }
}
