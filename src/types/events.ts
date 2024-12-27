import {
    AnySelectMenuInteraction,
    AutocompleteInteraction,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ClientEvents,
    CommandInteraction,
    GuildMember,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserContextMenuCommandInteraction,
    UserSelectMenuInteraction
} from 'discord.js';
import Self from '../modules/Self';
import Database from '../modules/Database';

export enum EventType {
    Classic = 1,
    Custom = 2,
    Database = 3
}

export enum DatabaseEvents_E {
    LevelUp = 'levelUp',
    Deposit = 'deposit',
    Withdraw = 'withdraw',
    Blacklist = 'blacklist',
    Whitelist = 'whitelist',
    Prevnames = 'prevnames',
    Ready = 'ready'
}

export enum CustomEvents_E {
    SlashCommandExecution = 'slashCommandExecution',
    UserContextCommandExecution = 'userContextCommandExecution',
    MessageContextCommandExecution = 'messageContextCommandExecution',
    ButtonExecution = 'buttonExecution',
    ModalExecution = 'modalExecution',
    AutocompleteExecution = 'autocompleteExecution',
    RoleSelectMenuExecution = 'roleSelectMenuExecution',
    UserSelectMenuExecution = 'userSelectMenuExecution',
    ChannelSelectMenuExecution = 'channelSelectMenuExecution',
    StringSelectMenuExecution = 'stringSelectMenuExecution',
    AnySelectMenuExecution = 'anySelectMenuExecution'
}

export type EventTypes = 1 | 2 | 3;

export interface EventInterface {
    name: keyof ClientEvents | keyof CustomEvents | keyof DatabaseEvents;
    type: EventTypes;
    once?: boolean; // ? Should the event be only executed once?
    run: (self: Self, db: Database, ...args: any[]) => void;
}

export interface CustomEvents {
    slashCommandExecution: [self: Self, db: Database, interaction: CommandInteraction, command: {}];
    userContextCommandExecution: [
        self: Self,
        db: Database,
        interaction: UserContextMenuCommandInteraction,
        command: {}
    ];
    messageContextCommandExecution: [
        self: Self,
        db: Database,
        interaction: MessageContextMenuCommandInteraction,
        command: {}
    ];
    buttonExecution: [self: Self, db: Database, interaction: ButtonInteraction, command: {}];
    modalExecution: [self: Self, db: Database, interaction: ModalSubmitInteraction, command: {}];
    autocompleteExecution: [self: Self, db: Database, interaction: AutocompleteInteraction, command: {}];
    roleSelectMenuExecution: [self: Self, db: Database, interaction: RoleSelectMenuInteraction, command: {}];
    userSelectMenuExecution: [self: Self, db: Database, interaction: UserSelectMenuInteraction, command: {}];
    channelSelectMenuExecution: [self: Self, db: Database, interaction: ChannelSelectMenuInteraction, command: {}];
    stringSelectMenuExecution: [self: Self, db: Database, interaction: StringSelectMenuInteraction, command: {}];
    anySelectMenuExecution: [self: Self, db: Database, interaction: AnySelectMenuInteraction, command: {}];
}

export interface DatabaseEvents {
    levelUp: [db: typeof Database, member: typeof GuildMember];
    deposit: [db: typeof Database, member: typeof GuildMember];
    withdraw: [db: typeof Database, member: typeof GuildMember];
    blacklist: [db: typeof Database, member?: typeof GuildMember];
    whitelist: [db: typeof Database, member?: typeof GuildMember];
    prevnames: [db: typeof Database, member: typeof GuildMember];
    ready: [db: typeof Database];
}
