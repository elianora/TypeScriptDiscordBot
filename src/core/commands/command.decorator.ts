import { interfaces } from 'inversify';
import { CommandContext } from './command-context';
import { CommandDefinition } from './command-definition';
type Newable<TConstructor> = interfaces.Newable<TConstructor>;

export function Command(name: string, trigger?: RegExp) {
    if (!trigger) {
        trigger = new RegExp(`^[?\`]${name}`);
    }

    return function <TConstructor extends Newable<CommandDefinition>>(
        CommandClass: TConstructor
    ) {
        return class extends CommandClass {
            name = name;
            parameters = [];
            trigger = trigger!;

            exec!: (
                context: CommandContext,
                commandArgs: Record<string, any>
            ) => void;
        };
    };
}
