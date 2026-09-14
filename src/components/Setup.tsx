import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { MarketScene } from './MarketScene';

interface SetupProps {
  onStart: (names: string[]) => void;
  onResume: () => void;
  canResume: boolean;
}

export function Setup({ onStart, onResume, canResume }: SetupProps) {
  const [count, setCount] = useState(3);
  const [names, setNames] = useState(['Alex', 'Blake', 'Casey', '', '']);

  return (
    <main className="setup">
      <motion.section
        className="setup-copy"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="landing-badge"><i /> Digital card game</div>
        <h1>Your farm.<br />Your deal.<br /><em>Your victory.</em></h1>
        <p>Bid for animals, bluff your friends, and build the most valuable farm. The classic game, reimagined.</p>
        <div className="rule-chips"><span><b>2–5</b> Players</span><span><b>40–60</b> Minutes</span><span><b>∞</b> Farmyard fun</span></div>
        <MarketScene />
      </motion.section>
      <motion.section
        className="setup-card card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
      >
        <div className="setup-card-head"><div className="brand-mark">KH</div><span>KUHHANDEL<small>THE AUCTION GAME</small></span></div>
        <p className="kicker">Create a new game</p>
        <h2>Who's trading today?</h2>
        <label>Number of players</label>
        <div className="segment">
          {[2, 3, 4, 5].map((amount) => <button aria-pressed={count === amount} onClick={() => setCount(amount)} key={amount}>{amount}</button>)}
        </div>
        <div className="names">
          {names.slice(0, count).map((name, index) => (
            <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} key={index}>
              <span>{index + 1}</span>
              <input
                aria-label={`Player ${index + 1} name`}
                value={name}
                onChange={(event) => setNames((current) => current.map((value, item) => item === index ? event.target.value : value))}
              />
            </motion.label>
          ))}
        </div>
        <Button onClick={() => onStart(names.slice(0, count))}>Start game <ArrowRight size={18} /></Button>
        {canResume && <Button variant="ghost" onClick={onResume}><RotateCcw size={16} /> Resume last game</Button>}
      </motion.section>
    </main>
  );
}
