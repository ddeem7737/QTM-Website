export type Product = {
  slug: string;
  name: string;
  family: string;
  description: string;
  suppliers: string[];
  industries: string[];
  materials: string[];
  subcategories: string[];
  profiles?: string[];
  benefits?: string[];
  image: string;
};

export type Supplier = {
  slug: string;
  name: string;
  short: string;
  relationship: string;
  products: string[];
  url: string;
  mark: string;
};

export const products: Product[] = [
  {
    slug: "timing-belts",
    name: "Timing Belts",
    family: "Power Transmission Belts",
    description: "Rubber and polyurethane synchronous belts for precise power transmission, conveying and positioning applications.",
    suppliers: ["Megadyne", "Continental / ContiTech", "Wilhelm Herm. Müller", "Ammeraal Beltech"],
    industries: ["Packaging", "Tobacco", "Food & Beverage", "Paper & Printing", "Automotive & Tire", "Elevators", "Robotics & Automation"],
    materials: ["Rubber", "Polyurethane", "Steel cord", "Aramid cord"],
    subcategories: ["Polyurethane Open End", "Polyurethane Endless", "Rubber Open End", "Rubber Endless"],
    profiles: ["HTD", "STD", "RPP", "SLV", "GLD", "TTM", "CXP", "CXA", "XL", "L", "H", "XH", "XXH", "T2.5", "T5", "T10", "T20", "AT3", "AT5", "AT10", "AT20", "R", "B", "ATP", "ATK", "ATG", "QST"],
    benefits: ["Precise synchronous transmission", "Custom coatings, cleats and guides", "Application-specific tension cords", "Product-selection support"],
    image: "/assets/partnership-megadyne-pu-new.png",
  },
  {
    slug: "v-belts",
    name: "V-Belts",
    family: "Power Transmission Belts",
    description: "A complete range of classical, narrow, wrapped, raw-edge, banded and specialty V-belts for industrial and agricultural drives.",
    suppliers: ["Megadyne", "Continental / ContiTech"],
    industries: ["Oil & Gas", "Agriculture", "Mining", "Stone & Ceramics", "Glass", "Wood Processing", "Elevators"],
    materials: ["Rubber", "Aramid reinforcement", "Textile wrap"],
    subcategories: ["Rubber Raw Edge", "Rubber Wrapped", "Rubber Banded"],
    profiles: ["Z", "A", "B", "C", "D", "E", "SPZ", "SPA", "SPB", "SPC", "3V", "5V", "8V", "AA", "BB", "CC", "Variable-speed profiles", "Agricultural profiles"],
    benefits: ["Broad application coverage", "Oil- and heat-resistant options", "Antistatic options", "High-power configurations"],
    image: "/assets/partnership-megadyne-vbelts-new.png",
  },
  {
    slug: "conveyor-belts",
    name: "Conveyor Belts",
    family: "Conveyor and Process Belts",
    description: "Premium and cost-effective conveyor and process belting for hygienic, high-speed and demanding industrial applications.",
    suppliers: ["Ammeraal Beltech", "Sampla"],
    industries: ["Food & Beverage", "Packaging", "Tobacco", "Paper & Printing", "Material Handling & Logistics", "Wood Processing", "Textile", "Recycling", "Airports & Baggage Handling"],
    materials: ["PU", "PVC", "Polyester", "Silicone", "Cotton", "Polyolefin", "Felt", "Fabric"],
    subcategories: ["PU", "PVC", "Polyester", "Silicone", "Cotton", "Polyolefin", "Felt", "Elastic", "Nonwoven", "Food-Grade", "Process Belts", "Airport and Logistics"],
    benefits: ["Custom fabrication", "Cleats, sidewalls and guides", "Endless splicing", "On-site technical support"],
    image: "/assets/partner-products/ammeraal-synthetic.webp",
  },
  {
    slug: "modular-belts",
    name: "Modular Belts",
    family: "Modular Conveying",
    description: "UNI modular belting, sprockets and accessories for cleanability, reliable handling and configurable conveying layouts.",
    suppliers: ["UNI Modular / Ammeraal Beltech"],
    industries: ["Food & Beverage", "Packaging", "Automotive & Tire", "Material Handling & Logistics", "Airports & Baggage Handling", "Robotics & Automation"],
    materials: ["Polypropylene", "Polyethylene", "Acetal", "Polyamide", "Engineering polymers"],
    subcategories: ["Straight-Running", "Radius", "Flush-Grid", "Flat-Top", "Friction-Top", "Roller-Top", "Spiral", "Side-Flexing"],
    benefits: ["Wear resistance", "High load capacity", "Easy cleaning", "Hygienic design", "Long service life"],
    image: "/assets/partner-products/uni-straight.webp",
  },
  {
    slug: "roller-chains",
    name: "Roller Chains",
    family: "Mechanical Power Transmission",
    description: "Roller and conveyor chains for dependable mechanical transmission and material movement.",
    suppliers: ["Challenge Power Transmission"],
    industries: ["Agriculture", "Mining", "Material Handling & Logistics", "Packaging"],
    materials: ["Steel", "Stainless steel"],
    subcategories: ["Roller Chains", "Conveyor Chains", "Attachment Chains", "Special Chains"],
    image: "/assets/products/roller-chain.jpg",
  },
  {
    slug: "sprockets",
    name: "Sprockets",
    family: "Mechanical Power Transmission",
    description: "Sprockets and matched mechanical components for chain and belt-drive systems.",
    suppliers: ["Challenge Power Transmission"],
    industries: ["Agriculture", "Material Handling & Logistics", "Mining", "Oil & Gas"],
    materials: ["Steel", "Cast iron", "Engineering polymers"],
    subcategories: ["Chain Sprockets", "Timing Pulleys", "V-Belt Pulleys", "Bushes"],
    image: "/assets/products/sprocket.jpg",
  },
  {
    slug: "bearings",
    name: "Bearings & Components",
    family: "Metal Parts",
    description: "Bearings, couplings, tensioners, bushes and related metal parts selected for the application.",
    suppliers: ["Multi-brand supply"],
    industries: ["Oil & Gas", "Mining", "Automotive & Tire", "Material Handling & Logistics"],
    materials: ["Steel", "Engineering polymers"],
    subcategories: ["Bearings", "Couplings", "Tensioners", "Bushes", "Metal Parts"],
    image: "/assets/products/bearings.jpg",
  },
];

