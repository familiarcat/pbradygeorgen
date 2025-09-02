"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextConfig = {
    // Removed 'output: export' to enable SSR capabilities
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
    reactStrictMode: true,
};
exports.default = nextConfig;
//# sourceMappingURL=next.config.js.map