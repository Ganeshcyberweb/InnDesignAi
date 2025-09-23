import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

import { type Transition, cubicBezier } from 'framer-motion';

export const easing = {
  smooth: cubicBezier(0.4, 0, 0.2, 1),
  smoothIn: cubicBezier(0.4, 0, 1, 1),
  smoothOut: cubicBezier(0, 0, 0.2, 1)
};

export const transitions: Record<string, Transition> = {
  default: {
    type: "tween",
    duration: 0.3,
    ease: easing.smooth
  },
  spring: {
    type: "spring",
    damping: 15,
    stiffness: 150
  },
  stagger: {
    staggerChildren: 0.1
  }
};

export const tapVariant = {
  tap: { scale: 0.98 }
};