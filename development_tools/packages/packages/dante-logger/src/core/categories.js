"use strict";
/**
 * Dante Logger Categories
 *
 * This file defines the categories for each realm of Dante's Divine Comedy:
 * - Inferno (Errors): The 9 circles of development hell
 * - Purgatorio (Warnings): The 7 terraces of purification
 * - Paradiso (Success): The 9 celestial spheres + Empyrean
 *
 * Each category has a name, emoji, and description that represents
 * its place in the Divine Comedy and its application to logging.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = exports.ParadisoCategories = exports.PurgatorioCategories = exports.InfernoCategories = void 0;
// Inferno (Error) categories with their corresponding circles
exports.InfernoCategories = {
    1: { name: 'Limbo', emoji: '👑🔥', description: 'Validation errors' },
    2: { name: 'Lust', emoji: '👑🌊', description: 'Data flow errors' },
    3: { name: 'Gluttony', emoji: '👑🍿', description: 'Resource consumption errors' },
    4: { name: 'Greed', emoji: '👑💰', description: 'Storage/caching errors' },
    5: { name: 'Wrath', emoji: '👑💢', description: 'Runtime exceptions' },
    6: { name: 'Heresy', emoji: '👑🔥', description: 'Configuration errors' },
    7: { name: 'Violence', emoji: '👑🌶️', description: 'Data corruption errors' },
    8: { name: 'Fraud', emoji: '👑🎭', description: 'Security violations' },
    9: { name: 'Treachery', emoji: '👑❄️', description: 'System-breaking errors' }
};
// Purgatorio (Warning) categories with their corresponding terraces
exports.PurgatorioCategories = {
    1: { name: 'Pride', emoji: '⚠️🪨', description: 'Deprecated feature usage' },
    2: { name: 'Envy', emoji: '⚠️👁️', description: 'Performance concerns' },
    3: { name: 'Wrath', emoji: '⚠️⚡', description: 'Resource warnings' },
    4: { name: 'Sloth', emoji: '⚠️🐌', description: 'Slow operations' },
    5: { name: 'Avarice', emoji: '⚠️💎', description: 'Excessive resource allocation' },
    6: { name: 'Gluttony', emoji: '⚠️🍽️', description: 'Memory leaks' },
    7: { name: 'Lust', emoji: '⚠️🔥', description: 'Potential security issues' }
};
// Paradiso (Success) categories with their corresponding celestial spheres
exports.ParadisoCategories = {
    1: { name: 'Moon', emoji: '😇🌙', description: 'Basic successful operations' },
    2: { name: 'Mercury', emoji: '😇☿️', description: 'Fast operations' },
    3: { name: 'Venus', emoji: '😇💖', description: 'User experience improvements' },
    4: { name: 'Sun', emoji: '😇☀️', description: 'Core functionality success' },
    5: { name: 'Mars', emoji: '😇⚔️', description: 'Security enhancements' },
    6: { name: 'Jupiter', emoji: '😇⚡', description: 'System-wide improvements' },
    7: { name: 'Saturn', emoji: '😇🪐', description: 'Architectural achievements' },
    8: { name: 'Fixed Stars', emoji: '😇✨', description: 'Major version releases' },
    9: { name: 'Primum Mobile', emoji: '😇🌌', description: 'Transformative innovations' },
    10: { name: 'Empyrean', emoji: '😇🌈', description: 'Perfect system harmony' }
};
// Export all categories
exports.Categories = {
    inferno: exports.InfernoCategories,
    purgatorio: exports.PurgatorioCategories,
    paradiso: exports.ParadisoCategories
};
//# sourceMappingURL=categories.js.map