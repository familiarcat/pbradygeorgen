"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DanteAgilePage;
const react_1 = require("react");
const DanteAgileLayout_1 = __importDefault(require("@/components/dante-agile/DanteAgileLayout"));
const DanteLogger_1 = require("@/utils/DanteLogger");
function DanteAgilePage() {
    const [activeTab, setActiveTab] = (0, react_1.useState)('dashboard');
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        DanteLogger_1.DanteLogger.success.ux(`Navigated to ${tab} tab`);
    };
    return (<DanteAgileLayout_1.default activeTab={activeTab} onTabChange={handleTabChange}/>);
}
//# sourceMappingURL=page.js.map