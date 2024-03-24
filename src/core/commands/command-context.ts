import { Client, Message } from 'discord.js';
import { CommandDefinition } from './command-definition';

export interface CommandContext {
    commands: Record<string, CommandDefinition>;
    discord: Client;
    message: Message;
}
