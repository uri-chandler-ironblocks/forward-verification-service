export class ListenerConfigError extends Error {
  constructor(message: string) {
    super(`ListenerConfigError: ${message}`);
    this.name = ListenerConfigError.name;
  }
}
