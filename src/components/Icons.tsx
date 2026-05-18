'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  children, size = 22, className, color = 'currentColor', strokeWidth = 1.75,
}) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >{children}</svg>
);

export const IconHome = (p: IconProps) => <Icon {...p}><path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2h-3.5v-7h-7v7H5a2 2 0 0 1-2-2z"/></Icon>;
export const IconWallet = (p: IconProps) => <Icon {...p}><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M16 15h2"/></Icon>;
export const IconGlobe = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></Icon>;
export const IconInbox = (p: IconProps) => <Icon {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></Icon>;
export const IconMore = (p: IconProps) => <Icon {...p}><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></Icon>;
export const IconPlus = (p: IconProps) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>;
export const IconFilter = (p: IconProps) => <Icon {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></Icon>;
export const IconSearch = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>;
export const IconBell = (p: IconProps) => <Icon {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Icon>;
export const IconChevRight = (p: IconProps) => <Icon {...p}><polyline points="9 18 15 12 9 6"/></Icon>;
export const IconClose = (p: IconProps) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>;
export const IconArrowUp = (p: IconProps) => <Icon {...p}><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></Icon>;
export const IconArrowDown = (p: IconProps) => <Icon {...p}><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></Icon>;
export const IconEye = (p: IconProps) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></Icon>;
export const IconEyeOff = (p: IconProps) => <Icon {...p}><path d="M3 3l18 18"/><path d="M10.6 6.1a10.7 10.7 0 0 1 1.4-.1c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3 4"/><path d="M6.6 6.6A18.7 18.7 0 0 0 2 12s3.5 7 10 7c1.5 0 2.9-.3 4.1-.8"/></Icon>;
export const IconTrend = (p: IconProps) => <Icon {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></Icon>;
export const IconCheck = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15.5 9.5"/></Icon>;
export const IconClock = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></Icon>;
export const IconAlert = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16.5"/></Icon>;
export const IconBuilding = (p: IconProps) => <Icon {...p}><path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></Icon>;
export const IconDroplet = (p: IconProps) => <Icon {...p}><path d="M12 2.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></Icon>;
export const IconZap = (p: IconProps) => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
export const IconWifi = (p: IconProps) => <Icon {...p}><path d="M5 12.55a11 11 0 0 1 14 0"/><path d="M2 8.82a16 16 0 0 1 20 0"/><path d="M8.5 16.3a6 6 0 0 1 7 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></Icon>;
export const IconCalc = (p: IconProps) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="12" x2="9" y2="12"/><line x1="12" y1="12" x2="13" y2="12"/><line x1="16" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="9" y2="16"/><line x1="12" y1="16" x2="13" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></Icon>;
export const IconUsers = (p: IconProps) => <Icon {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="3.5"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/><path d="M17 3.13a4 4 0 0 1 0 7.75"/></Icon>;
export const IconReceipt = (p: IconProps) => <Icon {...p}><path d="M5 2h14v20l-3-2-2 2-2-2-2 2-2-2-3 2z"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></Icon>;
export const IconBank = (p: IconProps) => <Icon {...p}><path d="M3 9l9-6 9 6"/><rect x="3" y="9" width="18" height="12"/><line x1="7" y1="13" x2="7" y2="18"/><line x1="12" y1="13" x2="12" y2="18"/><line x1="17" y1="13" x2="17" y2="18"/></Icon>;
export const IconBook = (p: IconProps) => <Icon {...p}><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></Icon>;
export const IconShopping = (p: IconProps) => <Icon {...p}><path d="M6 7h12l-1 13H7z"/><path d="M9 7V5a3 3 0 1 1 6 0v2"/></Icon>;
export const IconGift = (p: IconProps) => <Icon {...p}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></Icon>;
export const IconCoins = (p: IconProps) => <Icon {...p}><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="M16.71 13.88l.7.71-2.82 2.82"/></Icon>;
export const IconCap = (p: IconProps) => <Icon {...p}><path d="M22 10l-10-5L2 10l10 5 10-5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></Icon>;
export const IconTool = (p: IconProps) => <Icon {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3-3a6 6 0 0 1-8 8L4.7 21a2.4 2.4 0 0 1-3.4-3.4l6.7-6.7a6 6 0 0 1 8-8z"/></Icon>;
export const IconMessage = (p: IconProps) => <Icon {...p}><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></Icon>;
export const IconSparkles = (p: IconProps) => <Icon {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l.7 2.1 2.1.7-2.1.7L19 19.6l-.7-2.1-2.1-.7 2.1-.7z"/></Icon>;
export const IconServer = (p: IconProps) => <Icon {...p}><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><line x1="6" y1="6.5" x2="6" y2="6.5"/><line x1="6" y1="17.5" x2="6" y2="17.5"/></Icon>;
export const IconCloud = (p: IconProps) => <Icon {...p}><path d="M18 18a4 4 0 0 0 0-8 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6 18z"/></Icon>;
export const IconInstagram = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="0.6"/></Icon>;
export const IconGrid = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></Icon>;
export const IconMegaphone = (p: IconProps) => <Icon {...p}><path d="M3 11v2a2 2 0 0 0 2 2h2l5 5V4L7 9H5a2 2 0 0 0-2 2z"/><path d="M16 8a4 4 0 0 1 0 8"/></Icon>;
export const IconCard = (p: IconProps) => <Icon {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></Icon>;
export const IconWorkflow = (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M6 9v3a2 2 0 0 0 2 2h2"/><path d="M18 9v3a2 2 0 0 1-2 2h-2"/></Icon>;

const iconMap: Record<string, React.FC<IconProps>> = {
  home: IconHome, wallet: IconWallet, globe: IconGlobe, inbox: IconInbox, more: IconMore,
  plus: IconPlus, filter: IconFilter, search: IconSearch, bell: IconBell,
  chevR: IconChevRight, close: IconClose, arrowUp: IconArrowUp, arrowDown: IconArrowDown,
  eye: IconEye, eyeOff: IconEyeOff, trend: IconTrend,
  check: IconCheck, clock: IconClock, alert: IconAlert,
  building: IconBuilding, droplet: IconDroplet, zap: IconZap, wifi: IconWifi,
  calc: IconCalc, users: IconUsers, receipt: IconReceipt, bank: IconBank,
  book: IconBook, shopping: IconShopping, gift: IconGift, coins: IconCoins,
  cap: IconCap, tool: IconTool, message: IconMessage, sparkles: IconSparkles,
  server: IconServer, cloud: IconCloud, instagram: IconInstagram, grid: IconGrid,
  megaphone: IconMegaphone, card: IconCard, workflow: IconWorkflow,
};

export function IconByName({ name, ...props }: { name: string } & IconProps) {
  const C = iconMap[name] || IconReceipt;
  return <C {...props} />;
}
