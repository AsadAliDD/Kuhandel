import { motion, type HTMLMotionProps } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export function MotionPage({ children, ...props }: PropsWithChildren<HTMLMotionProps<'div'>>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({ children, ...props }: PropsWithChildren<HTMLMotionProps<'div'>>) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
