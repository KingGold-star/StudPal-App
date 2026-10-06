// src/services/gamification/countryLeaderboardData.js

export const SUPPORTED_COUNTRIES = [
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    region: "West Africa",
    activeScholars: "4,820 scholars",
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    region: "North America",
    activeScholars: "5,340 scholars",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    activeScholars: "3,910 scholars",
  },
  {
    code: "GH",
    name: "Ghana",
    flag: "🇬🇭",
    region: "West Africa",
    activeScholars: "2,150 scholars",
  },
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    region: "East Africa",
    activeScholars: "2,480 scholars",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    region: "North America",
    activeScholars: "1,940 scholars",
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    region: "Southern Africa",
    activeScholars: "2,260 scholars",
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    region: "South Asia",
    activeScholars: "6,100 scholars",
  },
];

export const COUNTRY_LEADERBOARDS = {
  NG: {
    country: "Nigeria",
    code: "NG",
    flag: "🇳🇬",
    podium: [
      {
        rank: 2,
        name: "Amina B.",
        city: "Abuja",
        baseXp: 1280,
        avatarUri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 1,
        name: "Chinedu O.",
        city: "Lagos",
        baseXp: 1450,
        avatarUri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 3,
        name: "Tunde A.",
        city: "Ibadan",
        baseXp: 1190,
        avatarUri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    standings: [
      {
        id: "ng-4",
        rank: 4,
        name: "Ngozi Eze",
        city: "Enugu",
        role: "JAMB Prep Lead",
        baseXp: 1050,
        avatarUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "ng-5",
        rank: 5,
        name: "Emeka Okon",
        city: "Port Harcourt",
        role: "Level 22",
        baseXp: 980,
        avatarUri: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "ng-user",
        rank: 6,
        name: "You",
        city: "Lagos",
        role: "Emerging Leader",
        isCurrentUser: true,
        baseXp: 860,
      },
      {
        id: "ng-7",
        rank: 7,
        name: "Zainab Musa",
        city: "Kano",
        role: "Level 19",
        baseXp: 810,
        avatarUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "ng-8",
        rank: 8,
        name: "Femi Adeleke",
        city: "Benin City",
        role: "Level 18",
        baseXp: 770,
        avatarUri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "ng-9",
        rank: 9,
        name: "Chioma Nnamdi",
        city: "Owerri",
        role: "Level 17",
        baseXp: 720,
        avatarUri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "ng-10",
        rank: 10,
        name: "Ibrahim Lawal",
        city: "Kaduna",
        role: "Level 16",
        baseXp: 680,
        avatarUri: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },

  US: {
    country: "United States",
    code: "US",
    flag: "🇺🇸",
    podium: [
      {
        rank: 2,
        name: "Sarah M.",
        city: "California",
        baseXp: 1340,
        avatarUri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 1,
        name: "Alex R.",
        city: "New York",
        baseXp: 1520,
        avatarUri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 3,
        name: "Michael C.",
        city: "Texas",
        baseXp: 1210,
        avatarUri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
    ],
    standings: [
      {
        id: "us-4",
        rank: 4,
        name: "Rachel McCoy",
        city: "Illinois",
        role: "AP Scholar",
        baseXp: 1080,
        avatarUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "us-5",
        rank: 5,
        name: "David Kim",
        city: "Washington",
        role: "Level 22",
        baseXp: 990,
        avatarUri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "us-6",
        rank: 6,
        name: "Jessica Alba",
        city: "Florida",
        role: "Level 20",
        baseXp: 860,
        avatarUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "us-7",
        rank: 7,
        name: "Roger Jordan",
        city: "Massachusetts",
        role: "Level 19",
        baseXp: 810,
        avatarUri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "us-8",
        rank: 8,
        name: "Emily Davis",
        city: "Colorado",
        role: "Level 18",
        baseXp: 760,
        avatarUri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },

  GB: {
    country: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    podium: [
      {
        rank: 2,
        name: "Charlotte D.",
        city: "Manchester",
        baseXp: 1310,
        avatarUri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 1,
        name: "Oliver S.",
        city: "London",
        baseXp: 1480,
        avatarUri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 3,
        name: "Harry T.",
        city: "Edinburgh",
        baseXp: 1190,
        avatarUri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    standings: [
      {
        id: "gb-4",
        rank: 4,
        name: "Liam Wilson",
        city: "Birmingham",
        role: "A-Level Honours",
        baseXp: 1060,
        avatarUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "gb-5",
        rank: 5,
        name: "Sophie Brown",
        city: "Oxford",
        role: "Level 21",
        baseXp: 970,
        avatarUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "gb-6",
        rank: 6,
        name: "George Evans",
        city: "Bristol",
        role: "Level 19",
        baseXp: 850,
        avatarUri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "gb-7",
        rank: 7,
        name: "Emma Watson",
        city: "Cambridge",
        role: "Level 18",
        baseXp: 790,
        avatarUri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },

  GH: {
    country: "Ghana",
    code: "GH",
    flag: "🇬🇭",
    podium: [
      {
        rank: 2,
        name: "Akosua B.",
        city: "Kumasi",
        baseXp: 1260,
        avatarUri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 1,
        name: "Kwame M.",
        city: "Accra",
        baseXp: 1430,
        avatarUri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 3,
        name: "Kofi A.",
        city: "Cape Coast",
        baseXp: 1170,
        avatarUri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    standings: [
      {
        id: "gh-4",
        rank: 4,
        name: "Abena Osei",
        city: "Tema",
        role: "WASSCE Lead",
        baseXp: 1040,
        avatarUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "gh-5",
        rank: 5,
        name: "Yaw Addo",
        city: "Tamale",
        role: "Level 21",
        baseXp: 960,
        avatarUri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "gh-6",
        rank: 6,
        name: "Efua Darko",
        city: "Takoradi",
        role: "Level 19",
        baseXp: 840,
        avatarUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "gh-7",
        rank: 7,
        name: "Kweku Baah",
        city: "Sunyani",
        role: "Level 18",
        baseXp: 780,
        avatarUri: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },

  KE: {
    country: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    podium: [
      {
        rank: 2,
        name: "Faith W.",
        city: "Nairobi",
        baseXp: 1290,
        avatarUri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 1,
        name: "Kipchoge K.",
        city: "Eldoret",
        baseXp: 1460,
        avatarUri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 3,
        name: "Brian O.",
        city: "Kisumu",
        baseXp: 1180,
        avatarUri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    standings: [
      {
        id: "ke-4",
        rank: 4,
        name: "Mercy Chebet",
        city: "Nakuru",
        role: "KCSE Top Tier",
        baseXp: 1030,
        avatarUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "ke-5",
        rank: 5,
        name: "Dennis Kipruto",
        city: "Mombasa",
        role: "Level 20",
        baseXp: 950,
        avatarUri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "ke-6",
        rank: 6,
        name: "Sharon Achieng",
        city: "Nyeri",
        role: "Level 19",
        baseXp: 830,
        avatarUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },

  CA: {
    country: "Canada",
    code: "CA",
    flag: "🇨🇦",
    podium: [
      {
        rank: 2,
        name: "Emma R.",
        city: "Toronto",
        baseXp: 1280,
        avatarUri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 1,
        name: "Lucas T.",
        city: "Montreal",
        baseXp: 1440,
        avatarUri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 3,
        name: "Noah C.",
        city: "Vancouver",
        baseXp: 1170,
        avatarUri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    standings: [
      {
        id: "ca-4",
        rank: 4,
        name: "Chloe Bouchard",
        city: "Quebec",
        role: "OSSD Scholar",
        baseXp: 1020,
        avatarUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "ca-5",
        rank: 5,
        name: "Liam MacDonald",
        city: "Calgary",
        role: "Level 20",
        baseXp: 960,
        avatarUri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "ca-6",
        rank: 6,
        name: "Maya Singh",
        city: "Ottawa",
        role: "Level 19",
        baseXp: 840,
        avatarUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },

  ZA: {
    country: "South Africa",
    code: "ZA",
    flag: "🇿🇦",
    podium: [
      {
        rank: 2,
        name: "Thabo M.",
        city: "Pretoria",
        baseXp: 1270,
        avatarUri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 1,
        name: "Siyabonga N.",
        city: "Johannesburg",
        baseXp: 1450,
        avatarUri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 3,
        name: "Anika v.",
        city: "Cape Town",
        baseXp: 1160,
        avatarUri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    standings: [
      {
        id: "za-4",
        rank: 4,
        name: "Zanele Khumalo",
        city: "Durban",
        role: "Matric Distinction",
        baseXp: 1010,
        avatarUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "za-5",
        rank: 5,
        name: "Pieter Botha",
        city: "Bloemfontein",
        role: "Level 20",
        baseXp: 940,
        avatarUri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "za-6",
        rank: 6,
        name: "Lerato Mokoena",
        city: "Soweto",
        role: "Level 18",
        baseXp: 820,
        avatarUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },

  IN: {
    country: "India",
    code: "IN",
    flag: "🇮🇳",
    podium: [
      {
        rank: 2,
        name: "Priya P.",
        city: "Mumbai",
        baseXp: 1320,
        avatarUri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 1,
        name: "Aarav S.",
        city: "Delhi",
        baseXp: 1510,
        avatarUri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        rank: 3,
        name: "Rohan V.",
        city: "Bengaluru",
        baseXp: 1200,
        avatarUri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ],
    standings: [
      {
        id: "in-4",
        rank: 4,
        name: "Ananya Iyer",
        city: "Chennai",
        role: "CBSE Topper",
        baseXp: 1070,
        avatarUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "in-5",
        rank: 5,
        name: "Vikram Singh",
        city: "Hyderabad",
        role: "Level 21",
        baseXp: 980,
        avatarUri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "in-6",
        rank: 6,
        name: "Neha Gupta",
        city: "Pune",
        role: "Level 19",
        baseXp: 850,
        avatarUri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      },
    ],
  },
};

/**
 * Returns formatted country leaderboard data scaled by the selected timeframe.
 * If isUserHomeCountry is true, "You" is accurately positioned in this country's board.
 */
export function getCountryLeaderboardData({
  countryCode = "NG",
  timeframe = "This Week",
  user = null,
  userTotalXp = 860,
  userHomeCountry = "NG",
}) {
  const code = (countryCode || "NG").toUpperCase();
  const countryObj = COUNTRY_LEADERBOARDS[code] || COUNTRY_LEADERBOARDS["NG"];
  const isHome = (userHomeCountry || "NG").toUpperCase() === code;

  let multiplier = 1.0;
  if (timeframe === "Today") multiplier = 0.14;
  if (timeframe === "This Month") multiplier = 4.0;

  // Format Podium
  const podium = countryObj.podium.map((item) => ({
    ...item,
    xpFormatted: `${Math.round(item.baseXp * multiplier).toLocaleString()} XP`,
    rawXp: Math.round(item.baseXp * multiplier),
  }));

  // Find 1st, 2nd, 3rd
  const p1 = podium.find((p) => p.rank === 1) || podium[1];
  const p2 = podium.find((p) => p.rank === 2) || podium[0];
  const p3 = podium.find((p) => p.rank === 3) || podium[2];

  // Format Standings
  let standings = countryObj.standings.map((item) => {
    if (item.isCurrentUser) {
      if (!isHome) {
        // Replace with a standard native peer if user does not belong to this country
        return {
          id: `${code}-peer-6`,
          rank: 6,
          name: code === "NG" ? "David Okon" : "Alex Jordan",
          city: item.city || "Capital City",
          role: "Rising Scholar",
          avatarUri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          baseXp: item.baseXp,
          xpFormatted: `${Math.round(item.baseXp * multiplier).toLocaleString()} XP`,
          isCurrentUser: false,
        };
      }
      return {
        ...item,
        name: user?.name ? `${user.name} (You)` : "You",
        city: user?.city || item.city,
        avatarUri: user?.avatarUri || null,
        avatarEmoji: user?.avatarEmoji || "👨‍🎓",
        isCurrentUser: true,
        xpFormatted: `${userTotalXp.toLocaleString()} XP`,
        rawXp: userTotalXp,
      };
    }

    return {
      ...item,
      xpFormatted: `${Math.round(item.baseXp * multiplier).toLocaleString()} XP`,
      rawXp: Math.round(item.baseXp * multiplier),
    };
  });

  // If user is from this country and wasn't in standings, insert user at rank 6
  if (isHome && !standings.some((s) => s.isCurrentUser)) {
    const userItem = {
      id: `${code}-current-user`,
      rank: 6,
      name: user?.name ? `${user.name} (You)` : "You",
      city: user?.city || countryObj.city || "Home",
      role: "Emerging Leader",
      avatarUri: user?.avatarUri || null,
      avatarEmoji: user?.avatarEmoji || "👨‍🎓",
      isCurrentUser: true,
      xpFormatted: `${userTotalXp.toLocaleString()} XP`,
      rawXp: userTotalXp,
    };
    standings.splice(2, 0, userItem);
    // Recalculate ranks
    standings = standings.map((item, index) => ({
      ...item,
      rank: index + 4,
    }));
  }

  return {
    country: countryObj.country,
    countryCode: code,
    flag: countryObj.flag,
    isHomeCountry: isHome,
    podium: {
      p1,
      p2,
      p3,
    },
    standings,
  };
}