export const suppliers: Supplier[] = [
  { slug: "megadyne", name: "Megadyne", short: "Power transmission belts", mark: "MEGADYNE_LOGO", relationship: "QTM Group is a Megadyne MegaPartner and a trusted regional distributor of Megadyne power transmission solutions.", products: ["Timing belts", "V-belts", "Polyurethane belts", "Rubber belts", "Power transmission solutions"], url: "https://megadynegroup.com/" },
  { slug: "continental", name: "Continental / ContiTech", short: "Industrial drive solutions", mark: "CONTINENTAL_LOGO", relationship: "QTM Group has served as a regional representative of ContiTech since 2023.", products: ["V-belts", "Timing belts", "Power transmission belts", "Industrial drive solutions"], url: "https://www.continental-industry.com/global/en" },
  { slug: "ammeraal-beltech", name: "Ammeraal Beltech", short: "Conveyor, process and flat belts", mark: "AMMERAAL_LOGO", relationship: "QTM Group supplies Ammeraal Beltech conveying and process solutions, including RAPPLON® flat belts and UNI modular belts.", products: ["Conveyor belts", "Process belts", "RAPPLON® flat belts", "UNI Modular Belts", "Timing belts where applicable"], url: "https://ammeraalbeltech.com/" },
  { slug: "sampla", name: "Sampla", short: "Cost-effective conveyor solutions", mark: "SAMPLA_LOGO", relationship: "QTM Group represents Sampla solutions as a cost-effective conveyor-belt range without compromising quality and performance.", products: ["Conveyor belts", "Process belts", "Cost-effective industrial conveying solutions"], url: "https://sampla.com/" },
  { slug: "uni-modular", name: "UNI Modular", short: "Modular conveying", mark: "UNI_MODULAR_LOGO", relationship: "UNI Modular is presented as the modular-belt product family of Ammeraal Beltech, supplied regionally through QTM Group.", products: ["Modular belts", "Sprockets", "Accessories", "Spiral and side-flexing solutions"], url: "https://ammeraalbeltech.com/en-us/products/modular-belts/" },
  { slug: "challenge", name: "Challenge Power Transmission", short: "Chains and components", mark: "CHALLENGE_LOGO", relationship: "QTM Group supplies Challenge mechanical power transmission products for industrial applications.", products: ["Roller chains", "Conveyor chains", "Sprockets", "Mechanical power transmission components"], url: "https://challengept.com/" },
  { slug: "whm", name: "Wilhelm Herm. Müller", short: "Customized drive technology", mark: "WHM_LOGO", relationship: "QTM Group was officially authorized in 2026 to represent Wilhelm Herm. Müller products and business interests across the region.", products: ["Timing belts", "Flat belts", "Drive technology", "Customized power transmission solutions"], url: "https://whm.net/en/" },
];

