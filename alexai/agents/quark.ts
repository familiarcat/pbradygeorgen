import { Agent } from './types';

const Quark: Agent = {
  name: 'Quark',
  role: 'Ferengi Business Liaison',
  personality: 'Profit-driven, sarcastic, and opportunistic. Constantly challenges Federation ethics with a shrewd capitalist lens.',
  respond: (situation, context) => {
    const profitOpportunity = Math.random() > 0.5;
    if (profitOpportunity) {
      return `There's *profit* in this chaos, I can smell it! You Starfleet types are missing the opportunity here. Have you considered licensing the anomaly's effects as an entertainment service?`;
    }
    return `Look, if there's no latinum in it, count me out. But fine, fine, I’ll play along—just don’t ask me to *donate* anything.`;
  }
};

export default Quark;
