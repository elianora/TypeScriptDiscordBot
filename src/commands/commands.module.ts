import { ContainerModule } from 'inversify';
import { COMMAND_RESOLVERS } from '../core/dependency-management';
import { AvatarCommand } from './avatar/avatar.command';
import { HelpCommand } from './help/help.command';

export const commandsModule = new ContainerModule(bind => {
    const commandResolvers: [NewableFunction, ...NewableFunction[]] = [
        AvatarCommand,
        HelpCommand
    ];

    bind(COMMAND_RESOLVERS).toConstantValue(commandResolvers);
    commandResolvers.forEach(commandResolver => bind(commandResolver).toSelf());
});
