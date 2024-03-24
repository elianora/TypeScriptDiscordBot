import { interfaces } from 'inversify';
import { CommandDefinition } from './command-definition';
import { ParameterDefinition } from './parameter-definition';
import { ParameterType } from './parameter-type';
type Newable<TConstructor> = interfaces.Newable<TConstructor>;

export function Parameter(name: string, trigger: RegExp, type?: ParameterType) {
    if (!type) {
        type = ParameterType.Mandatory;
    }

    return function <TConstructor extends Newable<CommandDefinition>>(
        CommandClass: TConstructor
    ) {
        return class extends CommandClass {
            constructor(...args: any[]) {
                super(...args);
                this.parameters.unshift(new ParameterDefinition(name, trigger, type!));
            }

            exec!: any;
        };
    };
}
