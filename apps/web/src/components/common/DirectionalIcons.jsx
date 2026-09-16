import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
} from 'lucide-react';
import { IS_RTL } from '../../locale.js';

// Icons whose MEANING is a reading direction ("forward", "back", "the panel
// on the start edge") — resolved once against the platform direction
// (src/locale.js) so call sites express intent, not a physical side.
// Fixed-meaning icons (Enter ⏎, play, a math arrow on an axis) must NOT go
// through here: they never mirror.
export const ArrowForward = IS_RTL ? ArrowLeft : ArrowRight;
export const ArrowBack = IS_RTL ? ArrowRight : ArrowLeft;
export const ChevronForward = IS_RTL ? ChevronLeft : ChevronRight;
export const ChevronBack = IS_RTL ? ChevronRight : ChevronLeft;
export const PanelStartOpen = IS_RTL ? PanelRightOpen : PanelLeftOpen;
export const PanelStartClose = IS_RTL ? PanelRightClose : PanelLeftClose;
