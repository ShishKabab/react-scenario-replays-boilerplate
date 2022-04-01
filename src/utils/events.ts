export type EventMap = { [EventName: string]: {} };
export type EventHandler<Events, EventName extends keyof Events> = (event: Events[EventName]) => void;

export class EventEmitter<Events> {
  generatedIds = 0;
  eventHandlers: { [EventName in keyof Events]?: { [id: number]: EventHandler<Events, EventName> } } = {};

  on<EventName extends keyof Events>(eventName: EventName, handler: EventHandler<Events, EventName>) {
    const id = ++this.generatedIds;
    this.eventHandlers[eventName] = this.eventHandlers[eventName] ?? {};
    this.eventHandlers[eventName]![id] = handler;
    return () => {
      delete this.eventHandlers[eventName]![id];
    };
  }

  emit<EventName extends keyof Events>(eventName: EventName, event: Events[EventName]) {
    for (const handler of Object.values(this.eventHandlers[eventName] ?? {})) {
      handler(event);
    }
  }
}