export const industries = [
  "Oil & Gas",
  "Packaging",
  "Tobacco",
  "Food & Beverage",
  "Paper & Printing",
  "Agriculture",
  "Automotive & Tire",
  "Mining",
  "Stone & Ceramics",
  "Glass",
  "Wood Processing",
  "Material Handling & Logistics",
  "Elevators",
  "Textile",
  "Recycling",
  "Airports & Baggage Handling",
  "Robotics & Automation",
].map((name) => ({
  name,
  slug: name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
}));

export const industryDetails: Record<string, { overview: string; applications: string[]; challenges: string[] }> = {
  "oil-and-gas": { overview: "Heavy-duty power transmission and conveying solutions for demanding oil and gas operations.", applications: ["Compressors and pumps", "Cooling systems", "Shale-handling equipment", "Auxiliary drives"], challenges: ["Continuous operation", "Oil and heat exposure", "High loads", "Remote-site reliability"] },
  packaging: { overview: "Precision belts and components for high-speed forming, filling, sealing, folding and end-of-line equipment.", applications: ["Folder gluers", "Vertical form-fill-seal", "Carton handling", "End-of-line systems"], challenges: ["Accurate positioning", "High cycle rates", "Low downtime", "Consistent tracking"] },
  tobacco: { overview: "Clean, precise belting for high-speed tobacco processing, conveying and packaging equipment.", applications: ["Primary processing", "Cigarette manufacturing", "Machine tapes", "Packaging lines"], challenges: ["Precise tracking", "Clean operation", "High speed", "Consistent product handling"] },
  "food-and-beverage": { overview: "Hygienic conveying and reliable power transmission for processing, packaging and handling lines.", applications: ["Processing lines", "Packaging equipment", "Cooling and freezing", "Product handling"], challenges: ["Hygiene", "Washdown resistance", "Product release", "Traceability"] },
  "paper-and-printing": { overview: "High-speed belts and machine tapes for accurate paper handling, printing and converting.", applications: ["Printing presses", "Folder gluers", "Paper converting", "Feeder and delivery systems"], challenges: ["High-speed accuracy", "Grip consistency", "Low marking", "Reliable tracking"] },
  agriculture: { overview: "Durable drive and conveying components for seasonal, dusty and demanding agricultural operations.", applications: ["Harvesting equipment", "Sorting lines", "Processing machinery", "Auxiliary drives"], challenges: ["Dust", "Shock loads", "Outdoor exposure", "Seasonal uptime"] },
  "automotive-and-tire": { overview: "Reliable conveying and power transmission for vehicle, component and tire manufacturing.", applications: ["Tire production", "Assembly lines", "Component handling", "Robotic cells"], challenges: ["Process consistency", "Abrasion resistance", "Accurate movement", "Production uptime"] },
  mining: { overview: "Robust belt and mechanical transmission solutions for abrasive, high-load mining applications.", applications: ["Crushers and screens", "Conveying systems", "Pumps and ventilation", "Processing equipment"], challenges: ["Abrasive material", "Heavy loads", "Dust contamination", "Continuous duty"] },
  "stone-and-ceramics": { overview: "Application-specific belts for abrasive materials, precision conveying and high-temperature production environments.", applications: ["Ceramic processing", "Stone cutting", "Finishing lines", "Sorting and conveying"], challenges: ["Abrasion", "Temperature", "Accurate positioning", "Surface protection"] },
  glass: { overview: "Reliable conveying and power transmission for glass forming, processing and handling lines.", applications: ["Container-glass production", "Flat-glass processing", "Inspection lines", "Product handling"], challenges: ["Heat", "Fragile-product handling", "Surface protection", "Process consistency"] },
  "wood-processing": { overview: "Durable conveying and drive solutions for cutting, sanding, profiling and furniture production.", applications: ["Panel processing", "Sanding machines", "Edge banders", "Material transfer"], challenges: ["Dust", "Grip", "Accurate feeding", "Abrasion resistance"] },
  "material-handling-and-logistics": { overview: "Efficient belting and conveying components for warehouses, distribution centres and material-flow systems.", applications: ["Warehouse conveyors", "Sorting systems", "Pallet handling", "Distribution lines"], challenges: ["Reliable tracking", "High throughput", "Load variation", "Low maintenance"] },
  elevators: { overview: "Dependable belt and transmission solutions for elevator and vertical-transport equipment.", applications: ["Elevator drives", "Door systems", "Auxiliary mechanisms", "Maintenance replacement"], challenges: ["Safety", "Low noise", "Reliable operation", "Long service life"] },
  textile: { overview: "High-speed process and transmission belts for textile production and nonwoven machinery.", applications: ["Spinning and weaving", "Machine tapes", "Nonwoven processing", "Finishing lines"], challenges: ["High speed", "Low vibration", "Accurate tracking", "Clean operation"] },
  recycling: { overview: "Durable conveying and transmission solutions for sorting, recovery and recycling systems.", applications: ["Sorting lines", "Waste conveyors", "Material separation", "Processing equipment"], challenges: ["Contamination", "Impact", "Abrasion", "Variable loads"] },
  "airports-and-baggage-handling": { overview: "Reliable conveyor and drive solutions for airport baggage movement, sorting and security systems.", applications: ["Check-in conveyors", "Baggage sorting", "Security screening", "Arrival carousels"], challenges: ["Continuous availability", "Accurate tracking", "Variable loads", "Passenger-area reliability"] },
  "robotics-and-automation": { overview: "Precision synchronous and conveying solutions for automated production and robotic systems.", applications: ["Linear positioning", "Robotic cells", "Automated assembly", "Pick-and-place systems"], challenges: ["Positioning accuracy", "Repeatability", "Low maintenance", "High cycle rates"] },
};

