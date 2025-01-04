import { ApplicationCommandType, ApplicationIntegrationType, ChatInputCommandInteraction } from 'discord.js';
import { CommandInterface } from '../../../types/commands';
import Self from '../../../classes/Self';
import Database from '../../../modules/Database';
import { LangTypes } from '../../../types/options';

export = {
    name: 'ping',
    nameLocalizations: { fr: 'latence' },
    description: "Shows the bot's latency.",
    integrations: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
    types: [ApplicationCommandType.ChatInput],
    options: [],
    managedOptions: {
        ephemeralSending: false,
        allowDms: false,
        isNSFW: true
    },
    customOptions: {
        forBotOwnerOnly: true
    },
    en: (
        self: Self,
        db: Database,
        interaction: ChatInputCommandInteraction,
        command: CommandInterface,
        lang: LangTypes
    ): void => {
        return void interaction.editReply('Réponse');
    }
} as CommandInterface;
