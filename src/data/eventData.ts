import { AuctionItem, HighlightCard, RuleStep, RegisteredTeam } from '../types';
import registeredTeamsSeed from '../../data/registered_teams.json';

export const ADMIN_EMAILS = [
  "its.rastro@gmail.com",
  "ajayswaminathan.work@gmail.com",
  "snitheesh2525@gmail.com"
];

export const EVENT_DETAILS = {
  title: "GREEN PREMIER LEAGUE",
  tagline: "Bid Green, Build Change",
  supportingText: "Bid Green, Build Change. Create the sustainable and resilient society you believe in.",
  badge: "GREEN PREMIER LEAGUE • ECO STRATEGY",
  host: "Green Premier League Committee • National Service Scheme",
  totalBudget: 1000000,
  exampleBudget: 1000000,
  budgetNote: "Official 10 Lakhs (₹10,00,000) green treasury allocation provided to all confirmed teams on event day.",
  eventDate: "24 September 2026",
  eventVenue: "Gallery Hall III, Block V",
  entryFee: "Official Delegate Accreditation • Free for Registered Teams",
  datePlaceholder: "24 September 2026",
  venuePlaceholder: "Gallery Hall III, Block V",
  feePlaceholder: "Free for Registered Teams",
};

export const BASELINE_BUDGET = 1000000;

export const ITEM_BASELINE_PERCENTAGES: Record<string, number> = {
  "clean-water": 10,          // 10%  -> ₹1,00,000 at ₹10 Lakhs
  "healthcare": 15,           // 15%  -> ₹1,50,000
  "education": 12,            // 12%  -> ₹1,20,000
  "waste-mgmt": 8,            // 8%   -> ₹80,000
  "transport": 10,            // 10%  -> ₹1,00,000
  "mental-care": 7,           // 7%   -> ₹70,000
  "access": 6,                // 6%   -> ₹60,000
  "employment": 15,           // 15%  -> ₹1,50,000
  "disaster-prep": 9,         // 9%   -> ₹90,000
  "environment": 8,           // 8%   -> ₹80,000
  "renewable-energy": 13,     // 13%  -> ₹1,30,000
  "food-security": 11,        // 11%  -> ₹1,10,000
  "affordable-housing": 14,   // 14%  -> ₹1,40,000
  "digital-infrastructure": 9,// 9%   -> ₹90,000
  "civic-safety": 8.5,        // 8.5% -> ₹85,000
  "cybersecurity-privacy": 7.5,// 7.5% -> ₹75,000
  "public-libraries": 5,      // 5%   -> ₹50,000
  "childcare-early-learning": 7.5, // 7.5% -> ₹75,000
  "elderly-care": 6.5,        // 6.5% -> ₹65,000
  "arts-culture": 5.5,        // 5.5% -> ₹55,000
  "transparent-governance": 7,// 7%   -> ₹70,000
  "circular-economy": 9.5,    // 9.5% -> ₹95,000
  "clean-air-defense": 8.5,   // 8.5% -> ₹85,000
  "legal-aid": 6,             // 6%   -> ₹60,000
  "flood-sponge-network": 11, // 11%  -> ₹1,10,000
  "research-innovation-labs": 12.5, // 12.5% -> ₹1,25,000
  "vocational-training": 8,   // 8%   -> ₹80,000
  "women-safety-corridors": 8,// 8%   -> ₹80,000
  // 30 Additional Resources (29 - 58)
  "microgrid-storage": 11.5,  // 11.5% -> ₹1,15,000
  "green-building-codes": 8.5,// 8.5% -> ₹85,000
  "desalination-treatment": 10,// 10% -> ₹1,00,000
  "ev-charging-corridors": 9, // 9%   -> ₹90,000
  "district-cooling": 7.5,    // 7.5% -> ₹75,000
  "mangrove-coastal-shield": 9,// 9%  -> ₹90,000
  "soil-regeneration": 8,     // 8%   -> ₹80,000
  "wildlife-corridors": 6,    // 6%   -> ₹60,000
  "zero-plastic-pact": 7.5,   // 7.5% -> ₹75,000
  "reforestation-drone-fleet": 8.5, // 8.5% -> ₹85,000
  "mobile-health-clinics": 8, // 8%   -> ₹80,000
  "youth-sports-academies": 6,// 6%   -> ₹60,000
  "community-kitchens": 7,    // 7%   -> ₹70,000
  "addiction-recovery": 6.5,  // 6.5% -> ₹65,000
  "accessible-pedestrian-grid": 7.5, // 7.5% -> ₹75,000
  "neighborhood-energy-coops": 7, // 7% -> ₹70,000
  "climate-resilient-seed-bank": 6.5, // 6.5% -> ₹65,000
  "urban-fire-disaster-squad": 8.5, // 8.5% -> ₹85,000
  "heatwave-refuge-network": 7, // 7% -> ₹70,000
  "participatory-town-halls": 6, // 6% -> ₹60,000
  "green-hydrogen-hub": 12,   // 12%  -> ₹1,20,000
  "artisanal-craft-incubator": 6.5, // 6.5% -> ₹65,000
  "eco-tourism-parks": 7,     // 7%   -> ₹70,000
  "social-enterprise-grants": 8.5, // 8.5% -> ₹85,000
  "water-treatment-tech": 9.5,// 9.5% -> ₹95,000
  "open-data-platform": 7,    // 7%   -> ₹70,000
  "digital-grievance-tribunal": 6.5, // 6.5% -> ₹65,000
  "disaster-satellite-telemetry": 8.5, // 8.5% -> ₹85,000
  "smart-traffic-transit": 7.5,// 7.5% -> ₹75,000
  "climate-resilience-academy": 6, // 6% -> ₹60,000
  // 42 Additional Resources to reach 100 total (59 - 100)
  "offshore-wind-arrays": 12, // 12% -> ₹1,20,000
  "electrified-freight-rail": 10.5, // 10.5% -> ₹1,05,000
  "smart-water-metering": 8, // 8% -> ₹80,000
  "underground-utility-ducts": 9, // 9% -> ₹90,000
  "biomethane-grid": 8.5, // 8.5% -> ₹85,000
  "stormwater-caverns": 9.5, // 9.5% -> ₹95,000
  "tidal-wave-power": 10, // 10% -> ₹1,00,000
  "miyawaki-microforests": 7, // 7% -> ₹70,000
  "wetland-bioremediation": 7.5, // 7.5% -> ₹75,000
  "riparian-buffer-zones": 6.5, // 6.5% -> ₹65,000
  "ocean-trash-skimmers": 7, // 7% -> ₹70,000
  "coral-nursery-sanctuaries": 6.5, // 6.5% -> ₹65,000
  "urban-pollinator-corridors": 5.5, // 5.5% -> ₹55,000
  "light-pollution-abatement": 5, // 5% -> ₹50,000
  "universal-school-nutrition": 7.5, // 7.5% -> ₹75,000
  "migrant-worker-complexes": 8.5, // 8.5% -> ₹85,000
  "pediatric-trauma-units": 8, // 8% -> ₹80,000
  "community-mental-wellness": 6, // 6% -> ₹60,000
  "safe-night-transit": 7, // 7% -> ₹70,000
  "occupational-safety-shield": 7.5, // 7.5% -> ₹75,000
  "deaf-blind-assistive-tech": 6, // 6% -> ₹60,000
  "seismic-retrofitting": 8.5, // 8.5% -> ₹85,000
  "community-radio-beacons": 5.5, // 5.5% -> ₹55,000
  "neighbourhood-cisterns": 7, // 7% -> ₹70,000
  "cyclone-resilient-roofs": 6.5, // 6.5% -> ₹65,000
  "volunteer-civil-defense": 7, // 7% -> ₹70,000
  "mobile-water-desal-trucks": 7.5, // 7.5% -> ₹75,000
  "mudslide-geogrid-barriers": 6.5, // 6.5% -> ₹65,000
  "cleantech-patent-commons": 7, // 7% -> ₹70,000
  "green-cement-kilns": 9, // 9% -> ₹90,000
  "local-barter-currency": 5.5, // 5.5% -> ₹55,000
  "rooftop-hydroponics": 8, // 8% -> ₹80,000
  "seaweed-kelp-aquaculture": 7.5, // 7.5% -> ₹75,000
  "circular-ewaste-refinery": 8.5, // 8.5% -> ₹85,000
  "regenerative-textile-mills": 6.5, // 6.5% -> ₹65,000
  "algorithmic-ethics-council": 6, // 6% -> ₹60,000
  "participatory-budgeting-app": 6.5, // 6.5% -> ₹65,000
  "digital-land-titling": 7, // 7% -> ₹70,000
  "whistleblower-protection": 6, // 6% -> ₹60,000
  "civic-open-code-stack": 6.5, // 6.5% -> ₹65,000
  "anti-corruption-ledger": 7, // 7% -> ₹70,000
  "smart-street-sensors": 6.5, // 6.5% -> ₹65,000
};

export const ITEM_BASELINE_PRICES: Record<string, number> = Object.fromEntries(
  Object.entries(ITEM_BASELINE_PERCENTAGES).map(([id, pct]) => [
    id,
    Math.round((BASELINE_BUDGET * pct) / 100),
  ])
);

export function getItemBaseRatio(itemId: string): number {
  const pct = ITEM_BASELINE_PERCENTAGES[itemId] ?? 10;
  return pct / 100;
}

export function getItemBudgetPercentage(itemId: string): number {
  return ITEM_BASELINE_PERCENTAGES[itemId] ?? 10;
}

export function calculateScaledItemPrice(
  itemId: string,
  overallBudget: number,
  customPercentage?: number
): number {
  const pct = customPercentage ?? (ITEM_BASELINE_PERCENTAGES[itemId] ?? 10);
  return Math.max(100, Math.round((overallBudget * pct) / 100));
}

export const HIGHLIGHT_CARDS: HighlightCard[] = [
  {
    number: "01",
    title: "THINK",
    subtitle: "Critical Thinking & Civic Awareness",
    description: "Deconstruct what human communities truly require to thrive beyond superficial growth, balancing urgent essentials against long-term resilience.",
    iconName: "BrainCircuit"
  },
  {
    number: "02",
    title: "BID",
    subtitle: "Strategic Resource Allocation",
    description: "Manage finite fictional capital in an open, competitive auction against rival student teams where every resource won eliminates it from the board.",
    iconName: "Gavel"
  },
  {
    number: "03",
    title: "BUILD",
    subtitle: "Create a Balanced Society",
    description: "Synthesize your acquired civic assets into an interconnected socio-economic blueprint, formulating your strategic society vision.",
    iconName: "Building2"
  }
];

export const RULES_LIST: RuleStep[] = [
  {
    number: 1,
    title: "Equal Fictional Budget",
    description: "Every registered team receives an equal fictional budget announced on event day. No team starts with a financial advantage.",
    iconName: "Coins"
  },
  {
    number: 2,
    title: "Open Live Auction",
    description: "Teams bid on societal resources in a high-energy open auction format overseen by the Official Auctioneer.",
    iconName: "Megaphone"
  },
  {
    number: 3,
    title: "Absolute Scarcity",
    description: "Once an item is hammered down and sold, it cannot be purchased by another team. It is permanently off the board.",
    iconName: "Lock"
  },
  {
    number: 4,
    title: "Deliberate Cost Disparities",
    description: "Some vital resources are intentionally expensive, forcing teams to make difficult moral and strategic trade-offs.",
    iconName: "TrendingUp"
  },
  {
    number: 5,
    title: "Strategic Budget Management",
    description: "Teams must carefully allocate their funds — overspending early may leave you vulnerable in crucial later rounds.",
    iconName: "Calculator"
  },
  {
    number: 6,
    title: "Strict No-AI Mandate",
    description: "AI assistance is strictly prohibited during the event. Only raw human strategy and empathy guide your society's blueprint.",
    iconName: "BotOff",
    highlight: true
  }
];

