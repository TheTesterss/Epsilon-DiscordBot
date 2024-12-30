export enum Preconditions {
    ALLOW_BLACKLISTED_USERS = 'blacklistDisallowed',
    RESERVED_FOR_GUILD_OWNER = 'forGuildOwnerOnly',
    RESERVED_FOR_GUILD_ADMINS = 'forGuildAdminsOnly',
    RESERVED_FOR_BOT_OWNER = 'forBotOwnerOnly',
    RESERVED_FOR_NSFW_CHANNELS = 'isNSFW',
}
