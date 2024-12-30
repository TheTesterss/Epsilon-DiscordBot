import mongoose, { ConnectOptions } from 'mongoose';
import { EventEmitter } from 'node:events';
import Self from '../classes/Self';
import User, { UserDocument } from './models/User';
import { green, red } from './Colors';
import Guild, { GuildDocument } from './models/Guild';

interface DatabaseOptions {
    family?: 4 | 6;
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
}
const Models = { UserDB: User, GuildDB: Guild };

export default class Database extends EventEmitter {
    public mongoose = mongoose;
    public self: Self;
    public models: typeof Models = Models;

    constructor(
        client: Self,
        options: DatabaseOptions = { family: 4, maxPoolSize: 10, serverSelectionTimeoutMS: 5000 }
    ) {
        super({ captureRejections: true });

        this.self = client;
        this.mongoose
            .connect(process.env.mongo_uri, options as ConnectOptions)
            .then(() => console.log(`${green('[EPISLON | ERROR]')} | Connected to ${green('MongoDB')}.`))
            .catch((err) => console.error(`${red('[EPISLON | ERROR]')} | ${red('MongoDB')} connection error:`, err));
    }

    public async fetchUsers(): Promise<UserDocument[]> {
        const users: UserDocument[] = await User.find({}).exec();
        return users;
    }

    public async fetchGuilds(): Promise<GuildDocument[]> {
        const guilds: GuildDocument[] = await Guild.find({}).exec();
        return guilds;
    }
}
