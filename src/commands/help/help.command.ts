import {
    Command,
    CommandContext,
    CommandDefinition,
} from '../../core/commands';
import { Injectable } from '../../core/dependency-management';

@Injectable()
@Command('help')
export class HelpCommand extends CommandDefinition {
    exec = (context: CommandContext): void => {
        let usageString = '**Ok, Help _Was_ an Option**\n> Here are the commands you can use: \n';
        Object.values(context.commands).forEach(commandDefinition => {
            usageString = `${usageString}>  \`\` \`${commandDefinition.name}`;
            commandDefinition.parameters.forEach(param => {
                usageString = `${usageString} ${param.usageString}`;
            });

            usageString = `${usageString}\`\`\n`;
        });

        context.message.channel.send(usageString);
    };
}
