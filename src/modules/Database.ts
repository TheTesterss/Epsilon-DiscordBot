import mongoose, { ConnectOptions, Model } from 'mongoose';
import { EventEmitter } from 'node:events';
import Self from './Self';
import UserManager from './database/UserManager';
import UserModel, { UserDocument } from './database/models/User';
import { green, red } from './Colors';

interface DatabaseOptions {
    family?: 4 | 6;
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
}

export default class Database extends EventEmitter {
    public mongoose = mongoose;
    public self: Self;
    public users: UserManager[] = [];
    public managers: { users: UserManager };

    constructor(
        client: Self,
        options: DatabaseOptions = { family: 4, maxPoolSize: 10, serverSelectionTimeoutMS: 5000 }
    ) {
        super({ captureRejections: true });

        this.self = client;
        this.mongoose.connect(process.env.mongo_uri, options as ConnectOptions)
            .then(() => console.log(`${green("[EPISLON | ERROR]")} | Connected to ${green("MongoDB")}.`))
            .catch(err => console.error(`${red("[EPISLON | ERROR]")} | ${red("MongoDB")} connection error:`, err));

        this.managers = {
            users: new UserManager(this.self, this),
        };
    }

    private async reload(): Promise<void> {
        await this.fetchUsers();
    }

    public async fetchUsers(): Promise<void> {
        try {
            const users = await UserModel.find<UserDocument>({});
            this.users = users.map(user => new UserManager(this.self, this, user));
        } catch (error) {
            console.error(`${red("[EPISLON | ERROR]")} | Error fetching users:`, error);
        }
    }
}