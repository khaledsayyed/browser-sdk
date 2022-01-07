"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeTransportConfiguration = void 0;
var tslib_1 = require("tslib");
var init_1 = require("../../boot/init");
var utils_1 = require("../../tools/utils");
var endpointBuilder_1 = require("./endpointBuilder");
var tags_1 = require("./tags");
function computeTransportConfiguration(initConfiguration, buildEnv) {
    var tags = (0, tags_1.buildTags)(initConfiguration);
    var endpointBuilders = computeEndpointBuilders(initConfiguration, buildEnv, tags);
    var intakeEndpoints = (0, utils_1.objectValues)(endpointBuilders).map(function (builder) { return builder.buildIntakeUrl(); });
    var replicaConfiguration = computeReplicaConfiguration(initConfiguration, buildEnv, intakeEndpoints, tags);
    return (0, tslib_1.__assign)((0, tslib_1.__assign)({ isIntakeUrl: function (url) { return intakeEndpoints.some(function (intakeEndpoint) { return url.indexOf(intakeEndpoint) === 0; }); } }, endpointBuilders), { replica: replicaConfiguration });
}
exports.computeTransportConfiguration = computeTransportConfiguration;
function computeEndpointBuilders(initConfiguration, buildEnv, tags) {
    if (buildEnv.buildMode === init_1.BuildMode.E2E_TEST) {
        var e2eEndpointBuilder = function (placeholder) { return ({
            build: function () { return placeholder; },
            buildIntakeUrl: function () { return placeholder; },
        }); };
        return {
            logsEndpointBuilder: e2eEndpointBuilder('<<< E2E LOGS ENDPOINT >>>'),
            rumEndpointBuilder: e2eEndpointBuilder('<<< E2E RUM ENDPOINT >>>'),
            sessionReplayEndpointBuilder: e2eEndpointBuilder('<<< E2E SESSION REPLAY ENDPOINT >>>'),
            internalMonitoringEndpointBuilder: e2eEndpointBuilder('<<< E2E INTERNAL MONITORING ENDPOINT >>>'),
        };
    }
    var endpointBuilders = {
        logsEndpointBuilder: (0, endpointBuilder_1.createEndpointBuilder)(initConfiguration, buildEnv, 'logs', tags),
        rumEndpointBuilder: (0, endpointBuilder_1.createEndpointBuilder)(initConfiguration, buildEnv, 'rum', tags),
        sessionReplayEndpointBuilder: (0, endpointBuilder_1.createEndpointBuilder)(initConfiguration, buildEnv, 'sessionReplay', tags),
    };
    if (initConfiguration.internalMonitoringApiKey) {
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, endpointBuilders), { internalMonitoringEndpointBuilder: (0, endpointBuilder_1.createEndpointBuilder)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, initConfiguration), { clientToken: initConfiguration.internalMonitoringApiKey }), buildEnv, 'logs', tags, 'browser-agent-internal-monitoring') });
    }
    return endpointBuilders;
}
function computeReplicaConfiguration(initConfiguration, buildEnv, intakeEndpoints, tags) {
    if (!initConfiguration.replica) {
        return;
    }
    var replicaConfiguration = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, initConfiguration), { site: endpointBuilder_1.INTAKE_SITE_US, clientToken: initConfiguration.replica.clientToken });
    var replicaEndpointBuilders = {
        logsEndpointBuilder: (0, endpointBuilder_1.createEndpointBuilder)(replicaConfiguration, buildEnv, 'logs', tags),
        rumEndpointBuilder: (0, endpointBuilder_1.createEndpointBuilder)(replicaConfiguration, buildEnv, 'rum', tags),
        internalMonitoringEndpointBuilder: (0, endpointBuilder_1.createEndpointBuilder)(replicaConfiguration, buildEnv, 'logs', tags, 'browser-agent-internal-monitoring'),
    };
    intakeEndpoints.push.apply(intakeEndpoints, (0, utils_1.objectValues)(replicaEndpointBuilders).map(function (builder) { return builder.buildIntakeUrl(); }));
    return (0, tslib_1.__assign)({ applicationId: initConfiguration.replica.applicationId }, replicaEndpointBuilders);
}
//# sourceMappingURL=transportConfiguration.js.map