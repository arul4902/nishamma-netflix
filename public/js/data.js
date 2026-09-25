/* ==========================================================================
   NISHAMMA+: DATA ENGINE & METADATA BINDINGS
   ========================================================================== */

const NISHAMMA_DATA = {
  profiles: [
    {
      id: 'nishamma',
      name: 'Nishamma',
      role: 'The Star of the Show ❤️',
      avatar: 'assets/image.png',
      isStar: true,
      tagline: 'The Heart of the Family',
      greeting: 'Welcome, Nishamma! Your Original Series is ready to stream.'
    },
    {
      id: 'bernard',
      name: 'Bernard',
      role: 'Husband • Her Forever Co-Star ❤️',
      avatar: 'assets/image copy 3.png',
      isStar: false,
      tagline: 'Partner in crime since day one',
      greeting: 'Bernard has entered the watch party!'
    },
    {
      id: 'aby-ammu',
      name: 'Aby & Ammu',
      role: 'Son & Daughter-in-law ❤️',
      avatar: 'assets/image copy 14.png',
      isStar: false,
      tagline: 'Tech support & biggest fans',
      greeting: 'Aby & Ammu are watching!'
    },
    {
      id: 'aleena-alen',
      name: 'Aleena & Alen',
      role: 'Daughter & Son-in-law ❤️',
      avatar: 'assets/image copy 13.png',
      isStar: false,
      tagline: 'The joy & laughter department',
      greeting: 'Aleena & Alen have tuned in!'
    },
    {
      id: 'kaylu',
      name: 'Kaylu',
      role: "Aby & Ammu's Baby ❤️",
      avatar: 'assets/image copy.png',
      isStar: false,
      tagline: "Grandma's newest favourite episode ❤️",
      greeting: "Kaylu is giggling at Grandma's series!"
    },
    {
      id: 'emy',
      name: 'Emy',
      role: "Aleena & Alen's Baby ❤️",
      avatar: 'assets/image copy.png',
      isStar: false,
      tagline: "Grandma's sweetest little co-star ❤️",
      greeting: "Emy is clapping for Grandma!"
    }
  ],

  continueWatching: [
    {
      id: 'ep-01',
      number: '01',
      title: 'The Malaysian Days 🇲🇾',
      subtitle: 'Memories of Kuala Lumpur & Beyond',
      desc: 'Walking through KLCC park, Petronas fountains, and Genting smiles that never fade.',
      image: 'assets/image copy 3.png',
      progress: 88,
      duration: '48m',
      targetSection: 'episode-01'
    },
    {
      id: 'ep-02',
      number: '02',
      title: 'Family First',
      subtitle: 'The Heart of Every Home',
      desc: 'From daily routines to celebrations, Nishamma is the glue that keeps all of us together.',
      image: 'assets/image copy 5.png',
      progress: 100,
      duration: '52m',
      targetSection: 'episode-02'
    },
    {
      id: 'ep-03',
      number: '03',
      title: 'The News Reporter 😂',
      subtitle: 'WhatsApp Forwarding Champion',
      desc: 'Confidence: 100%. Source: A random reel. Family fact check: Always pending!',
      image: 'assets/image copy 7.png',
      progress: 45,
      duration: '35m',
      targetSection: 'episode-04'
    },
    {
      id: 'ep-04',
      number: '04',
      title: 'Did You Eat?',
      subtitle: "The Ultimate Love Language",
      desc: '"Are you okay? Why didn\'t you call? Call me when you reach."',
      image: 'assets/image copy 14.png',
      progress: 95,
      duration: '60m',
      targetSection: 'episode-03'
    },
    {
      id: 'ep-05',
      number: '05',
      title: 'Grandma Era ❤️',
      subtitle: 'New Season Unlocked',
      desc: 'Featuring Kaylu & Emy: Two tiny miracles who made her enormous heart even bigger.',
      image: 'assets/image copy.png',
      progress: 15,
      duration: '∞ Seasons',
      targetSection: 'episode-05'
    },
    {
      id: 'ep-06',
      number: '06',
      title: 'Still Caring...',
      subtitle: 'Season Finale & Forever',
      desc: 'Because after everything she does, her first thought is always everyone else.',
      image: 'assets/image.png',
      progress: 100,
      duration: 'Forever',
      targetSection: 'finale-section'
    }
  ],

  cast: [
    {
      name: 'Nisha "Nishamma" Bernard',
      role: 'The Heart ❤️',
      subrole: 'The Leading Lady',
      bio: 'The epicenter of our universe. Master of care, warmth, and checking if anyone is hungry.',
      image: 'assets/image.png'
    },
    {
      name: 'Bernard',
      role: 'Her Forever Co-Star ❤️',
      subrole: 'Husband & Partner',
      bio: 'By her side through every chapter, from quiet mornings to grand Malaysian adventures.',
      image: 'assets/image copy 3.png'
    },
    {
      name: 'Aby',
      role: 'Son',
      subrole: 'Tech Support & First Critic',
      bio: 'Always on speed dial. Receiver of daily "Have you eaten?" check-ins.',
      image: 'assets/image copy 14.png'
    },
    {
      name: 'Ammu',
      role: 'Daughter-in-law',
      subrole: "Aby's Wife & Kaylu's Amma",
      bio: 'Brought warmth, elegance, and new joy into the family circle.',
      image: 'assets/image copy 13.png'
    },
    {
      name: 'Aleena',
      role: 'Daughter',
      subrole: "Nishamma's Mini-Me",
      bio: "Sharing laughter, secrets, and Nishamma's caring genes with little Emy.",
      image: 'assets/image copy 13.png'
    },
    {
      name: 'Alen',
      role: 'Son-in-law',
      subrole: "Aleena's Husband & Emy's Appa",
      bio: 'The cool co-star who joined the crew and embraced the family chaos with a smile.',
      image: 'assets/image copy 13.png'
    },
    {
      name: 'Kaylu',
      role: 'Grandchild ❤️',
      subrole: "Aby & Ammu's Baby",
      bio: "The boss of Grandma's heart. Officially gets away with everything.",
      image: 'assets/image copy.png'
    },
    {
      name: 'Emy',
      role: 'Grandchild ❤️',
      subrole: "Aleena & Alen's Baby",
      bio: "The newest ray of sunshine who has Grandma completely wrapped around her little finger.",
      image: 'assets/image copy.png'
    }
  ],

  malaysianMoments: [
    {
      title: 'KLCC Lake Symphony',
      location: 'Kuala Lumpur, Malaysia',
      image: 'assets/image copy 3.png',
      caption: 'Bernard & Nishamma enjoying the waterfront skyline.'
    },
    {
      title: 'City Park Serenity',
      location: 'Kuala Lumpur',
      image: 'assets/image copy 2.png',
      caption: 'A graceful afternoon on the park bench.'
    },
    {
      title: 'Urban Explorer',
      location: 'Petronas Towers View',
      image: 'assets/image copy 4.png',
      caption: 'Soaking in the vibrant Kuala Lumpur skyline.'
    },
    {
      title: 'Genting High Line',
      location: 'Genting Highlands',
      image: 'assets/image copy 7.png',
      caption: 'Playful moments with the golden top-hat gentleman.'
    },
    {
      title: 'Waterfront Whispers',
      location: 'Lake Symphony Steps',
      image: 'assets/image copy 11.png',
      caption: 'A serene couple portrait by the cascades.'
    },
    {
      title: 'Nature Walk',
      location: 'Banyan Tree Roots',
      image: 'assets/image copy 12.png',
      caption: 'Standing together amidst the beauty of nature.'
    }
  ],

  watchlistGenres: [
    {
      title: 'Feel-Good Movies',
      icon: '🍿',
      match: '99% Match',
      desc: 'Stories filled with pure warmth, laughter, and uplifting endings.',
      badge: 'Nishamma Choice'
    },
    {
      title: 'Nivin Pauly Specials',
      icon: '🎬',
      match: '100% Match',
      desc: 'Classic charm, Premam nostalgia, and endless family humor.',
      badge: 'All-Time Favorite'
    },
    {
      title: 'Family Time',
      icon: '🏡',
      match: '100% Match',
      desc: 'Every meal together, every video call, and every loud conversation.',
      badge: 'Essential Daily'
    },
    {
      title: 'Taking Care of Everyone',
      icon: '🍲',
      match: '999% Match',
      desc: 'Her unstoppable instinct to nourish, soothe, protect, and love.',
      badge: 'Her Superpower'
    },
    {
      title: 'Grandma Time',
      icon: '👶',
      match: '100% Match',
      desc: 'Cuddling Kaylu and Emy — the absolute happiest moments of all.',
      badge: 'New Era'
    },
    {
      title: 'Sending Reels 😂',
      icon: '📱',
      match: '100% Match',
      desc: '15 forwarded videos a day. 100% genuine concern.',
      badge: 'NNN Breaking News'
    }
  ],

  memoryMosaic: [
    { image: 'assets/image.png', tag: 'The Leading Lady', title: 'Grace in Mauve Silk' },
    { image: 'assets/image copy.png', tag: 'Grandma Era', title: 'Holding Kaylu & Emy' },
    { image: 'assets/image copy 2.png', tag: 'Malaysian Days', title: 'Quiet Sunshine in KL' },
    { image: 'assets/image copy 3.png', tag: 'Love Story', title: 'Bernard & Nishamma at KLCC' },
    { image: 'assets/image copy 4.png', tag: 'Adventures', title: 'Skyline Dreams' },
    { image: 'assets/image copy 5.png', tag: 'Family Hearth', title: 'At Home on the Stairs' },
    { image: 'assets/image copy 6.png', tag: 'Sunny Days', title: 'Teal in Bloom' },
    { image: 'assets/image copy 7.png', tag: 'Playful Nishamma', title: 'A Toast at High Line' },
    { image: 'assets/image copy 8.png', tag: 'Golden Blooms', title: 'Genting High Line Market' },
    { image: 'assets/image copy 9.png', tag: 'Candid Joy', title: 'Smiling Under the Canopy' },
    { image: 'assets/image copy 10.png', tag: 'Wading Waters', title: 'KLCC Park Cooling Off' },
    { image: 'assets/image copy 11.png', tag: 'Couple Goals', title: 'Standing Strong by the Cascades' },
    { image: 'assets/image copy 12.png', tag: 'Grounded Roots', title: 'The Banyan Tree Sanctuary' },
    { image: 'assets/image copy 13.png', tag: 'The Kids', title: 'With Aby & Aleena' },
    { image: 'assets/image copy 14.png', tag: 'Mother & Son', title: 'Aby and Amma' }
  ],

  finaleSentences: [
    "She worried.",
    "She called.",
    "She checked if we ate.",
    "She forwarded questionable reels.",
    "She loved.",
    "And she never stopped putting us first."
  ]
};
