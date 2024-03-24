import { BindingScopeEnum, Container } from 'inversify';

export const dependencyManager = new Container({
    autoBindInjectable: true,
    defaultScope: BindingScopeEnum.Singleton,
    skipBaseClassChecks: true
});
