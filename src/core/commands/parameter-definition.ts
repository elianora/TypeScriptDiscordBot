import { ParameterType } from './parameter-type';

export class ParameterDefinition {
    get isFlag() {
        return (this.type & ParameterType.Flag) === ParameterType.Flag;
    }

    get isMandatory() {
        return (this.type & ParameterType.Mandatory) === ParameterType.Mandatory;
    }

    get isOptional() {
        return (this.type & ParameterType.Optional) === ParameterType.Optional;
    }

    get positionMatters() {
        return (this.type & ParameterType.PositionMatters) === ParameterType.PositionMatters;
    }

    get usageString() {
        if (this.isFlag) {
            return `[.${this.name} <value>]`;
        }

        if (this.isOptional) {
            return `[${this.name}]`;
        }

        return this.name;
    }

    constructor(
        public name: string,
        public trigger: RegExp,
        public type: ParameterType
    ) {
        let rawTrigger = `\\s+${trigger.source}`;
        if (this.isOptional && !this.isFlag) {
            rawTrigger = `(?:${rawTrigger})?`;
        }

        this.trigger = new RegExp(rawTrigger, trigger.flags);
    }
}
