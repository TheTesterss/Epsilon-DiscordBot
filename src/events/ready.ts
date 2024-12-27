import { Events } from 'discord.js';
import { EventInterface, EventType } from '../types/events';
import Self from '../modules/Self';
import Database from '../modules/Database';

export = {
    name: Events.ClientReady,
    type: EventType.Classic,
    once: true,
    run: (self: Self, db: Database): void => {
        console.log(`Logged in as ${self.djsClient.user!.tag}`);

        for(const user of self.djsClient.users.cache) {
            db.managers.users.repair(user[0]);
        }
    }
} as EventInterface;
