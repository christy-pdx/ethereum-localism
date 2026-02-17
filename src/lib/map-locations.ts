/**
 * Ethereum Localism community locations for the interactive map.
 * Sourced from the Community Registry, Field Reports, and allied initiatives.
 * Popup content mirrors the Registry page format (name, tagline, contact, more).
 */
export interface MapLocation {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  /** Tagline/description (matches Registry format) */
  description: string;
  href: string;
  status: "active" | "on-hold" | "emerging";
  /** Contact links (label + href), matches Registry Contact line */
  contact?: { label: string; href: string }[];
  /** More/read-more links (e.g. Field Reports), matches Registry More line */
  more?: { label: string; href: string }[];
}

export const mapLocations: MapLocation[] = [
  {
    id: "regen-hub-boulder",
    name: "Regen Hub Boulder",
    location: "Boulder, Colorado",
    lat: 40.015,
    lng: -105.2705,
    description:
      "Bioregional hub, regenerative finance and community coordination",
    href: "/knowledge-garden/resources/Ethereum-Localism-Registry",
    status: "active",
    contact: [{ label: "regenhub.xyz", href: "https://regenhub.xyz" }],
    more: [
      { label: "Regen Hub Playbook", href: "/knowledge-garden/library/Implementation-Guides/Regen-Hub-Playbook" },
      { label: "Lessons Learned from the Boulder Blockchain Meetup", href: "/knowledge-garden/library/Field-Reports/Lessons-Learned-from-the-Boulder-Blockchain-Meetup" },
    ],
  },
  {
    id: "pdx-dao",
    name: "PDX DAO",
    location: "Portland, Oregon",
    lat: 45.5152,
    lng: -122.6784,
    description:
      "Local DAO, civic education and governance experiments",
    href: "/knowledge-garden/resources/Ethereum-Localism-Registry",
    status: "on-hold",
    contact: [
      { label: "pdxdao.xyz", href: "https://pdxdao.xyz" },
      { label: "@PDXDAO", href: "https://twitter.com/pdxdao" },
      { label: "etherealforest.eth@protonmail.com", href: "mailto:etherealforest.eth@protonmail.com" },
    ],
    more: [
      { label: "Hosting a GFEL", href: "/knowledge-garden/library/Implementation-Guides/Hosting-a-GFEL" },
      { label: "Imagination Circle in Portland", href: "/knowledge-garden/library/Field-Reports/Imagination-Circle-in-Portland" },
    ],
  },
  {
    id: "greensofa-taiwan",
    name: "GreenSofa Taiwan",
    location: "Taipei, Taiwan",
    lat: 25.033,
    lng: 121.5654,
    description:
      "Ethereum public goods culture, bridging Web3 with civic tech",
    href: "/knowledge-garden/library/Field-Reports/GreenSofa-Taiwan",
    status: "active",
    contact: [
      { label: "@greensofa_tw", href: "https://twitter.com/greensofa_tw" },
      { label: "FAB DAO", href: "https://fabdao.world/" },
    ],
    more: [{ label: "GreenSofa Taiwan", href: "/knowledge-garden/library/Field-Reports/GreenSofa-Taiwan" }],
  },
  {
    id: "urbe-eth",
    name: "urbe.eth",
    location: "Rome, Italy",
    lat: 41.9028,
    lng: 12.4964,
    description:
      "Web3 builder community, meetups and hackathons across Europe",
    href: "/knowledge-garden/library/Field-Reports/the-rise-of-urbe.eth",
    status: "active",
    contact: [
      { label: "urbe.build", href: "https://urbe.build" },
      { label: "@urbe_eth", href: "https://x.com/urbeEth" },
      { label: "Discord", href: "https://discord.gg/urbe" },
    ],
    more: [{ label: "the rise of urbe.eth", href: "/knowledge-garden/library/Field-Reports/the-rise-of-urbe.eth" }],
  },
  {
    id: "crypto-commons",
    name: "Crypto Commons Association",
    location: "Austrian Alps",
    lat: 47.2692,
    lng: 11.4041,
    description:
      "Think/do tank for crypto-commons, research residencies and retreat spaces",
    href: "https://www.crypto-commons.org/",
    status: "active",
    contact: [{ label: "crypto-commons.org", href: "https://www.crypto-commons.org/" }],
  },
  {
    id: "ekonavi",
    name: "Ekonavi",
    location: "Brazil",
    lat: -23.5505,
    lng: -46.6333,
    description:
      "Collaborative platform for ecological development, agriculture and bio-construction",
    href: "https://ekonavi.com",
    status: "active",
    contact: [{ label: "ekonavi.com", href: "https://ekonavi.com" }],
  },
  {
    id: "celo-chapada-diamantina",
    name: "Celo Localism Chapada Diamantina",
    location: "Chapada Diamantina, Bahia, Brazil",
    lat: -12.564,
    lng: -41.389,
    description:
      "Regenerative finance pilot with mobile-native infrastructure in rural Brazil",
    href: "https://x.com/celoorgbr/status/1938147875067990330",
    status: "active",
    contact: [{ label: "Celo Brasil (X)", href: "https://x.com/celoorgbr/status/1938147875067990330" }],
  },
];
