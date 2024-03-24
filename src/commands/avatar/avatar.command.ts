import { Command, CommandContext, CommandDefinition, Parameter, ParameterType } from '../../core/commands';
import { Injectable } from '../../core/dependency-management';

@Injectable()
@Parameter('userId', /(?:<@!)?(\d+)(?:>)?/, ParameterType.Optional | ParameterType.PositionMatters)
@Parameter('format', /[-.]format\s(webp|png|jp(?:e)?g|gif)/, ParameterType.Flag)
@Parameter('size', /[-.]size\s(1(?:6|28|024)|32|64|2(?:56|048)|512|4096)/, ParameterType.Flag)
@Command('avatar')
export class AvatarCommand extends CommandDefinition {
    exec = (
        context: CommandContext,
        commandArgs: Record<string, any>
    ): void => {
        const {
            userId = context.message.author.id,
            format = 'jpg',
            size = 4096,
        } = commandArgs;

        const user = context.discord.users.resolve(userId);
        if (!user) {
            context.message.channel.send(
                `No user could be found for the provided ID (\`${userId}\`).`
            );
            return;
        }

        const avatarUrl = user.avatarURL({
            format,
            size: Number(size) as any,
        })!;

        context.message.channel.send(avatarUrl);
    };
}
