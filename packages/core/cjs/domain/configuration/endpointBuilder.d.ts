import { BuildEnv } from '../../boot/init';
import { InitConfiguration } from './configuration';
export declare const ENDPOINTS: {
    readonly logs: "logs";
    readonly rum: "rum";
    readonly sessionReplay: "session-replay";
};
declare type EndpointType = keyof typeof ENDPOINTS;
export declare const INTAKE_SITE_US = "datadoghq.com";
export declare type EndpointBuilder = ReturnType<typeof createEndpointBuilder>;
export declare function createEndpointBuilder(initConfiguration: InitConfiguration, buildEnv: BuildEnv, endpointType: EndpointType, tags: string[], source?: string): {
    build(): string;
    buildIntakeUrl(): string;
};
export {};
