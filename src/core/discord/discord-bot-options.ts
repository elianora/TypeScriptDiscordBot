import { ContainerModule } from 'inversify';

export interface DiscordBotOptions {
    modules?: [ContainerModule, ...ContainerModule[]];
    services?: [NewableFunction, ...NewableFunction[]];
}
