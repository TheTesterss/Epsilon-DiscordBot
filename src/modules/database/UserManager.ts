import mongoose from 'mongoose';
import Database from '../Database';
import Self from '../Self';
import UserModel, { UserDocument } from './models/User';
import { green, red } from '../Colors';

export default class UserManager {
    public self: Self;
    public db: Database;
    private userData: UserDocument | null = null;

    constructor(client: Self, database: Database, user?: UserDocument) {
        this.self = client;
        this.db = database;
        if (user) this.userData = user;
    }

    public async create(id: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.create({
                id,
                username: this.self.djsClient.users.cache.get(id)?.username || 'Unknown',
                blacklist: {},
                whitelist: {},
            });
            this.userData = user;
            console.log(`${green("[EPISLON | DB]")} | new user created:`, this.self.djsClient.users.cache.get(id)?.username)
            return user;
        } catch (error) {
            console.error(`${red("[EPISLON | ERROR]")} | error creating user:`, error)
            return null;
        }
    }

    public async delete(id: string): Promise<boolean> {
        try {
            const result = await UserModel.deleteOne({ id });
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`${red("[EPISLON | ERROR]")} | error deleting user:`, error)
            return false;
        }
    }

    public async get(id: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findOne({ id });
            this.userData = user;
            return user;
        } catch (error) {
            console.error(`${red("[EPISLON | ERROR]")} | error fetching user:`, error)
            return null;
        }
    }

    public async repair(id: string): Promise<void> {
        const user = await this.get(id);
        if (!user) {
            await this.create(id);
        }
    }
}