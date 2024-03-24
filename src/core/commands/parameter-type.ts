export enum ParameterType {
    Flag = 1 << 0,
    Mandatory = 1 << 1,
    Optional = 1 << 2,
    PositionMatters = 1 << 3
}
