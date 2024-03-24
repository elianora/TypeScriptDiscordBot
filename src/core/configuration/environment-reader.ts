import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { Injectable } from '../dependency-management';

@Injectable()
export class EnvironmentReader {
    private _secrets?: Record<string, string>;

    protected parseObject<TResult>(rawValue: string) {
        return JSON.parse(rawValue) as TResult;
    }

    protected tryParse<TResult>(varName: string, castFn: (rawVal: string) => TResult) {
        const rawValue = this.getValue(varName);
        return rawValue ? castFn(rawValue) : undefined;
    }

    getSecret(secretName: string): string | undefined {
        if (!this._secrets) {
            this._secrets = {};
            const secretsDirectory = process.env['SECRETS_DIRECTORY'] ?? resolve(process.cwd(), '.secrets');
            readdirSync(secretsDirectory).forEach(filename => {
                const rawValue = readFileSync(resolve(secretsDirectory, filename));
                this._secrets![filename] = rawValue.toString('utf-8').trimEnd();
            });
        }

        return this._secrets[secretName];
    }

    getValue(varName: string): string | undefined {
        return process.env[varName];
    }

    setValue<TValue>(varName: string, value: TValue): void {
        if (value) {
            process.env[varName] = JSON.stringify(value);
        }
    }

    tryParseArray<TResult extends any[]>(varName: string) {
        return this.tryParseObject<TResult>(varName);
    }

    tryParseBigInt(varName: string) {
        return this.tryParse(varName, BigInt);
    }

    tryParseBoolean(varName: string) {
        return this.tryParseObject<boolean>(varName);
    }

    tryParseNumber(varName: string) {
        return this.tryParse(varName, Number);
    }

    tryParseObject<TResult>(varName: string) {
        return this.tryParse(varName, (rawValue) => this.parseObject<TResult>(rawValue));
    }

    tryParseString(varName: string) {
        return this.tryParse(varName, String);
    }
}
