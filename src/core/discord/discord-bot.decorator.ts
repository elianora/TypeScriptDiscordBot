import { interfaces } from 'inversify';
import { EnvironmentReader } from '../configuration';
import { dependencyManager } from '../dependency-management';
import { DiscordBotBase } from './discord-bot-base';
import { DiscordBotOptions } from './discord-bot-options';
type Newable<T = any> = interfaces.Newable<T>;

export function DiscordBot(options: DiscordBotOptions = {}) {
    return <TDiscordBot extends DiscordBotBase>(BotCtor: Newable<TDiscordBot>): Newable<TDiscordBot> => {
        if (DiscordBot.identifier && DiscordBot.identifier !== BotCtor) {
            throw new Error('Multiple classes were marked to act as the startup handler prior to starting the bootstrapping process. Please ensure exactly one class is decorated with the DiscordBot decorator.');
        }

        dependencyManager.bind<TDiscordBot>(BotCtor).toSelf();
        dependencyManager.bind<EnvironmentReader>(EnvironmentReader).toSelf();

        const { modules, services } = options;
        services?.forEach(service => dependencyManager.bind(service).toSelf());
        dependencyManager.load(...(modules ?? []));

        DiscordBot.identifier = BotCtor;
        return BotCtor;
    };
}

DiscordBot.identifier = undefined as Newable | undefined;
DiscordBot.bootstrap = <TDiscordBot>(): TDiscordBot => {
    if (!DiscordBot.identifier) {
        throw new Error('No class was marked to act as the startup handler prior to starting the bootstrapping process. Please ensure exactly one class is decorated with the DiscordBot decorator.');
    }

    return dependencyManager.get<TDiscordBot>(DiscordBot.identifier);
};
