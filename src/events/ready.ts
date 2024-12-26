import { Events } from 'discord.js';
import { EventInterface, EventType } from '../types/events';
import Self from '../classes/Self';
import Database from '../modules/Database';

export = {
    name: Events.ClientReady,
    type: EventType.Classic,
    once: true,
    run: (self: Self, db: Database): void => {
        console.log(`Logged in as ${self.djsClient.user!.tag}`);
    }
} as EventInterface;