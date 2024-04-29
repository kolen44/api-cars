export class TimerEvent {
  constructor(public readonly data: { message: string }) {}
  message() {
    return this.data.message;
  }
}
