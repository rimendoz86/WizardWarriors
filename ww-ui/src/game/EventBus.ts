import { Events } from "phaser";

// Used to emit events between react components & phaser scenes.
// https://docs.phaser.io/api-documentation/class/events-eventemitter
export const EventBus = new Events.EventEmitter();
