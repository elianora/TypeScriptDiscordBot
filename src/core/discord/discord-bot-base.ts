import { Client, Message } from 'discord.js';
import { CommandDefinition } from '../commands';
import { EnvironmentReader } from '../configuration';
import {
    COMMAND_RESOLVERS,
    dependencyManager,
    Inject,
    Injectable,
} from '../dependency-management';

@Injectable()
export abstract class DiscordBotBase {
    discord = new Client();
    commands: Record<string, CommandDefinition> = {};

    constructor(
        @Inject(EnvironmentReader) private environment: EnvironmentReader,
        @Inject(COMMAND_RESOLVERS)
        commandResolvers: [NewableFunction, ...NewableFunction[]]
    ) {
        const commandDefinitions = commandResolvers.map(
            (commandResolver) =>
                dependencyManager.get(commandResolver) as CommandDefinition
        );
        commandDefinitions.forEach(
            (command) => (this.commands[command.name] = command)
        );
    }

    listen() {
        const botToken = this.environment.getSecret('CLIENT_SECRET');
        this.discord.once('ready', this.onReady);
        this.discord.on('message', this.onMessage);
        this.discord.login(botToken).catch(console.error.bind(console));
    }

    onReady = () => {
        this.discord
            .generateInvite()
            .then((inviteUrl) => {
                const readyMessage =
                    this.environment.getValue('READY_MESSAGE') ??
                    'Bot is ready to cause problems for no reason!';
                console.info(readyMessage);
                console.info(
                    `To invite this bot to your server, use the following link: ${inviteUrl}`
                );
                console.info('Press CTRL+C to quit.');
            })
            .catch(console.error.bind(console));
    };

    onMessage = (message: Message) => {
        if (message.author.bot) {
            return;
        }

        const command = Object.values(this.commands).find((command) =>
            command.trigger.test(message.content)
        );
        if (!command) {
            return;
        }

        const params: Record<string, any> = {};
        let paramsExpr = command.trigger;
        command.parameters.forEach((param) => {
            if (param.positionMatters) {
                let updatedFlags = `${paramsExpr.flags}${param.trigger.flags}`
                    .split('')
                    .sort()
                    .join('');
                updatedFlags = updatedFlags.replace(/(.)(?=.*\1)/g, '');
                paramsExpr = new RegExp(
                    `${paramsExpr.source}${param.trigger.source}`,
                    updatedFlags
                );
            } else {
                const matchResults = param.trigger.exec(message.content);
                if (matchResults) {
                    params[param.name] = matchResults[1];
                }
            }
        });

        const matchResults = paramsExpr.exec(message.content);
        matchResults?.slice(1).forEach((value, index) => {
            const name = command.parameters[index].name;
            params[name] = value;
        });

        command.exec(
            {
                discord: this.discord,
                commands: this.commands,
                message
            },
            params
        );
    };
}
