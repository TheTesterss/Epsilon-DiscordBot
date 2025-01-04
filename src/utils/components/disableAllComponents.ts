import {
    Message,
    ActionRow,
    MessageActionRowComponent,
    ActionRowBuilder,
    MessageActionRowComponentBuilder,
    RestOrArray,
    ComponentType,
    ButtonComponent,
    ButtonBuilder,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder
} from 'discord.js';

export type ComponentResolvable =
    | MessageActionRowComponentBuilder
    | MessageActionRowComponentBuilder[]
    | [MessageActionRowComponentBuilder[]]
    | RestOrArray<MessageActionRowComponent>;

export default (message: Message) => {
    return message.components.map((component: ActionRow<MessageActionRowComponent>) => {
        return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            component.components.map((component_1: MessageActionRowComponent): MessageActionRowComponentBuilder => {
                let myComponent: MessageActionRowComponentBuilder;

                switch (component_1.type) {
                    case ComponentType.Button:
                        myComponent = ButtonBuilder.from(component_1).setDisabled(true);
                        break;
                    case ComponentType.ChannelSelect:
                        myComponent = ChannelSelectMenuBuilder.from(component_1).setDisabled(true);
                        break;
                    case ComponentType.MentionableSelect:
                        myComponent = MentionableSelectMenuBuilder.from(component_1).setDisabled(true);
                        break;
                    case ComponentType.RoleSelect:
                        myComponent = RoleSelectMenuBuilder.from(component_1).setDisabled(true);
                        break;
                    case ComponentType.StringSelect:
                        myComponent = StringSelectMenuBuilder.from(component_1).setDisabled(true);
                        break;
                    case ComponentType.UserSelect:
                        myComponent = UserSelectMenuBuilder.from(component_1).setDisabled(true);
                        break;
                }

                return myComponent;
            })
        );
    });
};
