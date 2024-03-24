import { CommandContext } from './command-context';
import { ParameterDefinition } from './parameter-definition';

export abstract class CommandDefinition {
    name!: string;
    trigger!: RegExp;
    parameters: ParameterDefinition[] = [];

    abstract exec: (
        context: CommandContext,
        commandArgs: Record<string, any>
    ) => void;
}
