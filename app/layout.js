"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const Navigation_1 = __importDefault(require("@/components/Navigation"));
const ThemeProvider_1 = __importDefault(require("@/theme/ThemeProvider"));
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'AlexAI Crew System',
    description: 'Advanced AI crew coordination and workflow management system',
};
function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={inter.className}>
        <ThemeProvider_1.default>
          <Navigation_1.default />
          <main>
            {children}
          </main>
        </ThemeProvider_1.default>
      </body>
    </html>);
}
//# sourceMappingURL=layout.js.map