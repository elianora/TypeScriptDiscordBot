import 'reflect-metadata';
import { commandsModule } from './commands';
import { DiscordBot, DiscordBotBase } from './core/discord';

@DiscordBot({
    modules: [commandsModule]
})
export class NeverAnOptionBot extends DiscordBotBase {}

DiscordBot.bootstrap<NeverAnOptionBot>().listen();
