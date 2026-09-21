import type { Content } from "./index";
import type { DocBlock } from "./ru";

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
    fullName: "Limited Liability Company “Pro-Print”",
    schedule: "Mon–Fri, 09:00–18:00 Moscow time (UTC+3)",
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
        alt: "Tray of tomatoes wrapped in printed film with red and green artwork around the edges, leaves, icons and a clear window",
        caption: "Tomatoes: rich red and green around the edges and a clear window in the middle — the product is visible, the brand is recognizable.",
      },
      {
        key: "mushrooms",
        src: "/examples/mushrooms.webp",
        alt: "Tray of button mushrooms wrapped in printed film with the product name, photographic mushrooms, parsley and icons",
        caption: "Mushrooms: soft color transitions, photographic artwork and the small type of the icons stay crisp.",
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
    details: "Add details",
    detailsHint: "Optional: volume, packaging machine, artwork, comment",
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
    consentBefore: "I give my ",
    consentLink: "consent to the processing of personal data",
    consentMiddle: " in accordance with the ",
    consentPolicyLink: "personal data processing policy",
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
    title: "We print on thin food films where most manufacturers say “we can’t take that on”",
    lede: "Pro-Print LLC is a manufacturing company with its own 10-color flexographic press. We print on food packaging films from 8 microns thick — stretch, PVC, POF, polyethylene and multilayer barrier films — a material that is hard to run through a press without web breaks or loss of registration.",
    whatTitle: "What we do",
    what: [
      "Our core business is flexographic printing on films for automatic packaging lines, hand wrapping and hot plate wrapping. We print in full-color CMYK with Pantone colors.",
      "We also take care of the artwork: we adapt your file for flexo printing, create designs from scratch and make the printing plates.",
      "Our customers are poultry farms, agricultural holdings, mushroom growers and meat processors. These are companies that value not one-off attractive packaging, but a supplier that performs predictably month after month.",
    ],
    photo: {
      alt: "Pro-Print production site: a building with the PRO-PRINT sign, a gatehouse and flags at the entrance",
      title: "Our own site",
      text: "Press, quality control, warehouse and office in the Leningrad Region",
    },
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
      "Phone, email and office address of Pro-Print LLC. Request a quote for printing on food-grade stretch films.",
    title: "Contact our sales team",
    lede: "Call us or send a request — a manager will clarify your specs and prepare a quote.",
    labels: {
      phone: "Phone",
      email: "Email",
      office: "Office",
      schedule: "Business hours",
    },
    requisitesTitle: "Company details",
    requisites: [
      ["Full name", "Limited Liability Company “Pro-Print”"],
      ["INN (Taxpayer ID)", "7805794800"],
      ["OGRN (State Registration No.)", "1227800087239"],
      ["Legal address", "10 Oboronnaya St., letter A, office 209, St. Petersburg, 198095, Russia"],
      ["General Director", "Nadezhda V. Voroshko"],
    ],
  },

  privacy: {
    metaTitle: "Personal Data Processing Policy",
    metaDescription:
      "Pro-Print LLC policy on personal data processing: purposes, data categories, retention periods, user rights and security measures under Russian Federal Law No. 152-FZ.",
    title: "Personal Data Processing Policy",
    lede: "How {legalName} processes and protects the personal data it receives through {site}.",
    version: "Version of 17 September 2026",
    translationNote:
      "This is a translation provided for convenience. The Russian version of this document prevails.",
    blocks: [
      {
        title: "1. General provisions",
        paras: [
          "This policy sets out the procedure and conditions for processing personal data at {fullName} (the Operator) and the measures taken to protect it. It is issued pursuant to Part 2 of Article 18.1 of Russian Federal Law No. 152-FZ of 27 July 2006 “On Personal Data” (the Personal Data Law) and applies to all personal data the Operator receives through {site}.",
          "The policy is publicly available: a link to it is placed next to the request form and in the footer of every page.",
        ],
      },
      {
        title: "2. Operator details",
        paras: [
          "{fullName}, INN {inn}, KPP {kpp}, OGRN {ogrn}. Registered address: office 209, 10A Oboronnaya St., Saint Petersburg, 198095, Russia. Phone: {phone}, email: {email}.",
          "The person responsible for organizing personal data processing is the General Director, Nadezhda V. Voroshko.",
        ],
      },
      {
        title: "3. Definitions",
        list: [
          "Personal data — any information relating directly or indirectly to an identified or identifiable individual (data subject).",
          "Processing of personal data — any operation or set of operations performed on personal data, whether or not by automated means.",
          "User — any person visiting {site}.",
          "Cookie — a small piece of data a website stores in the user’s browser; for the purposes of this policy, browser local storage (localStorage) is treated as a cookie.",
        ],
      },
      {
        title: "4. Legal grounds for processing",
        list: [
          "the data subject’s consent (Clause 1, Part 1, Article 6 of the Personal Data Law), given separately from other documents when submitting a request;",
          "the need to conclude and perform a contract to which the data subject is a party (Clause 5, Part 1, Article 6 of the Personal Data Law);",
          "the Civil Code of the Russian Federation, Federal Law No. 149-FZ of 27 July 2006 “On Information, Information Technologies and Protection of Information” and Federal Law No. 402-FZ of 6 December 2011 “On Accounting”.",
        ],
      },
      {
        title: "5. Purposes, data subjects and data categories",
        paras: [
          "The Operator processes only the data required for the stated purpose and does not collect excessive information.",
        ],
        list: [
          "Handling requests and contacting the person who submitted them: a call or email, cost calculation and a commercial offer. Data subjects: website users, including representatives of organizations. Data: name, company name, phone number, email address, order details from the optional form fields (volume and parameters, packaging machine model, artwork link, comment), and the IP address, date and time of submission and browser details — to evidence that consent was obtained.",
          "Concluding and performing a contract where an agreement is reached. Data subjects: client representatives. Data: the data listed above and the data needed to execute the contract.",
          "Ensuring the website works and is secure. Data subjects: website users. Data: IP address, date and time of the request, page address, browser and device details, and the choice made in the cookie notice.",
        ],
        after: [
          "The Operator does not process special categories of personal data or biometric data and makes no decisions producing legal effects for users based solely on automated processing. The website is intended for businesses and is not directed at persons under 18.",
        ],
      },
      {
        title: "6. Processing procedure and conditions",
        list: [
          "Operations: collection, recording, systematization, accumulation, storage, clarification (updating, modification), retrieval, use, transfer (provision, access), blocking, deletion and destruction.",
          "Processing method: mixed, with and without automation, with transfer over the Internet.",
          "Recording, systematization, accumulation, storage, clarification and retrieval of personal data of Russian citizens are carried out using databases located in the Russian Federation (Part 5, Article 18 of the Personal Data Law).",
          "Personal data is not transferred across borders and is not made public.",
          "The Operator entrusts processing (Part 3, Article 6 of the Personal Data Law) to TIMEWEB.CLOUD LLC (INN {timewebInn}; office 605, 7 Universitetskaya St., Innopolis, Republic of Tatarstan, 420500, Russia) for website hosting on servers in Russia, and to YANDEX LLC (INN {yandexInn}; 16 Lva Tolstogo St., Moscow, 119021, Russia) for the email service through which website requests reach the Operator. These parties are required to keep the data confidential and secure.",
          "Data is disclosed to other parties only where required by Russian law, for example at the request of a court or competent public authorities.",
          "The Operator and anyone given access to the data shall not disclose or distribute it without the data subject’s consent unless otherwise provided by federal law (Article 7 of the Personal Data Law).",
        ],
      },
      {
        title: "7. Retention and destruction",
        list: [
          "Request data is processed until the purposes are achieved, but no longer than three years from the last contact if no contract has been concluded.",
          "If a contract is concluded — for its term and the document retention periods required by Russian law.",
          "Once the purposes are achieved, the period expires or consent is withdrawn, the Operator stops processing and destroys the data within 30 days unless otherwise provided by contract or federal law (Parts 4 and 5, Article 21 of the Personal Data Law). If destruction within this period is not possible, the Operator blocks the data and destroys it within six months (Part 6, Article 21).",
          "Destruction is documented in accordance with Roskomnadzor Order No. 179 of 28 October 2022.",
        ],
      },
      {
        title: "8. User rights",
        paras: ["Users have the right to:"],
        list: [
          "obtain information about the processing of their personal data (Article 14 of the Personal Data Law);",
          "demand that their data be clarified, blocked or destroyed if it is incomplete, outdated, inaccurate, unlawfully obtained or not necessary for the stated purpose;",
          "withdraw consent to processing at any time;",
          "appeal the Operator’s actions or omissions to Roskomnadzor (the Russian data protection authority) or in court.",
        ],
        after: [
          "Requests and withdrawals of consent can be sent to {email} or by post to the Operator’s registered address. A request must contain information identifying the sender and confirming their dealings with the Operator, such as the date of the request and the phone number given in it (Part 3, Article 14). The Operator may ask for additional information to verify identity.",
          "The Operator responds within 10 business days of receipt. This period may be extended by no more than 5 business days with a reasoned notice.",
        ],
      },
      {
        title: "9. Data protection",
        paras: [
          "The Operator takes the legal, organizational and technical measures required by Articles 18.1 and 19 of the Personal Data Law:",
        ],
        list: [
          "appoints a person responsible for organizing data processing and adopts internal policies on data processing and protection;",
          "grants access to data only to employees who need it for their duties and informs them of the legal requirements;",
          "transmits data from the website over an encrypted connection (HTTPS) and restricts access to email and servers with passwords;",
          "assesses potential harm to data subjects in accordance with Roskomnadzor Order No. 178 of 27 October 2022 and carries out internal control;",
          "notifies Roskomnadzor of any unlawful or accidental transfer of personal data within 24 hours, and of the results of the internal investigation within 72 hours (Part 3.1, Article 21 of the Personal Data Law).",
        ],
      },
      {
        title: "10. Cookies",
        paras: [
          "The website stores only strictly necessary data in the browser. Analytics and advertising cookies are not used; if introduced, they will only run with the user’s permission. The list and how to change your choice are in the cookies section of the legal information page.",
        ],
        link: { label: "Cookies and browser storage", href: "/legal#cookies" },
      },
      {
        title: "11. Final provisions",
        paras: [
          "The Operator may amend this policy. A new version takes effect once published on the website unless stated otherwise. The current version is always available on this page.",
          "Questions about personal data processing: {email} or {phone}.",
        ],
      },
    ] as DocBlock[],
  },

  legal: {
    metaTitle: "Legal information",
    metaDescription:
      "Website owner details for pro-print.pro, consent to personal data processing and use of cookies.",
    title: "Legal information",
    lede: "Who owns this website, on what terms we process data from requests and what the website stores in your browser.",
    version: "Version of 17 September 2026",
    translationNote:
      "This is a translation provided for convenience. The Russian version of these documents prevails.",
    tocLabel: "On this page",
    operator: {
      title: "Website owner and personal data operator",
      text: "{site} is owned by {fullName}. The company is the operator of the personal data users submit through the website.",
      rows: [
        ["Full name", "{fullName}"],
        ["Short name", "{legalName}"],
        ["INN / KPP", "{inn} / {kpp}"],
        ["OGRN", "{ogrn}"],
        ["Registered address", "Office 209, 10A Oboronnaya St., Saint Petersburg, 198095, Russia"],
        ["General Director", "Nadezhda V. Voroshko"],
        ["Responsible for personal data processing", "General Director Nadezhda V. Voroshko"],
        ["Phone", "{phone}"],
        ["Email", "{email}"],
      ] as [string, string][],
    },
    consent: {
      title: "Consent to personal data processing",
      intro:
        "By ticking the consent box in the request form on {site} and submitting the request, I freely, of my own will and in my own interest give {fullName} (INN {inn}, OGRN {ogrn}, address: office 209, 10A Oboronnaya St., Saint Petersburg, 198095, Russia; the Operator) specific, informed, conscious and unambiguous consent to the processing of my personal data on the following terms.",
      items: [
        "Purpose: reviewing my request, contacting me by phone and email, calculating the cost and preparing a commercial offer and, if an agreement is reached, concluding and performing a contract.",
        "Data: name; company name; phone number; email address; order details I enter in the form (volume and parameters, packaging machine model, artwork link, comment); the IP address, date and time of submission and browser details — to evidence that consent was obtained.",
        "Operations: collection, recording, systematization, accumulation, storage, clarification (updating, modification), retrieval, use, transfer (provision, access) to the parties listed in item 5, blocking, deletion and destruction. Processing method: mixed, with transfer over the Internet.",
        "The data is stored in databases located in the Russian Federation. It is not transferred across borders or made public.",
        "Processing on the Operator’s behalf is carried out by TIMEWEB.CLOUD LLC (INN {timewebInn}; office 605, 7 Universitetskaya St., Innopolis, Republic of Tatarstan, 420500, Russia) — website hosting; and YANDEX LLC (INN {yandexInn}; 16 Lva Tolstogo St., Moscow, 119021, Russia) — the email service through which the request reaches the Operator.",
        "Term: until the purposes of processing are achieved, but no longer than three years from the date of the request, or until consent is withdrawn. If a contract is concluded, data is processed for its term and the document retention periods required by law.",
        "I may withdraw consent at any time by writing to {email} or to the Operator’s registered address. The Operator stops processing and destroys the data within 30 days of receiving the withdrawal, except where federal law permits processing to continue without consent.",
        "I confirm that I have read the Personal Data Processing Policy and my rights as a data subject (Article 14 of Federal Law No. 152-FZ), and that I provide another person’s data only with their consent.",
      ],
      policyBefore: "Processing terms are described in detail in the ",
      policyLink: "personal data processing policy",
      policyAfter: ".",
    },
    cookies: {
      title: "Cookies and browser storage",
      paras: [
        "Cookies are small pieces of data a website stores in your browser. Browser local storage (localStorage) works in a similar way.",
        "At present the website uses only strictly necessary storage — without it, your choice in the cookie notice cannot be remembered. This data stays in your browser and is not sent to the Operator or third parties.",
      ],
      table: {
        headers: ["Name", "Stored in", "Purpose", "Duration"],
        rows: [["pp-consent", "localStorage", "Your cookie notice choice and its date", "12 months"]] as string[][],
      },
      after: [
        "The website does not use analytics or advertising cookies. If the Operator adds a web analytics service, it will only run after you allow it in the cookie notice, and this section will list the services used.",
        "Each time you visit the website, the hosting provider’s server automatically receives your IP address, the date and time of the request, the page address and browser details. This is needed to deliver pages and protect the website from attacks.",
        "You can change your choice with the button below and delete stored data in your browser settings.",
      ],
      settings: "Change my choice",
    },
    documents: {
      title: "Documents",
      links: [
        { label: "Personal data processing policy", href: "/privacy" },
        { label: "Contacts and company details", href: "/contacts" },
      ],
    },
  },

  cookieBanner: {
    title: "Cookies and personal data",
    textBefore:
      "This website stores only what it needs to work in your browser. Analytics will run only if you allow it. Learn more in our ",
    legalLink: "legal information",
    textMiddle: " and ",
    policyLink: "privacy policy",
    textAfter: ".",
    accept: "Allow all",
    necessary: "Necessary only",
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
    links: [
      { label: "Legal information", href: "/legal" },
      { label: "Privacy policy", href: "/privacy" },
    ],
    note: "Product images are renderings, pending photography of our production",
  },
};
