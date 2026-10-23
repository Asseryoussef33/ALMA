/* ==========================================================================
   ALMA | data.js
   ALL placeholder content lives here. Edit this file to change what the site
   shows: no need to touch the HTML.

   Images: every item with an `images` array can take real photo paths, e.g.
     images: ['assets/images/minimal-kitchen-1.jpg', 'assets/images/minimal-kitchen-2.jpg']
   When the array is empty, a styled placeholder is drawn instead
   (`tone` picks its colour: warm | wood | stone | dark | marble).
   ========================================================================== */

window.ALMA_DATA = {
  brand: {
    name: 'ALMA',
    tagline: 'The soul of spaces',
    city: 'Alexandria, Egypt',
    phone: '+20 100 000 0000',        // PLACEHOLDER
    email: 'hello@example.com',       // PLACEHOLDER
    hours: 'Sat to Thu, 9:00 to 18:00' // PLACEHOLDER
  },

  /* ------------------------------------------------------------------------
     DEMO AUTH (PLACEHOLDER ONLY)
     These credentials are checked in the browser and are visible to anyone
     who opens this file. Replace with real server-side authentication before
     going live. See README.md > "Replacing the demo login".
     ------------------------------------------------------------------------ */
  auth: {
    users: [
      { username: 'loay',  password: 'alma-demo',  displayName: 'Loay',       role: 'Site Engineer', engineerId: 'loay' },
      { username: 'staff', password: 'alma-staff', displayName: 'ALMA Staff', role: 'Office Staff',  engineerId: null }
    ]
  },

  home: {
    hero: {
      eyebrow: 'Featured',
      title: 'Timeless Finishes for Modern Living',
      subtitle: 'Natural materials. Lasting beauty.',
      tone: 'warm',
      images: [] // e.g. ['assets/images/hero.jpg']
    }
  },

  categories: ['All', 'Living Room', 'Kitchen', 'Bedroom', 'Bathroom'],

  /* ------------------------------------------------------------------------
     SERVICES
     actions: first item is the main button. 'quote' = Request a Quote,
     'visit' = Book a Site Visit, 'video' = Book a Video Consultation.
     link / linkLabel: optional secondary link.
     ------------------------------------------------------------------------ */
  services: [
    {
      group: 'Design',
      icon: 'sparkle',
      items: [
        { id: 'interior-design', name: 'Interior design', icon: 'sofa', actions: ['quote'],
          description: 'Concept, space planning, mood boards and finish selections shaped around how you live or work.' },
        { id: '3d', name: '3D', icon: 'cube', actions: ['quote'],
          description: 'Realistic 3D renders of your space so you can review layout, colours and materials before work starts.' },
        { id: 'shop-drawings', name: 'Shop drawings & CAD plans', icon: 'ruler', actions: ['quote'],
          description: 'CAD plans, elevations, ceiling and electrical layouts, and joinery shop drawings ready for site execution.' },
        { id: 'furniture-layout', name: 'Furniture layout', icon: 'layers', actions: ['quote'],
          description: 'Furniture plans that balance circulation, function and proportion, with sizes and placement for every room.' }
      ]
    },
    {
      group: 'Execution',
      icon: 'hardhat',
      items: [
        { id: 'supervision', name: 'Supervision', icon: 'eye', actions: ['quote', 'visit'],
          description: 'Engineering supervision of your contractor on site: quality checks, schedule follow-up and progress reports.' },
        { id: 'full-execution', name: 'Full Execution', icon: 'hardhat', actions: ['quote', 'visit'],
          description: 'Turnkey finishing from bare walls to handover: civil, MEP, gypsum, flooring, joinery and paint.' },
        { id: 'partial-works', name: 'Partial works', icon: 'tools', actions: ['quote', 'visit'],
          description: 'Selected scopes only, such as a kitchen, a bathroom, flooring, or ceilings and lighting.' }
      ]
    },
    {
      group: 'Other services',
      icon: 'grid',
      items: [
        { id: 'site-inspection', name: 'Site inspection & consultation', icon: 'eye', actions: ['visit'],
          description: 'An engineer inspects your unit and advises on condition, priorities, materials and realistic budgets.' },
        { id: 'site-visit', name: 'Site visit', icon: 'pin', actions: ['visit'],
          description: 'Book a visit to measure, review the space with you and prepare an accurate quotation.' },
        { id: 'handover', name: 'Handover inspection', icon: 'checkSquare', actions: ['visit'],
          description: 'Snag list and quality inspection before you receive your unit from a developer or contractor.' },
        { id: 'video', name: 'Video consultation', icon: 'video', actions: ['video'],
          description: 'A remote call with an engineer to review photos, plans or a design question without a site visit.' },
        { id: 'small-utilities', name: 'Small utilities', icon: 'plug', actions: ['quote'],
          description: 'Small jobs such as plumbing fixes, extra electrical points, paint touch-ups and fixture installation.' },
        { id: 'estimator', name: 'Smart cost estimator', icon: 'calculator', actions: ['quote'], link: '#estimator', linkLabel: 'Try the estimator',
          description: 'A quick budget range for your finishing based on area, finishing level and scope.' },
        { id: 'site-tracker', name: 'Site tracker', icon: 'route', actions: ['quote'], link: 'dashboard.html', linkLabel: 'Staff: open tracker',
          description: 'Follow progress, milestones and site updates for your project in one place.' },
        { id: 'showroom-directory', name: 'Material & showroom directory', icon: 'store', actions: ['quote'],
          description: 'A curated list of suppliers and showrooms for tiles, stone, wood, lighting and fixtures.' },
        { id: 'daily-journal', name: 'Daily Journal', icon: 'book', actions: ['quote'], link: 'reports.html', linkLabel: 'Staff: open journal',
          description: 'A daily site log of activities, manpower and materials, summarised for clients every week.' }
      ]
    }
  ],

  /* Smart cost estimator: PLACEHOLDER rates in EGP per m². Replace with real pricing. */
  estimator: {
    levels: [
      { id: 'standard', label: 'Standard', rate: 6500 },
      { id: 'premium',  label: 'Premium',  rate: 9500 },
      { id: 'luxury',   label: 'Luxury',   rate: 14500 }
    ],
    scopes: [
      { id: 'full',    label: 'Full execution',      factor: 1 },
      { id: 'partial', label: 'Partial works',       factor: 0.55 },
      { id: 'design',  label: 'Design only',         factor: 0.12 }
    ],
    spread: 0.12 // shown as a +/- range
  },

  /* ------------------------------------------------------------------------
     PROJECTS (public portfolio)
     status: 'completed' | 'in-progress'
     price: single figure, OR budgetMin + budgetMax for a range
     ------------------------------------------------------------------------ */
  projects: [
    {
      id: 'modern-living-smouha',
      title: 'Modern Living Room in Smouha',
      type: 'Residential', category: 'Living Room', status: 'completed', featured: true,
      location: 'Smouha, Alexandria', area: 180, price: 1250000, year: 2025, engineerId: 'loay',
      summary: 'Warm tones, natural textures and clean lines create a calm, elegant space.',
      description: 'A full living and reception renovation built around warm neutrals, walnut wall paneling and layered indirect lighting. Clean lines keep the space calm while natural textures add depth and comfort.',
      tags: ['Modern', 'Warm Tones', 'Natural Materials'],
      features: ['Wall Paneling', 'Indirect Lighting', 'Gypsum Ceiling', 'Custom TV Unit'],
      materials: [
        { name: 'Walnut Veneer Panels', swatch: 'walnut' },
        { name: 'Linen Upholstery', swatch: 'linen' },
        { name: 'Porcelain Flooring', swatch: 'porcelain' },
        { name: 'Brushed Brass Accents', swatch: 'brass' }
      ],
      tone: 'warm', galleryCount: 5, images: []
    },
    {
      id: 'minimal-kitchen',
      title: 'Minimal Kitchen Design',
      type: 'Residential', category: 'Kitchen', status: 'completed', featured: true,
      location: 'Alexandria', area: 120, price: 950000, year: 2025, engineerId: 'loay',
      summary: 'Functional elegance with premium finishes and natural wood accents.',
      description: 'A clean and functional kitchen design with natural wood finishes, stone countertops and soft lighting. The space blends simplicity with warmth, creating a modern yet timeless feel.',
      tags: ['Minimal', 'Natural Materials', 'Custom Wood'],
      features: ['Wood Finishes', 'Stone', 'Custom Cabinets', 'Lighting'],
      materials: [
        { name: 'Oak Wood Cabinets', swatch: 'oak' },
        { name: 'Travertine Countertop', swatch: 'travertine' },
        { name: 'Porcelain Flooring', swatch: 'porcelain' },
        { name: 'Matte Black Fixtures', swatch: 'matte-black' }
      ],
      tone: 'wood', galleryCount: 6, images: []
    },
    {
      id: 'serene-bedroom',
      title: 'Serene Master Bedroom',
      type: 'Residential', category: 'Bedroom', status: 'completed', featured: false,
      location: 'Kafr Abdo, Alexandria', area: 45, price: 420000, year: 2025, engineerId: 'nour',
      summary: 'Soft upholstered walls, oak floors and hidden lighting for a quiet retreat.',
      description: 'A master suite designed for rest: an upholstered headboard wall, a walk-in wardrobe in matching oak, and concealed lighting that keeps the room soft in the evening.',
      tags: ['Minimal', 'Warm Tones'],
      features: ['Headboard Wall', 'Walk-in Wardrobe', 'Concealed Lighting'],
      materials: [
        { name: 'Engineered Oak Flooring', swatch: 'oak' },
        { name: 'Linen Wall Fabric', swatch: 'linen' },
        { name: 'Brushed Brass Hardware', swatch: 'brass' }
      ],
      tone: 'stone', galleryCount: 4, images: []
    },
    {
      id: 'marble-bathroom',
      title: 'Marble Guest Bathroom',
      type: 'Residential', category: 'Bathroom', status: 'in-progress', featured: false,
      location: 'Gleem, Alexandria', area: 12, price: 310000, year: 2026, engineerId: 'loay',
      summary: 'Book-matched marble, a floating walnut vanity and brass fixtures.',
      description: 'A compact guest bathroom finished in book-matched marble with a floating walnut vanity, terrazzo floor and brushed brass fixtures. Currently on site.',
      tags: ['Luxury', 'Marble'],
      features: ['Book-matched Marble', 'Floating Vanity', 'Rain Shower'],
      materials: [
        { name: 'Carrara Marble', swatch: 'marble' },
        { name: 'Walnut Vanity', swatch: 'walnut' },
        { name: 'Terrazzo Floor', swatch: 'terrazzo' },
        { name: 'Brushed Brass Fixtures', swatch: 'brass' }
      ],
      tone: 'marble', galleryCount: 3, images: []
    },
    {
      id: 'villa-living-hall',
      title: 'Family Villa Living Hall',
      type: 'Residential', category: 'Living Room', status: 'in-progress', featured: false,
      location: 'King Mariout, Alexandria', area: 260, budgetMin: 1900000, budgetMax: 2300000, year: 2026, engineerId: 'omar',
      summary: 'Double-height hall with marble floors and custom wood wall panels.',
      description: 'A double-height family hall with marble flooring, full-height custom wood paneling and a feature staircase. Demolition is complete and screed works are under way.',
      tags: ['Luxury', 'Marble', 'Custom Wood'],
      features: ['Marble Flooring', 'Wood Paneling', 'Feature Staircase'],
      materials: [
        { name: 'Marble Flooring', swatch: 'marble' },
        { name: 'Walnut Wall Panels', swatch: 'walnut' },
        { name: 'Polished Concrete', swatch: 'concrete' }
      ],
      tone: 'dark', galleryCount: 4, images: []
    },
    {
      id: 'office-pantry',
      title: 'Office Pantry & Lounge',
      type: 'Commercial', category: 'Kitchen', status: 'completed', featured: false,
      location: 'Sporting, Alexandria', area: 60, price: 540000, year: 2025, engineerId: 'nour',
      summary: 'A bright team pantry with durable surfaces and a relaxed lounge corner.',
      description: 'A shared pantry and lounge for an office floor: hard-wearing quartz counters, easy-clean terrazzo flooring and warm lighting for breaks and informal meetings.',
      tags: ['Modern', 'Minimal'],
      features: ['Quartz Counters', 'Lounge Seating', 'Warm Lighting'],
      materials: [
        { name: 'Terrazzo Flooring', swatch: 'terrazzo' },
        { name: 'Oak Veneer', swatch: 'oak' },
        { name: 'Matte Black Fixtures', swatch: 'matte-black' }
      ],
      tone: 'stone', galleryCount: 4, images: []
    }
  ],

  /* ------------------------------------------------------------------------
     ENGINEERS. `sample: true` shows a "Sample profile" badge.
     Loay is named in the references; his figures below are placeholders.
     ------------------------------------------------------------------------ */
  engineers: [
    { id: 'loay', name: 'Loay', role: 'Site Engineer', discipline: 'Interior Finishing', sample: false,
      specialties: ['Interior finishing', 'Site supervision', 'Tiling & stone'], years: 6,
      currentProjects: ['Smouha Apartment', 'Gleem Marble Bathroom', 'Gleem Penthouse'],
      phone: '+20 100 000 0101', email: 'loay@example.com', photo: '',
      bio: 'Placeholder bio: site engineer leading finishing works from handover to final snag list.' },
    { id: 'nour', name: 'Nour A.', role: 'Interior Designer', discipline: 'Design', sample: true,
      specialties: ['Interior design', '3D visualization', 'Furniture layout'], years: 4,
      currentProjects: ['Stanley Kitchen'],
      phone: '+20 100 000 0102', email: 'nour@example.com', photo: '',
      bio: 'Sample profile: designer focused on residential interiors and 3D presentation.' },
    { id: 'omar', name: 'Omar K.', role: 'Project Manager', discipline: 'Execution', sample: true,
      specialties: ['Full execution', 'Joinery coordination', 'Cost control'], years: 9,
      currentProjects: ['King Mariout Villa Hall'],
      phone: '+20 100 000 0103', email: 'omar@example.com', photo: '',
      bio: 'Sample profile: project manager coordinating trades, suppliers and schedules.' },
    { id: 'mariam', name: 'Mariam S.', role: 'MEP Engineer', discipline: 'Electrical & Plumbing', sample: true,
      specialties: ['Electrical & lighting', 'Plumbing', 'Handover inspection'], years: 5,
      currentProjects: [],
      phone: '+20 100 000 0104', email: 'mariam@example.com', photo: '',
      bio: 'Sample profile: MEP engineer covering lighting design, plumbing and handover checks.' }
  ],

  /* ------------------------------------------------------------------------
     OFFICE DIRECTORY. All entries below are SAMPLE listings with example
     contact details. Replace with offices that have asked to be listed.
     ------------------------------------------------------------------------ */
  offices: [
    { id: 'office-a', name: 'Sample Finishing Office A', location: 'Smouha, Alexandria', city: 'Alexandria',
      specialties: ['Residential finishing', 'Gypsum & ceilings'], services: ['Full execution', 'Partial works', 'Painting'],
      phone: '+20 100 000 0201', email: 'office-a@example.com', website: 'https://example.com', sample: true },
    { id: 'office-b', name: 'Sample Interiors Studio B', location: 'Sidi Gaber, Alexandria', city: 'Alexandria',
      specialties: ['Interior design', '3D visualization'], services: ['Interior design', '3D', 'Furniture layout'],
      phone: '+20 100 000 0202', email: 'office-b@example.com', website: 'https://example.com', sample: true },
    { id: 'office-c', name: 'Sample Fit-Out Contractor C', location: 'New Cairo, Cairo', city: 'Cairo',
      specialties: ['Commercial fit-out', 'MEP works'], services: ['Full execution', 'Supervision'],
      phone: '+20 100 000 0203', email: 'office-c@example.com', website: '', sample: true },
    { id: 'office-d', name: 'Sample Design & Build D', location: 'Agami, Alexandria', city: 'Alexandria',
      specialties: ['Villas', 'Joinery'], services: ['Interior design', 'Full execution', 'Custom joinery'],
      phone: '+20 100 000 0204', email: 'office-d@example.com', website: 'https://example.com', sample: true },
    { id: 'office-e', name: 'Sample Stone & Tile Works E', location: 'Miami, Alexandria', city: 'Alexandria',
      specialties: ['Marble & stone', 'Tiling'], services: ['Partial works', 'Stone installation'],
      phone: '+20 100 000 0205', email: 'office-e@example.com', website: '', sample: true },
    { id: 'office-f', name: 'Sample Kitchen Studio F', location: 'Sheikh Zayed, Giza', city: 'Giza',
      specialties: ['Kitchens', 'Joinery'], services: ['Kitchen design', 'Custom joinery'],
      phone: '+20 100 000 0206', email: 'office-f@example.com', website: 'https://example.com', sample: true }
  ],
  officeSpecialties: ['Residential finishing', 'Commercial fit-out', 'Interior design', '3D visualization', 'Joinery', 'Kitchens', 'Marble & stone', 'Tiling', 'Gypsum & ceilings', 'MEP works', 'Villas'],

  /* ------------------------------------------------------------------------
     ENGINEER DASHBOARD (restricted)
     metrics are shown as entered (not calculated) so they match the reference.
     requests.status: 'new' | 'in-progress' | 'completed'
     ------------------------------------------------------------------------ */
  dashboard: {
    metrics: {
      activeSites: 5, activeSitesChange: 2,
      pendingQuotations: 3, urgentQuotations: 2,
      revenue: 482000, revenueChangePct: 18
    },
    requests: [
      { id: 'r1', title: 'Apartment Finishing', type: 'Residential', location: 'Smouha, Alexandria', area: 160,
        budgetMin: 1200000, budgetMax: 1600000, hoursAgo: 2, status: 'new', urgent: true, tone: 'warm',
        description: 'Modern, warm and minimal style. Looking for full interior finishing (living, kitchen, bedrooms).',
        tags: ['Modern', 'Warm Tones', 'Minimal', 'Natural Materials'] },
      { id: 'r2', title: 'Villa Finishing', type: 'Residential', location: 'Sidi Bishr, Alexandria', area: 350,
        budgetMin: 2500000, budgetMax: 3500000, hoursAgo: 6, status: 'new', urgent: true, tone: 'wood',
        description: 'High-end finishing with modern aesthetic. Open kitchen, marble, custom woodwork.',
        tags: ['Luxury', 'Modern', 'Natural', 'Custom Wood'] },
      { id: 'r3', title: 'Townhouse Finishing', type: 'Residential', location: 'Alexandria Gate', area: 220,
        budgetMin: 1800000, budgetMax: 2400000, hoursAgo: 24, status: 'new', urgent: false, tone: 'stone',
        description: 'Contemporary design with natural materials and warm color palette.',
        tags: ['Contemporary', 'Natural', 'Warm Tones'] },
      { id: 'r4', title: 'Clinic Reception Fit-out', type: 'Commercial', location: 'Roushdy, Alexandria', area: 90,
        budgetMin: 600000, budgetMax: 800000, hoursAgo: 30, status: 'new', urgent: false, tone: 'marble',
        description: 'Reception, waiting area and two consultation rooms. Easy-clean, calm and bright.',
        tags: ['Minimal', 'Modern'] },
      { id: 'r5', title: 'Kitchen Renovation', type: 'Residential', location: 'Stanley, Alexandria', area: 35,
        budgetMin: 350000, budgetMax: 450000, hoursAgo: 120, status: 'in-progress', stage: 'On site', siteId: 's4', tone: 'wood',
        description: 'Full kitchen replacement with quartz counters and new lighting.',
        tags: ['Modern', 'Custom Wood'] },
      { id: 'r6', title: 'Penthouse Finishing', type: 'Residential', location: 'Gleem, Alexandria', area: 240,
        budgetMin: 2200000, budgetMax: 2900000, hoursAgo: 200, status: 'in-progress', stage: 'On site', siteId: 's5', tone: 'dark',
        description: 'Full finishing for a sea-view penthouse with a large terrace.',
        tags: ['Luxury', 'Marble'] },
      { id: 'r7', title: 'Studio Apartment', type: 'Residential', location: 'Miami, Alexandria', area: 70,
        budgetMin: 500000, budgetMax: 650000, hoursAgo: 900, status: 'completed', stage: 'Handed over', tone: 'stone',
        description: 'Compact studio refresh: flooring, kitchenette and bathroom.',
        tags: ['Minimal', 'Warm Tones'] }
    ],
    messages: [
      { id: 'm1', from: 'Client (sample)', subject: 'Question about the villa proposal', date: '2026-10-22 10:15',
        body: 'Placeholder message: could we review the marble options before you send the final proposal?' },
      { id: 'm2', from: 'Supplier (sample)', subject: 'Porcelain delivery for Smouha', date: '2026-10-21 16:40',
        body: 'Placeholder message: the remaining 60x120 porcelain tiles are ready for delivery on Sunday.' }
    ]
  },

  /* ------------------------------------------------------------------------
     SITES & DAILY JOURNAL (restricted reports)
     Weeks run Saturday to Friday. revenue = payment received that day (EGP).
     materials.cost = line total in EGP.
     ------------------------------------------------------------------------ */
  sites: [
    { id: 's1', name: 'Smouha Apartment',        location: 'Smouha, Alexandria',       engineerId: 'loay' },
    { id: 's2', name: 'Gleem Marble Bathroom',   location: 'Gleem, Alexandria',        engineerId: 'loay', projectId: 'marble-bathroom' },
    { id: 's3', name: 'King Mariout Villa Hall', location: 'King Mariout, Alexandria', engineerId: 'omar', projectId: 'villa-living-hall' },
    { id: 's4', name: 'Stanley Kitchen',         location: 'Stanley, Alexandria',      engineerId: 'nour' },
    { id: 's5', name: 'Gleem Penthouse',         location: 'Gleem, Alexandria',        engineerId: 'loay' }
  ],

  journal: [
    { id: 'j1', date: '2026-10-10', siteId: 's1', progress: 32, workers: 6, revenue: 0,
      activities: 'Gypsum board ceiling framing in living room and corridor.',
      materials: [ { name: 'Gypsum board 12.5 mm', qty: 40, unit: 'sheet', cost: 9200 }, { name: 'Metal studs & tracks', qty: 120, unit: 'm', cost: 5400 } ], issues: '' },
    { id: 'j2', date: '2026-10-11', siteId: 's2', progress: 60, workers: 3, revenue: 120000,
      activities: 'Marble slabs delivered and inspected; book-match layout approved by client.',
      materials: [ { name: 'Carrara marble slab', qty: 4, unit: 'slab', cost: 96000 } ], issues: '' },
    { id: 'j3', date: '2026-10-12', siteId: 's1', progress: 36, workers: 7, revenue: 150000,
      activities: 'Ceiling boarding completed in living room; conduits for indirect lighting.',
      materials: [ { name: 'Electrical conduit 20 mm', qty: 150, unit: 'm', cost: 2250 } ], issues: '' },
    { id: 'j4', date: '2026-10-12', siteId: 's3', progress: 18, workers: 9, revenue: 0,
      activities: 'Removal of old ceiling finishes and debris.',
      materials: [], issues: 'Two truckloads of debris removed; access road blocked for one hour.' },
    { id: 'j5', date: '2026-10-13', siteId: 's2', progress: 68, workers: 3, revenue: 0,
      activities: 'Wall marble installation in the shower zone.',
      materials: [ { name: 'Marble adhesive', qty: 6, unit: 'bag', cost: 2100 } ], issues: '' },
    { id: 'j6', date: '2026-10-14', siteId: 's1', progress: 41, workers: 6, revenue: 0,
      activities: 'Wall plastering in bedrooms 1 and 2.',
      materials: [ { name: 'Cement plaster', qty: 35, unit: 'bag', cost: 5600 }, { name: 'Sand', qty: 3, unit: 'm³', cost: 1800 } ],
      issues: 'Water supply interrupted for 2 hours; plastering resumed after.' },
    { id: 'j7', date: '2026-10-15', siteId: 's1', progress: 45, workers: 5, revenue: 0,
      activities: 'Bathroom waterproofing and flood test started.',
      materials: [ { name: 'Cementitious waterproofing', qty: 6, unit: 'pail', cost: 7200 } ], issues: '' },
    { id: 'j8', date: '2026-10-16', siteId: 's3', progress: 24, workers: 8, revenue: 300000,
      activities: 'Levelling screed for marble flooring.',
      materials: [ { name: 'Cement', qty: 40, unit: 'bag', cost: 6400 }, { name: 'Sand', qty: 6, unit: 'm³', cost: 3600 } ], issues: '' },
    { id: 'j9', date: '2026-10-17', siteId: 's2', progress: 76, workers: 4, revenue: 0,
      activities: 'Terrazzo floor laid and cured; vanity wall prepared.',
      materials: [ { name: 'Terrazzo tiles', qty: 9, unit: 'm²', cost: 10800 } ],
      issues: 'One marble piece chipped at a corner; replacement cut ordered.' },
    { id: 'j10', date: '2026-10-17', siteId: 's4', progress: 40, workers: 4, revenue: 60000,
      activities: 'Kitchen cabinet carcasses installed.',
      materials: [ { name: 'Kitchen carcasses (MDF)', qty: 1, unit: 'lot', cost: 42000 } ], issues: '' },
    { id: 'j11', date: '2026-10-18', siteId: 's1', progress: 49, workers: 7, revenue: 0,
      activities: 'Porcelain floor tiling started in living room (60x120).',
      materials: [ { name: 'Porcelain tiles 60x120', qty: 48, unit: 'm²', cost: 33600 }, { name: 'Tile adhesive', qty: 20, unit: 'bag', cost: 4400 } ], issues: '' },
    { id: 'j12', date: '2026-10-19', siteId: 's1', progress: 53, workers: 7, revenue: 0,
      activities: 'Living room tiling 70% complete; skirting cut list prepared.',
      materials: [ { name: 'Porcelain tiles 60x120', qty: 36, unit: 'm²', cost: 25200 } ], issues: '' },
    { id: 'j13', date: '2026-10-19', siteId: 's3', progress: 30, workers: 10, revenue: 0,
      activities: 'Measurements for custom wood wall panels; joinery shop drawings issued.',
      materials: [], issues: '' },
    { id: 'j14', date: '2026-10-20', siteId: 's2', progress: 85, workers: 3, revenue: 90000,
      activities: 'Floating walnut vanity installed; brass fixtures first fix.',
      materials: [ { name: 'Brushed brass mixer set', qty: 1, unit: 'set', cost: 18500 } ], issues: '' },
    { id: 'j15', date: '2026-10-21', siteId: 's1', progress: 58, workers: 6, revenue: 200000,
      activities: 'Kitchen wall tiling and grouting in living room.',
      materials: [ { name: 'Ceramic wall tiles', qty: 18, unit: 'm²', cost: 6300 }, { name: 'Grout', qty: 8, unit: 'bag', cost: 960 } ], issues: '' },
    { id: 'j16', date: '2026-10-22', siteId: 's4', progress: 55, workers: 4, revenue: 0,
      activities: 'Quartz countertop template taken; backsplash preparation.',
      materials: [], issues: '' },
    { id: 'j17', date: '2026-10-22', siteId: 's5', progress: 8, workers: 5, revenue: 250000,
      activities: 'Site received for finishing; condition survey and photo record.',
      materials: [], issues: '' }
  ]
};
