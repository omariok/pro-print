import type { Content } from "./index";

/**
 * English version. Written for packaging buyers and technologists outside
 * Russia: terms follow flexo and tray-wrapping practice, units are metric,
 * Russian regulatory names keep their official English forms.
 */
export const en: Content = {
  meta: {
    siteName: "Pro-Print",
    titleDefault: "Pro-Print — flexographic printing on food packaging films",
    titleTemplate: "%s — Pro-Print",
    description:
      "Up to 10-color printing on food packaging films from 8 µm: stretch, PVC, POF, polyethylene and multilayer barrier films. Our own flexo press and full-cycle production in the Leningrad Region, Russia.",
    keywords: [
      "flexographic printing",
      "printed film",
      "stretch film",
      "food packaging film",
      "PVC cling film",
      "POF film",
      "polyethylene film",
      "barrier film",
      "tray wrapping film",
    ],
    ogTitle: "Pro-Print — up to 10-color printing on food packaging films",
    ogDescription:
      "Flexographic CMYK and Pantone printing on stretch, PVC, POF, polyethylene and barrier films from 8 µm. Production in the Leningrad Region, Russia.",
    ogImageAlt: "Pro-Print — up to 10-color flexographic printing on food packaging films",
    ogImageTitle: "Up to 10-color printing on food packaging films",
    ogImageText:
      "Stretch, PVC, POF, polyethylene and multilayer barrier films from 8 µm. Our own production in the Leningrad Region.",
    skipLink: "Skip to content",
  },

  site: {
    name: "Pro-Print",
    legalName: "Pro-Print LLC",
    schedule: "Mon–Fri, 09:00–18:00 Moscow time (UTC+3)",
    production:
      "27 Leningradskaya St., bldg. 1, Tervolovo, Gatchinsky District, Leningrad Region, 188351, Russia",
    office: "10 Oboronnaya St., letter A, office 209, St. Petersburg, 198095, Russia",
  },

  nav: [
    { label: "Products", href: "/#products" },
    { label: "Specifications", href: "/#specs" },
    { label: "Production", href: "/#production" },
    { label: "How we work", href: "/#process" },
    { label: "FAQ", href: "/#faq" },
    { label: "About", href: "/about" },
    { label: "Contacts", href: "/contacts" },
  ],

  header: {
    cta: "Get a quote",
    call: "Call {phone}",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    home: "Pro-Print — home",
    language: "Site language",
  },

  hero: {
    titleLines: ["We print", "so your product", "won’t get lost", "on the shelf"],
    materialsPrefix: "on",
    materials: [
      "food-grade stretch film",
      "polyethylene film",
      "PVC film",
      "POF polyolefin film",
      "multilayer barrier film",
    ],
    materialsEnd: ".",
    materialsPlain:
      "on food-grade stretch film, polyethylene film, PVC film, POF polyolefin film and multilayer barrier film.",
    cta: "Get a quote",
    features: [
      { icon: "diamond", text: "Vivid, durable print in up to 10 colors" },
      { icon: "shield", text: "Safe for food contact" },
      { icon: "leaf", text: "Fits any packaging task" },
    ],
    probe: {
      value: "ΔE ≤ 2",
      text: "Color matches the approved artwork.",
      proof: "Artwork",
      print: "Print",
      hint: "Hover over the sphere",
      hintText: "See what accurate color reproduction at ΔE ≤ 2 looks like.",
    },
  },

  capabilities: {
    title: "Film matched to your packing method, not to a catalog number",
    lede: "We choose thickness, width and winding for your product and your packaging line.",
    cards: [
      {
        title: "Automatic lines",
        text: "Smooth running on packaging machines — no web breaks, no sticking.",
        points: [
          "Up to 10-color printing across the full web width",
          "Anti-fog finish keeps the display window clear",
          "Longer product shelf life",
        ],
        note: "Runs on all common packaging machines: ULMA, Automac, Waldissa, Elixa, Omori, DIGI.",
      },
      {
        title: "Hand wrapping",
        text: "For packing rooms where products are wrapped by hand or on semi-automatic equipment.",
        points: [
          "Stretches easily and hugs the tray tightly",
          "Thickness chosen for the product and temperature",
          "76 or 110 mm core to fit your dispenser",
        ],
        note: "",
      },
      {
        title: "Hot plate wrapping",
        text: "Fruit and vegetables, fresh meat, ready meals, semi-finished products, confectionery.",
        points: [
          "Withstands heat sealing",
          "Clean seal without burn marks",
          "Works on standard hot plate stations",
          "Longer product shelf life",
          "Stays strong when frozen and through temperature changes",
        ],
        note: "",
      },
      {
        title: "Unprinted",
        text: "Clear PVC stretch films from stock and made to order.",
        points: [
          "Thickness from 8 µm",
          "Width from 250 to 550 mm",
          "Roll length up to 3,000 meters",
        ],
        note: "",
      },
    ],
    prepress: {
      title: "Design and prepress",
      text: "No need for a separate designer or plate supplier: we take the artwork to press and make the plates in-house.",
      groups: [
        {
          title: "Packaging design",
          points: [
            "From scratch or based on your artwork",
            "Built around the limits of flexo printing",
            "Shelf test: how the product reads on the shelf",
          ],
        },
        {
          title: "Prepress",
          points: [
            "Color separation, trapping, repeat, Pantone colors",
            "Checked against your packaging machine",
            "Flexo plates, stored for repeat runs",
          ],
        },
      ],
    },
    callout: {
      title: "Don’t see your format?",
      text: "Send us your machine and product details — we’ll select the film and price the run.",
      cta: "Request a quote",
    },
  },

  pvc: {
    title: "Clear PVC film for almost any product",
    lede: "A thin food-grade polyvinyl chloride film: it wraps the tray tightly, holds the pack’s shape and leaves the product in full view.",
    usesTitle: "Applications",
    uses: [
      {
        title: "Food",
        text: "Meat and poultry, fish, fruit and vegetables, cheese, ready meals and semi-finished products. The film keeps products fresh and looking their best on the counter and in cold storage.",
      },
      {
        title: "Fragile and loose goods",
        text: "Glass, tableware, ceramics, small and loose items. The wrap holds contents together and reduces the risk of chipping in transit.",
      },
      {
        title: "Household and industrial use",
        text: "Household goods, components, hardware, tools. Multipack bundling and pallet wrapping without extra containers.",
      },
      {
        title: "Agriculture",
        text: "Covering beds and greenhouses, protecting seedlings from wind and rain, packing the harvest.",
      },
    ],
    advTitle: "Material benefits",
    advantages: [
      {
        title: "Strength and elasticity",
        text: "Stretches without tearing and fits snugly around the product.",
      },
      {
        title: "Longer shelf life",
        text: "Limits air exposure and extends product shelf life.",
      },
      {
        title: "Clarity",
        text: "Shoppers see the whole product without opening the pack.",
      },
      {
        title: "Moisture resistance",
        text: "Keeps moisture out and stops the product from drying out.",
      },
      {
        title: "Low thermal conductivity",
        text: "Softens temperature swings during handling and transport.",
      },
      {
        title: "Chemical resistance",
        text: "Does not react with the contents, fats or household chemicals.",
      },
      {
        title: "Sealability",
        text: "Gives an even seal on a hot plate and on a packaging machine.",
      },
      {
        title: "Hygiene",
        text: "Food-grade material with no foreign odor or taste.",
      },
    ],
    note: "The film is covered by an EAEU declaration of conformity for food packaging and backed by a laboratory test report. We ship from stock and to order, with a full set of documents.",
  },

  examples: {
    title: "What the print looks like on a finished product",
    lede: "Full-color CMYK with Pantone colors, or designs printed in Pantone colors only — we reproduce artwork of any complexity.",
    pending: "Photo coming soon",
    items: [
      {
        key: "chicken",
        src: "/examples/chicken.webp",
        alt: "Tray of chicken thighs wrapped in full-color printed film with the product name, herbs, a countryside scene and icons",
        caption: "Chicken thighs: full-color print across the whole tray — landscape, herbs, icons and small type on one film.",
      },
      {
        key: "tomatoes",
        src: "/examples/tomatoes.webp",
        alt: "Tray of tomatoes wrapped in printed film with a dark green border, botanical artwork and a clear window",
        caption: "Tomatoes: rich artwork around the edges and a clear window in the middle — the product is visible, the brand is recognizable.",
      },
      {
        key: "mushrooms",
        src: "/examples/mushrooms.webp",
        alt: "Tray of button mushrooms wrapped in printed film with the product name, icons, an engraved field scene and parsley",
        caption: "Mushrooms: fine engraved lines, small type and soft color transitions stay crisp.",
      },
    ],
  },

  advantages: {
    title: "Packaging that works like advertising on the shelf",
    lede: "Printed film is part of brand promotion: it catches the shopper’s eye and lifts sales through recognition.",
    items: [
      {
        n: "01",
        title: "Brand recognition",
        text: "Printed film turns an ordinary tray into a brand carrier. Shoppers remember your product, not just the category.",
      },
      {
        n: "02",
        title: "Standing out on the shelf",
        text: "A store chiller holds dozens of identical clear trays. Color and graphics make your product visible from a distance.",
      },
      {
        n: "03",
        title: "Higher sales",
        text: "Products in branded packaging sell faster — thanks to recognition and a perception of higher quality.",
      },
      {
        n: "04",
        title: "A neat look",
        text: "A printed border hides drips and small presentation flaws, so the pack looks tidy until the end of its shelf life.",
      },
    ],
  },

  metrics: {
    title: "The numbers a technologist decides by",
    lede: "If your requirements go beyond this table, get in touch — some parameters can be agreed individually for your packaging line.",
    rows: [
      ["Colors", "up to 10, CMYK and Pantone"],
      ["Material", "stretch, PVC, POF, PE, barrier films"],
      ["Film thickness", "from 8 µm"],
      ["Roll width", "250–550 mm"],
      ["Roll length", "up to 3,000 m"],
      ["Core diameter", "76 or 110 mm"],
      ["Minimum order", "120 rolls or 1.5 metric tons"],
      ["Lead time", "from 7 working days"],
      ["Production capacity", "from 1,500,000 kg per year"],
    ],
  },

  production: {
    title: "Our own production site, not a middleman",
    lede: "We print ourselves: the press, quality control department, warehouse and office are all on one site in the Leningrad Region.",
    cards: [
      {
        title: "10-color flexo press",
        text: "Our own press reproduces designs of any complexity: full-color CMYK with Pantone colors, or designs printed in Pantone colors only.",
      },
      {
        title: "Quality control",
        text: "Our quality control department checks every run: color registration, color density, width, winding and web integrity.",
      },
      {
        title: "Our own office and warehouse",
        text: "A warehouse next to production lets us keep material in stock and ship repeat runs without long logistics delays.",
      },
    ],
  },

  process: {
    title: "From inquiry to shipment in six steps",
    steps: [
      {
        n: "01",
        time: "same day",
        title: "Inquiry",
        text: "You send the volume, thickness, width and type of packaging machine. A manager calls you back to clarify the details.",
      },
      {
        n: "02",
        time: "1–2 days",
        title: "Quote",
        text: "We prepare a commercial offer based on your specs: meterage, number of rolls, number of colors.",
      },
      {
        n: "03",
        time: "2–5 days",
        title: "Artwork",
        text: "We accept your file or create the design. We adapt it for flexo printing and agree on colors with you.",
      },
      {
        n: "04",
        time: "3–5 days",
        title: "Plates",
        text: "We make flexo plates for the approved artwork and color set.",
      },
      {
        n: "05",
        time: "as scheduled",
        title: "Printing",
        text: "The run starts on our 10-color press. You are welcome to attend the press start and see the first print.",
      },
      {
        n: "06",
        time: "from 7 working days",
        title: "QC and shipment",
        text: "We check winding, width, color registration and web integrity. Then we pack and ship.",
      },
    ],
  },

  documents: {
    title: "Proven food safety",
    lede: "Our products are declared under Customs Union Technical Regulation TR CU 005/2011 “On Safety of Packaging”. We send the full set of documents on request together with our commercial offer.",
    items: [
      {
        title: "EAEU Declaration of Conformity",
        meta: "ЕАЭС N RU Д-RU.РА05.В.56457/26",
        text: "Registered on June 30, 2026, valid until June 29, 2031. Covers PVC-based film from 8 to 30 µm thick — clear and colored, unprinted, printed and perforated.",
        file: { href: "/docs/pro-print-deklaraciya-eaes.pdf", size: "PDF in Russian, 1 page, 96 KB" },
      },
      {
        title: "Technical Specifications (TU)",
        meta: "ТУ 22.21.30-001-05379358-2026",
        text: "Our own specifications for polymer food packaging: requirements for the material, roll dimensions, labeling and batch acceptance.",
        file: { href: "/docs/pro-print-tu.pdf", size: "PDF in Russian, 14 pages, 2.1 MB" },
      },
      {
        title: "Test report",
        meta: "No. у-34/16.06.2026/974607",
        text: "An accredited testing center examined a sample of printed PVC film for organoleptic properties, sanitary-chemical parameters and phthalate content. No deviations from the standards were found.",
        file: { href: "/docs/pro-print-protokol-ispytaniy.pdf", size: "PDF in Russian, 9 pages, 91 KB" },
      },
    ],
    downloadLabel: "Download",
    downloadAria: "Download “{title}” — {size}",
  },

  faq: {
    title: "What customers ask before their first order",
    items: [
      {
        q: "How is an order measured — in kilograms, meters or rolls?",
        a: "We quote in all three units at once — kilograms, rolls and linear meters — and optimize the order for your needs.",
      },
      {
        q: "What is the minimum order?",
        a: "The minimum order is 120 rolls or 1.5 metric tons.",
      },
      {
        q: "We don’t have artwork yet. What should we do?",
        a: "Our designer will help. We’ll create a design from scratch that makes your product recognizable on the shelf.",
      },
      {
        q: "Will the film work on our packaging machine?",
        a: "Our films run on all common packaging machines: ULMA, Automac, Waldissa, Elixa, Omori, DIGI. Send us the machine model, dispenser diameter and working width — we’ll match the thickness, web width and a 76 or 110 mm core to your line.",
      },
      {
        q: "What are the lead times?",
        a: "Lead time is from 7 working days after the run starts.",
      },
      {
        q: "How can we be sure the color stays consistent?",
        a: "Customers are always welcome at the start of a run. During printing, our technologists and quality control department check the print against the approved artwork, verify color accuracy and monitor Delta E (ΔE) deviation.",
      },
      {
        q: "What documents come with the film?",
        a: "Our products are declared under TR CU 005/2011 “On Safety of Packaging”: EAEU declaration ЕАЭС N RU Д-RU.РА05.В.56457/26 is valid until June 29, 2031. It comes with our own technical specifications ТУ 22.21.30-001-05379358-2026, a test report from an accredited testing center and a product specification. The documents are issued in Russian.",
      },
      {
        q: "Printed film costs more than clear film. Why do we need it?",
        a: "Printed film works like advertising on the shelf: the product is recognized, stands out among identical clear trays and sells faster. A printed border also hides drips and small presentation flaws.",
      },
    ],
  },

  contact: {
    title: "Send us your specs — we’ll come back with a quote",
    lede: "A sales manager will contact you, clarify the details and prepare an offer for your volume.",
    points: [
      "Minimum order: 120 rolls or 1.5 metric tons",
      "Lead time: from 7 working days",
      "No artwork? We’ll design and adapt it",
      "You are welcome to attend the press start",
    ],
    detailsBefore: "{schedule}. Company details and addresses are ",
    detailsLink: "on the Contacts page",
    detailsAfter: ".",
  },

  form: {
    successTitle: "Request sent",
    successText:
      "A sales manager will contact you during business hours ({schedule}) to clarify the run details. If it’s urgent, call us: {phone}.",
    again: "Send another request",
    optional: "optional",
    name: {
      label: "Name",
      placeholder: "How should we address you",
      required: "Please enter your name",
      tooShort: "Name must be at least two characters",
    },
    company: {
      label: "Company",
      placeholder: "Company name",
      required: "Please enter your company",
    },
    phone: {
      label: "Phone",
      placeholder: "With country code",
      required: "Please enter your phone number",
      invalid: "Enter the number with country code, e.g. +7 900 000-00-00",
    },
    email: {
      label: "Email",
      placeholder: "name@company.com",
      required: "Please enter your email",
      invalid: "Email should look like name@company.com",
    },
    volume: { label: "Volume and specs", placeholder: "E.g. 500 rolls, 15 µm, 400 mm" },
    machine: { label: "Packaging machine", placeholder: "Machine model or “hand wrapping”" },
    artwork: { label: "Artwork link", placeholder: "Cloud link or “no artwork yet”" },
    comment: { label: "Comment", placeholder: "Task, deadlines, product specifics" },
    consentBefore:
      "I consent to the processing of my personal data under Russian Federal Law No. 152-FZ and the ",
    consentLink: "personal data processing policy",
    consentAfter: ".",
    consentRequired: "We can’t send your request without your consent",
    next: "What happens next: a manager will contact you during business hours ({schedule}) to clarify the run size, material and colors. No artwork is needed at this stage — we quote based on your specs.",
    submit: "Send request",
    submitting: "Sending…",
    failed: "We couldn’t send your request. What you entered has been kept — please try again, or call us: ",
    failedAfter: ".",
    emailBefore: "Or send your artwork and specs directly to ",
  },

  about: {
    metaTitle: "About",
    metaDescription:
      "Pro-Print LLC — flexographic printing on food packaging films from 8 µm: stretch, PVC, POF, polyethylene and barrier films. Production facilities, supply geography and key specifications.",
    title: "We print on thin food films where most printers say “we can’t take that on”",
    lede: "Pro-Print LLC is a manufacturing company with its own 10-color flexographic press. We print on food packaging films from 8 microns thick — stretch, PVC, POF, polyethylene and multilayer barrier films — a material that is hard to run through a press without web breaks or loss of registration.",
    whatTitle: "What we do",
    what: [
      "Our core business is flexographic printing on films for automatic packaging lines, hand wrapping and hot plate wrapping. We print in full-color CMYK with Pantone colors.",
      "We also take care of the artwork: we adapt your file for flexo printing, create designs from scratch and make the printing plates.",
      "Our customers are poultry farms, agricultural holdings, mushroom growers and meat processors. These are companies that value not one-off attractive packaging, but a supplier that performs predictably month after month.",
    ],
    baseTitle: "Production facilities",
    geographyTitle: "Where we supply",
    geography: [
      { title: "Russia", text: "Poultry farms, agricultural holdings, mushroom growers and meat processors" },
      { title: "Republic of Belarus", text: "Regular supplies of printed and clear film" },
      { title: "Uzbekistan", text: "Supplies on an agreed schedule" },
    ],
    audienceTitle: "Who we work for",
    audience: [
      {
        title: "Packaging technologist",
        text: "Cares about machine compatibility, smooth running and no web breaks.",
      },
      {
        title: "Procurement specialist",
        text: "Cares about price per roll, minimum order, and stable, predictable supply.",
      },
      {
        title: "Marketer and brand manager",
        text: "Cares about color accuracy, Pantone colors and shelf recognition.",
      },
      {
        title: "Production director",
        text: "Cares about sales growth through brand recognition and neat packaging.",
      },
    ],
    keyParamsTitle: "Key specifications",
    ctaText: "Send us your run specs — we’ll come back with a quote.",
    cta: "Get a quote",
  },

  contacts: {
    metaTitle: "Contacts",
    metaDescription:
      "Phone, email and production address of Pro-Print LLC. Request a quote for printing on food-grade stretch films.",
    title: "Contact our sales team",
    lede: "Call us or send a request — a manager will clarify your specs and prepare a quote.",
    labels: {
      phone: "Phone",
      email: "Email",
      production: "Production",
      office: "Office",
      schedule: "Business hours",
    },
    requisitesTitle: "Company details",
    requisites: [
      ["Full name", "Limited Liability Company “Pro-Print”"],
      ["INN (Taxpayer ID)", "7805794800"],
      ["OGRN (State Registration No.)", "1227800087239"],
      ["Legal address", "10 Oboronnaya St., letter A, office 209, St. Petersburg, 198095, Russia"],
      [
        "Production address",
        "27 Leningradskaya St., bldg. 1, Tervolovo, Gatchinsky District, Leningrad Region, 188351, Russia",
      ],
      ["General Director", "Nadezhda V. Voroshko"],
    ],
  },

  privacy: {
    metaTitle: "Personal Data Processing Policy",
    metaDescription:
      "Personal data processing policy of Pro-Print LLC in accordance with Russian Federal Law No. 152-FZ.",
    title: "Personal Data Processing Policy",
    lede: "This document describes what data the {legalName} website collects, why it is needed and how to have it deleted. It is provided for information purposes and is subject to review by our legal team.",
    blocks: [
      {
        title: "1. General provisions",
        text: "This policy sets out how {legalName} processes personal data and applies to information the operator may receive about website visitors. Processing is carried out in accordance with Russian Federal Law No. 152-FZ “On Personal Data”.",
      },
      {
        title: "2. What data we collect",
        text: "Through the request form, the operator receives the name, company name, phone number, email address and details of the planned order that the visitor provides voluntarily. The website does not request any other personal data.",
      },
      {
        title: "3. Purposes of processing",
        text: "Data is processed solely to contact the person making the request, prepare a commercial offer and calculate the cost of the run. Data is not used for mailings or advertising messages.",
      },
      {
        title: "4. Disclosure to third parties",
        text: "The operator does not disclose personal data to third parties, except in cases expressly provided for by the legislation of the Russian Federation.",
      },
      {
        title: "5. Retention and withdrawal of consent",
        text: "Data is stored until the purposes of processing are achieved or until consent is withdrawn. To withdraw consent or request deletion of your data, write to {email}.",
      },
      {
        title: "6. Data protection",
        text: "The operator takes the organizational and technical measures necessary to protect personal data from unauthorized access, destruction, alteration and disclosure.",
      },
    ],
  },

  notFound: {
    metaTitle: "Page not found",
    metaDescription: "This page doesn’t exist on the Pro-Print website. Go back to the home page or contact us.",
    title: "Out of register: page not found",
    lede: "There’s nothing at this address — the link is outdated or the address has a typo. Below are the sections people usually come here for.",
    home: "Home page",
    cta: "Get a quote",
    navLabel: "Main sections",
    exits: [
      { label: "Products and materials", href: "/#products" },
      { label: "Specifications", href: "/#specs" },
      { label: "About", href: "/about" },
      { label: "Contacts", href: "/contacts" },
    ],
    helpBefore: "Looking for a specific document or quote? Call ",
    helpOr: " or write to ",
    helpAfter: ".",
  },

  footer: {
    about:
      "Pro-Print LLC. Up to 10-color flexographic printing on food packaging films: stretch, PVC, POF, polyethylene and multilayer barrier films. Our own production in the Leningrad Region, Russia.",
    contactsTitle: "Contacts",
    productionLabel: "Production:",
    legal: { label: "Privacy policy", href: "/privacy" },
    note: "Product images are renderings, pending photography of our production",
  },
};
