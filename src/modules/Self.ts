// ? Imports libraries.
import { Client, Collection, IntentsBitField, Events, ClientEvents } from 'discord.js';
import { EventEmitter } from 'node:events';
import Database from './Database';
import path from 'node:path';
import fs from 'node:fs';

// ? Imports types.
import {
    EventInterface,
    EventTypes,
    CustomEvents,
    DatabaseEvents,
    EventType,
    CustomEvents_E,
    DatabaseEvents_E
} from '../types/events';
import { blue, red, yellow } from './Colors';

export default class Self extends EventEmitter {
    // ? Public
    public djsClient: Client = new Client({
        allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
        intents: [
            IntentsBitField.Flags.Guilds, // ? Captures guilds.
            IntentsBitField.Flags.GuildMessages, // ? Captures messages in guilds.
            IntentsBitField.Flags.GuildMessageReactions, // ? Captures reactions to messages in guilds.
            IntentsBitField.Flags.GuildMembers, // ? Captures members in guilds.
            IntentsBitField.Flags.GuildVoiceStates, // ? Captures voice states in guilds.
            IntentsBitField.Flags.GuildPresences, // ? Captures presences in guilds.
            IntentsBitField.Flags.GuildWebhooks, // ? Captures webhooks in guilds.
            IntentsBitField.Flags.GuildInvites, // ? Captures invites in guilds.
            IntentsBitField.Flags.GuildIntegrations, // ? Captures integrations in guilds.
            // * DEPRECATED | IntentsBitField.Flags.GuildBans, // ? Captures bans in guilds.
            IntentsBitField.Flags.GuildEmojisAndStickers, // ? Captures emojis and stickers creations/suppressions/updates in guilds.
            IntentsBitField.Flags.GuildMessageTyping, // ? Captures typing events in guilds.
            IntentsBitField.Flags.DirectMessages, // ? Captures messages in dm.
            IntentsBitField.Flags.DirectMessageReactions, // ? Captures reactions to messages in dm.
            IntentsBitField.Flags.DirectMessageTyping, // ? Captures typing events in dm.
            IntentsBitField.Flags.MessageContent // ? Captures the content of messages.
        ]
    });
    public database: Database = new Database(this);
    public commands: Collection<string, {}> = new Collection();

    // ? Private
    private eventTypes: Record<EventTypes, string> = {
        1: 'Classic',
        2: 'Custom',
        3: 'Database'
    };
    private errorText: string = '[EPSILON | ERROR]';
    private warningText: string = '[EPSILON | WARNING]';
    private runText: string = '[EPSILON | RUN]';
    private regiteredText: string = '[EPSILON | REGISTERED]';

    constructor() {
        super({ captureRejections: true });
    }

    public async fetchEvents(): Promise<EventInterface[]> {
        const followedModels: EventInterface[] = [];

        const track = async (dir: string): Promise<void> => {
            const files: string[] = fs.readdirSync(dir);

            for (const file of files) {
                const fullPath = path.join(dir, file);

                if (!fs.statSync(fullPath).isDirectory()) {
                    const d: EventInterface = require(fullPath);
                    followedModels.push(d);
                } else {
                    await track(fullPath);
                }
            }
        };

        await track(path.join(__dirname, '../events'));
        return followedModels;
    }

    public checkEventValidity(event: EventInterface): true {
        // ? Classic errors
        if (!event.name) throw new Error(`${red(this.errorText)} | ${red('Event name')} is a required argument.`);
        if (!event.type) throw new Error(`${red(this.errorText)} | ${red('Event type')} is a required argument.`);
        if (!event.run)
            throw new Error(`${red(this.errorText)} | You may provide a valid ${red('Event run function')}.`);

        // ? Type errors
        if (
            !(event.name in Object.values(Events)) &&
            !(event.name in Object.values(CustomEvents_E)) &&
            !(event.name in Object.values(DatabaseEvents_E))
        )
            throw new TypeError(
                `${red(this.errorText)} | ${red('Event type')} argument must be a valid type. Refer to ${yellow('"EventType" enum')}.`
            );
        if (event.once && ![true, false].includes(event.once))
            throw new TypeError(`${red(this.errorText)} | ${red('Event once')} argument must be a boolean.`);
        if (!(event.type in Object.keys(this.eventTypes)))
            throw new TypeError(
                `${red(this.errorText)} | ${red('Event type')} must be a valid type. Refer to ${yellow('"EventType" enum')}.`
            );

        return true;
    }

    public async runEvents(): Promise<void> {
        const followedModels: EventInterface[] = await this.fetchEvents();
        for (const model of followedModels) {
            switch (model.type) {
                case EventType.Classic:
                    this.djsClient[model.once ? 'once' : 'on'](
                        model.name as keyof ClientEvents,
                        async (...args: any[]) => model.run(this, this.database, ...args)
                    );
                    break;
                case EventType.Custom:
                    this[model.once ? 'once' : 'on'](model.name as keyof CustomEvents, async (...args: any[]) =>
                        model.run(this, this.database, ...args)
                    );
                    break;
                case EventType.Database:
                    this.database[model.once ? 'once' : 'on'](
                        model.name as keyof DatabaseEvents,
                        async (...args: any[]) => model.run(this, this.database, ...args)
                    );
                    break;
            }

            console.log(
                `${blue(this.regiteredText)} | ${blue(this.eventTypes[model.type]).toUpperCase()} | ${blue(model.name)} event has been registered.`
            );
        }
    }

    public async startClient(token: string): Promise<void> {
        await this.runEvents();
        await this.djsClient.login(token);
    }
}