// Expanded 28 Auction Items (between 25 and 30)
const RAW_AUCTION_ITEMS: Array<Omit<AuctionItem, 'percentage'>> = [
  {
    id: "clean-water",
    name: "CLEAN WATER",
    startingPrice: 100000,
    category: "Vital Infrastructure",
    impactDescription: "Universal potable water access, river conservation, wastewater purification, and guaranteed sanitation infrastructure.",
    longDescription: "The absolute baseline of civilization. Securing clean water prevents waterborne epidemics, ensures agricultural stability, reduces infant mortality, and powers basic residential hygienic needs.",
    societalBenefit: "+40 Public Health baseline, disease transmission prevention, water security during droughts.",
    riskIfIgnored: "Severe public health crises, water rationing, and dependency on costly external aid.",
    synergyTags: ["Healthcare", "Waste Mgmt", "Environment"],
    iconName: "Droplets",
    colorAccent: "#0ea5e9"
  },
  {
    id: "healthcare",
    name: "HEALTHCARE",
    startingPrice: 150000,
    category: "Human Welfare",
    impactDescription: "Primary health centres, emergency care facilities, disease immunization networks, and community medicine.",
    longDescription: "A healthy population is the foundation of economic productivity and civic stability. Robust healthcare provides preventive treatments, reduces preventable mortalities, and creates frontline emergency defenses.",
    societalBenefit: "+45 Life Expectancy, resilient workforce, reduced mortality during seasonal outbreaks.",
    riskIfIgnored: "Worker absenteeism, economic paralysis during health outbreaks, and shortened lifespan.",
    synergyTags: ["Clean Water", "Mental Care", "Disaster Prep"],
    iconName: "HeartPulse",
    colorAccent: "#10b981"
  },
  {
    id: "education",
    name: "EDUCATION",
    startingPrice: 120000,
    category: "Human Welfare",
    impactDescription: "Public schools, vocational academies, digital literacy drives, and civic-scientific research institutes.",
    longDescription: "Unlocks generational human capital. An educated populace drives technical innovation, strengthens democratic institutions, reduces structural poverty, and elevates ethical governance.",
    societalBenefit: "+35 Civic Literacy, high-skill employment pipeline, social mobility.",
    riskIfIgnored: "Technological stagnation, generational inequality, and vulnerability to misinformation.",
    synergyTags: ["Employment", "Access", "Mental Care"],
    iconName: "GraduationCap",
    colorAccent: "#06b6d4"
  },
  {
    id: "waste-mgmt",
    name: "WASTE MGMT",
    startingPrice: 80000,
    category: "Environment & Ecology",
    impactDescription: "Solid waste segregation, circular recycling plants, landfill abatement, and bioremediation.",
    longDescription: "Prevents modern cities from drowning in industrial and domestic refuse. Converts waste into energy and recyclable commodities while protecting soil and groundwater aquifers.",
    societalBenefit: "Clean urban environments, microplastic reduction, methane emission recapture.",
    riskIfIgnored: "Toxic landfill overflow, groundwater contamination, disease vectors.",
    synergyTags: ["Environment", "Clean Water", "Healthcare"],
    iconName: "Trash2",
    colorAccent: "#059669"
  },
  {
    id: "transport",
    name: "TRANSPORT",
    startingPrice: 100000,
    category: "Vital Infrastructure",
    impactDescription: "Affordable public transit grids, electric bus networks, pedestrian paths, and freight logistics.",
    longDescription: "Connects communities with opportunity. Efficient low-carbon transit cuts commute times, connects rural peripheries to city centres, and reduces traffic fatalities and emissions.",
    societalBenefit: "Economic mobility, reduced carbon emissions, universal physical accessibility.",
    riskIfIgnored: "Gridlocked cities, isolated marginalized districts, inflated logistics costs.",
    synergyTags: ["Employment", "Access", "Environment"],
    iconName: "Bus",
    colorAccent: "#0284c7"
  },
  {
    id: "mental-care",
    name: "MENTAL CARE",
    startingPrice: 70000,
    category: "Human Welfare",
    impactDescription: "Community counselling hubs, destigmatization drives, workplace wellbeing policies, and youth helpline systems.",
    longDescription: "Addresses the invisible epidemic of urban isolation and psychological distress. Prioritizing mental care elevates communal trust, reduces suicides, and enhances emotional resilience.",
    societalBenefit: "Social cohesion, psychological resilience, lower crime and burnout rates.",
    riskIfIgnored: "Silent burnout epidemics, diminished communal empathy, fractured family systems.",
    synergyTags: ["Healthcare", "Education", "Access"],
    iconName: "Sparkles",
    colorAccent: "#14b8a6"
  },
  {
    id: "access",
    name: "ACCESS",
    startingPrice: 60000,
    category: "Civic Resilience",
    impactDescription: "Universal accessibility for disabled citizens, legal aid clinics, digital connectivity, and minority inclusion.",
    longDescription: "Ensures no citizen is left behind. Guarantees universal design in buildings, equal digital bandwidth for rural regions, and accessible legal protections for marginalized populations.",
    societalBenefit: "True democratic equity, dignity for differently-abled citizens, unified society.",
    riskIfIgnored: "Severe social exclusion, civil unrest, disenfranchisement of vulnerable groups.",
    synergyTags: ["Education", "Transport", "Employment"],
    iconName: "Accessibility",
    colorAccent: "#2dd4bf"
  },
  {
    id: "employment",
    name: "EMPLOYMENT",
    startingPrice: 150000,
    category: "Economy & Innovation",
    impactDescription: "Living wage standards, sustainable green manufacturing, entrepreneurship incubators, and fair labor laws.",
    longDescription: "The engine of sustainable prosperity. Provides dignified livelihoods, funds public treasuries via fair taxation, and channels youth vigor into constructive national building.",
    societalBenefit: "Economic independence, eradication of poverty, vibrant local marketplaces.",
    riskIfIgnored: "Mass youth unemployment, crime spikes, brain drain to overseas economies.",
    synergyTags: ["Education", "Transport", "Access"],
    iconName: "Briefcase",
    colorAccent: "#38bdf8"
  },
  {
    id: "disaster-prep",
    name: "DISASTER PREP",
    startingPrice: 90000,
    category: "Civic Resilience",
    impactDescription: "Early flood/cyclone warning sirens, rapid relief corps, climate shelters, and seismic-resistant codes.",
    longDescription: "Protects all built achievements against nature's fury. Critical for coastal and monsoon-impacted regions like Chennai where floods and tropical storms threaten sudden destruction.",
    societalBenefit: "Near-zero casualty rate during extreme climate events, rapid community recovery.",
    riskIfIgnored: "Catastrophic loss of life, destroyed civic infrastructure, prolonged economic collapse.",
    synergyTags: ["Healthcare", "Clean Water", "Transport"],
    iconName: "ShieldAlert",
    colorAccent: "#0369a1"
  },
  {
    id: "environment",
    name: "ENVIRONMENT",
    startingPrice: 80000,
    category: "Environment & Ecology",
    impactDescription: "Urban afforestation, wetland preservation, clean air standards, and renewable solar-wind microgrids.",
    longDescription: "The ecological shield safeguarding all future generations. Protects coastal mangroves, regulates microclimates, lowers urban heat island effects, and keeps air breathable.",
    societalBenefit: "Clean air, natural flood sponges, bio-diversity preservation, cooling urban heat.",
    riskIfIgnored: "Unbreathable smog, groundwater exhaustion, irreversible ecological desertification.",
    synergyTags: ["Waste Mgmt", "Clean Water", "Disaster Prep"],
    iconName: "Trees",
    colorAccent: "#10b981"
  },
  // Additional Resources (11 - 28)
  {
    id: "renewable-energy",
    name: "RENEWABLE ENERGY GRID",
    startingPrice: 130000,
    category: "Vital Infrastructure",
    impactDescription: "Distributed solar rooftops, offshore wind arrays, smart energy storage, and zero-carbon power distribution.",
    longDescription: "Drives industrial power without dirtying the atmosphere. Stabilizes electricity costs and ensures uninterrupted supply to hospitals, colleges, and water filtration plants.",
    societalBenefit: "Zero blackout risk, fossil fuel independence, massive greenhouse gas elimination.",
    riskIfIgnored: "Air pollution spikes, soaring electricity tariffs, vulnerability to fuel import shocks.",
    synergyTags: ["Environment", "Clean Water", "Employment"],
    iconName: "Sun",
    colorAccent: "#34d399"
  },
  {
    id: "food-security",
    name: "FOOD SECURITY & AGRI-TECH",
    startingPrice: 110000,
    category: "Human Welfare",
    impactDescription: "Buffer food granaries, precision urban farming, cold storage supply chains, and subsidized community kitchens.",
    longDescription: "Guarantees that no family sleeps hungry. Shields food prices from market speculation and extreme climate crop failures.",
    societalBenefit: "Eradication of child stunting, stable staple prices, agricultural climate adaptation.",
    riskIfIgnored: "Severe food riots, inflation spikes in vegetables/grains, widespread malnutrition.",
    synergyTags: ["Healthcare", "Clean Water", "Environment"],
    iconName: "Utensils",
    colorAccent: "#0d9488"
  },
  {
    id: "affordable-housing",
    name: "AFFORDABLE HOUSING",
    startingPrice: 140000,
    category: "Vital Infrastructure",
    impactDescription: "Regulated rent social housing, anti-eviction legal safety nets, slum redevelopment, and modular construction.",
    longDescription: "Provides every citizen with safe shelter, clean sanitation, and postal identity. Prevents predatory landlord practices and overcrowding.",
    societalBenefit: "Dignified living conditions, reduction of urban slums, generational wealth stability.",
    riskIfIgnored: "Exploding homelessness, squalid informal settlements, public health vectors.",
    synergyTags: ["Clean Water", "Access", "Healthcare"],
    iconName: "Home",
    colorAccent: "#06b6d4"
  },
  {
    id: "digital-infrastructure",
    name: "DIGITAL INFRASTRUCTURE",
    startingPrice: 90000,
    category: "Governance & Digital",
    impactDescription: "Universal fiber optic connectivity, municipal free Wi-Fi, public cloud storage, and low-latency digital networks.",
    longDescription: "The nervous system of the 21st century. Connects rural schools to global education and allows citizens to file grievances online without bribery.",
    societalBenefit: "Digital democracy, equal remote work access, high-speed educational connectivity.",
    riskIfIgnored: "Deep digital divide, economic marginalization of non-urban students.",
    synergyTags: ["Education", "Employment", "Transparent Governance"],
    iconName: "Wifi",
    colorAccent: "#0284c7"
  },
  {
    id: "civic-safety",
    name: "CIVIC SAFETY & EMERGENCY",
    startingPrice: 85000,
    category: "Civic Resilience",
    impactDescription: "Community-driven emergency dispatch, responsive street illumination, citizen safety ambassadors, and quick sirens.",
    longDescription: "Fosters safety in public spaces after dusk. Ensures ambulance, fire, and rescue services reach emergency sites within 8 minutes.",
    societalBenefit: "Drastic drop in nighttime crime, high pedestrian confidence, rapid fire containment.",
    riskIfIgnored: "High nighttime street harassment, delayed fire rescue, fear in public parks.",
    synergyTags: ["Healthcare", "Disaster Prep", "Transport"],
    iconName: "Shield",
    colorAccent: "#22c55e"
  },
  {
    id: "cybersecurity-privacy",
    name: "CYBERSECURITY & DATA PRIVACY",
    startingPrice: 75000,
    category: "Governance & Digital",
    impactDescription: "State-grade data encryption, identity protection vaults, anti-surveillance charters, and critical grid firewalls.",
    longDescription: "Guarantees citizen medical records and financial details cannot be leaked or held hostage by foreign cybercriminals.",
    societalBenefit: "Total protection of citizen identity, resilience against digital infrastructure blackmail.",
    riskIfIgnored: "Mass identity theft, municipal ransomware blackouts, surveillance state creep.",
    synergyTags: ["Digital Infrastructure", "Transparent Governance"],
    iconName: "LockKeyhole",
    colorAccent: "#14b8a6"
  },
  {
    id: "public-libraries",
    name: "PUBLIC LIBRARIES & ARCHIVES",
    startingPrice: 50000,
    category: "Human Welfare",
    impactDescription: "Free public study spaces, digital research archives, cultural preservation vaults, and community bookmobiles.",
    longDescription: "Democratic temples of lifelong learning. Offers quiet study chambers and high-speed research terminals for underprivileged students.",
    societalBenefit: "Unrestricted self-education, cultural identity safeguarding, intellectual sanctuary.",
    riskIfIgnored: "Erosion of collective history, commercialization of knowledge access.",
    synergyTags: ["Education", "Access", "Digital Infrastructure"],
    iconName: "BookOpen",
    colorAccent: "#06b6d4"
  },
  {
    id: "childcare-early-learning",
    name: "CHILDCARE & EARLY LEARNING",
    startingPrice: 75000,
    category: "Human Welfare",
    impactDescription: "Free municipal crèches, infant sensory development hubs, toddler nutrition support, and parenting circles.",
    longDescription: "Empowers working parents—especially mothers—to pursue careers while infants receive cognitive development and balanced nourishment.",
    societalBenefit: "Massive boost in female labor participation, high school readiness, early detection of learning needs.",
    riskIfIgnored: "Women forced out of the workforce, latchkey children, developmental delays.",
    synergyTags: ["Education", "Employment", "Healthcare"],
    iconName: "Baby",
    colorAccent: "#38bdf8"
  },
  {
    id: "elderly-care",
    name: "ELDERLY CARE & GERIATRICS",
    startingPrice: 65000,
    category: "Human Welfare",
    impactDescription: "Senior day-activity centres, geriatric clinics, doorstep medicine delivery, and loneliness reduction networks.",
    longDescription: "Honors the generation that built our foundation. Delivers dignity, palliative medicine, and community socialization for senior citizens.",
    societalBenefit: "Zero senior abandonment, intergenerational wisdom transfer, lower hospital bed congestion.",
    riskIfIgnored: "Isolated seniors dying in despair, overloaded tertiary hospital beds.",
    synergyTags: ["Healthcare", "Mental Care", "Access"],
    iconName: "HeartHandshake",
    colorAccent: "#14b8a6"
  },
  {
    id: "arts-culture",
    name: "ARTS, CULTURE & RECREATION",
    startingPrice: 55000,
    category: "Civic Resilience",
    impactDescription: "Open-air amphitheaters, neighborhood sports turfs, indie artist grants, and cultural heritage festivals.",
    longDescription: "Provides the soul of civic life. Sports and arts channel youth energy away from addiction or crime into communal celebration.",
    societalBenefit: "Civic happiness index surge, youth athleticism, vibrant pluralistic culture.",
    riskIfIgnored: "Sterile gray cities, youth disillusionment, erosion of local performing arts.",
    synergyTags: ["Mental Care", "Access", "Environment"],
    iconName: "Palette",
    colorAccent: "#2dd4bf"
  },
  {
    id: "transparent-governance",
    name: "TRANSPARENT GOVERNANCE",
    startingPrice: 70000,
    category: "Governance & Digital",
    impactDescription: "Participatory municipal budgeting, real-time public ledger tracking, whistle-blower protection, and open civic audits.",
    longDescription: "Shines bright sunlight on every spent rupee. Eliminates kickbacks in municipal contracts and lets citizens vote on local neighborhood spending.",
    societalBenefit: "Near-zero corruption losses, high citizen trust in public institutions, efficient capital usage.",
    riskIfIgnored: "Rampant embezzlement, delayed public works, utter public apathy.",
    synergyTags: ["Digital Infrastructure", "Legal Aid", "Cybersecurity & Data Privacy"],
    iconName: "FileCheck",
    colorAccent: "#34d399"
  },
  {
    id: "circular-economy",
    name: "CIRCULAR ECONOMY INCUBATOR",
    startingPrice: 95000,
    category: "Economy & Innovation",
    impactDescription: "Zero-waste industrial symbiosis, electronics repair cafes, remanufacturing grants, and upcycling co-ops.",
    longDescription: "Transforms one industry's waste into another's raw material. Creates high-volume local green technician jobs while terminating landfill reliance.",
    societalBenefit: "New green employment sector, 70% reduction in raw material extraction, zero landfill.",
    riskIfIgnored: "Resource depletion, skyrocketing manufacturing costs, toxic e-waste dumps.",
    synergyTags: ["Waste Mgmt", "Employment", "Environment"],
    iconName: "RefreshCw",
    colorAccent: "#10b981"
  },
  {
    id: "clean-air-defense",
    name: "CLEAN AIR DEFENSE",
    startingPrice: 85000,
    category: "Environment & Ecology",
    impactDescription: "Industrial chimney scrubbers, bio-moss smog walls, low emission delivery zones, and real-time AQI monitors.",
    longDescription: "Guarantees children can run outdoors without developing asthma. Filters lethal PM2.5 and PM10 particles out of urban air corridors.",
    societalBenefit: "60% drop in respiratory admissions, crystal clear urban skies, longer citizen lifespans.",
    riskIfIgnored: "Chronic childhood asthma, smog inversions causing airport and school shutdowns.",
    synergyTags: ["Environment", "Healthcare", "Transport"],
    iconName: "Wind",
    colorAccent: "#38bdf8"
  },
  {
    id: "legal-aid",
    name: "LEGAL AID & ADVOCACY",
    startingPrice: 60000,
    category: "Governance & Digital",
    impactDescription: "Pro-bono citizen legal clinics, mobile lok-adalat arbitration, tenant defense attorneys, and labor rights bureaus.",
    longDescription: "Ensures justice is not an exclusive commodity for the wealthy. Protects daily wage laborers from wage theft and wrongful eviction.",
    societalBenefit: "Rule of law for all, swift resolution of civil disputes, defense against corporate abuse.",
    riskIfIgnored: "Predatory exploitation of uneducated workers, vigilante justice, lawless slums.",
    synergyTags: ["Access", "Transparent Governance", "Employment"],
    iconName: "Scale",
    colorAccent: "#0ea5e9"
  },
  {
    id: "flood-sponge-network",
    name: "RAPID FLOOD & DRAINAGE NETWORK",
    startingPrice: 110000,
    category: "Civic Resilience",
    impactDescription: "Permeable pavements, bioswales, deep canal desilting, storm pumps, and urban wetland sponge corridors.",
    longDescription: "Engineered specifically for monsoon and coastal cities prone to deluge like Chennai. Soaks up extreme rainfall and recharges aquifers instead of flooding homes.",
    societalBenefit: "Zero waterlogging during cyclones, groundwater replenishment, millions saved in damages.",
    riskIfIgnored: "Annual catastrophic urban flooding, submerged power substations, drowned neighborhoods.",
    synergyTags: ["Disaster Prep", "Clean Water", "Environment"],
    iconName: "CloudRain",
    colorAccent: "#0ea5e9"
  },
  {
    id: "research-innovation-labs",
    name: "RESEARCH & DEEP-TECH LABS",
    startingPrice: 125000,
    category: "Economy & Innovation",
    impactDescription: "Collegiate patent grants, renewable battery research, open science repositories, and biotech testbeds.",
    longDescription: "Propels the society from simple resource consumption into technological leadership. Generates indigenous patents and high-paying scientific careers.",
    societalBenefit: "High-value patent revenue, brain gain from top universities, indigenous solutions to climate change.",
    riskIfIgnored: "Eternal dependency on expensive foreign patents and imported critical equipment.",
    synergyTags: ["Education", "Employment", "Digital Infrastructure"],
    iconName: "Cpu",
    colorAccent: "#0284c7"
  },
  {
    id: "vocational-training",
    name: "VOCATIONAL TRAINING CENTERS",
    startingPrice: 80000,
    category: "Economy & Innovation",
    impactDescription: "Modern polytechnics, electric vehicle repair academies, carpentry & plumbing certification, and solar installer apprenticeships.",
    longDescription: "Bridges the gap between academic theory and real-world trade. Gives non-university youths high-paying, recession-proof trade skills.",
    societalBenefit: "Near-zero idle youth, abundant certified tradespeople for infrastructure maintenance.",
    riskIfIgnored: "Shortage of skilled blue-collar technicians, severe underemployment.",
    synergyTags: ["Employment", "Education", "Renewable Energy Grid"],
    iconName: "Wrench",
    colorAccent: "#059669"
  },
  {
    id: "women-safety-corridors",
    name: "WOMEN'S SAFETY CORRIDORS",
    startingPrice: 80000,
    category: "Civic Resilience",
    impactDescription: "High-intensity safe pedestrian paths, 24/7 dedicated transit shuttles, CCTV audit feeds, and well-lit commercial boulevards.",
    longDescription: "Guarantees women complete freedom of movement at any hour of day or night. Transforms the city into an inclusive space for work, study, and leisure.",
    societalBenefit: "Doubling of women's evening economic participation, universal sense of security.",
    riskIfIgnored: "Self-imposed curfews on women, restricted career options, climate of intimidation.",
    synergyTags: ["Transport", "Civic Safety", "Access"],
    iconName: "ShieldCheck",
    colorAccent: "#0d9488"
  },
  // Additional 30 Resources (29 - 58)
  {
    id: "microgrid-storage",
    name: "ADVANCED BATTERY & GRID STORAGE",
    startingPrice: 115000,
    category: "Vital Infrastructure",
    impactDescription: "Solid-state battery hubs, vanadium flow reservoirs, and smart inverter substations ensuring 24/7 uninterrupted renewable grid reliability.",
    longDescription: "Addresses the core intermittency of green power. Stores daytime solar and coastal wind peaks to ensure hospitals, water filtration stations, and residential sectors never experience voltage drops or rolling blackouts.",
    societalBenefit: "Zero renewable power curtailment, eliminates emergency diesel generator reliance, and guarantees grid resilience during cyclones.",
    riskIfIgnored: "Severe brownouts at sunset, wasted clean energy generation, and catastrophic grid collapse during peak summer heatwaves.",
    synergyTags: ["Renewable Energy Grid", "Digital Infrastructure", "Disaster Prep"],
    iconName: "BatteryCharging",
    colorAccent: "#0ea5e9"
  },
  {
    id: "green-building-codes",
    name: "NET-ZERO BUILDING MANDATES",
    startingPrice: 85000,
    category: "Vital Infrastructure",
    impactDescription: "Strict carbon-neutral construction standards, passive aerodynamic cooling architecture, and mandatory rooftop rainwater harvesting.",
    longDescription: "Overhauls urban building bylaws to ban heat-trapping all-glass facades and mandate fly-ash sustainable concrete, cross-ventilation, and rooftop solar on all new structures.",
    societalBenefit: "Cuts municipal air conditioning power demand by 40%, eliminates concrete heat islands, and ensures structural durability.",
    riskIfIgnored: "Runaway domestic power bills, urban heat suffocating dense tenement clusters, and unchecked depletion of construction sands.",
    synergyTags: ["Affordable Housing", "Environment", "Clean Air Defense"],
    iconName: "Building",
    colorAccent: "#10b981"
  },
  {
    id: "desalination-treatment",
    name: "SOLAR DESALINATION & WATER RECLAMATION",
    startingPrice: 100000,
    category: "Vital Infrastructure",
    impactDescription: "Zero-emission solar-powered seawater desalination facilities paired with multi-barrier aquifer recharge plants for coastal drought immunity.",
    longDescription: "Secures an inexhaustible, weather-independent drinking water baseline for coastal metros. Employs advanced graphene membranes with brine mineralization to prevent ocean hypersalinity.",
    societalBenefit: "100% drought-proof city, elimination of private water tanker mafia gouging, and replenishment of coastal aquifers.",
    riskIfIgnored: "Day Zero acute water exhaustion during drought years, saline contamination of freshwater wells, and mass thirst.",
    synergyTags: ["Clean Water", "Renewable Energy Grid", "Disaster Prep"],
    iconName: "Waves",
    colorAccent: "#0284c7"
  },
  {
    id: "ev-charging-corridors",
    name: "MUNICIPAL EV CHARGING ARTERY",
    startingPrice: 90000,
    category: "Vital Infrastructure",
    impactDescription: "Ultra-fast solar charging plazas, swappable battery depots for auto-rickshaws, and bi-directional vehicle-to-grid (V2G) balancing nodes.",
    longDescription: "Removes range anxiety for shared public mobility and freight logistics. Converts millions of electric two-wheelers and auto-rickshaws into distributed power storage.",
    societalBenefit: "Accelerates 100% electrification of city transit, slashes toxic diesel particulate emissions, and stabilizes off-peak grid load.",
    riskIfIgnored: "Persistent reliance on dirty imported petroleum, localized asthma corridors along highways, and blocked e-mobility adoption.",
    synergyTags: ["Transport", "Renewable Energy Grid", "Clean Air Defense"],
    iconName: "Zap",
    colorAccent: "#38bdf8"
  },
  {
    id: "district-cooling",
    name: "GEOTHERMAL & DISTRICT COOLING",
    startingPrice: 75000,
    category: "Vital Infrastructure",
    impactDescription: "Centralized underground chilled-water piping loops and ground-source heat exchangers serving commercial, educational, and civic zones.",
    longDescription: "Eliminates thousands of energy-guzzling split air conditioning units from building exteriors. Pumps chilled water through an insulated subterranean circuit with massive thermodynamic efficiency.",
    societalBenefit: "50% lower electricity consumption for cooling, zero rooftop heat rejection into pedestrian lanes, and phaseout of fluorinated refrigerants.",
    riskIfIgnored: "Blistering urban micro-climates, deafening rooftop compressor noise, and summer transformer explosions.",
    synergyTags: ["Affordable Housing", "Clean Air Defense", "Environment"],
    iconName: "ThermometerSnowflake",
    colorAccent: "#06b6d4"
  },
  {
    id: "mangrove-coastal-shield",
    name: "MANGROVE & REEF RESTORATION",
    startingPrice: 90000,
    category: "Environment & Ecology",
    impactDescription: "Extensive mangrove afforestation, artificial living oyster reef barriers, and biosaline vegetation buffers shielding vulnerable coastlines.",
    longDescription: "Nature's greatest defense against devastating maritime storms. Mangrove root matrices absorb up to 66% of wave energy while multiplying nursery habitats for indigenous fisheries.",
    societalBenefit: "Dampens destructive cyclone storm surges, locks down massive coastal soil erosion, and revives coastal artisanal fishing incomes.",
    riskIfIgnored: "Catastrophic storm surge inundation of coastal settlements, washing away roads and drowning fishing hamlets.",
    synergyTags: ["Disaster Prep", "Environment", "Rapid Flood & Drainage Network"],
    iconName: "Fish",
    colorAccent: "#059669"
  },
  {
    id: "soil-regeneration",
    name: "ORGANIC REGENERATIVE SOIL CORPS",
    startingPrice: 80000,
    category: "Environment & Ecology",
    impactDescription: "Municipal compost distribution, biochar enrichment, cover-cropping subsidies, and strict phaseout of toxic synthetic fertilizers.",
    longDescription: "Rebuilds depleted topsoil biodiversity across agricultural peripheries. Living soil retains 300% more water and traps gigatons of atmospheric carbon.",
    societalBenefit: "Halts toxic pesticide runoff into freshwater lakes, triples soil drought resistance, and yields nutrient-dense crops.",
    riskIfIgnored: "Total topsoil desertification, chronic farmer debt traps, and poisoned groundwater aquifers.",
    synergyTags: ["Food Security & Agri-Tech", "Waste Mgmt", "Clean Water"],
    iconName: "Sprout",
    colorAccent: "#10b981"
  },
  {
    id: "wildlife-corridors",
    name: "BIODIVERSITY ECO-CORRIDORS",
    startingPrice: 60000,
    category: "Environment & Ecology",
    impactDescription: "Canopy rope bridges, subterranean fauna tunnels, native forest greenbelts, and urban pollinator sanctuary strips.",
    longDescription: "Reconnects fragmented natural landscapes divided by expressways and urban sprawl. Safeguards migratory birds, native fauna, and vital pollinator bees.",
    societalBenefit: "Prevents localized species extinction, preserves natural pest predation, and stabilizes pollination for local agriculture.",
    riskIfIgnored: "Complete collapse of honeybee populations, frequent wildlife roadkill, and unchecked agricultural pest outbreaks.",
    synergyTags: ["Environment", "Food Security & Agri-Tech", "Clean Air Defense"],
    iconName: "Footprints",
    colorAccent: "#2dd4bf"
  },
  {
    id: "zero-plastic-pact",
    name: "BIOPLASTIC & PACKAGING REVOLUTION",
    startingPrice: 75000,
    category: "Environment & Ecology",
    impactDescription: "Seaweed- and agricultural waste-derived compostable packaging factories, package-free retail depots, and stormwater microplastic traps.",
    longDescription: "Attacks plastic pollution at the root manufacturing source. Replaces single-use poly-bags and sachets with marine-degradable organic polymers.",
    societalBenefit: "Prevents millions of plastic wrappers from clogging storm drains, terminating microplastic contamination of drinking water and seafood.",
    riskIfIgnored: "Storm sewers choking during torrential downpours causing flash flooding, and toxic dioxin fumes from trash burning.",
    synergyTags: ["Waste Mgmt", "Circular Economy Incubator", "Clean Water"],
    iconName: "PackageOpen",
    colorAccent: "#14b8a6"
  },
  {
    id: "reforestation-drone-fleet",
    name: "PRECISION AERIAL REFORESTATION",
    startingPrice: 85000,
    category: "Environment & Ecology",
    impactDescription: "Autonomous seed-pellet firing drones and soil-monitoring aerial fleets planting indigenous tree canopies on rugged hills and degraded watersheds.",
    longDescription: "Replants millions of trees in inaccessible hilly terrains, river basins, and quarry lands at 10 times the speed of traditional manual sapling planting.",
    societalBenefit: "Rapid restoration of mountain river catchments, prevention of deadly monsoon mudslides, and massive biodiversity recovery.",
    riskIfIgnored: "Uncontrolled hillside erosion during heavy rainfall, siltation of major water reservoirs, and loss of green tree cover.",
    synergyTags: ["Environment", "Research & Deep-Tech Labs", "Disaster Prep"],
    iconName: "Plane",
    colorAccent: "#0d9488"
  },
  {
    id: "mobile-health-clinics",
    name: "MOBILE TELE-MEDICINE SQUAD",
    startingPrice: 80000,
    category: "Human Welfare",
    impactDescription: "All-electric diagnostic ambulances with satellite links, point-of-care biochemistry labs, and specialist tele-consultations for peri-urban slums.",
    longDescription: "Brings hospital-grade healthcare right to the doorsteps of informal settlements, migrant labor camps, and isolated rural hamlets.",
    societalBenefit: "Early detection of hypertension, cancer, and diabetes before expensive hospitalization is required; zero transport cost for the poor.",
    riskIfIgnored: "Treatable infections deteriorating into life-threatening emergencies, medical bankruptcies, and high infant mortality.",
    synergyTags: ["Healthcare", "Digital Infrastructure", "Access"],
    iconName: "Truck",
    colorAccent: "#0ea5e9"
  },
  {
    id: "youth-sports-academies",
    name: "GRASSROOTS SPORTS ACADEMIES",
    startingPrice: 60000,
    category: "Human Welfare",
    impactDescription: "Floodlit public football/cricket turfs, athletics synthetic tracks, subsidized sports gear, and elite coaching fellowships.",
    longDescription: "Creates healthy, safe recreational outlets for youth in congested urban zones. Fosters discipline, team spirit, and physical vigor while combating teen substance abuse.",
    societalBenefit: "Drastic decline in juvenile delinquency, reduction in youth lifestyle obesity, and grassroots scouting for national sports honors.",
    riskIfIgnored: "Youth alienation, lack of open recreational spaces, and sedentary chronic disease vulnerabilities.",
    synergyTags: ["Mental Care", "Arts, Culture & Recreation", "Civic Safety & Emergency"],
    iconName: "Activity",
    colorAccent: "#06b6d4"
  },
  {
    id: "community-kitchens",
    name: "DECENTRALIZED COMMUNITY KITCHENS",
    startingPrice: 70000,
    category: "Human Welfare",
    impactDescription: "Neighborhood cooperative dining halls serving wholesome, hot, nutrition-balanced meals using local farm surpluses at nominal costs.",
    longDescription: "Guarantees that no laborer, student, or elderly citizen goes hungry. Operates clean, dignified open cafeterias that double as community hubs.",
    societalBenefit: "Eradication of urban caloric malnutrition, relief from spiraling cooking gas prices for families, and reinforced neighborhood solidarity.",
    riskIfIgnored: "Desperate hunger among daily-wage earners, malnutrition-driven immune vulnerability, and predatory unhygienic street stalls.",
    synergyTags: ["Food Security & Agri-Tech", "Childcare & Early Learning", "Circular Economy Incubator"],
    iconName: "Soup",
    colorAccent: "#10b981"
  },
  {
    id: "addiction-recovery",
    name: "ADDICTION RECOVERY & REINTEGRATION",
    startingPrice: 65000,
    category: "Human Welfare",
    impactDescription: "Holistic medical detoxification centres, cognitive rehabilitation sanctuaries, peer support networks, and vocational job placement.",
    longDescription: "Treats substance dependency as a compassionate public health challenge rather than a criminal failure. Restores affected individuals into productive society.",
    societalBenefit: "Reunites shattered families, slashes petty theft and violent crime, and returns productive workers to the economy.",
    riskIfIgnored: "Generational trauma, crime syndicates preying on vulnerable youth, and overwhelmed hospital trauma wards.",
    synergyTags: ["Mental Care", "Healthcare", "Employment"],
    iconName: "ShieldAlert",
    colorAccent: "#38bdf8"
  },
  {
    id: "accessible-pedestrian-grid",
    name: "UNIVERSAL BRAILLE & BARRIER-FREE ROADS",
    startingPrice: 75000,
    category: "Human Welfare",
    impactDescription: "Continuous tactile paving, acoustic pedestrian crossing signals, wheelchair ramps on all footpaths, and low-floor accessible transit boarding.",
    longDescription: "Transforms city streetscapes so that persons with visual impairments, wheelchair users, and the elderly can navigate safely with complete autonomy.",
    societalBenefit: "100% independent navigation for differently-abled citizens, elimination of pedestrian vehicle collisions, and true universal dignity.",
    riskIfIgnored: "Total home confinement of differently-abled persons, tragic road fatalities on broken sidewalks, and institutional segregation.",
    synergyTags: ["Access", "Transport", "Civic Safety & Emergency"],
    iconName: "Milestone",
    colorAccent: "#2dd4bf"
  },
  {
    id: "neighborhood-energy-coops",
    name: "CITIZEN ENERGY COOPERATIVES",
    startingPrice: 70000,
    category: "Civic Resilience",
    impactDescription: "Locally owned rooftop solar and biogas trusts where apartment blocks and residential lanes generate, store, and trade clean watts peer-to-peer.",
    longDescription: "Democratizes energy ownership. Instead of paying monopoly utility tariffs, communities share power generation assets and reinvest energy revenue locally.",
    societalBenefit: "Neighborhood energy self-reliance, shields families from utility bill inflation, and decentralizes grid resilience.",
    riskIfIgnored: "Helplessness during centralized utility rate hikes, complete vulnerability when high-voltage feeder lines snap in storms.",
    synergyTags: ["Renewable Energy Grid", "Circular Economy Incubator", "Transparent Governance"],
    iconName: "Share2",
    colorAccent: "#34d399"
  },
  {
    id: "climate-resilient-seed-bank",
    name: "HERITAGE & CLIMATE SEED BANK",
    startingPrice: 65000,
    category: "Civic Resilience",
    impactDescription: "Underground climate-controlled vaults protecting thousands of heirloom, flood-resistant, deep-root drought-tolerant indigenous seeds.",
    longDescription: "Safeguards indigenous biodiversity against patent monopolies. Distributes resilient native paddy and millet seeds to farmers after cyclones and droughts.",
    societalBenefit: "Immediate agricultural reboot after climate catastrophes, genetic heritage preservation, and food sovereignty.",
    riskIfIgnored: "Catastrophic crop failure across entire states during severe weather, complete farmer indebtedness to foreign seed conglomerates.",
    synergyTags: ["Food Security & Agri-Tech", "Research & Deep-Tech Labs", "Disaster Prep"],
    iconName: "Database",
    colorAccent: "#059669"
  },
  {
    id: "urban-fire-disaster-squad",
    name: "RAPID URBAN FIRE & RESCUE CORPS",
    startingPrice: 85000,
    category: "Civic Resilience",
    impactDescription: "High-reach drone water cannons, specialized narrow-lane electric mini fire vehicles, and trained community volunteer warden brigades.",
    longDescription: "Tailored for dense, historic city markets and congested neighborhoods where standard heavy fire engines cannot physically squeeze through.",
    societalBenefit: "Under 4-minute first response to tenement and commercial blazes, stopping localized sparks before they incinerate entire districts.",
    riskIfIgnored: "Massive urban infernos wiping out commercial markets, catastrophic civilian casualties, and prolonged toxic smoke plumes.",
    synergyTags: ["Civic Safety & Emergency", "Disaster Prep", "Healthcare"],
    iconName: "Flame",
    colorAccent: "#0ea5e9"
  },
  {
    id: "heatwave-refuge-network",
    name: "URBAN HEATWAVE COOLING SHELTERS",
    startingPrice: 70000,
    category: "Civic Resilience",
    impactDescription: "Public air-conditioned cooling refuges, cool-roof reflective lime coatings on tin homes, and high-pressure evaporative misting bus stops.",
    longDescription: "Guarantees that outdoor delivery agents, construction workers, and vulnerable elders have accessible refuges when summer mercury exceeds 44°C.",
    societalBenefit: "Prevents fatal heatstroke emergencies, lowers indoor room temperatures in slums by 5°C without electricity, and saves lives.",
    riskIfIgnored: "Silent deaths of elderly citizens in poorly insulated tenements, widespread occupational heat collapse among manual workers.",
    synergyTags: ["Disaster Prep", "Clean Air Defense", "Elderly Care & Geriatrics"],
    iconName: "SunDim",
    colorAccent: "#14b8a6"
  },
  {
    id: "participatory-town-halls",
    name: "DECENTRALIZED WARD PARLIAMENTS",
    startingPrice: 60000,
    category: "Civic Resilience",
    impactDescription: "Permanent open-air civic pavilions in each electoral ward equipped with digital voting consoles for monthly citizen budgetary assemblies.",
    longDescription: "Puts municipal decision-making directly into the hands of residents. Neighbors debate street repairs, park upgrades, and water allocations before funds are dispersed.",
    societalBenefit: "Direct democracy, peaceful resolution of community disputes, and accountability for local elected representatives.",
    riskIfIgnored: "Disillusionment with local government, corrupt backroom deals on civic tenders, and complete public voter apathy.",
    synergyTags: ["Transparent Governance", "Access", "Arts, Culture & Recreation"],
    iconName: "Landmark",
    colorAccent: "#0284c7"
  },
  {
    id: "green-hydrogen-hub",
    name: "GREEN HYDROGEN & FUEL CELLS",
    startingPrice: 120000,
    category: "Economy & Innovation",
    impactDescription: "Water-electrolysis hydrogen generation clusters powered by surplus wind/solar, supplying zero-carbon fuel to heavy freight and steel foundries.",
    longDescription: "Pioneers the decarbonization of heavy industries that cannot be powered by batteries alone. Positions the economy as an exporter of green energy carriers.",
    societalBenefit: "Decarbonizes heavy manufacturing and port logistics, generating thousands of high-tech chemical engineering careers.",
    riskIfIgnored: "Severe carbon border tax penalties on national exports, persistent heavy reliance on imported coking coal.",
    synergyTags: ["Renewable Energy Grid", "Research & Deep-Tech Labs", "Employment"],
    iconName: "Atom",
    colorAccent: "#0d9488"
  },
  {
    id: "artisanal-craft-incubator",
    name: "INDIGENOUS ARTISAN & HANDLOOM GUILD",
    startingPrice: 65000,
    category: "Economy & Innovation",
    impactDescription: "Natural dye processing units, fair-trade direct export channels, designer co-working spaces, and low-interest credit for traditional weavers.",
    longDescription: "Breathes modern economic vitality into ancient handloom, pottery, and metalcraft traditions. Cuts out exploitative middlemen and connects artisans directly to ethical global markets.",
    societalBenefit: "Preserves irreplaceable cultural craft traditions, stops forced distress migration to urban slums, and ensures dignified rural wages.",
    riskIfIgnored: "Permanent extinction of centuries-old weaving knowledge, starvation wages for artisans, and flood of synthetic imports.",
    synergyTags: ["Employment", "Arts, Culture & Recreation", "Access"],
    iconName: "Scissors",
    colorAccent: "#38bdf8"
  },
  {
    id: "eco-tourism-parks",
    name: "CONSERVATION ECO-TOURISM HUBS",
    startingPrice: 70000,
    category: "Economy & Innovation",
    impactDescription: "Low-impact wooden canopy boardwalks, certified indigenous wildlife guide programs, community homestays, and wetland bird sanctuaries.",
    longDescription: "Proves that standing forests and undisturbed wetlands are far more economically valuable alive than destroyed. Channels tourist spending directly into village trusts.",
    societalBenefit: "Locals become passionate ecological defenders against poachers and encroachers while earning thriving hospitality livelihoods.",
    riskIfIgnored: "Destruction of sensitive wilderness by unregulated commercial concrete resorts, pollution of pristine estuaries.",
    synergyTags: ["Environment", "Employment", "Mangrove & Reef Restoration"],
    iconName: "Compass",
    colorAccent: "#10b981"
  },
  {
    id: "social-enterprise-grants",
    name: "GRASSROOTS SOCIAL IMPACT FUND",
    startingPrice: 85000,
    category: "Economy & Innovation",
    impactDescription: "Seed grants, patenting subsidies, and incubation labs for student and youth startups engineering affordable solutions for civic issues.",
    longDescription: "Mobilizes collegiate talent to build commercially viable ventures solving water contamination, agricultural spoilage, and plastic recycling.",
    societalBenefit: "Drives homegrown technological self-reliance, retains bright young engineers, and spawns scalable civic tech unicorns.",
    riskIfIgnored: "Brain drain of top engineering graduates to overseas corporations, unresolved domestic civic bottlenecks.",
    synergyTags: ["Research & Deep-Tech Labs", "Employment", "Vocational Training Centers"],
    iconName: "Coins",
    colorAccent: "#06b6d4"
  },
  {
    id: "water-treatment-tech",
    name: "INDUSTRIAL WASTEWATER BIO-REACTORS",
    startingPrice: 95000,
    category: "Economy & Innovation",
    impactDescription: "Advanced membrane biological reactors and zero-liquid-discharge (ZLD) plants for industrial dyeing, tanneries, and chemical zones.",
    longDescription: "Purifies heavy industrial effluent into ultra-pure process water for continuous industrial recirculation, extracting valuable salts and eliminating toxic effluents.",
    societalBenefit: "100% elimination of toxic chemical dumping into rivers, shields downstream farmers from poisoned irrigation, and slashes industrial freshwater usage.",
    riskIfIgnored: "Irreversible heavy metal poisoning of major rivers, cancer clusters in riparian villages, and destruction of river fisheries.",
    synergyTags: ["Clean Water", "Circular Economy Incubator", "Waste Mgmt"],
    iconName: "Filter",
    colorAccent: "#0284c7"
  },
  {
    id: "open-data-platform",
    name: "CIVIC OPEN DATA & SATELLITE ATLAS",
    startingPrice: 70000,
    category: "Governance & Digital",
    impactDescription: "Real-time open API repository streaming air pollution maps, groundwater sensor levels, traffic density, and municipal expenditure ledgers.",
    longDescription: "Democratizes civic information. Enables college researchers, journalists, and civic developers to build civic alerts and track municipal efficiency.",
    societalBenefit: "Radical civic transparency, data-driven municipal policy decisions, and community-built public utility apps.",
    riskIfIgnored: "Opaque municipal operations hiding leaks and pollution, inability to measure whether environmental policies actually work.",
    synergyTags: ["Digital Infrastructure", "Transparent Governance", "Research & Deep-Tech Labs"],
    iconName: "Globe",
    colorAccent: "#0ea5e9"
  },
  {
    id: "digital-grievance-tribunal",
    name: "CITIZEN OMBUDSMAN & FAST-TRACK PORTAL",
    startingPrice: 65000,
    category: "Governance & Digital",
    impactDescription: "Legally binding digital dispute portal with statutory 72-hour time limits, independent ombudsmen, and public resolution dashboards.",
    longDescription: "Gives ordinary citizens instant recourse against municipal negligence, illegal encroachments, delayed public services, or bribery demands.",
    societalBenefit: "Guarantees swift administrative accountability, eliminates bureaucratic harassment of vulnerable citizens, and builds trust.",
    riskIfIgnored: "Rampant administrative indifference, citizens forced to pay illicit bribes for basic civic entitlements.",
    synergyTags: ["Legal Aid & Advocacy", "Transparent Governance", "Digital Infrastructure"],
    iconName: "Gavel",
    colorAccent: "#14b8a6"
  },
  {
    id: "disaster-satellite-telemetry",
    name: "DISASTER SATELLITE EARLY WARNING BEACON",
    startingPrice: 85000,
    category: "Governance & Digital",
    impactDescription: "Direct-to-handset emergency satellite alerts, coastal Doppler radar feeds, and deep-sea tsunami buoy telemetry networks.",
    longDescription: "Reaches fishing boats far offshore beyond cellular tower range and sends geo-targeted siren triggers 36 hours ahead of cyclone landfall.",
    societalBenefit: "Zero lives lost at sea during storms, automated storm shutter deployments on critical infrastructure, and orderly coastal evacuation.",
    riskIfIgnored: "Catastrophic loss of offshore fishermen during unpredicted cyclones, stampedes during delayed emergency evacuations.",
    synergyTags: ["Disaster Prep", "Civic Safety & Emergency", "Digital Infrastructure"],
    iconName: "Radio",
    colorAccent: "#059669"
  },
  {
    id: "smart-traffic-transit",
    name: "AI-OPTIMIZED GREEN TRAFFIC CORRIDORS",
    startingPrice: 75000,
    category: "Governance & Digital",
    impactDescription: "Dynamic light synchronization giving automated green-wave priority to public electric buses and emergency response ambulances.",
    longDescription: "Slashes idling at red lights across arterial boulevards. Guarantees that public transit moves faster than private single-occupancy cars.",
    societalBenefit: "Cuts bus transit travel times by 35%, slashes vehicular idling emissions by 40%, and guarantees clear hospital corridors for ambulances.",
    riskIfIgnored: "Choking traffic gridlock, ambulances trapped in vehicular paralysis, and citizens abandoning public transit.",
    synergyTags: ["Transport", "Digital Infrastructure", "Clean Air Defense"],
    iconName: "Navigation",
    colorAccent: "#2dd4bf"
  },
  {
    id: "climate-resilience-academy",
    name: "CIVIC CLIMATE LITERACY ACADEMY",
    startingPrice: 60000,
    category: "Governance & Digital",
    impactDescription: "Compulsory climate resilience and emergency response training in all colleges and schools, certifying student green ambassadors.",
    longDescription: "Transforms the entire youth population into certified disaster first-responders, energy conservation champions, and community eco-auditors.",
    societalBenefit: "Mass community preparedness during floods and cyclones, widespread adoption of water conservation, and empowered student leadership.",
    riskIfIgnored: "Civic panic during natural emergencies, pervasive environmental apathy, and lack of trained volunteers during crises.",
    synergyTags: ["Education", "Disaster Prep", "Transparent Governance"],
    iconName: "Award",
    colorAccent: "#10b981"
  },
  // Additional 42 Resources to reach 100 total (59 - 100)
  {
    id: "offshore-wind-arrays",
    name: "DEEP-SEA OFFSHORE WIND FARMS",
    startingPrice: 120000,
    category: "Vital Infrastructure",
    impactDescription: "Deep-water floating multi-megawatt wind turbine arrays tapping high-velocity oceanic winds to power coastal industrial sectors.",
    longDescription: "Harvests steady, uninterrupted marine winds without consuming valuable onshore land footprint. Connected via submarine high-voltage DC transmission cables.",
    societalBenefit: "Gigawatt-scale non-intermittent clean baseload, cuts coastal reliance on coal plants, and creates marine engineering careers.",
    riskIfIgnored: "Severe power rationing for coastal manufacturing, continued thermal coal emissions, and air smog.",
    synergyTags: ["Renewable Energy Grid", "Advanced Battery & Grid Storage", "Green Hydrogen & Fuel Cells"],
    iconName: "Wind",
    colorAccent: "#0284c7"
  },
  {
    id: "electrified-freight-rail",
    name: "GREEN ELECTRIC FREIGHT RAIL",
    startingPrice: 105000,
    category: "Vital Infrastructure",
    impactDescription: "Dedicated electrified container rail corridors directly linking marine ports, farming hubs, and industrial dry depots.",
    longDescription: "Eliminates tens of thousands of polluting diesel freight trucks from city expressways by shifting long-distance cargo onto high-capacity electrified rail.",
    societalBenefit: "75% reduction in freight transit carbon emissions, frees commuter expressways from lethal truck congestion, and lowers shipping logistics costs.",
    riskIfIgnored: "Dangerous highway gridlock, lethal truck accidents, and runaway diesel soot poisoning roadside communities.",
    synergyTags: ["Public Transit Grid", "Clean Air Defense", "Circular Economy Incubator"],
    iconName: "Train",
    colorAccent: "#10b981"
  },
  {
    id: "smart-water-metering",
    name: "SMART IOT WATER METERING & LEAK PATROL",
    startingPrice: 80000,
    category: "Vital Infrastructure",
    impactDescription: "Ultrasonic acoustic sensors detecting subterranean pipe fractures with real-time digital flow tracking for equitable civic water distribution.",
    longDescription: "Cures the silent catastrophe of non-revenue municipal water losses where up to 45% of treated drinking water leaks underground before reaching homes.",
    societalBenefit: "Saves billions of liters of potable water, ensures 24/7 pressurized tap water for all wards, and prevents sinkhole collapses.",
    riskIfIgnored: "Catastrophic water wastage, dry taps in poor wards while broken mains bleed underground, and structural street collapses.",
    synergyTags: ["Clean Water", "Digital Infrastructure", "Civic Open Data & Satellite Atlas"],
    iconName: "Gauge",
    colorAccent: "#0ea5e9"
  },
  {
    id: "underground-utility-ducts",
    name: "SUBTERRANEAN UTILITY DUCT CORRIDORS",
    startingPrice: 90000,
    category: "Vital Infrastructure",
    impactDescription: "Unified underground concrete utility tunnels housing power cables, optical fibers, and gas pipes with robotic maintenance crawlers.",
    longDescription: "Puts an end to destructive repeated road digging by telecom, water, and power agencies. Safeguards essential lifelines against storms and floods.",
    societalBenefit: "Eliminates overhead wire tangles, prevents electrocution deaths during floods, and guarantees continuous power during cyclones.",
    riskIfIgnored: "Messy dangerous overhead wires collapsing in typhoons, constant road digging causing traffic gridlock, and electrocution hazards.",
    synergyTags: ["Digital Infrastructure", "Renewable Energy Grid", "Disaster Prep"],
    iconName: "Cable",
    colorAccent: "#64748b"
  },
  {
    id: "biomethane-grid",
    name: "MUNICIPAL BIO-METHANE PIPELINE",
    startingPrice: 85000,
    category: "Vital Infrastructure",
    impactDescription: "Anaerobic digester hubs upgrading wet municipal organic waste and sewage into pipeline-grade renewable compressed natural gas.",
    longDescription: "Transforms city stench and sewage into clean cooking gas and public bus fuel. Creates nutrient-rich bio-fertilizer as an essential agricultural byproduct.",
    societalBenefit: "Replaces imported fossil LPG, prevents open landfill methane explosions, and supplies free organic fertilizer to peri-urban farmers.",
    riskIfIgnored: "Spontaneous landfill fires spewing toxic smoke, high household cooking fuel inflation, and raw sewage contamination.",
    synergyTags: ["Waste Mgmt", "Circular Economy Incubator", "Food Security & Agri-Tech"],
    iconName: "Flame",
    colorAccent: "#f59e0b"
  },
  {
    id: "stormwater-caverns",
    name: "SUB-SURFACE FLOOD RETENTION CAVERNS",
    startingPrice: 95000,
    category: "Vital Infrastructure",
    impactDescription: "Massive underground storm reservoirs excavated beneath public plazas to store excessive monsoon runoff during high-tide cloudbursts.",
    longDescription: "Engineered for low-lying delta cities where sea level rise and cloudbursts overwhelm gravity drains. Stores billions of liters and pumps water out at low tide.",
    societalBenefit: "Guarantees zero flood inundation of city centers, subway lines, and hospital basements during 100-year storm events.",
    riskIfIgnored: "Subway tunnels drowning, billions in damaged downtown infrastructure, and paralyzing urban water-logging for weeks.",
    synergyTags: ["Rapid Flood & Drainage Network", "Disaster Prep", "Clean Water"],
    iconName: "Waves",
    colorAccent: "#0284c7"
  },
  {
    id: "tidal-wave-power",
    name: "COASTAL TIDAL & KINETIC WAVE HARVESTERS",
    startingPrice: 100000,
    category: "Vital Infrastructure",
    impactDescription: "Submerged tidal turbine arrays and near-shore oscillating water column generators providing astronomical lunar-cycle predictable energy.",
    longDescription: "Unlike solar or wind which fluctuate with atmospheric clouds, ocean tides are 100% predictable centuries in advance, supplying uninterrupted base power.",
    societalBenefit: "Astronomically predictable zero-carbon marine energy, zero onshore footprint, and natural sea-wall wave dampening.",
    riskIfIgnored: "Under-utilization of immense coastline energy potential and continued dependence on fossil fuels.",
    synergyTags: ["Renewable Energy Grid", "Mangrove & Reef Restoration", "Vital Infrastructure"],
    iconName: "Anchor",
    colorAccent: "#06b6d4"
  },
  {
    id: "miyawaki-microforests",
    name: "URBAN MIYAWAKI DENSE FORESTS",
    startingPrice: 70000,
    category: "Environment & Ecology",
    impactDescription: "Hyper-dense native forest groves planted in pocket wastelands, highway medians, and industrial buffers that grow 10x faster.",
    longDescription: "Deploys the Akira Miyawaki botanical methodology with multi-tiered native species. Transforms neglected urban asphalt pockets into thriving carbon-absorbing biodiversity sanctuaries.",
    societalBenefit: "Drops local neighborhood temperatures by up to 3°C, dampens expressway traffic acoustics, and attracts 30x more native birds and insects.",
    riskIfIgnored: "Concrete heat canyons causing respiratory heat exhaustion and total disappearance of urban songbirds.",
    synergyTags: ["Civic Parks & Green Lungs", "Clean Air Defense", "Biodiversity Eco-Corridors"],
    iconName: "Trees",
    colorAccent: "#059669"
  },
  {
    id: "wetland-bioremediation",
    name: "BIO-ENGINEERED WETLAND PURIFIERS",
    startingPrice: 75000,
    category: "Environment & Ecology",
    impactDescription: "Constructed reed beds, floating phytoremediation islands, and microbial bio-filters naturally neutralizing sewage flowing into urban lakes.",
    longDescription: "Uses biological plants like vetiver, cattails, and biochar floating mats to consume heavy nitrates, phosphorus, and industrial detergents without chemical additives.",
    societalBenefit: "Revives dead foam-covered urban lakes into clear water havens, stops toxic algal blooms, and restores aquatic fish habitats.",
    riskIfIgnored: "Urban lakes catching fire from chemical sludge, toxic frothing covering residential bridges, and poisoned groundwater.",
    synergyTags: ["Clean Water", "Environment & Ecology", "Rapid Flood & Drainage Network"],
    iconName: "Sparkles",
    colorAccent: "#10b981"
  },
  {
    id: "riparian-buffer-zones",
    name: "RIVERBANK VEGETATED RIPARIAN BUFFERS",
    startingPrice: 65000,
    category: "Environment & Ecology",
    impactDescription: "Deep-rooting native bamboo and willow embankments preventing river erosion and filtering agricultural chemical runoff before it reaches streams.",
    longDescription: "Creates a living defensive green skin along riverbanks. Slows down flash flood waters and traps silt before reservoirs get choked.",
    societalBenefit: "Halts riverbank collapses, shields riverside farms from flood scour, and ensures pristine freshwater purity for downstream towns.",
    riskIfIgnored: "Massive riverbank landslides washing away farmland, heavy reservoir siltation reducing water storage capacity by half.",
    synergyTags: ["Clean Water", "Food Security & Agri-Tech", "Disaster Prep"],
    iconName: "Mountain",
    colorAccent: "#14b8a6"
  },
  {
    id: "ocean-trash-skimmers",
    name: "AUTONOMOUS HARBOR & CANAL PLASTIC SKIMMERS",
    startingPrice: 70000,
    category: "Environment & Ecology",
    impactDescription: "Solar-powered autonomous water-surface interceptor boats and bubble curtains trapping floating plastics in canals before they enter the open sea.",
    longDescription: "Stops oceanic plastic pollution at its narrowest chokepoints: urban canals, storm drains, and river mouths. Operates 24/7 scooping floating trash.",
    societalBenefit: "Prevents thousands of tons of plastics from entering ocean food chains, protects maritime motors, and cleans polluted waterways.",
    riskIfIgnored: "Beaches covered in toxic plastic waste, death of coastal marine life from ingestion, and microplastics in commercial seafood.",
    synergyTags: ["Waste Mgmt", "Bioplastic & Packaging Revolution", "Mangrove & Reef Restoration"],
    iconName: "LifeBuoy",
    colorAccent: "#0ea5e9"
  },
  {
    id: "coral-nursery-sanctuaries",
    name: "CLIMATE-RESILIENT CORAL NURSERIES",
    startingPrice: 65000,
    category: "Environment & Ecology",
    impactDescription: "Underwater micro-fragmentation cultivation tanks and mineral accretion bio-rock reefs propagating heat-tolerant coral colonies.",
    longDescription: "Selectively breeds resilient coral strains that survive warming ocean waters, transplanting them onto degraded marine coastlines to restore marine biomes.",
    societalBenefit: "Shields coastlines from wave energy, revives commercial fish breeding grounds, and regenerates coastal eco-tourism.",
    riskIfIgnored: "Complete coral bleaching turning reefs into underwater graveyards, causing collapse of coastal fishing economies.",
    synergyTags: ["Mangrove & Reef Restoration", "Conservation Eco-Tourism Hubs", "Research & Deep-Tech Labs"],
    iconName: "Fish",
    colorAccent: "#06b6d4"
  },
  {
    id: "urban-pollinator-corridors",
    name: "POLLINATOR HIGHWAYS & APICULTURE HAVENS",
    startingPrice: 55000,
    category: "Environment & Ecology",
    impactDescription: "Wildflower green roofs, pesticide-free road verges, and community bee sanctuaries sustaining essential wild pollinator colonies.",
    longDescription: "Provides unbroken nectar and pollen pathways through concrete urban landscapes for bees, butterflies, and nectar bats crucial for food crops.",
    societalBenefit: "Boosts urban community garden fruit yields by 40%, preserves fragile pollinator biodiversity, and yields local artisan honey.",
    riskIfIgnored: "Colony collapse disorder among pollinator insects, stunted fruit production, and loss of indigenous flowering plant species.",
    synergyTags: ["Food Security & Agri-Tech", "Biodiversity Eco-Corridors", "Civic Parks & Green Lungs"],
    iconName: "Sprout",
    colorAccent: "#84cc16"
  },
  {
    id: "light-pollution-abatement",
    name: "DARK-SKY COMPLIANT SMART LIGHTING",
    startingPrice: 50000,
    category: "Environment & Ecology",
    impactDescription: "Down-shielded warm-spectrum adaptive streetlights that dim when streets are empty, mitigating nocturnal biological disruptions.",
    longDescription: "Restores natural nocturnal circadian rhythms for humans, migrating birds, and nocturnal pollinators while slashing unnecessary municipal lighting bills.",
    societalBenefit: "60% electricity savings on municipal lighting, restores restful sleep cycles for urban citizens, and prevents disorienting bird collisions.",
    riskIfIgnored: "Chronic sleep disorders in densely lit neighborhoods, disorientation of billions of migratory songbirds, and massive energy waste.",
    synergyTags: ["Renewable Energy Grid", "Digital Infrastructure", "Mental Care"],
    iconName: "Eye",
    colorAccent: "#6366f1"
  },
  {
    id: "universal-school-nutrition",
    name: "ORGANIC SCHOOL NUTRITION SCHEME",
    startingPrice: 75000,
    category: "Human Welfare",
    impactDescription: "Guaranteed hot, organic breakfast and lunch for all public school children sourced directly from local regenerative farmers.",
    longDescription: "Solves hidden hunger and childhood stunting. Ensures that every child, regardless of socio-economic background, receives balanced protein, micronutrients, and clean milk daily.",
    societalBenefit: "Boosts school attendance by 98%, triples classroom cognitive focus, eradicates pediatric anemia, and guarantees farmer crop sales.",
    riskIfIgnored: "Chronic childhood malnutrition, high dropout rates among poor children, and developmental stunting.",
    synergyTags: ["Education", "Food Security & Agri-Tech", "Decentralized Community Kitchens"],
    iconName: "Utensils",
    colorAccent: "#10b981"
  },
  {
    id: "migrant-worker-complexes",
    name: "DIGNIFIED MIGRANT RESIDENTIAL HOSTELS",
    startingPrice: 85000,
    category: "Human Welfare",
    impactDescription: "Clean, well-ventilated dormitory apartments with subsidized kitchens, hygienic laundromats, and free medical dispensaries for construction laborers.",
    longDescription: "Replaces precarious, hazardous tin shacks on construction sites with dignified, safe civic residential campuses for the men and women who build our cities.",
    societalBenefit: "Eradicates exploitative slumlords, ends occupational illnesses from squalor, and accords equal dignity to migrant workers.",
    riskIfIgnored: "Dismal shantytowns with no toilets or water, dangerous fires in temporary worker camps, and severe labor exploitation.",
    synergyTags: ["Affordable Housing", "Healthcare", "Civic Safety & Emergency"],
    iconName: "Home",
    colorAccent: "#0d9488"
  },
  {
    id: "pediatric-trauma-units",
    name: "CHILD RESILIENCE & PEDIATRIC TRAUMA WINGS",
    startingPrice: 80000,
    category: "Human Welfare",
    impactDescription: "Dedicated pediatric intensive care units, neonatal rescue ambulances, and specialized surgical equipment calibrated for infants.",
    longDescription: "Standard adult emergency rooms are critically ill-equipped to treat pediatric respiratory collapse and neonatal trauma. This asset saves vulnerable young lives.",
    societalBenefit: "Drops neonatal and child mortality rates to single digits, providing rapid intensive treatment within the golden hour.",
    riskIfIgnored: "Tragic preventable infant deaths during respiratory outbreaks and prolonged trauma for grieving parents.",
    synergyTags: ["Healthcare", "Childcare & Early Learning", "Emergency Medical Response"],
    iconName: "Stethoscope",
    colorAccent: "#ef4444"
  },
  {
    id: "community-mental-wellness",
    name: "NEIGHBORHOOD MINDFULNESS & STRESS CENTRES",
    startingPrice: 60000,
    category: "Human Welfare",
    impactDescription: "Walk-in quiet sanctuaries offering free counseling, stress mitigation workshops, grief support, and peer therapy in every municipal ward.",
    longDescription: "Destigmatizes psychological well-being by bringing calming, compassionate counseling out of clinical psychiatric wards into welcoming neighborhood green gardens.",
    societalBenefit: "Substantial drop in suicide rates among students and young professionals, alleviation of domestic burnout, and emotional resilience.",
    riskIfIgnored: "Epidemic of untreated clinical depression, youth suicides during exams, and chronic domestic emotional conflict.",
    synergyTags: ["Mental Care", "Healthcare", "Arts, Culture & Recreation"],
    iconName: "HeartPulse",
    colorAccent: "#8b5cf6"
  },
  {
    id: "safe-night-transit",
    name: "ON-DEMAND WOMEN'S NIGHT TRANSIT",
    startingPrice: 70000,
    category: "Human Welfare",
    impactDescription: "Dedicated late-night electric feeder shuttles, well-lit panic-button transit stops, and verified female-staffed transit teams.",
    longDescription: "Empowers women shift workers, nurses, students, and factory workers to travel anywhere across the metro safely after dark without fear of harassment.",
    societalBenefit: "Enables equal female participation in the nighttime economy, eliminates sexual harassment on public routes, and ensures peace of mind.",
    riskIfIgnored: "Imposition of informal curfews on women, lost career opportunities for night-shift workers, and constant fear.",
    synergyTags: ["Women Safety Corridors", "Public Transit Grid", "Civic Safety & Emergency"],
    iconName: "Siren",
    colorAccent: "#ec4899"
  },
  {
    id: "occupational-safety-shield",
    name: "SANITATION ROBOTIC EXOSKELETONS",
    startingPrice: 75000,
    category: "Human Welfare",
    impactDescription: "Robotic sewer cleaning rovers, powered lift exoskeletons, and toxic gas leak detectors totally eliminating manual scavenging.",
    longDescription: "Erases the inhuman practice of manual scavenging forever. Replaces hazardous manual sewer entry with high-torque robotic hydro-jetting machines.",
    societalBenefit: "Zero sanitation worker deaths from toxic sewer fumes, eliminates chronic spinal injuries, and restores constitutional human dignity.",
    riskIfIgnored: "Horrific asphyxiation fatalities of municipal sanitation workers in underground sewage lines, preserving caste indignity.",
    synergyTags: ["Waste Mgmt", "Clean Water", "Human Welfare"],
    iconName: "ShieldCheck",
    colorAccent: "#f97316"
  },
  {
    id: "deaf-blind-assistive-tech",
    name: "HAPTIC & BRAILLE ASSISTIVE TECH",
    startingPrice: 60000,
    category: "Human Welfare",
    impactDescription: "Free digital Braille tablets, real-time sign language computer-vision kiosks, and haptic navigation vests distributed through public libraries.",
    longDescription: "Removes communication barriers for hearing and visually impaired citizens, ensuring full equal access to higher education, civic voting, and digital jobs.",
    societalBenefit: "Universal inclusion of differently-abled citizens in corporate and civic arenas, eliminating digital exclusion.",
    riskIfIgnored: "Forced isolation of hearing and sight-impaired individuals from employment and public discourse.",
    synergyTags: ["Disability Access & Inclusion", "Education", "Public Libraries & Knowledge Hubs"],
    iconName: "Milestone",
    colorAccent: "#06b6d4"
  },
  {
    id: "seismic-retrofitting",
    name: "LIFELINE SEISMIC RETROFITTING PROGRAM",
    startingPrice: 85000,
    category: "Civic Resilience",
    impactDescription: "Base isolators, carbon-fiber structural wrapping, and damping dampers reinforcing historic schools, hospitals, and bridges against earthquakes.",
    longDescription: "Identifies vulnerable masonry and soft-story concrete structures in earthquake fault zones, retrofitting them to withstand 8.0-magnitude temblors without structural collapse.",
    societalBenefit: "Prevents mass building collapses during seismic tremors, safeguarding thousands of school children and hospital patients.",
    riskIfIgnored: "Catastrophic building collapse during moderate earthquakes, flattening schools and crushing trapped victims.",
    synergyTags: ["Disaster Prep", "Vital Infrastructure", "Affordable Housing"],
    iconName: "Construction",
    colorAccent: "#f59e0b"
  },
  {
    id: "community-radio-beacons",
    name: "SOLAR OFF-GRID HAM RADIO STATIONS",
    startingPrice: 55000,
    category: "Civic Resilience",
    impactDescription: "Resilient solar-powered radio stations and low-frequency emergency amateur radio repeaters broadcasting hyperlocal updates when cellular networks fail.",
    longDescription: "When cyclones tear down cell towers and internet cables, low-frequency radio is the only communication channel that stays operational across flooded zones.",
    societalBenefit: "Guarantees continuous citizen broadcasts during grid collapses, directing rescue boats and countering rumors.",
    riskIfIgnored: "Total information blackout during catastrophic storms, widespread panic, and inability of marooned citizens to summon help.",
    synergyTags: ["Disaster Satellite Early Warning Beacon", "Civic Resilience", "Digital Infrastructure"],
    iconName: "Radio",
    colorAccent: "#10b981"
  },
  {
    id: "neighbourhood-cisterns",
    name: "DECENTRALIZED RAINWATER VAULTS",
    startingPrice: 70000,
    category: "Civic Resilience",
    impactDescription: "Sub-surface concrete filtration cisterns under municipal playgrounds capturing rooftop runoff to recharge domestic borewells.",
    longDescription: "Captures rainwater at the source instead of letting it mix with street sewage. Provides every housing society with an emergency 90-day water reserve.",
    societalBenefit: "Drastically elevates underground water table levels, eliminates water rationing during dry months, and prevents localized street flooding.",
    riskIfIgnored: "Complete groundwater depletion, bone-dry borewells by March, and dependence on private water profiteers.",
    synergyTags: ["Clean Water", "Rapid Flood & Drainage Network", "Civic Resilience"],
    iconName: "CloudRain",
    colorAccent: "#0284c7"
  },
  {
    id: "cyclone-resilient-roofs",
    name: "AERODYNAMIC CYCLONE-PROOF ROOFS",
    startingPrice: 65000,
    category: "Civic Resilience",
    impactDescription: "Subsidized aerodynamic roof strapping, composite tile anchors, and hurricane-rated shutter systems for coastal low-income settlements.",
    longDescription: "Prevents tin and asbestos sheets from tearing off and turning into lethal airborne projectiles during 200 km/h coastal cyclonic gales.",
    societalBenefit: "Saves homes from roof de-sheeting, prevents lethal airborne debris injuries, and enables families to shelter safely in place.",
    riskIfIgnored: "Hundreds of tin roofs shearing off into streets like flying blades, destroying home belongings and slicing down power lines.",
    synergyTags: ["Disaster Prep", "Affordable Housing", "Civic Safety & Emergency"],
    iconName: "Umbrella",
    colorAccent: "#0d9488"
  },
  {
    id: "volunteer-civil-defense",
    name: "COMMUNITY RAPID FLOOD RESCUE BOATS",
    startingPrice: 70000,
    category: "Civic Resilience",
    impactDescription: "Inflatable rescue rafts, solar outboard motors, life-vest stockpiles, and specialized swift-water flood rescue training for local fisher-folk.",
    longDescription: "Equips coastal and lakeside fisher-folk with modern rescue navigation technology. Locals are always the fastest first responders when urban inundation occurs.",
    societalBenefit: "Immediate rescue of stranded citizens within 30 minutes of flash flooding, before government armed forces can mobilize.",
    riskIfIgnored: "Vulnerable citizens stranded on flooded rooftops for days without food or water awaiting delayed military helicopters.",
    synergyTags: ["Rapid Flood & Drainage Network", "Disaster Prep", "Civic Safety & Emergency"],
    iconName: "LifeBuoy",
    colorAccent: "#0ea5e9"
  },
  {
    id: "mobile-water-desal-trucks",
    name: "MOBILE DISASTER WATER PURIFICATION TRUCKS",
    startingPrice: 75000,
    category: "Civic Resilience",
    impactDescription: "All-terrain emergency purification vehicles capable of filtering 20,000 liters/hour of floodwater into certified medical-grade drinking water.",
    longDescription: "Deployed immediately into flood-devastated districts where municipal water plants have failed. Prevents waterborne cholera and typhoid outbreaks.",
    societalBenefit: "Stops secondary cholera epidemics following natural disasters, dispensing free clean drinking water right into relief camps.",
    riskIfIgnored: "Explosive post-disaster cholera and gastroenteritis outbreaks killing more people than the flood itself.",
    synergyTags: ["Clean Water", "Disaster Prep", "Healthcare"],
    iconName: "Truck",
    colorAccent: "#06b6d4"
  },
  {
    id: "mudslide-geogrid-barriers",
    name: "HILLSIDE BIO-ANCHORING & SLOPE MESH",
    startingPrice: 65000,
    category: "Civic Resilience",
    impactDescription: "Steel geogrid hillside pinning, hydro-seeded deep-root vetiver grass slopes, and automated acoustic slope-shear sensors.",
    longDescription: "Stabilizes fragile mountain slopes and road cuttings against catastrophic monsoon landslides, alerting rescue squads seconds before ground movement occurs.",
    societalBenefit: "Keeps vital lifeline mountain roads open during monsoons, preventing villages from being cut off from food and medical supplies.",
    riskIfIgnored: "Massive mudslides burying hillside settlements and cutting off arterial mountain transit for months.",
    synergyTags: ["Disaster Prep", "Vital Infrastructure", "Precision Aerial Reforestation"],
    iconName: "Mountain",
    colorAccent: "#84cc16"
  },
  {
    id: "cleantech-patent-commons",
    name: "OPEN-SOURCE CLEAN-TECH COMMONS",
    startingPrice: 70000,
    category: "Economy & Innovation",
    impactDescription: "Royalty-free municipal patent pool and open engineering blueprints for low-cost solar inverters, composters, and water sensors.",
    longDescription: "Removes exorbitant patent licensing barriers for local hardware innovators. Allows collegiate engineering teams to build, fork, and manufacture green hardware cheaply.",
    societalBenefit: "Accelerates local green hardware manufacturing, slashes costs of clean energy hardware by 60%, and stimulates student innovation.",
    riskIfIgnored: "Heavy reliance on expensive foreign proprietary equipment and sluggish technological adaptation.",
    synergyTags: ["Research & Deep-Tech Labs", "Vocational Training Centers", "Circular Economy Incubator"],
    iconName: "Lightbulb",
    colorAccent: "#eab308"
  },
  {
    id: "green-cement-kilns",
    name: "POZZOLANIC LOW-CARBON GREEN CEMENT",
    startingPrice: 90000,
    category: "Economy & Innovation",
    impactDescription: "Industrial kilns utilizing calcined clay, steel slag, and industrial fly-ash to produce structural cement with 70% lower carbon footprint.",
    longDescription: "Traditional cement manufacturing produces 8% of global carbon emissions. This asset decarbonizes the physical building blocks of growing cities.",
    societalBenefit: "Slashes embodied carbon across all municipal infrastructure projects while utilizing otherwise toxic industrial waste slags.",
    riskIfIgnored: "Massive carbon emission spikes as urban construction expands, accompanied by limestone quarry depletion.",
    synergyTags: ["Net-Zero Building Mandates", "Waste Mgmt", "Economy & Innovation"],
    iconName: "Factory",
    colorAccent: "#64748b"
  },
  {
    id: "local-barter-currency",
    name: "COMMUNITY TIME-BANK & GREEN CURRENCY",
    startingPrice: 55000,
    category: "Economy & Innovation",
    impactDescription: "Complementary municipal digital currency and volunteer time-credit exchange enabling citizens to trade skills, caregiving, and surplus goods.",
    longDescription: "Creates an alternative grassroots economic safety net that operates even during financial recessions or inflation, rewarding community service and eldercare.",
    societalBenefit: "Fosters vibrant neighborhood mutual aid, rewards unpaid caregiving work, and stimulates hyper-local business patronage.",
    riskIfIgnored: "Total dependency on scarce national currency leaving cash-poor but skill-rich citizens unable to trade services.",
    synergyTags: ["Transparent Governance", "Civic Resilience", "Citizen Energy Cooperatives"],
    iconName: "Wallet",
    colorAccent: "#10b981"
  },
  {
    id: "rooftop-hydroponics",
    name: "COMMERCIAL ROOFTOP HYDROPONIC ARRAYS",
    startingPrice: 80000,
    category: "Economy & Innovation",
    impactDescription: "Automated nutrient-film greenhouse farms built on commercial warehouse roofs producing high-yield pesticide-free greens with 95% less water.",
    longDescription: "Brings fresh organic vegetable cultivation directly above grocery stores and restaurants. Eliminates refrigerated trucking miles and food spoilage.",
    societalBenefit: "Year-round climate-proof fresh produce supply, cuts food transportation emissions, and creates high-tech urban agronomy jobs.",
    riskIfIgnored: "Price spikes in fresh vegetables during floods or transport strikes, and reliance on heavily pesticide-sprayed distant farms.",
    synergyTags: ["Food Security & Agri-Tech", "Circular Economy Incubator", "Clean Water"],
    iconName: "Apple",
    colorAccent: "#22c55e"
  },
  {
    id: "seaweed-kelp-aquaculture",
    name: "REGENERATIVE OCEAN KELP SEQUESTRATION",
    startingPrice: 75000,
    category: "Economy & Innovation",
    impactDescription: "Offshore marine floating kelp farms absorbing ocean acidification, extracting bio-stimulant fertilizers, and creating edible seaweed foods.",
    longDescription: "Fast-growing seaweed requires zero fresh water, zero fertilizer, and zero arable land while drawing down carbon 30x faster than land trees.",
    societalBenefit: "De-acidifies coastal bays, creates alternative livelihoods for artisanal fishermen, and yields sustainable organic biostimulants.",
    riskIfIgnored: "Coastal sea acidification decimating shellfish and leaving coastal fishing communities with depleted catches.",
    synergyTags: ["Bioplastic & Packaging Revolution", "Mangrove & Reef Restoration", "Food Security & Agri-Tech"],
    iconName: "Shell",
    colorAccent: "#06b6d4"
  },
  {
    id: "circular-ewaste-refinery",
    name: "URBAN MINING & E-WASTE REFINERY",
    startingPrice: 85000,
    category: "Economy & Innovation",
    impactDescription: "Hydrometallurgical extraction plant safely recovering gold, lithium, copper, and rare earths from discarded electronics without acid-burning.",
    longDescription: "Urban electronic trash contains 50x higher concentrations of gold and copper than virgin ores. Replaces hazardous informal burning with clean green chemistry.",
    societalBenefit: "Recovers valuable strategic tech metals locally, shields informal scrap workers from lethal toxic fumes, and creates green tech supply chains.",
    riskIfIgnored: "Informal toxic acid washing of circuit boards poisoning riverbanks, causing chronic lead and mercury blood poisoning in children.",
    synergyTags: ["Circular Economy Incubator", "Waste Mgmt", "Research & Deep-Tech Labs"],
    iconName: "Monitor",
    colorAccent: "#6366f1"
  },
  {
    id: "regenerative-textile-mills",
    name: "CIRCULAR NATURAL FIBER & LINEN GUILDS",
    startingPrice: 65000,
    category: "Economy & Innovation",
    impactDescription: "Closed-loop spinning and natural indigo dyeing facilities converting banana pseudo-stem fiber and hemp into biodegradable textiles.",
    longDescription: "Transforms agricultural crop waste (banana trunks and hemp stalks) into luxurious, plastic-free fabric, eliminating synthetic polyester microfibers.",
    societalBenefit: "Prevents millions of tons of synthetic polyester shed into wastewater, provides extra crop revenue for farmers, and revives natural dyeing.",
    riskIfIgnored: "Unchecked synthetic fast-fashion waste clogging landfills, and synthetic microfibers contaminating drinking tap water.",
    synergyTags: ["Bioplastic & Packaging Revolution", "Indigenous Artisan & Handloom Guild", "Clean Water"],
    iconName: "Shirt",
    colorAccent: "#ec4899"
  },
  {
    id: "algorithmic-ethics-council",
    name: "AI & ALGORITHMIC ETHICS OMBUDSBOARD",
    startingPrice: 60000,
    category: "Governance & Digital",
    impactDescription: "Statutory multi-stakeholder watchdog auditing algorithmic bias in civic welfare allocation, police surveillance, and public exam scoring.",
    longDescription: "Guarantees that automated government computer systems do not discriminate against marginalized castes, women, or informal workers.",
    societalBenefit: "Eliminates discriminatory algorithm glitches that cancel poor citizens' food rations, protecting civil liberties and ensuring fair access.",
    riskIfIgnored: "Opaque algorithmic discrimination wrongfully denying welfare to millions of destitute families with zero human appeal.",
    synergyTags: ["Transparent Governance", "Legal Aid & Advocacy", "Digital Infrastructure"],
    iconName: "Scale",
    colorAccent: "#8b5cf6"
  },
  {
    id: "participatory-budgeting-app",
    name: "MOBILE CIVIC BUDGET REFERENDUM APP",
    startingPrice: 65000,
    category: "Governance & Digital",
    impactDescription: "Direct-democracy mobile platform allowing verified ward residents to propose, debate, and vote on 25% of municipal capital spending.",
    longDescription: "Takes public budgets out of closed bureaucratic corridors. Citizens vote directly on whether their ward gets a new park, streetlight grid, or library.",
    societalBenefit: "Eliminates wasteful white-elephant projects, matches public funds to real neighborhood priorities, and inspires high civic participation.",
    riskIfIgnored: "Public funds squandered on unnecessary commercial projects while basic slum drainage and streetlights remain neglected.",
    synergyTags: ["Decentralized Ward Parliaments", "Civic Open Data & Satellite Atlas", "Transparent Governance"],
    iconName: "Laptop",
    colorAccent: "#0ea5e9"
  },
  {
    id: "digital-land-titling",
    name: "TAMPER-PROOF MUNICIPAL GIS LAND REGISTRY",
    startingPrice: 70000,
    category: "Governance & Digital",
    impactDescription: "Cryptographically verified, drone-surveyed digital cadastral registry guaranteeing absolute ownership security for smallholders and slum dwellers.",
    longDescription: "Ends centuries of predatory land-grabbing by corrupt land mafias. Provides undeniable legal ownership deeds to vulnerable slum dwellers and small farmers.",
    societalBenefit: "Permanently ends arbitrary demolitions, empowers poor families to collateralize homes for low-interest bank loans, and ends court disputes.",
    riskIfIgnored: "Corrupt tampering of paper land deeds, violent eviction of poor families by connected real-estate mafias.",
    synergyTags: ["Legal Aid & Advocacy", "Affordable Housing", "Transparent Governance"],
    iconName: "Map",
    colorAccent: "#10b981"
  },
  {
    id: "whistleblower-protection",
    name: "ENCRYPTED ANONYMOUS WHISTLEBLOWER SHIELD",
    startingPrice: 60000,
    category: "Governance & Digital",
    impactDescription: "End-to-end zero-knowledge encrypted portal with statutory physical witness protection and legal defense funds for corruption reporters.",
    longDescription: "Shields whistleblowers who uncover illicit toxic dumping, tender embezzlement, or public contract kickbacks from assassination or termination.",
    societalBenefit: "Exposes corrupt civic cartels, recovers billions in stolen public tax funds, and protects the lives of courageous civic truth-tellers.",
    riskIfIgnored: "Whistleblowers silenced through violent retribution, institutionalized systemic graft, and unpunished environmental crimes.",
    synergyTags: ["Citizen Ombudsman & Fast-Track Portal", "Transparent Governance", "Legal Aid & Advocacy"],
    iconName: "Bell",
    colorAccent: "#f59e0b"
  },
  {
    id: "civic-open-code-stack",
    name: "MUNICIPAL OPEN-SOURCE DIGITAL STACK",
    startingPrice: 65000,
    category: "Governance & Digital",
    impactDescription: "Public digital goods architecture featuring open-source transit ticketing, health registries, and tax portals free from vendor lock-in.",
    longDescription: "Replaces proprietary multi-million-dollar software licenses from foreign monopolies with transparent, auditable open-source code maintained by public engineers.",
    societalBenefit: "Saves hundreds of crores in recurring software licensing fees, guarantees data sovereignty, and prevents proprietary vendor extortion.",
    riskIfIgnored: "Total capture of public civic data by predatory private software monopolies with zero customization flexibility.",
    synergyTags: ["Digital Infrastructure", "Research & Deep-Tech Labs", "Transparent Governance"],
    iconName: "Cpu",
    colorAccent: "#38bdf8"
  },
  {
    id: "anti-corruption-ledger",
    name: "PUBLIC INFRASTRUCTURE CONTRACT REPOSITORY",
    startingPrice: 70000,
    category: "Governance & Digital",
    impactDescription: "Publicly accessible portal publishing all government infrastructure contracts, contractor milestone inspections, and raw material cement lab tests.",
    longDescription: "Enables any citizen, engineering student, or investigative journalist to audit the exact thickness of newly laid asphalt and hold contractors legally accountable.",
    societalBenefit: "Eliminates substandard pothole-riddled road work, ensures bridges last for generations, and ends contractor kickbacks.",
    riskIfIgnored: "Newly paved roads washing away in the first rain, collapsing pedestrian flyovers, and zero contractor accountability.",
    synergyTags: ["Transparent Governance", "Civic Open Data & Satellite Atlas", "Citizen Ombudsman & Fast-Track Portal"],
    iconName: "FileCheck",
    colorAccent: "#059669"
  },
  {
    id: "smart-street-sensors",
    name: "HYPERLOCAL AIR & NOISE CITIZEN DASHBOARD",
    startingPrice: 65000,
    category: "Governance & Digital",
    impactDescription: "Lamp-post optical particulate counters, volatile chemical sniffers, and acoustic monitors mapping air and noise toxins down to street corner level.",
    longDescription: "Moves beyond a handful of citywide weather stations to dense block-by-block environmental monitoring. Sends instant health alerts to asthmatic citizens.",
    societalBenefit: "Pinpoints illegal midnight factory emissions, protects asthmatic school children, and holds industrial polluters legally accountable.",
    riskIfIgnored: "Polluting factories dumping toxic emissions under cover of darkness with zero legal proof or neighborhood detection.",
    synergyTags: ["Clean Air Defense", "Civic Open Data & Satellite Atlas", "Healthcare"],
    iconName: "Search",
    colorAccent: "#06b6d4"
  }
];

export const AUCTION_ITEMS: AuctionItem[] = RAW_AUCTION_ITEMS.map((item) => {
  const percentage = ITEM_BASELINE_PERCENTAGES[item.id] ?? 10;
  return {
    ...item,
    percentage,
    startingPrice: Math.round((BASELINE_BUDGET * percentage) / 100),
  };
});

// Official registered teams enrolled for Green Premier League
export const INITIAL_REGISTERED_TEAMS: RegisteredTeam[] = (registeredTeamsSeed as unknown as RegisteredTeam[]) || [];
