import { Eye, Users, ClipboardCheck, HeartHandshake, ShieldCheck, ClipboardList, Sparkles } from 'lucide-react';

// أسماء الأيقونات اللي جاية من الداتا (services.items[].icon و home.cardIcons)
const MAP = {
  eye: Eye,
  users: Users,
  'clipboard-check': ClipboardCheck,
  'heart-handshake': HeartHandshake,
  shield: ShieldCheck,
  clipboard: ClipboardList,
};

export default function Icon({ name, className = 'h-6 w-6' }) {
  const C = MAP[name] || Sparkles;
  return <C className={className} aria-hidden="true" />;
}
