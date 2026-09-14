import { AnimatePresence, motion } from 'framer-motion';
import { ANIMALS, type Player } from '../game/types';
import { animalCount } from '../game/rules';

const gridMotion = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.08 } },
};

const cardMotion = {
  hidden: { opacity: 0, y: 22, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring' as const, stiffness: 320, damping: 24 },
  },
};

export function AnimalCollection({ player }: { player: Player }) {
  return (
    <motion.section className="collection card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <header>
        <div><span className="kicker">Your livestock</span><h2>Animal collection</h2></div>
        <span>{player.animals.length} cards</span>
      </header>
      <motion.div className="animal-grid" variants={gridMotion} initial="hidden" animate="visible">
        {ANIMALS.map((animal, animalIndex) => {
          const count = animalCount(player, animal.id);
          return (
            <motion.article
              className={`animal-card ${count === 4 ? 'complete' : ''} ${!count ? 'empty' : ''}`}
              key={animal.id}
              variants={cardMotion}
              whileHover={{ y: -8, rotate: count ? 1.5 : 0, scale: 1.035 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              <motion.span
                className="animal-emoji"
                aria-hidden="true"
                animate={count ? { y: [0, -5, 0], rotate: [0, -3, 3, 0] } : { y: [0, -2, 0] }}
                transition={{ duration: count ? 2.1 : 3.2, repeat: Infinity, delay: animalIndex * 0.16 }}
              >
                {animal.emoji}
              </motion.span>
              <strong>{animal.name}</strong>
              <small>{animal.value} points</small>
              <div className="pips" aria-label={`${count} von 4 cards`}>
                {[0, 1, 2, 3].map((index) => <i className={index < count ? 'filled' : ''} key={index} />)}
              </div>
              <AnimatePresence>
                {count === 4 && <motion.b initial={{ scale: 0, y: 5 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }}>Complete set!</motion.b>}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
