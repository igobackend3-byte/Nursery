import React from 'react';

export default function CategoryIllustration({ slug, className = "" }) {
  // Common organic, hand-drawn style SVGs for each category
  // Colors match a premium botanical/e-commerce vibe
  const illustrations = {
    'indoor-plants': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 85 C 30 85, 35 60, 35 60 L 65 60 C 65 60, 70 85, 50 85 Z" fill="#f4a5c9"/>
        <path d="M40 70 C 45 75, 55 75, 60 70" fill="none" stroke="#e889b2" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 60 Q 50 30 30 20 Q 20 40 50 60" fill="#007f5f"/>
        <path d="M50 60 Q 60 25 80 30 Q 75 55 50 60" fill="#2b9348"/>
        <path d="M50 60 Q 30 40 20 60 Q 35 75 50 60" fill="#55a630"/>
        <path d="M50 60 Q 70 45 80 65 Q 65 75 50 60" fill="#80b918"/>
        <path d="M50 60 L 50 20" fill="none" stroke="#004b23" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'outdoor-plants': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 85 L 60 85 L 65 60 L 35 60 Z" fill="#d08c60"/>
        <path d="M30 60 L 70 60 L 70 55 L 30 55 Z" fill="#b5651d"/>
        <path d="M50 55 L 50 40" fill="none" stroke="#5c4033" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="50" cy="30" r="18" fill="#55a630"/>
        <circle cx="35" cy="40" r="14" fill="#2b9348"/>
        <circle cx="65" cy="40" r="14" fill="#80b918"/>
      </svg>
    ),
    'succulents': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M35 80 C 25 80, 20 65, 20 65 L 80 65 C 80 65, 75 80, 65 80 Z" fill="#8ab17d"/>
        <path d="M50 65 Q 25 45 35 30 Q 50 50 50 65" fill="#aacc00"/>
        <path d="M50 65 Q 75 45 65 30 Q 50 50 50 65" fill="#aacc00"/>
        <path d="M50 65 Q 15 60 20 45 Q 40 55 50 65" fill="#bfd200"/>
        <path d="M50 65 Q 85 60 80 45 Q 60 55 50 65" fill="#bfd200"/>
        <path d="M50 65 Q 50 25 50 25 Q 55 45 50 65" fill="#d4d700"/>
      </svg>
    ),
    'cactus': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 85 L 60 85 L 65 65 L 35 65 Z" fill="#ffb703"/>
        <path d="M43 65 L 43 30 C 43 20 57 20 57 30 L 57 65 Z" fill="#2b9348"/>
        <path d="M57 45 Q 70 45 70 35 L 70 30" fill="none" stroke="#2b9348" strokeWidth="8" strokeLinecap="round"/>
        <path d="M43 55 Q 30 55 30 45 L 30 40" fill="none" stroke="#2b9348" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="50" cy="20" r="4" fill="#fb8500"/>
      </svg>
    ),
    'palms': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 35 Q 20 20 10 45 Q 25 40 50 35" fill="#2d6a4f"/>
        <path d="M50 35 Q 80 20 90 45 Q 75 40 50 35" fill="#2d6a4f"/>
        <path d="M50 35 Q 25 5 15 20 Q 35 20 50 35" fill="#40916c"/>
        <path d="M50 35 Q 75 5 85 20 Q 65 20 50 35" fill="#40916c"/>
        <path d="M50 35 Q 40 0 50 5 Q 60 0 50 35" fill="#52b788"/>
        <path d="M50 35 Q 30 35 20 55 Q 35 50 50 35" fill="#74c69d"/>
        <path d="M50 35 Q 70 35 80 55 Q 65 50 50 35" fill="#74c69d"/>
        <path d="M47 65 Q 48 45 50 35 Q 52 45 53 65 Z" fill="#604b36"/>
        <path d="M47 60 Q 50 62 53 60" fill="none" stroke="#4a3a2a" strokeWidth="1"/>
        <path d="M47 55 Q 50 57 53 55" fill="none" stroke="#4a3a2a" strokeWidth="1"/>
        <path d="M47 50 Q 50 52 53 50" fill="none" stroke="#4a3a2a" strokeWidth="1"/>
        <path d="M48 45 Q 50 47 52 45" fill="none" stroke="#4a3a2a" strokeWidth="1"/>
        <path d="M35 85 L 65 85 L 68 65 L 32 65 Z" fill="#b08d6a"/>
        <path d="M31 65 L 69 65" fill="none" stroke="#8b5a2b" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'bonsai': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="65" cy="25" r="12" fill="#1b4332"/>
        <circle cx="55" cy="20" r="10" fill="#2d6a4f"/>
        <circle cx="72" cy="30" r="10" fill="#40916c"/>
        <circle cx="45" cy="45" r="14" fill="#1b4332"/>
        <circle cx="35" cy="40" r="11" fill="#2d6a4f"/>
        <circle cx="50" cy="50" r="9" fill="#40916c"/>
        <circle cx="30" cy="55" r="12" fill="#2d6a4f"/>
        <circle cx="22" cy="52" r="9" fill="#52b788"/>
        <path d="M45 80 Q 40 60 55 45 Q 65 35 60 25 Q 55 35 50 45 Q 35 60 48 80 Z" fill="#5c4033"/>
        <path d="M45 80 Q 30 75 35 80" fill="none" stroke="#5c4033" strokeWidth="2"/>
        <rect x="25" y="80" width="50" height="8" rx="2" fill="#2b2d42"/>
        <rect x="23" y="77" width="54" height="4" rx="1" fill="#8d99ae"/>
      </svg>
    ),
    'orchids': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 85 C 35 85, 35 65, 35 65 L 65 65 C 65 65, 65 85, 60 85 Z" fill="#e9edc9"/>
        <path d="M50 65 L 50 20" fill="none" stroke="#55a630" strokeWidth="2"/>
        <path d="M50 65 Q 30 60 25 75 Q 40 70 50 65" fill="#8ab17d"/>
        <path d="M50 65 Q 70 60 75 75 Q 60 70 50 65" fill="#8ab17d"/>
        <circle cx="45" cy="45" r="5" fill="#ffb703"/>
        <circle cx="55" cy="30" r="5" fill="#ffb703"/>
        <circle cx="45" cy="15" r="5" fill="#ffb703"/>
        <path d="M45 45 Q 35 45 40 35 Q 50 40 45 45" fill="#fb8500"/>
        <path d="M55 30 Q 65 30 60 20 Q 50 25 55 30" fill="#fb8500"/>
        <path d="M45 15 Q 35 15 40 5 Q 50 10 45 15" fill="#fb8500"/>
      </svg>
    ),
    'bromeliads': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 70 Q 20 60 10 70 Q 30 75 50 70" fill="#2b9348"/>
        <path d="M50 70 Q 80 60 90 70 Q 70 75 50 70" fill="#2b9348"/>
        <path d="M50 70 Q 25 45 15 50 Q 35 60 50 70" fill="#55a630"/>
        <path d="M50 70 Q 75 45 85 50 Q 65 60 50 70" fill="#55a630"/>
        <path d="M50 70 Q 35 30 25 35 Q 40 55 50 70" fill="#80b918"/>
        <path d="M50 70 Q 65 30 75 35 Q 60 55 50 70" fill="#80b918"/>
        <path d="M50 70 L 40 45 L 50 25 L 60 45 Z" fill="#d00000"/>
        <path d="M50 60 L 35 40 L 50 20 L 65 40 Z" fill="#dc2f02"/>
        <path d="M50 50 L 42 30 L 50 15 L 58 30 Z" fill="#f48c06"/>
        <path d="M50 40 L 46 25 L 50 10 L 54 25 Z" fill="#faa307"/>
        <path d="M38 85 L 62 85 L 65 70 L 35 70 Z" fill="#fefae0"/>
        <path d="M33 70 L 67 70" fill="none" stroke="#dda15e" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'ferns': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 65 C 25 50, 5 35, 15 25 C 25 35, 35 50, 50 65" fill="#2d6a4f"/>
        <path d="M50 65 C 75 50, 95 35, 85 25 C 75 35, 65 50, 50 65" fill="#2d6a4f"/>
        <path d="M50 65 C 30 35, 15 15, 30 10 C 35 25, 45 45, 50 65" fill="#40916c"/>
        <path d="M50 65 C 70 35, 85 15, 70 10 C 65 25, 55 45, 50 65" fill="#40916c"/>
        <path d="M50 65 C 45 30, 40 5, 50 5 C 60 5, 55 30, 50 65" fill="#52b788"/>
        <path d="M47 35 L 43 32 M 53 35 L 57 32 M 48 25 L 45 22 M 52 25 L 55 22" fill="none" stroke="#74c69d" strokeWidth="2" strokeLinecap="round"/>
        <path d="M38 45 L 34 40 M 62 45 L 66 40 M 30 35 L 26 30 M 70 35 L 74 30" fill="none" stroke="#74c69d" strokeWidth="2" strokeLinecap="round"/>
        <path d="M35 85 L 65 85 L 68 65 L 32 65 Z" fill="#bc6c25"/>
        <path d="M30 65 L 70 65" fill="none" stroke="#dda15e" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'hanging-basket-plants': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L 25 35" fill="none" stroke="#a98467" strokeWidth="2"/>
        <path d="M50 5 L 75 35" fill="none" stroke="#a98467" strokeWidth="2"/>
        <path d="M50 5 L 50 35" fill="none" stroke="#a98467" strokeWidth="1"/>
        <circle cx="50" cy="5" r="3" fill="#6c584c"/>
        <path d="M25 35 L 75 35 C 75 55, 65 65, 50 65 C 35 65, 25 55, 25 35 Z" fill="#8b5a2b"/>
        <path d="M25 35 L 75 35" fill="none" stroke="#6b4423" strokeWidth="3" strokeLinecap="round"/>
        <path d="M30 45 L 70 45 M 35 55 L 65 55" fill="none" stroke="#6b4423" strokeWidth="1"/>
        <path d="M30 35 C 20 50, 10 70, 20 85 C 25 70, 30 50, 35 35" fill="#40916c"/>
        <path d="M45 35 C 35 60, 30 80, 40 95 C 45 80, 50 60, 50 35" fill="#2d6a4f"/>
        <path d="M60 35 C 65 60, 75 80, 65 90 C 55 75, 55 55, 55 35" fill="#52b788"/>
        <path d="M75 35 C 85 50, 95 65, 85 75 C 80 65, 70 50, 70 35" fill="#74c69d"/>
      </svg>
    ),
    'herbs': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 65 L 50 20" fill="none" stroke="#386641" strokeWidth="3" strokeLinecap="round"/>
        <path d="M47 50 L 30 30" fill="none" stroke="#386641" strokeWidth="2" strokeLinecap="round"/>
        <path d="M53 55 L 70 35" fill="none" stroke="#386641" strokeWidth="2" strokeLinecap="round"/>
        <path d="M49 35 L 35 15" fill="none" stroke="#386641" strokeWidth="2" strokeLinecap="round"/>
        <path d="M51 40 L 65 20" fill="none" stroke="#386641" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="50" cy="18" rx="5" ry="8" fill="#6a994e"/>
        <ellipse cx="28" cy="28" rx="4" ry="7" fill="#6a994e" transform="rotate(-45 28 28)"/>
        <ellipse cx="72" cy="33" rx="4" ry="7" fill="#6a994e" transform="rotate(45 72 33)"/>
        <ellipse cx="33" cy="13" rx="4" ry="7" fill="#a7c957" transform="rotate(-30 33 13)"/>
        <ellipse cx="67" cy="18" rx="4" ry="7" fill="#a7c957" transform="rotate(30 67 18)"/>
        <ellipse cx="43" cy="30" rx="5" ry="8" fill="#a7c957" transform="rotate(-60 43 30)"/>
        <ellipse cx="57" cy="35" rx="5" ry="8" fill="#a7c957" transform="rotate(60 57 35)"/>
        <ellipse cx="40" cy="45" rx="4" ry="7" fill="#6a994e" transform="rotate(-70 40 45)"/>
        <ellipse cx="60" cy="48" rx="4" ry="7" fill="#6a994e" transform="rotate(70 60 48)"/>
        <path d="M38 85 L 62 85 L 65 65 L 35 65 Z" fill="#d4a373"/>
        <rect x="33" y="60" width="34" height="6" rx="2" fill="#faedcd"/>
      </svg>
    ),
    'fruit-plants': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 85 C 35 85, 35 60, 35 60 L 65 60 C 65 60, 65 85, 60 85 Z" fill="#ffcdb2"/>
        <path d="M50 60 L 50 30" fill="none" stroke="#5c4033" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="50" cy="30" r="20" fill="#80b918"/>
        <circle cx="40" cy="35" r="15" fill="#55a630"/>
        <circle cx="60" cy="35" r="15" fill="#2b9348"/>
        <circle cx="55" cy="25" r="4" fill="#e5989b"/>
        <circle cx="42" cy="20" r="4" fill="#ffb4a2"/>
        <circle cx="65" cy="38" r="4" fill="#ffb4a2"/>
      </svg>
    ),
    'table-top-plants': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="22" fill="#1b4332"/>
        <circle cx="35" cy="45" r="16" fill="#2d6a4f"/>
        <circle cx="65" cy="45" r="16" fill="#2d6a4f"/>
        <circle cx="50" cy="30" r="16" fill="#40916c"/>
        <circle cx="42" cy="55" r="12" fill="#52b788"/>
        <circle cx="58" cy="55" r="12" fill="#52b788"/>
        <circle cx="50" cy="45" r="14" fill="#74c69d"/>
        <circle cx="50" cy="45" r="6" fill="#b7e4c7"/>
        <path d="M40 85 L 60 85 L 63 65 L 37 65 Z" fill="#e9ecef"/>
        <rect x="35" y="60" width="30" height="5" rx="2" fill="#ced4da"/>
      </svg>
    ),
    'ceramic-pots': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 70 Q 20 50 35 25 Q 50 35 40 70 Z" fill="#95d5b2"/>
        <path d="M60 70 Q 80 50 65 25 Q 50 35 60 70 Z" fill="#74c69d"/>
        <path d="M50 70 Q 50 20 50 15 Q 60 30 50 70 Z" fill="#52b788"/>
        <path d="M25 45 Q50 90 75 45 Z" fill="#a8dadc"/>
        <ellipse cx="50" cy="45" rx="25" ry="6" fill="#f1faee"/>
        <path d="M25 45 Q50 90 75 45 Z" fill="#457b9d" opacity="0.1"/>
        <path d="M35 55 Q40 80 45 85 Q35 70 30 55 Z" fill="#ffffff" opacity="0.4"/>
        <path d="M25 45 Q50 60 75 45 L 73 48 Q 50 63 27 48 Z" fill="#e9c46a"/>
      </svg>
    ),
    'plastic-pots': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 80 L 40 20" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round"/>
        <path d="M48 80 L 48 30" fill="none" stroke="#40916c" strokeWidth="6" strokeLinecap="round"/>
        <path d="M56 80 L 56 25" fill="none" stroke="#52b788" strokeWidth="6" strokeLinecap="round"/>
        <path d="M64 80 L 64 35" fill="none" stroke="#74c69d" strokeWidth="6" strokeLinecap="round"/>
        <path d="M32 45 L 68 45 L 60 85 L 40 85 Z" fill="#ffb4a2"/>
        <rect x="28" y="35" width="44" height="10" rx="3" fill="#e5989b"/>
        <path d="M35 50 L 37 85 M 42 50 L 43 85 M 50 50 L 50 85 M 58 50 L 57 85 M 65 50 L 63 85" fill="none" stroke="#b5838d" strokeWidth="2" opacity="0.5"/>
      </svg>
    ),
    'terracotta-pots': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 70 Q 20 40 30 15 Q 45 35 50 70 Z" fill="#40916c"/>
        <path d="M50 70 Q 80 40 70 15 Q 55 35 50 70 Z" fill="#52b788"/>
        <path d="M50 70 Q 15 60 20 35 Q 40 50 50 70 Z" fill="#74c69d"/>
        <path d="M50 70 Q 85 60 80 35 Q 60 50 50 70 Z" fill="#95d5b2"/>
        <path d="M30 45 L70 45 L62 85 L38 85 Z" fill="#e76f51"/>
        <rect x="25" y="30" width="50" height="15" rx="2" fill="#f4a261"/>
        <path d="M30 55 Q40 60 50 55 Q60 60 70 55" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8"/>
        <path d="M32 65 Q40 70 50 65 Q60 70 68 65" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8"/>
        <circle cx="50" cy="75" r="2" fill="#ffffff" opacity="0.8"/>
        <circle cx="40" cy="75" r="2" fill="#ffffff" opacity="0.8"/>
        <circle cx="60" cy="75" r="2" fill="#ffffff" opacity="0.8"/>
      </svg>
    ),
    'decorative-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 60 Q 20 30 15 45 Q 35 55 50 60 Z" fill="#2d6a4f"/>
        <path d="M50 60 Q 30 10 40 15 Q 45 40 50 60 Z" fill="#40916c"/>
        <path d="M50 60 Q 70 10 60 15 Q 55 40 50 60 Z" fill="#52b788"/>
        <path d="M50 60 Q 80 30 85 45 Q 65 55 50 60 Z" fill="#74c69d"/>
        <path d="M35 50 L 65 50 L 60 80 L 40 80 Z" fill="#e9c46a"/>
        <path d="M35 50 L 45 80 L 55 80 L 65 50 Z" fill="#f4a261" opacity="0.5"/>
        <line x1="40" y1="80" x2="35" y2="90" stroke="#264653" strokeWidth="3" strokeLinecap="round"/>
        <line x1="60" y1="80" x2="65" y2="90" stroke="#264653" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'metal-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 40 Q 25 20 30 50 C 35 80, 50 40, 50 40 Z" fill="#74c69d"/>
        <path d="M50 40 Q 75 20 70 50 C 65 80, 50 40, 50 40 Z" fill="#52b788"/>
        <path d="M50 40 Q 50 10 40 30 C 30 50, 50 40, 50 40 Z" fill="#95d5b2"/>
        <path d="M30 40 Q 50 45 70 40 L 65 80 Q 50 85 35 80 Z" fill="#b08d6a"/>
        <path d="M35 43 L 38 78 M 42 44 L 44 80 M 50 45 L 50 81 M 58 44 L 56 80 M 65 43 L 62 78" fill="none" stroke="#8b5a2b" strokeWidth="2"/>
        <ellipse cx="50" cy="40" rx="20" ry="4" fill="#d4a373"/>
      </svg>
    ),
    'hanging-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 55 C 30 75, 40 95, 45 85 C 50 75, 50 55, 50 55 Z" fill="#74c69d"/>
        <path d="M50 55 C 70 85, 60 95, 55 85 C 50 75, 50 55, 50 55 Z" fill="#52b788"/>
        <path d="M50 55 C 20 65, 30 80, 35 70 C 40 60, 50 55, 50 55 Z" fill="#95d5b2"/>
        <path d="M50 55 C 80 65, 70 80, 65 70 C 60 60, 50 55, 50 55 Z" fill="#b7e4c7"/>
        <path d="M30 45 Q50 75 70 45 Z" fill="#e76f51"/>
        <ellipse cx="50" cy="45" rx="20" ry="4" fill="#f4a261"/>
        <path d="M50 10 L30 45 M50 10 L70 45 M50 10 L50 45" fill="none" stroke="#faedcd" strokeWidth="2" strokeDasharray="3 3"/>
        <circle cx="50" cy="8" r="3" fill="none" stroke="#faedcd" strokeWidth="2"/>
        <path d="M35 53 L 45 65 L 55 65 L 65 53" fill="none" stroke="#faedcd" strokeWidth="2"/>
      </svg>
    ),
    'grow-bags': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 70 Q 20 30 35 15 Q 50 40 50 70 Z" fill="#2d6a4f"/>
        <path d="M50 70 Q 80 30 65 15 Q 50 40 50 70 Z" fill="#40916c"/>
        <path d="M50 70 Q 50 15 50 10 Q 60 30 50 70 Z" fill="#52b788"/>
        <circle cx="40" cy="30" r="5" fill="#d00000"/>
        <circle cx="65" cy="40" r="4" fill="#dc2f02"/>
        <circle cx="35" cy="50" r="4" fill="#d00000"/>
        <path d="M25 50 Q20 70 25 85 Q50 90 75 85 Q80 70 75 50 Q50 55 25 50 Z" fill="#495057"/>
        <path d="M35 55 Q35 35 45 40 M65 55 Q65 35 55 40" fill="none" stroke="#ced4da" strokeWidth="4" strokeLinecap="round"/>
        <path d="M26 50 Q 50 55 74 50" fill="none" stroke="#343a40" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    'grow-bags-containers': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 70 Q 20 30 35 15 Q 50 40 50 70 Z" fill="#2d6a4f"/>
        <path d="M50 70 Q 80 30 65 15 Q 50 40 50 70 Z" fill="#40916c"/>
        <path d="M50 70 Q 50 15 50 10 Q 60 30 50 70 Z" fill="#52b788"/>
        <circle cx="40" cy="30" r="5" fill="#d00000"/>
        <circle cx="65" cy="40" r="4" fill="#dc2f02"/>
        <circle cx="35" cy="50" r="4" fill="#d00000"/>
        <path d="M25 50 Q20 70 25 85 Q50 90 75 85 Q80 70 75 50 Q50 55 25 50 Z" fill="#495057"/>
        <path d="M35 55 Q35 35 45 40 M65 55 Q65 35 55 40" fill="none" stroke="#ced4da" strokeWidth="4" strokeLinecap="round"/>
        <path d="M26 50 Q 50 55 74 50" fill="none" stroke="#343a40" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    'self-watering-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 50 C 10 40, 20 15, 30 25 C 40 35, 45 45, 40 50 Z" fill="#2d6a4f"/>
        <path d="M60 50 C 90 40, 80 15, 70 25 C 60 35, 55 45, 60 50 Z" fill="#40916c"/>
        <path d="M50 50 C 20 20, 50 10, 50 10 C 50 10, 80 20, 50 50 Z" fill="#ffffff"/>
        <circle cx="50" cy="30" r="3" fill="#ffb703"/>
        <path d="M30 40 L70 40 L65 70 L35 70 Z" fill="#f8f9fa"/>
        <path d="M35 70 L65 70 L62 85 L38 85 Z" fill="#2a9d8f"/>
        <rect x="65" y="55" width="5" height="25" rx="2" fill="#cad2c5"/>
        <rect x="65" y="70" width="5" height="10" rx="2" fill="#00b4d8"/>
      </svg>
    ),
    'plant-stands': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 70 L 40 15" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 70 L 50 25" fill="none" stroke="#40916c" strokeWidth="6" strokeLinecap="round"/>
        <path d="M60 70 L 60 10" fill="none" stroke="#52b788" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="40" cy="15" r="8" fill="#1b4332"/>
        <circle cx="50" cy="25" r="8" fill="#2d6a4f"/>
        <circle cx="60" cy="10" r="8" fill="#40916c"/>
        <circle cx="35" cy="35" r="8" fill="#52b788"/>
        <circle cx="65" cy="30" r="8" fill="#74c69d"/>
        <path d="M32 45 L 68 45 L 65 65 L 35 65 Z" fill="#212529"/>
        <path d="M39 65 L 34 85 M 61 65 L 66 85" fill="none" stroke="#cb997e" strokeWidth="4" strokeLinecap="round"/>
        <line x1="37" y1="75" x2="63" y2="75" stroke="#cb997e" strokeWidth="3"/>
        <path d="M36 45 Q50 50 64 45" fill="none" stroke="#343a40" strokeWidth="2"/>
      </svg>
    ),
    'indoor-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 70 L 40 15" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 70 L 50 25" fill="none" stroke="#40916c" strokeWidth="6" strokeLinecap="round"/>
        <path d="M60 70 L 60 10" fill="none" stroke="#52b788" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="40" cy="15" r="8" fill="#1b4332"/>
        <circle cx="50" cy="25" r="8" fill="#2d6a4f"/>
        <circle cx="60" cy="10" r="8" fill="#40916c"/>
        <circle cx="35" cy="35" r="8" fill="#52b788"/>
        <circle cx="65" cy="30" r="8" fill="#74c69d"/>
        <path d="M32 45 L 68 45 L 65 65 L 35 65 Z" fill="#fdf0d5"/>
        <circle cx="50" cy="55" r="6" fill="#f4a261"/>
        <path d="M39 65 L 34 85 M 61 65 L 66 85" fill="none" stroke="#cb997e" strokeWidth="4" strokeLinecap="round"/>
        <line x1="37" y1="75" x2="63" y2="75" stroke="#cb997e" strokeWidth="3"/>
      </svg>
    ),
    'wall-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 Q 20 60 15 80 Q 25 70 30 40 Z" fill="#74c69d"/>
        <path d="M40 40 Q 30 70 25 90 Q 35 75 40 40 Z" fill="#52b788"/>
        <path d="M50 40 Q 45 75 45 95 Q 55 75 50 40 Z" fill="#40916c"/>
        <path d="M60 40 Q 70 70 75 90 Q 65 75 60 40 Z" fill="#74c69d"/>
        <path d="M70 40 Q 80 60 85 80 Q 75 70 70 40 Z" fill="#95d5b2"/>
        <path d="M25 25 Q50 65 75 25 Z" fill="#e76f51"/>
        <rect x="20" y="20" width="60" height="5" rx="2" fill="#d00000"/>
        <circle cx="50" cy="15" r="3" fill="#3d405b"/>
      </svg>
    ),
    'window-box-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="8" fill="#ffb4a2"/>
        <circle cx="50" cy="25" r="8" fill="#e5989b"/>
        <circle cx="70" cy="30" r="8" fill="#ffb4a2"/>
        <circle cx="40" cy="40" r="8" fill="#ffcdb2"/>
        <circle cx="60" cy="40" r="8" fill="#ffcdb2"/>
        <rect x="15" y="45" width="70" height="25" rx="2" fill="#fefae0"/>
        <path d="M20 45 L 20 70 M 80 45 L 80 70 M 35 45 L 35 70 M 65 45 L 65 70 M 50 45 L 50 70" fill="none" stroke="#dda15e" strokeWidth="2"/>
        <rect x="12" y="45" width="76" height="4" fill="#faedcd"/>
      </svg>
    ),
    'balcony-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 Q 20 60 30 70 Q 40 50 30 40 Z" fill="#40916c"/>
        <path d="M50 40 Q 50 65 50 80 Q 60 65 50 40 Z" fill="#52b788"/>
        <path d="M70 40 Q 80 60 70 70 Q 60 50 70 40 Z" fill="#74c69d"/>
        <rect x="20" y="35" width="60" height="25" rx="8" fill="#6c584c"/>
        <path d="M30 35 L30 20 Q30 10 40 10 L40 15 Q35 15 35 20 L35 35 M70 35 L70 20 Q70 10 60 10 L60 15 Q65 15 65 20 L65 35" fill="none" stroke="#adb5bd" strokeWidth="4"/>
        <rect x="18" y="35" width="64" height="6" rx="3" fill="#8a817c"/>
      </svg>
    ),
    'railing-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 Q 20 60 30 70 Q 40 50 30 40 Z" fill="#40916c"/>
        <path d="M50 40 Q 50 65 50 80 Q 60 65 50 40 Z" fill="#52b788"/>
        <path d="M70 40 Q 80 60 70 70 Q 60 50 70 40 Z" fill="#74c69d"/>
        <rect x="20" y="35" width="60" height="25" rx="8" fill="#6c584c"/>
        <path d="M30 35 L30 20 Q30 10 40 10 L40 15 Q35 15 35 20 L35 35 M70 35 L70 20 Q70 10 60 10 L60 15 Q65 15 65 20 L65 35" fill="none" stroke="#adb5bd" strokeWidth="4"/>
        <rect x="18" y="35" width="64" height="6" rx="3" fill="#8a817c"/>
      </svg>
    ),
    'seedling-trays': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M25 45 Q30 30 35 45 Q30 40 25 45 Z" fill="#aacc00"/>
        <path d="M45 45 Q50 30 55 45 Q50 40 45 45 Z" fill="#aacc00"/>
        <path d="M65 45 Q70 30 75 45 Q70 40 65 45 Z" fill="#aacc00"/>
        <path d="M20 55 Q25 40 30 55 Q25 50 20 55 Z" fill="#80b918"/>
        <path d="M40 55 Q45 40 50 55 Q45 50 40 55 Z" fill="#80b918"/>
        <path d="M60 55 Q65 40 70 55 Q65 50 60 55 Z" fill="#80b918"/>
        <rect x="15" y="55" width="70" height="20" rx="3" fill="#2b2d42"/>
        <path d="M25 55 L25 75 M35 55 L35 75 M45 55 L45 75 M55 55 L55 75 M65 55 L65 75 M75 55 L75 75" fill="none" stroke="#495057" strokeWidth="2"/>
        <path d="M15 65 L85 65" fill="none" stroke="#495057" strokeWidth="2"/>
        <rect x="13" y="55" width="74" height="4" rx="1" fill="#1b1c26"/>
      </svg>
    ),
    'nursery-pots': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M45 35 Q50 20 55 35 Q50 30 45 35 Z" fill="#74c69d"/>
        <path d="M55 35 Q60 20 65 35 Q60 30 55 35 Z" fill="#52b788"/>
        <path d="M35 35 L65 35 L60 65 L40 65 Z" fill="#495057"/>
        <rect x="32" y="32" width="36" height="5" fill="#343a40"/>
        <path d="M37 45 L63 45 L58 75 L42 75 Z" fill="#6c757d"/>
        <rect x="34" y="42" width="32" height="5" fill="#495057"/>
        <path d="M41 50 L59 50 M43 60 L57 60 M45 70 L55 70" fill="none" stroke="#adb5bd" strokeWidth="2" strokeDasharray="3 3"/>
      </svg>
    ),
    'coco-fibre-pots': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 35 C 30 20, 50 15, 50 35 Z" fill="#55a630"/>
        <path d="M60 35 C 70 20, 50 15, 50 35 Z" fill="#2b9348"/>
        <path d="M35 35 L65 35 L60 75 L40 75 Z" fill="#9c6644"/>
        <rect x="32" y="30" width="36" height="6" rx="2" fill="#7f4f24"/>
        <circle cx="45" cy="45" r="1.5" fill="#b08d6a"/>
        <circle cx="55" cy="50" r="1.5" fill="#b08d6a"/>
        <circle cx="48" cy="60" r="1.5" fill="#b08d6a"/>
        <circle cx="42" cy="65" r="1.5" fill="#b08d6a"/>
        <circle cx="58" cy="68" r="1.5" fill="#b08d6a"/>
        <circle cx="50" cy="70" r="1.5" fill="#b08d6a"/>
      </svg>
    ),
    'outdoor-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="30" r="22" fill="#2d6a4f"/>
        <circle cx="40" cy="25" r="12" fill="#40916c"/>
        <circle cx="60" cy="25" r="12" fill="#52b788"/>
        <circle cx="50" cy="20" r="15" fill="#74c69d"/>
        <path d="M30 40 L70 40 L62 85 L38 85 Z" fill="#ced4da"/>
        <rect x="25" y="35" width="50" height="8" rx="2" fill="#adb5bd"/>
        <path d="M35 45 L38 85 M45 45 L46 85 M55 45 L54 85 M65 45 L62 85" fill="none" stroke="#6c757d" strokeWidth="2"/>
      </svg>
    ),
    'cement-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 45 L 35 15 L 40 45 Z" fill="#55a630"/>
        <path d="M50 45 L 65 15 L 60 45 Z" fill="#2b9348"/>
        <path d="M50 45 L 50 10" fill="none" stroke="#007f5f" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 45 L 25 25 L 35 45 Z" fill="#80b918"/>
        <path d="M50 45 L 75 25 L 65 45 Z" fill="#55a630"/>
        <polygon points="25,45 75,45 65,85 35,85" fill="#adb5bd"/>
        <polygon points="25,45 50,85 35,85" fill="#6c757d"/>
        <polygon points="75,45 50,85 65,85" fill="#ced4da"/>
        <polygon points="50,45 25,45 50,85" fill="#e9ecef" opacity="0.5"/>
      </svg>
    ),
    'vertical-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 35 C 20 25, 20 45, 30 35 Z" fill="#aacc00"/>
        <path d="M70 35 C 80 25, 80 45, 70 35 Z" fill="#80b918"/>
        <path d="M25 55 C 15 45, 15 65, 25 55 Z" fill="#aacc00"/>
        <path d="M75 55 C 85 45, 85 65, 75 55 Z" fill="#80b918"/>
        <circle cx="25" cy="35" r="3" fill="#d00000"/>
        <circle cx="75" cy="55" r="3" fill="#dc2f02"/>
        <path d="M40 70 L60 70 L55 90 L45 90 Z" fill="#e76f51"/>
        <path d="M35 50 L65 50 L60 70 L40 70 Z" fill="#f4a261"/>
        <path d="M30 30 L70 30 L65 50 L35 50 Z" fill="#e76f51"/>
        <path d="M25 10 L75 10 L70 30 L30 30 Z" fill="#f4a261"/>
      </svg>
    ),
    'vertical-tower-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 35 C 20 25, 20 45, 30 35 Z" fill="#aacc00"/>
        <path d="M70 35 C 80 25, 80 45, 70 35 Z" fill="#80b918"/>
        <path d="M25 55 C 15 45, 15 65, 25 55 Z" fill="#aacc00"/>
        <path d="M75 55 C 85 45, 85 65, 75 55 Z" fill="#80b918"/>
        <circle cx="25" cy="35" r="3" fill="#d00000"/>
        <circle cx="75" cy="55" r="3" fill="#dc2f02"/>
        <path d="M40 70 L60 70 L55 90 L45 90 Z" fill="#e76f51"/>
        <path d="M35 50 L65 50 L60 70 L40 70 Z" fill="#f4a261"/>
        <path d="M30 30 L70 30 L65 50 L35 50 Z" fill="#e76f51"/>
        <path d="M25 10 L75 10 L70 30 L30 30 Z" fill="#f4a261"/>
      </svg>
    ),
    'wooden-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="30" r="8" fill="#f4a261"/>
        <circle cx="50" cy="25" r="8" fill="#e9c46a"/>
        <circle cx="65" cy="30" r="8" fill="#f4a261"/>
        <circle cx="45" cy="35" r="5" fill="#e76f51"/>
        <circle cx="55" cy="35" r="5" fill="#e76f51"/>
        <path d="M25 40 L75 40 L70 85 L30 85 Z" fill="#b08d6a"/>
        <path d="M25 40 L75 40" fill="none" stroke="#8b5a2b" strokeWidth="4"/>
        <path d="M28 55 L72 55" fill="none" stroke="#8b5a2b" strokeWidth="4"/>
        <path d="M29 70 L71 70" fill="none" stroke="#8b5a2b" strokeWidth="4"/>
        <path d="M30 85 L70 85" fill="none" stroke="#8b5a2b" strokeWidth="4"/>
        <line x1="35" y1="40" x2="38" y2="85" stroke="#8b5a2b" strokeWidth="2"/>
        <line x1="65" y1="40" x2="62" y2="85" stroke="#8b5a2b" strokeWidth="2"/>
      </svg>
    ),
    'rattan-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 45 C 10 30, 20 10, 50 45 Z" fill="#2d6a4f"/>
        <path d="M60 45 C 90 30, 80 10, 50 45 Z" fill="#40916c"/>
        <path d="M30 40 Q50 90 70 40 Z" fill="#d4a373"/>
        <path d="M30 40 Q50 50 70 40 Q50 30 30 40 Z" fill="#faedcd"/>
        <path d="M32 45 Q50 60 68 45" fill="none" stroke="#bc6c25" strokeWidth="3"/>
        <path d="M35 55 Q50 70 65 55" fill="none" stroke="#bc6c25" strokeWidth="3"/>
        <path d="M40 65 Q50 75 60 65" fill="none" stroke="#bc6c25" strokeWidth="3"/>
        <path d="M45 75 Q50 80 55 75" fill="none" stroke="#bc6c25" strokeWidth="3"/>
        <path d="M40 45 L40 70 M50 48 L50 80 M60 45 L60 70" fill="none" stroke="#bc6c25" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    ),
    'fibre-planters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M45 40 L 45 10" fill="none" stroke="#8ab17d" strokeWidth="4" strokeLinecap="round"/>
        <path d="M55 40 L 55 15" fill="none" stroke="#aacc00" strokeWidth="4" strokeLinecap="round"/>
        <path d="M35 40 L 35 20" fill="none" stroke="#bfd200" strokeWidth="3" strokeLinecap="round"/>
        <path d="M65 40 L 65 25" fill="none" stroke="#74c69d" strokeWidth="3" strokeLinecap="round"/>
        <path d="M45 25 L 50 20 M 55 30 L 60 25 M 35 30 L 40 25" fill="none" stroke="#8ab17d" strokeWidth="2" strokeLinecap="round"/>
        <path d="M25 50 Q50 90 75 50 Q75 35 50 35 Q25 35 25 50 Z" fill="#f8f9fa"/>
        <path d="M30 50 Q50 80 70 50 Q70 40 50 40 Q30 40 30 50 Z" fill="#e9ecef"/>
      </svg>
    ),
    'vegetable-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="55" r="16" fill="#e63946"/>
        <path d="M35 39 Q38 30 45 35 Q40 40 35 39" fill="#2a9d8f"/>
        <path d="M60 40 L65 75 L75 40 Z" fill="#f4a261"/>
        <path d="M67 40 Q60 25 55 30 Q65 35 67 40" fill="#2a9d8f"/>
        <path d="M67 40 Q75 25 80 30 Q70 35 67 40" fill="#2a9d8f"/>
        <ellipse cx="50" cy="80" rx="2" ry="3.5" fill="#dda15e"/>
        <ellipse cx="60" cy="83" rx="2" ry="3.5" fill="#dda15e" transform="rotate(45 60 83)"/>
        <ellipse cx="40" cy="85" rx="2" ry="3.5" fill="#dda15e" transform="rotate(-30 40 85)"/>
        <ellipse cx="70" cy="78" rx="2" ry="3.5" fill="#dda15e" transform="rotate(60 70 78)"/>
      </svg>
    ),
    'flower-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="45" r="12" fill="#ffb4a2"/>
        <circle cx="50" cy="35" r="12" fill="#ffb4a2"/>
        <circle cx="65" cy="45" r="12" fill="#ffb4a2"/>
        <circle cx="58" cy="60" r="12" fill="#ffb4a2"/>
        <circle cx="42" cy="60" r="12" fill="#ffb4a2"/>
        <circle cx="50" cy="49" r="10" fill="#ffcdb2"/>
        <circle cx="50" cy="49" r="4" fill="#e5989b"/>
        <ellipse cx="45" cy="78" rx="1.5" ry="3" fill="#6c584c"/>
        <ellipse cx="55" cy="80" rx="1.5" ry="3" fill="#6c584c" transform="rotate(30 55 80)"/>
        <ellipse cx="50" cy="85" rx="1.5" ry="3" fill="#6c584c" transform="rotate(-45 50 85)"/>
      </svg>
    ),
    'herb-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="35" rx="12" ry="20" fill="#6a994e"/>
        <ellipse cx="35" cy="50" rx="10" ry="16" fill="#a7c957" transform="rotate(-45 35 50)"/>
        <ellipse cx="65" cy="50" rx="10" ry="16" fill="#a7c957" transform="rotate(45 65 50)"/>
        <ellipse cx="40" cy="65" rx="8" ry="14" fill="#386641" transform="rotate(-60 40 65)"/>
        <ellipse cx="60" cy="65" rx="8" ry="14" fill="#386641" transform="rotate(60 60 65)"/>
        <circle cx="45" cy="82" r="2" fill="#dda15e"/>
        <circle cx="55" cy="80" r="2" fill="#dda15e"/>
        <circle cx="50" cy="86" r="2" fill="#dda15e"/>
        <circle cx="62" cy="85" r="2" fill="#dda15e"/>
        <circle cx="38" cy="81" r="2" fill="#dda15e"/>
      </svg>
    ),
    'fruit-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M25 55 A 25 25 0 0 0 75 55 Z" fill="#ff4d6d"/>
        <path d="M20 55 A 30 30 0 0 0 80 55 A 32 32 0 0 1 20 55 Z" fill="#2d6a4f"/>
        <ellipse cx="38" cy="65" rx="1.5" ry="3" fill="#1b4332" transform="rotate(-30 38 65)"/>
        <ellipse cx="50" cy="68" rx="1.5" ry="3" fill="#1b4332"/>
        <ellipse cx="62" cy="65" rx="1.5" ry="3" fill="#1b4332" transform="rotate(30 62 65)"/>
        <circle cx="65" cy="35" r="14" fill="#f4a261"/>
        <circle cx="60" cy="30" r="3" fill="#e76f51"/>
        <path d="M65 21 Q70 15 75 25 Q68 28 65 21" fill="#2a9d8f"/>
      </svg>
    ),
    'microgreen-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="70" width="50" height="12" rx="3" fill="#8d99ae"/>
        <rect x="22" y="66" width="56" height="4" rx="2" fill="#adb5bd"/>
        <path d="M30 66 Q25 40 35 35" fill="none" stroke="#a7c957" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 66 Q35 45 42 30" fill="none" stroke="#a7c957" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 66 Q50 35 55 35" fill="none" stroke="#a7c957" strokeWidth="2" strokeLinecap="round"/>
        <path d="M60 66 Q65 40 60 30" fill="none" stroke="#a7c957" strokeWidth="2" strokeLinecap="round"/>
        <path d="M70 66 Q75 45 68 35" fill="none" stroke="#a7c957" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="35" cy="35" rx="3" ry="5" fill="#6a994e" transform="rotate(45 35 35)"/>
        <ellipse cx="42" cy="30" rx="3" ry="5" fill="#6a994e" transform="rotate(-30 42 30)"/>
        <ellipse cx="55" cy="35" rx="3" ry="5" fill="#6a994e" transform="rotate(30 55 35)"/>
        <ellipse cx="60" cy="30" rx="3" ry="5" fill="#6a994e" transform="rotate(-45 60 30)"/>
        <ellipse cx="68" cy="35" rx="3" ry="5" fill="#6a994e" transform="rotate(-60 68 35)"/>
      </svg>
    ),
    'lawn-grass-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M25 75 L75 75 L80 85 L20 85 Z" fill="#9c6644"/>
        <path d="M25 75 L30 40 L35 75 L42 35 L48 75 L55 30 L60 75 L68 40 L72 75" fill="#74c69d"/>
        <path d="M28 75 L35 45 L40 75 L48 40 L53 75 L62 35 L68 75" fill="#52b788"/>
        <ellipse cx="30" cy="80" rx="2" ry="1" fill="#e6ccb2"/>
        <ellipse cx="40" cy="82" rx="2" ry="1" fill="#e6ccb2"/>
        <ellipse cx="50" cy="78" rx="2" ry="1" fill="#e6ccb2"/>
        <ellipse cx="60" cy="81" rx="2" ry="1" fill="#e6ccb2"/>
        <ellipse cx="70" cy="79" rx="2" ry="1" fill="#e6ccb2"/>
      </svg>
    ),
    'fodder-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 85 L70 85 L75 92 L25 92 Z" fill="#7f4f24"/>
        <path d="M35 85 Q25 50 30 20 Q40 50 45 85 Z" fill="#aacc00"/>
        <path d="M50 85 Q40 40 55 15 Q65 40 60 85 Z" fill="#80b918"/>
        <path d="M65 85 Q75 50 70 25 Q60 50 55 85 Z" fill="#aacc00"/>
        <ellipse cx="40" cy="88" rx="3" ry="1.5" fill="#ddbea9" transform="rotate(15 40 88)"/>
        <ellipse cx="50" cy="87" rx="3" ry="1.5" fill="#ddbea9" transform="rotate(-15 50 87)"/>
        <ellipse cx="60" cy="89" rx="3" ry="1.5" fill="#ddbea9" transform="rotate(25 60 89)"/>
      </svg>
    ),
    'medicinal-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 75 L50 35" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 65 Q30 60 25 45 Q40 40 50 65 Z" fill="#40916c"/>
        <path d="M50 55 Q70 50 75 35 Q60 30 50 55 Z" fill="#40916c"/>
        <path d="M50 45 Q35 40 30 25 Q45 20 50 45 Z" fill="#52b788"/>
        <path d="M50 35 Q65 30 70 15 Q55 10 50 35 Z" fill="#52b788"/>
        <circle cx="35" cy="78" r="3" fill="#a68a64"/>
        <circle cx="45" cy="82" r="3" fill="#a68a64"/>
        <circle cx="55" cy="79" r="3" fill="#a68a64"/>
        <circle cx="65" cy="83" r="3" fill="#a68a64"/>
      </svg>
    ),
    'exotic-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 80 Q30 70 20 45 C 20 20, 50 15, 50 15 C 50 15, 80 20, 80 45 Q70 70 50 80 Z" fill="#1b4332"/>
        <path d="M50 80 L50 20" fill="none" stroke="#40916c" strokeWidth="2"/>
        <path d="M25 40 L35 45 M75 40 L65 45 M30 60 L40 58 M70 60 L60 58" fill="none" stroke="#e9ecef" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 85 L40 70 L50 65 L60 70 Z" fill="#d4a373"/>
        <circle cx="50" cy="72" r="4" fill="#6c584c"/>
      </svg>
    ),
    'native-ornamental-seeds': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M50 80 C 20 75, 15 45, 50 15 C 85 45, 80 75, 50 80 Z" fill="#2d6a4f"/>
        <path d="M50 75 C 30 70, 25 50, 50 25 C 75 50, 70 70, 50 75 Z" fill="#f4a5c9"/>
        <path d="M50 70 C 35 65, 35 55, 50 35 C 65 55, 65 65, 50 70 Z" fill="#d00000"/>
        <ellipse cx="40" cy="85" rx="3" ry="5" fill="#bc6c25" transform="rotate(-30 40 85)"/>
        <ellipse cx="60" cy="85" rx="3" ry="5" fill="#bc6c25" transform="rotate(30 60 85)"/>
        <ellipse cx="50" cy="88" rx="3" ry="5" fill="#bc6c25"/>
      </svg>
    ),
    'plant-growth-promoters': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 30 L60 30 L65 75 L35 75 Z" fill="#95d5b2"/>
        <path d="M40 30 L45 75" fill="none" stroke="#74c69d" strokeWidth="2" opacity="0.5"/>
        <path d="M60 30 L55 75" fill="none" stroke="#74c69d" strokeWidth="2" opacity="0.5"/>
        <rect x="45" y="20" width="10" height="10" rx="2" fill="#e9c46a"/>
        <path d="M50 20 Q 30 5 25 35 Q 40 40 50 20" fill="#2d6a4f"/>
        <path d="M50 20 Q 70 5 75 35 Q 60 40 50 20" fill="#40916c"/>
        <ellipse cx="50" cy="55" rx="10" ry="14" fill="#ffffff" opacity="0.4"/>
        <path d="M35 55 L 45 45 M 65 65 L 75 55 M 25 25 L 30 20" fill="none" stroke="#f4a261" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="35" cy="55" r="2" fill="#e9c46a"/>
        <circle cx="65" cy="65" r="2" fill="#e9c46a"/>
      </svg>
    ),
    'plant-nutrients': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="45" width="20" height="35" rx="5" fill="#1d3557"/>
        <rect x="45" y="25" width="10" height="20" rx="3" fill="#a8dadc"/>
        <path d="M45 40 Q50 45 55 40 Z" fill="#457b9d"/>
        <path d="M50 15 Q 55 25 50 30 Q 45 25 50 15" fill="#e9c46a"/>
        <rect x="43" y="55" width="14" height="15" rx="2" fill="#f1faee"/>
        <circle cx="50" cy="62" r="4" fill="#2a9d8f"/>
        <path d="M70 70 Q 70 55 80 50 Q 85 70 70 70" fill="#52b788"/>
        <path d="M80 50 L 70 70" fill="none" stroke="#2d6a4f" strokeWidth="2"/>
      </svg>
    ),
    'liquid-nutrients': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="45" width="20" height="35" rx="5" fill="#1d3557"/>
        <rect x="45" y="25" width="10" height="20" rx="3" fill="#a8dadc"/>
        <path d="M45 40 Q50 45 55 40 Z" fill="#457b9d"/>
        <path d="M50 15 Q 55 25 50 30 Q 45 25 50 15" fill="#e9c46a"/>
        <rect x="43" y="55" width="14" height="15" rx="2" fill="#f1faee"/>
        <circle cx="50" cy="62" r="4" fill="#2a9d8f"/>
        <path d="M70 70 Q 70 55 80 50 Q 85 70 70 70" fill="#52b788"/>
        <path d="M80 50 L 70 70" fill="none" stroke="#2d6a4f" strokeWidth="2"/>
      </svg>
    ),
    'chemical-fertilizers': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="45" width="20" height="35" rx="5" fill="#1d3557"/>
        <rect x="45" y="25" width="10" height="20" rx="3" fill="#a8dadc"/>
        <path d="M45 40 Q50 45 55 40 Z" fill="#457b9d"/>
        <path d="M50 15 Q 55 25 50 30 Q 45 25 50 15" fill="#e9c46a"/>
        <rect x="43" y="55" width="14" height="15" rx="2" fill="#f1faee"/>
        <circle cx="50" cy="62" r="4" fill="#2a9d8f"/>
        <path d="M70 70 Q 70 55 80 50 Q 85 70 70 70" fill="#52b788"/>
        <path d="M80 50 L 70 70" fill="none" stroke="#2d6a4f" strokeWidth="2"/>
      </svg>
    ),
    'rooting-hormones': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="55" width="30" height="25" rx="4" fill="#fdf0d5"/>
        <rect x="32" y="48" width="36" height="7" rx="3" fill="#d4a373"/>
        <path d="M50 50 Q 30 20 20 30 Q 30 40 50 50" fill="#74c69d"/>
        <path d="M50 50 Q 70 20 80 30 Q 70 40 50 50" fill="#52b788"/>
        <path d="M50 50 L 50 25" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 55 Q 40 65 45 75 M 50 55 Q 60 65 55 75 M 50 65 Q 45 70 50 80 M 50 65 Q 55 70 50 80" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        <rect x="38" y="65" width="24" height="8" rx="2" fill="#f4a261" opacity="0.3"/>
      </svg>
    ),
    'propagation-supplies': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="55" width="30" height="25" rx="4" fill="#fdf0d5"/>
        <rect x="32" y="48" width="36" height="7" rx="3" fill="#d4a373"/>
        <path d="M50 50 Q 30 20 20 30 Q 30 40 50 50" fill="#74c69d"/>
        <path d="M50 50 Q 70 20 80 30 Q 70 40 50 50" fill="#52b788"/>
        <path d="M50 50 L 50 25" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 55 Q 40 65 45 75 M 50 55 Q 60 65 55 75 M 50 65 Q 45 70 50 80 M 50 65 Q 55 70 50 80" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        <rect x="38" y="65" width="24" height="8" rx="2" fill="#f4a261" opacity="0.3"/>
      </svg>
    ),
    'organic-plant-food': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 L70 40 L75 80 Q 50 90 25 80 Z" fill="#b08d6a"/>
        <path d="M25 40 Q50 30 75 40 Q 50 50 25 40" fill="#8b5a2b"/>
        <path d="M28 40 Q50 30 72 40 Z" fill="#5c4033"/>
        <path d="M50 35 Q 40 10 30 20 Q 40 30 50 35" fill="#aacc00"/>
        <path d="M50 35 Q 60 10 70 20 Q 60 30 50 35" fill="#80b918"/>
        <ellipse cx="50" cy="65" rx="15" ry="8" fill="#f4a261"/>
        <circle cx="50" cy="65" r="4" fill="#e9c46a"/>
        <path d="M35 50 L 40 45 M 65 50 L 60 45" fill="none" stroke="#8b5a2b" strokeWidth="2"/>
        <circle cx="45" cy="35" r="2" fill="#e9c46a"/>
        <circle cx="55" cy="35" r="2" fill="#e9c46a"/>
        <path d="M22 45 L 78 45" fill="none" stroke="#d4a373" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'organic-fertilizers': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 L70 40 L75 80 Q 50 90 25 80 Z" fill="#b08d6a"/>
        <path d="M25 40 Q50 30 75 40 Q 50 50 25 40" fill="#8b5a2b"/>
        <path d="M28 40 Q50 30 72 40 Z" fill="#5c4033"/>
        <path d="M50 35 Q 40 10 30 20 Q 40 30 50 35" fill="#aacc00"/>
        <path d="M50 35 Q 60 10 70 20 Q 60 30 50 35" fill="#80b918"/>
        <ellipse cx="50" cy="65" rx="15" ry="8" fill="#f4a261"/>
        <circle cx="50" cy="65" r="4" fill="#e9c46a"/>
        <path d="M35 50 L 40 45 M 65 50 L 60 45" fill="none" stroke="#8b5a2b" strokeWidth="2"/>
        <circle cx="45" cy="35" r="2" fill="#e9c46a"/>
        <circle cx="55" cy="35" r="2" fill="#e9c46a"/>
        <path d="M22 45 L 78 45" fill="none" stroke="#d4a373" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'biofertilizers': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 L70 40 L75 80 Q 50 90 25 80 Z" fill="#b08d6a"/>
        <path d="M25 40 Q50 30 75 40 Q 50 50 25 40" fill="#8b5a2b"/>
        <path d="M28 40 Q50 30 72 40 Z" fill="#5c4033"/>
        <path d="M50 35 Q 40 10 30 20 Q 40 30 50 35" fill="#aacc00"/>
        <path d="M50 35 Q 60 10 70 20 Q 60 30 50 35" fill="#80b918"/>
        <ellipse cx="50" cy="65" rx="15" ry="8" fill="#f4a261"/>
        <circle cx="50" cy="65" r="4" fill="#e9c46a"/>
        <path d="M35 50 L 40 45 M 65 50 L 60 45" fill="none" stroke="#8b5a2b" strokeWidth="2"/>
        <circle cx="45" cy="35" r="2" fill="#e9c46a"/>
        <circle cx="55" cy="35" r="2" fill="#e9c46a"/>
        <path d="M22 45 L 78 45" fill="none" stroke="#d4a373" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'potting-media': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 L70 40 L75 80 Q 50 90 25 80 Z" fill="#b08d6a"/>
        <path d="M25 40 Q50 30 75 40 Q 50 50 25 40" fill="#8b5a2b"/>
        <path d="M28 40 Q50 30 72 40 Z" fill="#5c4033"/>
        <path d="M50 35 Q 40 10 30 20 Q 40 30 50 35" fill="#aacc00"/>
        <path d="M50 35 Q 60 10 70 20 Q 60 30 50 35" fill="#80b918"/>
        <ellipse cx="50" cy="65" rx="15" ry="8" fill="#f4a261"/>
        <circle cx="50" cy="65" r="4" fill="#e9c46a"/>
        <path d="M35 50 L 40 45 M 65 50 L 60 45" fill="none" stroke="#8b5a2b" strokeWidth="2"/>
        <circle cx="45" cy="35" r="2" fill="#e9c46a"/>
        <circle cx="55" cy="35" r="2" fill="#e9c46a"/>
        <path d="M22 45 L 78 45" fill="none" stroke="#d4a373" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'composting-products': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 L70 40 L75 80 Q 50 90 25 80 Z" fill="#b08d6a"/>
        <path d="M25 40 Q50 30 75 40 Q 50 50 25 40" fill="#8b5a2b"/>
        <path d="M28 40 Q50 30 72 40 Z" fill="#5c4033"/>
        <path d="M50 35 Q 40 10 30 20 Q 40 30 50 35" fill="#aacc00"/>
        <path d="M50 35 Q 60 10 70 20 Q 60 30 50 35" fill="#80b918"/>
        <ellipse cx="50" cy="65" rx="15" ry="8" fill="#f4a261"/>
        <circle cx="50" cy="65" r="4" fill="#e9c46a"/>
        <path d="M35 50 L 40 45 M 65 50 L 60 45" fill="none" stroke="#8b5a2b" strokeWidth="2"/>
        <circle cx="45" cy="35" r="2" fill="#e9c46a"/>
        <circle cx="55" cy="35" r="2" fill="#e9c46a"/>
        <path d="M22 45 L 78 45" fill="none" stroke="#d4a373" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'neem-oil': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M35 45 L65 45 L70 85 Q50 95 30 85 Z" fill="#e76f51"/>
        <rect x="42" y="20" width="16" height="25" rx="2" fill="#8b5a2b"/>
        <path d="M35 45 Q 50 55 65 45 L 70 85 Q 50 95 30 85 Z" fill="#f4a261" opacity="0.4"/>
        <path d="M30 60 Q 15 50 25 40 Q 35 50 30 60" fill="#2a9d8f"/>
        <path d="M70 70 Q 85 60 75 50 Q 65 60 70 70" fill="#2a9d8f"/>
        <path d="M25 40 C 30 20, 70 20, 75 50" fill="none" stroke="#2a9d8f" strokeWidth="2"/>
        <rect x="40" y="55" width="20" height="15" rx="3" fill="#ffffff" opacity="0.9"/>
        <circle cx="50" cy="62" r="3" fill="#e76f51"/>
      </svg>
    ),
    'plant-protection-spray': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="45" width="30" height="40" rx="6" fill="#f4a261"/>
        <path d="M40 45 L 30 45 L 35 35 L 50 35 Z" fill="#e76f51"/>
        <rect x="30" y="38" width="5" height="5" fill="#264653"/>
        <path d="M25 40 Q 15 45 20 60 M 20 35 Q 10 40 15 55" fill="none" stroke="#e9c46a" strokeWidth="2" strokeDasharray="2 2"/>
        <path d="M15 70 C 5 60, 15 45, 25 55 C 35 65, 25 80, 15 70 Z" fill="#2a9d8f"/>
        <path d="M75 55 C 85 45, 95 60, 85 70 C 75 80, 65 65, 75 55 Z" fill="#2a9d8f"/>
        <ellipse cx="50" cy="65" rx="8" ry="12" fill="#ffffff" opacity="0.3"/>
        <rect x="48" y="35" width="4" height="10" fill="#264653"/>
      </svg>
    ),
    'plant-protection': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="45" width="30" height="40" rx="6" fill="#f4a261"/>
        <path d="M40 45 L 30 45 L 35 35 L 50 35 Z" fill="#e76f51"/>
        <rect x="30" y="38" width="5" height="5" fill="#264653"/>
        <path d="M25 40 Q 15 45 20 60 M 20 35 Q 10 40 15 55" fill="none" stroke="#e9c46a" strokeWidth="2" strokeDasharray="2 2"/>
        <path d="M15 70 C 5 60, 15 45, 25 55 C 35 65, 25 80, 15 70 Z" fill="#2a9d8f"/>
        <path d="M75 55 C 85 45, 95 60, 85 70 C 75 80, 65 65, 75 55 Z" fill="#2a9d8f"/>
        <ellipse cx="50" cy="65" rx="8" ry="12" fill="#ffffff" opacity="0.3"/>
        <rect x="48" y="35" width="4" height="10" fill="#264653"/>
      </svg>
    ),
    'fungicide': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="40" width="30" height="45" rx="8" fill="#457b9d"/>
        <rect x="40" y="25" width="20" height="15" rx="2" fill="#1d3557"/>
        <path d="M35 50 Q 50 60 65 50" fill="none" stroke="#a8dadc" strokeWidth="4"/>
        <circle cx="50" cy="65" r="12" fill="#ffffff"/>
        <path d="M50 57 Q 58 65 50 73 Q 42 65 50 57 Z" fill="#2a9d8f"/>
        <path d="M50 57 L 50 73" fill="none" stroke="#ffffff" strokeWidth="1.5"/>
        <circle cx="45" cy="32" r="2" fill="#a8dadc"/>
        <circle cx="55" cy="32" r="2" fill="#a8dadc"/>
      </svg>
    ),
    'insecticide': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M35 45 L65 45 L70 85 Q50 95 30 85 Z" fill="#e76f51"/>
        <rect x="45" y="25" width="10" height="20" rx="2" fill="#264653"/>
        <rect x="32" y="30" width="36" height="6" rx="3" fill="#e9c46a"/>
        <circle cx="50" cy="65" r="14" fill="#ffffff"/>
        <path d="M46 61 L54 69 M54 61 L46 69" fill="none" stroke="#d00000" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="35" cy="25" r="2" fill="#e9c46a"/>
        <circle cx="28" cy="35" r="2" fill="#e9c46a"/>
        <circle cx="70" cy="25" r="2" fill="#e9c46a"/>
        <path d="M35 45 Q 50 55 65 45" fill="none" stroke="#f4a261" strokeWidth="4"/>
      </svg>
    ),
    'leaf-shine': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 45 Q50 5 70 45 Q50 85 30 45" fill="#2a9d8f"/>
        <path d="M30 45 Q50 5 70 45 Q50 85 30 45" fill="url(#leaf-shine-grad)" opacity="0.3"/>
        <path d="M50 15 L50 75" fill="none" stroke="#1d3557" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 35 L 60 25 M 50 45 L 62 35 M 50 55 L 60 45 M 50 35 L 40 25 M 50 45 L 38 35 M 50 55 L 40 45" fill="none" stroke="#264653" strokeWidth="2" strokeLinecap="round"/>
        <path d="M70 25 M75 20 L80 15 M72 15 L78 20 M80 20 L75 25 M65 20 L70 25" fill="none" stroke="#e9c46a" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="75" cy="20" r="1.5" fill="#ffffff"/>
        <path d="M25 65 Q 15 75 25 85 Q 35 75 25 65 Z" fill="#f4a261"/>
        <path d="M20 75 L 30 75" fill="none" stroke="#e76f51" strokeWidth="2"/>
      </svg>
    ),
    'plant-cleaning-spray': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M40 45 Q35 85 40 85 L60 85 Q65 85 60 45 Z" fill="#a8dadc"/>
        <path d="M40 45 L35 35 L55 35 L50 45 Z" fill="#457b9d"/>
        <rect x="42" y="25" width="6" height="10" fill="#1d3557"/>
        <rect x="30" y="25" width="12" height="6" rx="2" fill="#1d3557"/>
        <path d="M40 45 Q 50 55 60 45" fill="none" stroke="#f1faee" strokeWidth="3"/>
        <ellipse cx="50" cy="65" rx="6" ry="10" fill="#f1faee" opacity="0.6"/>
        <path d="M25 45 Q 15 35 20 20" fill="none" stroke="#457b9d" strokeWidth="2" strokeDasharray="2 2"/>
        <path d="M15 25 Q 10 30 15 35" fill="none" stroke="#457b9d" strokeWidth="2" strokeDasharray="2 2"/>
        <circle cx="50" cy="65" r="2" fill="#2a9d8f"/>
      </svg>
    ),
    'plant-support-sticks': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="44" y="10" width="12" height="80" rx="6" fill="#a68a64"/>
        <path d="M44 20 L56 25 M44 35 L56 40 M44 50 L56 55 M44 65 L56 70 M44 80 L56 85" fill="none" stroke="#7f4f24" strokeWidth="2"/>
        <path d="M44 85 Q 20 70 44 55 Q 65 40 44 25" fill="none" stroke="#2a9d8f" strokeWidth="5" strokeLinecap="round"/>
        <path d="M35 70 Q 25 65 30 55 Q 40 60 35 70 Z" fill="#52b788"/>
        <path d="M55 45 Q 65 40 60 30 Q 50 35 55 45 Z" fill="#52b788"/>
        <path d="M38 35 Q 28 30 33 20 Q 43 25 38 35 Z" fill="#74c69d"/>
        <circle cx="44" cy="55" r="2" fill="#2d6a4f"/>
        <circle cx="56" cy="40" r="2" fill="#2d6a4f"/>
      </svg>
    ),
    'plant-ties': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="25" width="30" height="50" rx="4" fill="#d4a373"/>
        <rect x="30" y="35" width="40" height="30" rx="2" fill="#52b788"/>
        <path d="M30 40 L70 40 M30 45 L70 45 M30 50 L70 50 M30 55 L70 55 M30 60 L70 60" fill="none" stroke="#2d6a4f" strokeWidth="2"/>
        <path d="M70 45 Q 85 30 75 15" fill="none" stroke="#52b788" strokeWidth="4" strokeLinecap="round"/>
        <path d="M75 15 Q 65 25 60 20" fill="none" stroke="#52b788" strokeWidth="4" strokeLinecap="round"/>
        <path d="M25 75 Q 15 65 25 55 Q 35 65 25 75 Z" fill="#74c69d"/>
        <path d="M15 80 Q 5 70 15 60 Q 25 70 15 80 Z" fill="#95d5b2"/>
      </svg>
    ),
    'pruning-care-kit': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M25 80 Q 40 50 45 40 Q 50 50 65 80" fill="none" stroke="#e76f51" strokeWidth="10" strokeLinecap="round"/>
        <path d="M45 40 L 40 10 M 45 40 L 50 10" fill="none" stroke="#adb5bd" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="45" cy="40" r="4" fill="#2b2d42"/>
        <path d="M70 30 C 85 20, 95 35, 80 45 C 65 55, 55 40, 70 30 Z" fill="#2a9d8f"/>
        <path d="M75 35 L 65 45 M 70 35 L 75 40" fill="none" stroke="#1d3557" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="25" cy="30" rx="3" ry="3" fill="#e9c46a"/>
        <ellipse cx="15" cy="40" rx="2" ry="2" fill="#e9c46a"/>
        <ellipse cx="80" cy="70" rx="3" ry="3" fill="#e9c46a"/>
      </svg>
    ),
    'gardening-tools': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M25 80 Q 40 50 45 40 Q 50 50 65 80" fill="none" stroke="#e76f51" strokeWidth="10" strokeLinecap="round"/>
        <path d="M45 40 L 40 10 M 45 40 L 50 10" fill="none" stroke="#adb5bd" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="45" cy="40" r="4" fill="#2b2d42"/>
        <path d="M70 30 C 85 20, 95 35, 80 45 C 65 55, 55 40, 70 30 Z" fill="#2a9d8f"/>
        <path d="M75 35 L 65 45 M 70 35 L 75 40" fill="none" stroke="#1d3557" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="25" cy="30" rx="3" ry="3" fill="#e9c46a"/>
        <ellipse cx="15" cy="40" rx="2" ry="2" fill="#e9c46a"/>
        <ellipse cx="80" cy="70" rx="3" ry="3" fill="#e9c46a"/>
      </svg>
    ),
    'plant-repotting-kit': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M20 50 L 50 50 L 45 80 L 25 80 Z" fill="#e76f51"/>
        <rect x="18" y="45" width="34" height="6" rx="2" fill="#f4a261"/>
        <path d="M60 85 L 75 45 L 82 45 L 70 85 Z" fill="#adb5bd"/>
        <rect x="65" y="80" width="12" height="15" rx="4" fill="#d4a373"/>
        <path d="M35 45 C 20 25, 50 15, 35 45 Z" fill="#2a9d8f"/>
        <path d="M35 45 C 50 25, 20 15, 35 45 Z" fill="#52b788"/>
        <path d="M15 80 C 5 80, 5 95, 25 90 C 45 85, 30 75, 15 80 Z" fill="#8b5a2b"/>
      </svg>
    ),
    'root-care-products': (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M30 40 L 70 40 L 65 85 L 35 85 Z" fill="#f8f9fa"/>
        <path d="M35 40 L 65 40 L 60 85 L 40 85 Z" fill="#e0fbfc" opacity="0.6"/>
        <path d="M50 20 L 50 45 M 50 45 Q 40 60 45 80 M 50 45 Q 60 55 55 75 M 50 55 Q 40 65 35 80 M 50 65 Q 60 70 60 85" fill="none" stroke="#2a9d8f" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50 20 C 30 5, 20 30, 50 20 Z" fill="#52b788"/>
        <path d="M50 20 C 70 5, 80 30, 50 20 Z" fill="#74c69d"/>
        <path d="M30 45 L 70 45" fill="none" stroke="#ffffff" strokeWidth="4"/>
      </svg>
    )
  };

  const defaultIcon = (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M40 80 L 60 80 L 65 60 L 35 60 Z" fill="#e9ecef"/>
      <path d="M50 60 Q 30 30 20 20 Q 30 40 50 60" fill="#adb5bd"/>
      <path d="M50 60 Q 70 30 80 20 Q 70 40 50 60" fill="#ced4da"/>
      <path d="M50 60 Q 45 25 50 15 Q 55 25 50 60" fill="#6c757d"/>
    </svg>
  );

  return illustrations[slug] || defaultIcon;
}