export const news = [
  { slug: "regional-technical-network", category: "Company News", supplier: "QTM Group", title: "Strengthening Regional Technical Support", excerpt: "A draft update about how QTM connects international product expertise with responsive regional coordination.", status: "Draft — date to be confirmed" },
  { slug: "product-identification-guide", category: "Technical Articles", supplier: "Multi-brand", title: "What to Send When Identifying an Industrial Belt", excerpt: "A practical draft guide covering markings, dimensions, machine details and photographs.", status: "Draft — date to be confirmed" },
  { slug: "supplier-network-update", category: "Partnerships", supplier: "Megadyne", title: "Inside QTM’s Multi-Brand Supplier Network", excerpt: "A draft overview of how one regional contact can help customers compare suitable industrial solutions.", status: "Draft — date to be confirmed" },
  { slug: "conveyor-selection-basics", category: "Industry Insights", supplier: "Ammeraal Beltech", title: "Conveyor Belt Selection: The Application Comes First", excerpt: "A draft technical note on matching belt construction to process demands.", status: "Draft — date to be confirmed" },
];

export const productFamilies = [
  { name: "Power Transmission Belts", items: ["Timing Belts", "V-Belts", "Specialty Belts"] },
  { name: "Conveyor and Process Belts", items: ["PU Conveyor Belts", "PVC Conveyor Belts", "Polyester Belts", "Silicone Belts", "Cotton Belts", "Polyolefin Belts", "Felt Belts", "Elastic Belts", "Nonwoven Belts", "Fabric Belts", "Food-Grade Belts", "Process Belts", "Seamless Belts", "Airport and Logistics Belts"] },
  { name: "Modular Conveying", items: ["Straight-Running Modular Belts", "Radius Modular Belts", "Flat-Top Belts", "Flush-Grid Belts", "Friction-Top Belts", "Roller-Top Belts", "Rubber-Top Belts", "Spiral Belts", "Side-Flexing Belts", "Modular Belt Accessories"] },
  { name: "Metal Parts", items: ["Bearings", "Couplings", "Tensioners", "Bushes", "Metal Parts"] },
];

export const timingBeltTypes = ["Polyurethane Open End", "Polyurethane Endless", "Rubber Open End", "Rubber Endless"];

export function findProduct(slug: string) { return products.find((p) => p.slug === slug); }
export function findSupplier(slug: string) { return suppliers.find((s) => s.slug === slug); }
export function findIndustry(slug: string) { return industries.find((i) => i.slug === slug); }
export function slugify(value: string) { return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
