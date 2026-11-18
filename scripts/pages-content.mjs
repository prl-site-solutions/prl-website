// Content for the service and sector pages. Built into /<slug>/index.html by
// scripts/build-pages.mjs — edit here, then run `node scripts/build-pages.mjs`.
//
// Every factual claim here must be something PRL can stand behind: the homepage,
// llms.txt, or roles PRL has actually advertised on CV-Library. No invented
// clients, numbers or case studies.

export const COMMON_CHECKS = [
  ['CSCS verified', 'every operative holds a valid CSCS card, or the right scheme card for their trade (ECS for electricians, CPCS or NPORS for plant).'],
  ['Right to work checked', 'before anyone is placed, with documents held on file.'],
  ['Tickets and qualifications checked', 'coding certificates, SMSTS/SSSTS, NEBOSH, CCNSG and other site tickets, with expiry dates tracked in PRISM.'],
  ['Drug and alcohol testing', 'programme in operation.'],
  ['IR35 compliant', 'across all our contractor engagements.'],
  ['ISO 9001:2015 certified', 'quality management, plus Cyber Essentials for how we handle your data.'],
];

export const STEPS = [
  ['Tell us what you need', 'Use the form or call 0800 772 3959. Trades, numbers, site, start date and any site-specific tickets.'],
  ['We put forward checked people', 'We match from our pool of 320+ active contractors. Everyone is compliance-checked before they go, and in most cases they can be on site within 24 hours.'],
  ['On site, and we stay involved', 'We appoint a project manager to each customer\'s site and visit regularly to check our workforce are OK and being treated properly. Timesheets and documents run through our PRISM app.'],
];

// Case studies — /case-studies/<slug>/. Headcounts come from PRISM placement
// records (read-only aggregate query, 2026-09-26); project facts from PRL's 2026
// company profile. Update the figures by re-running that query, not by guessing.
export const CASE_STUDIES = [
  {
    slug: 'protos-energy-park-ince',
    title: 'Case Study: 420+ Workers for Protos Energy Park, Ince Marsh | PRL',
    description: 'How PRL Site Solutions placed 420+ electricians, labourers, fire watch, plant and mechanical staff for Metlen at Protos Energy Park, Ince Marsh, Cheshire.',
    h1: 'Staffing Protos Energy Park at Ince Marsh: 420+ workers placed',
    lede: 'Energy-from-waste with carbon capture at Ince Marsh, Cheshire. PRL has placed more than 420 people across electrical, mechanical, civils, plant and fire watch roles, on days and nights.',
    image: ['/assets/case-studies/protos-ince-marsh.jpg', 1400, 423, 'Aerial view of the Protos Energy Park construction site at Ince Marsh, Cheshire'],
    imageSmall: ['/assets/case-studies/protos-ince-marsh-700.jpg', 700, 212],
    meta: [['Client', 'Metlen'], ['Site', 'Ince Marsh, Cheshire'], ['Sector', 'Energy-from-waste'], ['Since', 'March 2026, ongoing']],
    glance: [['420+', 'workers placed'], ['250+', 'on site today'], ['Day & night', 'shifts covered'], ['16 wks', 'typical placement']],
    sections: [
      ['The project', [
        'Protos Energy Park at Ince Marsh, Cheshire is home to an energy-from-waste plant, a joint venture by Encyclis and Biffa, processing 500,000 tonnes of non-recyclable waste a year into 49.9MW of electricity.',
        'A full-scale carbon capture facility is being added, one of the first in the UK integrated with an energy-from-waste plant. It is designed to capture around 370,000 tonnes of CO₂ a year for storage in depleted Liverpool Bay gas fields via the HyNet pipeline.',
      ]],
      ['The challenge', [
        'An energy-from-waste build is one of the most labour-intensive jobs in UK construction, and the demand changes as it moves from civils into a large electrical and mechanical installation. The site needed a supplier who could put large numbers of compliance-checked people on site quickly, across many trades and on day and night shifts, and keep it going for months.',
      ]],
    ],
    supplied: {
      intro: 'Placements for Metlen at Ince Marsh, by trade (people with a recorded role):',
      rows: [
        ['Electrical', '118', 'Electricians, approved electricians, testers, improvers and electrical supervisors'],
        ['Labour', '64', 'General and skilled labourers, days and nights'],
        ['Fire watch', '44', 'Day and night fire watch covering hot works across the site'],
        ['Plant, lifting and banksmen', '30', 'Telehandler drivers, slingers, banksmen, riggers and gantry operators'],
        ['Mechanical, piping and welding', '27', 'Pipefitters, pipefitter mates, welders and plater fabricators'],
        ['Supervision and HSE', '12', 'Site supervisors, HSE and H&S advisors, QA/QC'],
        ['Civils', '11', 'Groundworkers, groundworks supervisors and setting-out'],
        ['Other trades and support', '15+', 'Joiners, painters, scaffolders, rope access, storemen, traffic marshals and site admin'],
      ],
    },
    how: [
      ['Checked before day one', 'Every worker\'s CSCS card, right to work and trade tickets were checked in PRISM before their first shift, with expiry dates tracked for the whole placement.'],
      ['Scale without the paperwork', 'Hundreds of starts and finishes managed in one system, with timesheets, documents and assignments in the contractor app.'],
      ['A project manager on site', 'A PRL project manager assigned to the site, plus regular visits to check our workforce are OK and being treated properly.'],
    ],
    also: 'Alongside Ince Marsh, PRL has supplied 37 people to Carey\'s on the Protos Carbon Capture works, mainly civils, plant and banksmen on short, fast-turnaround packages.',
    related: ['energy-from-waste-recruitment', 'mechanical-electrical-recruitment', 'construction-labour-supply'],
  },
  {
    slug: 'kelvin-energy-from-waste-sandwell',
    title: 'Case Study: Civils on the Kelvin EfW Plant, Sandwell | PRL Site Solutions',
    description: 'PRL Site Solutions delivered foundational civils on the £500m Kelvin energy-from-waste plant in Sandwell: process drainage, service ducts, pits and troughs.',
    h1: 'Foundational civils for the Kelvin energy-from-waste plant, Sandwell',
    lede: 'On the £500m Kelvin EfW facility in the West Midlands, PRL delivered the underground and foundational civils the rest of the plant is built on.',
    image: ['/assets/case-studies/kelvin-sandwell.jpg', 600, 338, 'The Kelvin energy-from-waste plant under construction beside the motorway in Sandwell'],
    meta: [['Project', 'Acciona Kelvin Project'], ['Site', 'Sandwell, West Midlands'], ['Sector', 'Energy-from-waste'], ['Scope', 'Foundational civils']],
    glance: [['£500m', 'facility'], ['395,000 t', 'waste a year'], ['44MW', 'baseload power'], ['95,000+', 'homes powered']],
    sections: [
      ['The project', [
        'The Kelvin Energy-from-Waste facility is a £500 million green infrastructure development in Sandwell, West Midlands. It was granted planning consent in September 2019 and acquired from developer Verus Energy in 2021.',
        'The plant is designed to process 395,000 tonnes of non-recyclable household and business waste a year, turning waste that would otherwise go to landfill or export into 44MW of baseload electricity, enough for more than 95,000 homes and businesses.',
      ]],
      ['Our scope', [
        'An energy recovery facility has to withstand extreme industrial demands, and that starts below ground. PRL was trusted with foundational civils and essential infrastructure on the Acciona Kelvin Project, deploying experienced civils teams on:',
      ]],
    ],
    scope: [
      ['Process drainage systems', 'High-performance systems to safely manage complex industrial run-off.'],
      ['Service ducts and ancillary structures', 'Containment networks protecting the facility\'s cabling and utility connections.'],
      ['Pits and troughs', 'Heavily reinforced concrete structures supporting heavy machinery and plant operations.'],
    ],
    result: 'With experienced teams and rigorous safety standards, PRL delivered the underground network and structural foundations, laying the groundwork for a facility that will help drive the West Midlands towards net zero.',
    related: ['energy-from-waste-recruitment', 'construction-labour-supply', 'skilled-trades-recruitment'],
  },
];

export const PAGES = [
  // ───────────────────────────── SERVICES ─────────────────────────────
  {
    slug: 'skilled-trades-recruitment',
    kind: 'service',
    nav: 'Skilled Trades',
    title: 'Skilled Trades Recruitment Agency | Welders, Platers, Electricians | PRL',
    description: 'Coded welders, platers, steel fixers, electricians and fitters for UK construction and industrial sites. Cards and tickets checked, on site in 24 hours.',
    h1: 'Skilled trades recruitment for construction and industrial sites',
    lede: 'Coded welders, platers, steel fixers, electricians and fitters, checked for cards, tickets and right to work before they arrive. Short packages or long contracts, anywhere in the UK.',
    facts: ['CSCS / ECS carded', 'Coding certificates checked', 'On site in 24 hours in most cases'],
    rolesIntro: 'The trades we place most often. If your trade isn\'t listed, ask anyway.',
    roles: [
      ['Coded welders', 'TIG (141), MIG (135) and MMA (111) on carbon and stainless steel, pipe and plate, up to 6G. In-date coding certificates checked, and a site weld test arranged if you need one.'],
      ['Platers and fabricators', 'Marking out, cutting, forming and fit-up of platework and structural steel from engineering drawings, in the workshop or on site.'],
      ['Steel fixers', 'Heavy reinforced concrete as well as mesh, reading bending schedules and RC drawings. Blue CSCS, NVQ Level 2.'],
      ['Electricians', 'ECS-carded electricians, plus testers and inspectors holding 2391/2394/2395 for testing to BS 7671.'],
      ['Mechanical fitters and pipefitters', 'Installation and fit-up on industrial and process projects, working to isometrics and weld maps.'],
      ['Joiners, carpenters and plumbers', 'For new build, fit-out and site works.'],
    ],
    body: [
      'Most of the trades we place work on heavy industrial and construction projects: energy-from-waste plants, fabrication workshops, docks and factory new builds. Recent adverts have included coded TIG welders at Tilbury Docks in Essex, platers for a fabrication workshop in Cheshire and steel fixers on an energy-from-waste new build at Ince.',
      'Tell us the exact requirement (weld process and position, card type, the tickets the site insists on) and we only put forward people who meet it. You won\'t get CVs that miss the brief.',
    ],
    faqs: [
      ['Can you supply coded welders?', 'Yes. We recruit TIG, MIG and MMA welders, including coded welders for pipe and plate. Tell us the process, material and position (for example 141 TIG root with 111 MMA fill and cap on carbon and stainless, 6G) and we only put forward welders with in-date coding certificates for it. A site weld test can be arranged before they start.'],
      ['What cards and tickets do your tradespeople hold?', 'Every operative holds a valid CSCS card or the right scheme card for their trade, such as ECS for electricians. We check trade qualifications, coding certificates and site tickets like CCNSG before placement, and PRISM tracks expiry dates so nobody arrives with a lapsed card.'],
      ['How quickly can you get tradespeople on site?', 'In most cases within 24 hours of confirming the requirement. Hard-to-find trades or unusual ticket combinations can take longer, and we\'ll tell you straight away if that\'s the case.'],
      ['Do you supply for short jobs as well as long contracts?', 'Yes. Recent placements have run from three-week packages to contracts of six to twelve months.'],
    ],
    related: ['construction-labour-supply', 'energy-from-waste-recruitment', 'industrial-construction-recruitment', 'mechanical-electrical-recruitment'],
  },
  {
    slug: 'construction-labour-supply',
    kind: 'service',
    nav: 'Labour Supply',
    title: 'Construction Labour Supply | Labourers, Groundworkers, Banksmen | PRL',
    description: 'CSCS-carded labourers, groundworkers, banksmen and slinger signallers for UK construction sites. One worker or a full gang, usually within 24 hours.',
    h1: 'Construction labour supply, from one labourer to a full gang',
    lede: 'CSCS-carded labourers, groundworkers, banksmen and slinger signallers, compliance-checked and ready to start. Most requests are covered within 24 hours.',
    facts: ['CSCS carded', 'Right to work checked', 'Single workers or full gangs'],
    rolesIntro: 'Site labour we supply week in, week out.',
    roles: [
      ['General labourers', 'CSCS-carded labourers for site clearance, material handling, housekeeping and supporting trades.'],
      ['Groundworkers', 'Drainage, foundations, kerbs and concrete work for civils packages and new build.'],
      ['Banksmen and traffic marshals', 'Guiding plant and vehicle movements safely around the site.'],
      ['Slinger signallers', 'CPCS or NPORS slinger signallers to direct lifts and check loads alongside crane operators.'],
      ['Fire marshals and fire watch', 'Monitoring hot works and leading evacuations on larger industrial sites, with NEBOSH or IOSH fire marshal training.'],
      ['Skilled labourers', 'Labourers with extra tickets such as abrasive wheels, confined space or PASMA, when the job needs them.'],
    ],
    body: [
      'Labour is where a missed start day costs you most. We keep a large pool of checked operatives across the North West and further afield, so we can usually fill a request for the next working day, whether it\'s one labourer or a gang.',
      'Timesheets come in through our PRISM app and we look after contractor pay, so there\'s no paperwork chasing on your side.',
    ],
    faqs: [
      ['How fast can you supply labourers?', 'In most cases within 24 hours. Call 0800 772 3959 for urgent cover. A phone call is the quickest way to get a same-week start confirmed.'],
      ['Do your labourers have CSCS cards?', 'Yes. Every labourer we place holds a valid CSCS card, and we check right to work before they start. If your site needs extra tickets, tell us and we\'ll only send people who hold them.'],
      ['Can you supply a whole gang rather than one worker?', 'Yes. We regularly supply several operatives to the same site. Tell us the numbers and the mix of labourers, groundworkers and banksmen you need.'],
      ['Who handles timesheets and pay?', 'We do. Contractors submit their hours through the PRISM app, and we deal with their pay and compliance so you don\'t have to.'],
    ],
    related: ['skilled-trades-recruitment', 'plant-operator-recruitment', 'site-management-recruitment', 'energy-from-waste-recruitment'],
  },
  {
    slug: 'plant-operator-recruitment',
    kind: 'service',
    nav: 'Plant Operators',
    title: 'Plant Operator Recruitment | CPCS & NPORS Operators | PRL Site Solutions',
    description: 'CPCS and NPORS carded plant operators: 360 excavators, telehandlers, cranes and more, supplied to contractors and plant and crane hire companies across the UK.',
    h1: 'CPCS and NPORS plant operators, supplied to site or to your hire fleet',
    lede: 'Carded operators for excavators, telehandlers, cranes and other plant. Card scheme and category checked before they go, whether they\'re joining your site team or going out with your hire machines.',
    facts: ['CPCS / NPORS carded', 'Category checked against your plant', 'Operators only, or with your machines'],
    rolesIntro: 'Tell us the machine and category and we\'ll match the card to it.',
    roles: [
      ['360 excavator operators', 'Tracked and wheeled 360s, above and below 10 tonnes, for groundworks, civils and demolition.'],
      ['Telehandler operators', 'Including 360 rotating telehandlers for material handling on industrial and construction sites.'],
      ['Crane operators', 'Mobile and crawler crane operators to work alongside your lifting team.'],
      ['Slinger signallers and crane supervisors', 'To plan and direct lifts safely.'],
      ['Dumper, roller and other plant', 'Forward tipping dumpers, rollers and other plant. Tell us the category you need.'],
    ],
    body: [
      'As well as main contractors, we supply plant hire and crane hire companies, who often need a carded operator to go out with a machine at short notice.',
      'Sites differ on which card scheme they accept. If yours takes only CPCS, or needs a blue competent-operator card rather than a red trained-operator card, say so and that\'s what we\'ll send.',
    ],
    faqs: [
      ['Do you supply CPCS or NPORS operators?', 'Both. If your site or principal contractor accepts only one scheme, or needs a particular card level, tell us and we\'ll only put forward operators who hold it for the right category.'],
      ['Do you supply the machine as well?', 'No, we supply operators only. Many of our clients are plant and crane hire companies who need a carded operator to go out with their own machines.'],
      ['Can you supply a telehandler operator for a 360 rotating machine?', 'Yes. Rotating telehandlers need the right category on the card, which we check before placement. We have recently recruited 360 telehandler operators for industrial sites in Cheshire.'],
      ['How quickly can an operator start?', 'In most cases within 24 hours of confirming the machine, category and site.'],
    ],
    related: ['construction-labour-supply', 'site-management-recruitment', 'energy-from-waste-recruitment', 'industrial-construction-recruitment'],
  },
  {
    slug: 'site-management-recruitment',
    kind: 'service',
    nav: 'Site Management',
    title: 'Site Management Recruitment | Supervisors, HSE, QA/QC | PRL',
    description: 'Site managers, supervisors, foremen, HSE advisors and QA/QC inspectors for construction, industrial and energy-from-waste projects. SMSTS, SSSTS and NEBOSH checked.',
    h1: 'Site managers, supervisors, HSE and QA/QC for construction and industrial projects',
    lede: 'People who run the site, keep it safe and prove the quality: supervisors, foremen, HSE advisors and QA/QC inspectors. Qualifications checked and experience matched to your project type.',
    facts: ['SMSTS / SSSTS / NEBOSH checked', 'Project-type experience matched', 'Contract and temporary placements'],
    rolesIntro: 'Management, supervision and assurance roles we recruit for.',
    roles: [
      ['Site managers and site supervisors', 'Running daily site activity, coordinating trades and subcontractors, and reporting progress. SMSTS or SSSTS as the site requires.'],
      ['Foremen', 'Civils and trade foremen leading gangs on site, including on heavy civils for energy-from-waste new builds.'],
      ['HSE advisors', 'Inspections, audits, risk assessments, incident investigation and CDM 2015 compliance. NEBOSH Certificate or Diploma.'],
      ['QA/QC inspectors', 'Electrical QA/QC (2391/2394/2395), piping and welding QA/QC including NDT coordination and weld logs. CSWIP 3.1/3.2 where needed.'],
      ['Fire marshals', 'Fire risk assessment, hot works monitoring and evacuation leadership on large sites.'],
      ['Project coordinators', 'Document control, reporting and coordination support for the site team.'],
    ],
    body: [
      'For management and assurance roles, the qualification is only half of it. A supervisor who has run an energy-from-waste or process site behaves differently to one from housebuilding. We match candidates on the kind of project they\'ve done, as well as the tickets they hold.',
      'Recent roles include site supervisors, HSE advisors and fire marshals on an energy-from-waste project in Pembrokeshire, civils foremen at Ince in Cheshire, and electrical and piping QA/QC in Deeside.',
    ],
    faqs: [
      ['What qualifications do your site supervisors hold?', 'Supervisors and site managers hold SSSTS or SMSTS as the role requires, with a valid CSCS card at the right level. HSE advisors hold NEBOSH qualifications. We check every certificate before we put someone forward.'],
      ['Can you find supervisors with energy-from-waste or process experience?', 'Yes. For EfW, power and process projects we put forward people who have worked on that kind of site, not just anyone with the right ticket.'],
      ['Do you recruit QA/QC inspectors?', 'Yes, for electrical QA/QC (inspection and testing to BS 7671, with 2391/2394/2395) and piping and welding QA/QC, including weld log management and coordinating NDT. CSWIP 3.1/3.2 where you need it.'],
      ['Are these permanent or contract roles?', 'Most of our management placements are contract or temporary, running for the length of a project or phase. Tell us what you need and we\'ll say whether we can help.'],
    ],
    related: ['energy-from-waste-recruitment', 'skilled-trades-recruitment', 'mechanical-electrical-recruitment', 'industrial-construction-recruitment'],
  },

  // ───────────────────────────── SECTORS ─────────────────────────────
  {
    slug: 'energy-from-waste-recruitment',
    kind: 'sector',
    nav: 'Energy-from-Waste',
    title: 'Energy-from-Waste (EfW) Recruitment Agency | PRL Site Solutions',
    description: 'Energy-from-waste (EfW) recruitment: civils, steel fixers, platers, coded welders, E&I, supervisors, HSE and QA/QC. Roles filled at Ince, Pembrokeshire and more.',
    h1: 'Energy-from-waste (EfW) recruitment, from heavy civils to QA/QC',
    lede: 'We staff EfW new builds through every phase: heavy civils for the bunker and boiler house, then mechanical, piping and E&I installation, with the supervision, HSE and QA/QC that tie it together.',
    facts: ['EfW is a core specialism', 'Civils through to E&I install', 'Supervisors with EfW / power / process backgrounds'],
    rolesIntro: 'Roles we fill on EfW projects, grouped by discipline.',
    roles: [
      ['Civils', 'Civils foremen, groundworkers and steel fixers for heavy reinforced concrete: the waste bunker, tipping hall, boiler house, turbine hall and flue gas treatment bases.'],
      ['Mechanical and fabrication', 'Platers, fabricators and coded welders on carbon and stainless pipe and plate, plus mechanical fitters and pipefitters.'],
      ['Electrical and instrumentation', 'ECS-carded electricians and electrical testers and inspectors.'],
      ['Supervision', 'Site supervisors and foremen with EfW, power or process experience who know CDM 2015 and HASAWA.'],
      ['HSE and fire safety', 'HSE advisors (NEBOSH) and fire marshals for hot works monitoring, audits and evacuation planning on large, busy sites.'],
      ['QA/QC', 'Piping and welding QA/QC for fabrication, erection and fit-up inspections, weld logs and NDT coordination. CSWIP 3.1/3.2 preferred.'],
    ],
    body: [
      'An energy-from-waste plant burns residual waste to generate electricity, and sometimes heat. Building one is a long, heavy industrial project. First come deep, thick reinforced concrete structures for the waste bunker and boiler house, then a large mechanical, piping and electrical installation, all under strict HSE and quality control.',
      'That mix is why EfW contractors struggle to staff it through general agencies. The steel fixers need heavy RC experience, not light mesh. The supervisors need to have run a process site. The QA/QC team has to manage weld traceability across thousands of joints. EfW is one of our core specialisms.',
      'Recent EfW and industrial roles we\'ve recruited for include civils foremen and steel fixers at Ince in Cheshire; site supervisors, HSE advisors and fire marshals in Pembrokeshire; and plater fabricators on a new build at Bridgwater in Somerset.',
    ],
    faqs: [
      ['What is an energy-from-waste (EfW) plant?', 'An EfW plant burns non-recyclable household and commercial waste to generate electricity, and in some cases heat. Building one involves heavy civils (waste bunker, tipping hall, boiler house), followed by mechanical, piping, and electrical and instrumentation installation, typically over several years.'],
      ['Which EfW roles do you recruit for?', 'Civils foremen, groundworkers and steel fixers; platers, fabricators and coded welders; electricians; site supervisors; HSE advisors and fire marshals; and piping and welding QA/QC inspectors.'],
      ['Do your workers have EfW experience?', 'For supervisory, HSE and QA/QC roles we put forward people with EfW, power or process experience. For trades we match on the type of work: heavy RC for steel fixers, coded pipe welding for welders, and so on.'],
      ['Where are your EfW placements?', 'Wherever the project is. Recent EfW and industrial roles have been at Ince in Cheshire, in Pembrokeshire, at Deeside and at Bridgwater in Somerset, and we place nationwide.'],
    ],
    related: ['industrial-construction-recruitment', 'site-management-recruitment', 'skilled-trades-recruitment', 'construction-labour-supply'],
    caseStudies: ['protos-energy-park-ince', 'kelvin-energy-from-waste-sandwell'],
  },
  {
    slug: 'industrial-construction-recruitment',
    kind: 'sector',
    nav: 'Industrial',
    title: 'Industrial Construction Recruitment | Fabrication, Docks, Process | PRL',
    description: 'Industrial construction recruitment for fabrication shops, docks, process plants and factory builds: coded welders, platers, fitters, electricians and QA/QC.',
    h1: 'Industrial construction recruitment: fabrication, process, docks and factory builds',
    lede: 'Skilled people for heavy industrial work: coded welders and platers for fabrication shops and docks, fitters and electricians for process plants and factory new builds, and the supervision and QA/QC to keep it to standard.',
    facts: ['Coded welders and platers', 'CCNSG checked where sites require it', 'Workshop and site-based roles'],
    rolesIntro: 'The industrial roles we fill most often.',
    roles: [
      ['Coded welders', 'TIG root with MMA fill and cap on carbon and stainless pipe, plate butt and fillet welds in all positions, working to WPS and weld maps.'],
      ['Platers and fabricators', 'Heavy and light fabrication from engineering drawings, including overhead crane and magnet-drill work in the shop.'],
      ['Mechanical fitters and pipefitters', 'Installation and fit-up on process plants and industrial new builds.'],
      ['Electricians and testers', 'ECS-carded electricians and inspection and testing to BS 7671 on factory and industrial builds.'],
      ['Supervisors and QA/QC', 'Site supervisors, plus electrical, piping and welding QA/QC inspectors.'],
      ['Plant operators and labour', 'Telehandlers, slinger signallers and labourers to support the trades.'],
    ],
    body: [
      'Industrial sites set a higher bar than most construction work. Welds are coded and tested, drawings are read to tight tolerances, and petrochemical and process sites often insist on a CCNSG safety passport before anyone sets foot on site. We check those requirements before we put anyone forward.',
      'Recent industrial roles include coded TIG welders at Tilbury Docks in Essex, platers and plater welders for a fabrication workshop near Hapsford in Cheshire, and electrical QA/QC on a factory new build in Deeside.',
    ],
    faqs: [
      ['Do you supply workers with CCNSG safety passports?', 'Yes. Many industrial and process sites need a CCNSG passport. Tell us if yours does and we\'ll only put forward people who hold one.'],
      ['Can you supply workshop-based fabricators as well as site workers?', 'Yes. We place platers, fabricators and welders into fabrication workshops as well as onto sites.'],
      ['Do your welders work to WPS and weld maps?', 'Yes. Our coded welders work to welding procedure specifications, weld maps and isometric drawings, keep weld traceability records, and can take a site weld test before starting if you need one.'],
    ],
    related: ['energy-from-waste-recruitment', 'mechanical-electrical-recruitment', 'skilled-trades-recruitment', 'plant-operator-recruitment'],
  },
  {
    slug: 'mechanical-electrical-recruitment',
    kind: 'sector',
    nav: 'M&E',
    title: 'M&E Recruitment | Electricians, Testers, Fitters, Pipefitters | PRL',
    description: 'M&E recruitment: ECS-carded electricians, testers and inspectors (2391/2394/2395), electrical QA/QC, mechanical fitters, pipefitters and plumbers.',
    h1: 'M&E recruitment: electricians, testers, fitters and pipefitters',
    lede: 'ECS-carded electricians, testing and inspection specialists, electrical QA/QC and mechanical trades for construction, industrial and energy projects, with every card and qualification checked before placement.',
    facts: ['ECS cards checked', '2391 / 2394 / 2395 testers', 'Electrical and mechanical QA/QC'],
    rolesIntro: 'Mechanical and electrical roles we recruit for.',
    roles: [
      ['Electricians', 'ECS-carded electricians for installation on commercial, industrial and energy projects.'],
      ['Testers and inspectors', 'Inspection and testing to BS 7671, holding 2391, 2394 or 2395.'],
      ['Electrical QA/QC', 'Documentation review, quality audits and non-conformance reporting, working with the installing contractors. ECS Gold Card.'],
      ['Mechanical fitters and pipefitters', 'Pipework and mechanical installation to isometric drawings on industrial and process projects.'],
      ['Plumbers', 'For new build and fit-out.'],
      ['Piping QA/QC', 'Inspection of piping fabrication, erection and fit-up, weld logs and NDT coordination.'],
    ],
    body: [
      'Electrical work on site comes down to the card and the paperwork. We check the ECS card type and every testing qualification before anyone is put forward, so what arrives on site matches what the principal contractor will ask for.',
      'Recent M&E roles include electrical QA/QC on a factory new build in Deeside, requiring 2391/2394/2395 and an ECS Gold Card.',
    ],
    faqs: [
      ['Do your electricians hold ECS cards?', 'Yes. Every electrician we place holds a valid ECS card at the right level for the role, which we check before placement.'],
      ['Can you supply electrical testers and inspectors?', 'Yes, holding 2391, 2394 or 2395 for inspection and testing to BS 7671, and electrical QA/QC inspectors for documentation, audits and non-conformance reporting.'],
      ['Do you cover mechanical as well as electrical?', 'Yes: mechanical fitters, pipefitters and plumbers, plus piping QA/QC for industrial and process work.'],
    ],
    related: ['industrial-construction-recruitment', 'energy-from-waste-recruitment', 'skilled-trades-recruitment', 'site-management-recruitment'],
  },
  {
    slug: 'rail-recruitment',
    kind: 'sector',
    nav: 'Rail',
    title: 'Rail Recruitment Agency | PTS, COSS & Rail Civils Staff | PRL',
    description: 'Rail recruitment: PTS track operatives, COSS, Engineering Supervisors, rail civils and trades. Competencies checked, deployed under your Sentinel sponsorship.',
    h1: 'Rail recruitment: track, civils and construction staff with the right competencies',
    lede: 'PTS-holding operatives, COSS and Engineering Supervisors for trackside work, plus the civils, trades and supervision rail projects need off the track. Every competency checked before anyone is put forward.',
    facts: ['PTS, Sentinel and COSS checked', 'Trackside and off-track roles', 'Team with a rail background'],
    rolesIntro: 'Rail roles we supply. Tell us the competencies your work needs.',
    roles: [
      ['Track operatives', 'PTS-holding operatives with a current Sentinel card and track induction, for maintenance, renewals and enhancement work.'],
      ['COSS', 'Controllers of Site Safety to plan and set up safe systems of work for trackside teams.'],
      ['Engineering Supervisors', 'ES-competent staff to manage worksites within a possession.'],
      ['Rail civils and structures', 'Groundworkers, steel fixers and labourers for drainage, embankments, bridges, platforms and other civils packages.'],
      ['Station and depot construction trades', 'Electricians, joiners, welders and fabricators for station, depot and building works off the operational railway.'],
      ['Supervision and HSE', 'Site supervisors, foremen and HSE advisors for rail construction projects.'],
    ],
    body: [
      'The railway runs on competencies. Anyone going trackside on Network Rail infrastructure needs a Personal Track Safety (PTS) card on the Sentinel scheme, and roles like COSS and Engineering Supervisor carry their own competence requirements. We record each person\'s PTS, Sentinel, COSS, ES and track induction details in our PRISM system and check them before anyone is put forward, so you don\'t get someone whose competence has lapsed.',
      'Trackside workers are deployed under your company\'s, or a partner\'s, Sentinel sponsorship, as the rules require. PRL finds and checks the people; sponsorship stays with the organisation that controls the work. For off-track work such as rail civils, stations and depots, we supply and manage the workforce in the usual way.',
      'Our team has a background in construction, rail and administration, so we understand why a missing competency or a late start on a possession matters.',
    ],
    faqs: [
      ['Is PRL a Sentinel sponsor?', 'No. PRL supplies rail-competent workers who are deployed under the client\'s, or a partner\'s, Sentinel sponsorship. We check each worker\'s PTS, Sentinel card, COSS, Engineering Supervisor and track induction competencies before putting them forward, and work with your sponsorship arrangements.'],
      ['What rail competencies do you check?', 'PTS (Personal Track Safety) on a current Sentinel card, COSS, Engineering Supervisor (ES) and track induction, alongside the standard checks: CSCS where relevant, right to work and trade qualifications.'],
      ['Do you supply off-track rail roles?', 'Yes. Rail civils (groundworkers, steel fixers, labourers), station and depot construction trades, and site supervision and HSE for rail construction projects.'],
      ['Can you supply for possessions and night work?', 'Tell us the shift pattern, location and competencies needed and we\'ll put forward people who can work it. Night and weekend possession work is common in rail, and we ask about availability up front.'],
    ],
    related: ['construction-labour-supply', 'site-management-recruitment', 'skilled-trades-recruitment', 'industrial-construction-recruitment'],
  },
];

// Local landing pages. Facts only: registered office, published case studies,
// and the services PRL already advertises. No invented local projects.
export const AREAS = [
  {
    slug: 'construction-recruitment-wirral',
    nav: 'Wirral',
    city: 'Wirral',
    region: 'Merseyside',
    geo: [53.4308, -3.0560],
    title: 'Construction Recruitment Wirral | Labour & Trades | PRL',
    description: 'Wirral construction recruitment from Wallasey. CSCS labour, trades and plant for Birkenhead, Prenton, Ellesmere Port and sites across Merseyside.',
    h1: 'Construction recruitment on the Wirral',
    lede: 'PRL Site Solutions is registered in Wallasey. We supply CSCS-checked labour, trades and plant to sites on the Wirral and across Merseyside, usually within 24 hours.',
    towns: ['Birkenhead', 'Wallasey', 'Prenton', 'Bromborough', 'Ellesmere Port', 'Heswall', 'Bebington'],
    asks: [
      ['Labour and groundworks', 'Green CSCS labourers and blue-card groundworkers for Birkenhead, Bromborough and sites further out toward Heswall and Bebington.'],
      ['Plant', 'CPCS or NPORS telehandlers and 360 excavators. The category on the card is what the gate checks, not the word "driver".'],
      ['Industrial next door', 'Ellesmere Port and the dock estate ask for the same mix as Ince Marsh: electricians, welders, banksmen and fire watch. That job is on the Chester page.'],
    ],
    body: [
      'The company is PRL Site Solutions Ltd, number 14358717, registered in England and Wales. The registered office is 259 Wallasey Village, Wallasey, Wirral, Merseyside, CH45 3LR. The desk is open Monday to Friday, 9am to 5pm, on 0800 772 3959. Mobilising people onto a site is a separate promise: pre-checked workers can be on site the next day, including when the call comes in late.',
      'From Wallasey we cover Birkenhead, Prenton, Bromborough, Bebington, Heswall and across the Mersey into Ellesmere Port. Typical orders are labourers, groundworkers and banksmen, coded welders and platers, electricians, and CPCS or NPORS plant operators for contractors and plant and crane hire companies.',
      'The nearest project we publish in detail is Protos Energy Park at Ince Marsh, just off the Wirral in Cheshire, where we have placed more than 420 people for Metlen since March 2026. The same compliance checks — CSCS, right to work, tickets, IR35 — apply on a Wirral site of any size.',
    ],
    faqs: [
      ['Where is PRL based?', 'The registered office is 259 Wallasey Village, Wallasey, Wirral, Merseyside, CH45 3LR. Call 0800 772 3959, Monday to Friday, 9am to 5pm. We do not ask clients to visit; we come to the site.'],
      ['How fast can you get people onto a Wirral site?', 'In most cases, the next day. Tell us the trade, the tickets the site insists on, the numbers and the start date. Everyone is compliance-checked before they are put forward.'],
      ['Which Wirral towns do you cover?', 'Prenton, Birkenhead, Wallasey, Bromborough, Bebington, Heswall and Ellesmere Port, plus the rest of Merseyside and Cheshire when the job needs it.'],
    ],
  },
  {
    slug: 'construction-recruitment-liverpool',
    nav: 'Liverpool',
    city: 'Liverpool',
    region: 'Merseyside',
    geo: [53.4084, -2.9916],
    title: 'Construction Recruitment Liverpool | Trades & Labour | PRL',
    description: 'Liverpool construction recruitment: CSCS labourers, trades, plant operators and supervisors for the city, Bootle, Speke and Knowsley. On site in 24 hours.',
    h1: 'Construction recruitment in Liverpool',
    lede: 'CSCS labour, skilled trades and plant operators for Liverpool and the city region, supplied from our Wirral desk and checked before they start.',
    towns: ['Liverpool', 'Bootle', 'Speke', 'Knowsley', 'St Helens', 'Crosby', 'Kirkby'],
    asks: [
      ['City, docks and Speke', 'Fit-out trades, labourers and banksmen in the city and on the dock estate. Speke, Kirkby and Knowsley are more industrial: electricians, fitters and plant.'],
      ['From the office', 'CH45 3LR is on the Wallasey side of the Mersey tunnels, about 5 miles from Liverpool city centre through the Kingsway Tunnel. Bootle and Crosby are the same run.'],
      ['Rail in the city region', 'Trackside staff need a current PTS card on Sentinel and are deployed under your sponsorship or a partner’s. PRL is not a Sentinel sponsor.'],
    ],
    body: [
      'Liverpool sites ask for the same things we already supply: labourers and groundworkers, banksmen, electricians, welders, steel fixers, and CPCS or NPORS operators. We are based in Wallasey, a short run through the Kingsway Tunnel, and the office line is 0800 772 3959, Monday to Friday, 9am to 5pm.',
      'Coverage includes the city, Bootle, Speke, Kirkby, Knowsley, Crosby and St Helens. For trackside rail work in the city region, PTS, COSS and Engineering Supervisor staff are deployed under your Sentinel sponsorship or a partner’s. PRL is not a Sentinel sponsor. Off-track rail civils, stations and depots we supply in the usual way.',
      'Our published large-scale job nearby is Protos Energy Park at Ince Marsh, Cheshire: more than 420 workers placed for Metlen since March 2026, across electrical, labour, fire watch, plant, mechanical and supervision. Liverpool orders use that same PRISM checking process.',
    ],
    faqs: [
      ['Do you supply Liverpool city centre and the docks?', 'Yes. We supply construction and industrial sites across Liverpool, Bootle, Speke and the rest of the city region. Tell us the postcode, the trade and the site tickets.'],
      ['Can you cover Merseyrail or other rail work?', 'Trackside staff need a current PTS card on Sentinel and are deployed under the client’s or a partner’s sponsorship. We check PTS, COSS, Engineering Supervisor and track induction before anyone is put forward. PRL is not a Sentinel sponsor.'],
      ['How do Liverpool contractors request people?', 'Call 0800 772 3959 or use the form on this page. We call back the same working day in most cases, and can usually have checked people on site within 24 hours.'],
    ],
  },
  {
    slug: 'construction-recruitment-manchester',
    nav: 'Manchester',
    city: 'Manchester',
    region: 'Greater Manchester',
    geo: [53.4808, -2.2426],
    title: 'Construction Recruitment Manchester | Labour & Plant | PRL',
    description: 'Manchester construction recruitment for Salford, Trafford, Stockport and the city. CSCS labour, trades and CPCS plant operators, usually on site in 24 hours.',
    h1: 'Construction recruitment in Manchester',
    lede: 'Labour, trades and plant for Greater Manchester sites, supplied by a Wirral recruiter that already works on major Northwest projects.',
    towns: ['Manchester', 'Salford', 'Trafford', 'Stockport', 'Bolton', 'Wigan', 'Oldham'],
    asks: [
      ['What Manchester sites ask for', 'CSCS labour and groundworkers, CPCS excavators and telehandlers, electricians, coded welders and SMSTS supervisors. City commercial and out-of-town civils both come through the same desk.'],
      ['No Manchester office', 'Greater Manchester is covered from Wallasey. A start the next morning is normal. A start in an hour is not — book it the working day before.'],
      ['Where this page stops', 'Salford, Trafford, Stockport, Bolton, Wigan and Oldham are in the weekly patch. Leeds and the rest of Yorkshire are not. Ask, and we will say if we can fill it.'],
    ],
    body: [
      'We supply Greater Manchester from the Wallasey office: labourers, groundworkers, banksmen, electricians, mechanical fitters, coded welders, steel fixers, site supervisors and CPCS or NPORS plant operators, including excavators, telehandlers and cranes.',
      'The patch covers Manchester, Salford, Trafford, Stockport, Bolton, Wigan and Oldham. Office hours are Monday to Friday, 9am to 5pm. If a site needs people tomorrow, say so on the call — rapid response is how most of our placements start, not a separate product.',
      'We have not published a Manchester case study. What we can show is the same standard of checking used at Protos Energy Park in Cheshire, where more than 420 people have been placed since March 2026, and on the Kelvin energy-from-waste civils in Sandwell. Cards, right to work and tickets are checked in PRISM before day one.',
    ],
    faqs: [
      ['Do you have an office in Manchester?', 'No. The registered office is in Wallasey, Wirral. Manchester, Salford, Trafford and the rest of Greater Manchester are covered from there, with workers sent to your site.'],
      ['What plant tickets do you supply in Manchester?', 'CPCS and NPORS operators, including 360 excavators, telehandlers and crane roles. Tell us the category and we only put forward people with that card in date.'],
      ['Can you staff a Manchester site at short notice?', 'In most cases, yes — the following day. Numbers, shift pattern and any site induction or ticket need to be in the brief so we do not send the wrong people.'],
    ],
  },
  {
    slug: 'construction-recruitment-chester',
    nav: 'Chester',
    city: 'Chester',
    region: 'Cheshire',
    geo: [53.1934, -2.8931],
    title: 'Construction Recruitment Chester & Cheshire | PRL Site Solutions',
    description: 'Chester and Cheshire construction recruitment, including Ince Marsh. CSCS trades, labour and supervisors. 420+ people placed at Protos Energy Park.',
    h1: 'Construction recruitment in Chester and Cheshire',
    lede: 'Chester, Ellesmere Port and the industrial sites around them — including the energy-from-waste build at Ince Marsh, where PRL has placed more than 420 people.',
    towns: ['Chester', 'Ellesmere Port', 'Ince', 'Deeside', 'Northwich', 'Frodsham', 'Helsby'],
    asks: [
      ['The job we can show', 'Protos Energy Park at Ince Marsh: more than 420 people placed for Metlen since March 2026, and 37 people supplied to Carey’s on the carbon-capture civils.'],
      ['How an EfW crew changes', 'Civils and groundworks first, then steel fixers, platers, coded welders, electricians, pipefitters, plant, HSE and QA/QC as the job comes out of the ground.'],
      ['Over the border', 'Deeside and nearby Flintshire sites are covered from the same desk. Chester city centre is about 18 miles from the Wallasey office. Send the postcode either way.'],
    ],
    body: [
      'Cheshire is where our largest published project sits. Protos Energy Park at Ince Marsh is an energy-from-waste plant with carbon capture, processing a designed 500,000 tonnes of waste a year. Since March 2026 we have placed more than 420 people there for Metlen: electricians, labourers, fire watch, plant, mechanical trades, civils and supervision, days and nights. A further 37 people went to Carey’s on the Protos carbon-capture civils.',
      'The same desk covers Chester, Ellesmere Port, Frodsham, Helsby, Northwich and over the border into Deeside. Trades are the ones on that job and the ones we advertise every week: coded welders, platers, steel fixers, electricians and testers, pipefitters, groundworkers, banksmen and site managers.',
      'PRL is registered in Wallasey on the Wirral, about 40 minutes from Chester. Call 0800 772 3959, Monday to Friday, 9am to 5pm.',
    ],
    faqs: [
      ['Have you worked on a Chester or Ellesmere Port site?', 'Yes. Protos Energy Park at Ince Marsh, Cheshire. More than 420 workers placed for Metlen since March 2026, and 37 people supplied to Carey’s on the carbon-capture civils.'],
      ['Do you cover North Wales from Chester?', 'Deeside and nearby Flintshire sites, yes, as part of the same Northwest patch. Tell us the postcode and the tickets the site requires.'],
      ['What trades are on EfW sites around Chester?', 'Civils and groundworks early on, then steel fixers, platers, coded welders, electricians, pipefitters, plant, supervision, HSE and QA/QC. The mix changes as the job moves from the ground into M&E.'],
    ],
  },
  {
    slug: 'construction-recruitment-warrington',
    nav: 'Warrington',
    city: 'Warrington',
    region: 'Cheshire',
    geo: [53.3900, -2.5970],
    title: 'Construction Recruitment Warrington | Labour & Trades | PRL',
    description: 'Warrington construction recruitment for Widnes, Runcorn and the M62 corridor. CSCS labour, trades and plant operators from a Wirral agency. 24-hour mobilisation.',
    h1: 'Construction recruitment in Warrington',
    lede: 'Labour, trades and plant for Warrington, Widnes and Runcorn, sent from our Wirral office and checked before they arrive.',
    towns: ['Warrington', 'Widnes', 'Runcorn', 'Birchwood', 'Newton-le-Willows', 'Lymm', 'Great Sankey'],
    asks: [
      ['Sheds, civils and nights', 'Logistics units and industrial builds along the M62. Night shifts are a normal brief, not an exception, and we ask about availability before anyone is put forward.'],
      ['Tickets the gate usually wants', 'Green CSCS for labour, a banksman or slinger ticket where lifting is happening, CPCS or NPORS for telehandlers and excavators, and SMSTS where you need a supervisor.'],
      ['How far is reasonable', 'Widnes and Runcorn are closer to Wallasey than Manchester is. If the site is the far side of the M6, say so on the call and we will tell you whether we can fill it.'],
    ],
    body: [
      'Warrington sits between Liverpool and Manchester, which is why so much of the work is logistics, industrial units, civils and plant. We supply the people those sites usually need at short notice: CSCS labourers and groundworkers, banksmen and slinger signallers, telehandler and excavator operators, electricians, and site supervisors.',
      'The towns we cover from this page are Warrington, Birchwood, Great Sankey, Lymm, Widnes, Runcorn and Newton-le-Willows. There is no published Warrington case study. The checking standard is the one used on Protos at Ince Marsh and on our other live jobs: CSCS or the right scheme card, right to work, and trade tickets recorded in PRISM with expiry dates.',
      'Office hours are Monday to Friday, 9am to 5pm, on 0800 772 3959. Ask for people the next morning if the programme has slipped — that is a normal request, not an emergency-only service.',
    ],
    faqs: [
      ['Do you supply warehouse and logistics sites around Warrington?', 'Yes, where the requirement is construction or industrial labour, trades, plant or supervision. Tell us the shift pattern. Nights and weekends are common and we ask about availability before anyone is put forward.'],
      ['How far do crews travel?', 'Warrington, Widnes and Runcorn are inside the area we cover every week from Wallasey. If the job is further out, say so and we will tell you whether we can fill it.'],
      ['What should I send with the enquiry?', 'Trade, numbers, postcode, start date, shift, and any ticket the principal contractor insists on (CSCS colour, CPCS category, SMSTS, CCNSG). The tighter the brief, the fewer wrong CVs you see.'],
    ],
  },
];

// Practical guides. Public scheme rules plus PRL's own checking process.
// Not legal advice, and not a substitute for the scheme operator's site.
export const GUIDES = [
  {
    slug: 'which-site-card',
    nav: 'Which site card',
    title: 'CSCS, ECS, CPCS and NPORS: which card a site wants | PRL',
    description: 'Green, blue, gold and black CSCS cards, plus ECS for electricians and CPCS or NPORS for plant. What PRL checks before anyone reaches a UK site.',
    h1: 'Which card does the site actually want?',
    lede: 'A CSCS card shows a health and safety test and, on most colours, a qualification. It does not show that the person can do tomorrow’s job. This is how we read a card before anyone is put forward.',
    sections: [
      {
        h2: 'The colour is a shorthand, not the job',
        paragraphs: [
          'CSCS cards are issued by the Construction Skills Certification Scheme. The colour is a quick way to see the level. The occupation printed on the card is the part that matters on the gate. A blue card in one trade is not evidence of another.',
          'Scheme rules change. The list below is the reading we use when a site says “CSCS only”. If a colour is disputed, the current CSCS register beats this page.',
        ],
        bullets: [
          'Green — labourer. Health, safety and environment test, plus a Level 1 award in health and safety in a construction environment. Right for general labour. Wrong for a skilled trade.',
          'Blue — skilled worker. Typically an NVQ or SVQ Level 2 in the trade named on the card. The usual card for a competent tradesman.',
          'Gold — advanced craft or supervisor. Typically Level 3. The card says which of the two it is. Do not treat them as the same person.',
          'Black — manager. A construction management qualification, the card a site manager is expected to hold.',
          'White — academically or professionally qualified. Degrees and chartered routes. Common for engineers and designers visiting site, not for an operative.',
          'Red — temporary. Trainee, apprentice, experienced worker and similar. These expire. We look at the date before we look at the photo.',
          'Yellow — a visitor card. Not a licence to work. We do not send a visitor card in place of an operative.',
        ],
      },
      {
        h2: 'Electricians and plant are different schemes',
        paragraphs: [
          'An electrician on an industrial or building site is usually expected to hold an ECS card, the Electrotechnical Certification Scheme, not a generic CSCS labourer card. Testers need the testing qualification as well: 2391, 2394 or 2395, depending on what the site is asking them to sign off.',
          'Plant is CPCS or NPORS. “Ticketed driver” is not a category. A 360 excavator, a telehandler and a crane are different cards. We only put forward the category named in the brief, and we record the expiry in PRISM.',
        ],
      },
      {
        h2: 'What we check, and what we refuse',
        paragraphs: [
          'Before a start, the card has to be in date, the occupation has to match the order, and right to work has to be on file. Coding certificates, SMSTS, SSSTS, NEBOSH and CCNSG are checked the same way when the site asks for them. Expiry dates sit in PRISM so a card that dies mid-placement is visible before the gate finds it.',
          'If the brief is “four lads, CSCS”, we will ask which colour and which occupation. Sending green-card labourers to do a blue-card job wastes the induction and usually gets them turned away.',
        ],
      },
    ],
    faqs: [
      ['Is a green CSCS card enough for a groundworker?', 'Only if the site has agreed that the work is general labour. A groundworker expected to work as a skilled operative should hold the blue skilled-worker card for that occupation. Tell us which one the principal contractor will accept.'],
      ['Do you accept a photo of a card?', 'A photo starts the check. The card still has to be valid for the occupation, and the expiry is recorded. We do not send someone on a picture alone if the register or the date does not match.'],
      ['Where should I confirm a card colour?', 'The scheme operator. CSCS for construction occupations, ECS for electrotechnical, CPCS or NPORS for plant. This page is how PRL reads those cards. It is not the scheme rulebook.'],
    ],
    relatedPages: ['construction-labour-supply', 'skilled-trades-recruitment', 'plant-operator-recruitment', 'site-management-recruitment'],
    relatedGuides: ['briefing-a-construction-agency', 'right-to-work-before-a-start'],
  },
  {
    slug: 'hiring-construction-labour-northwest',
    nav: 'Hiring in the Northwest',
    title: 'How to hire construction labour in the Northwest | PRL',
    description: 'What to send a Wirral recruiter for a Liverpool, Manchester, Chester or Warrington site. Tickets, distance and the only local job we publish numbers for.',
    h1: 'How to hire construction labour in the Northwest',
    lede: 'PRL is registered in Wallasey, Wirral. These are the towns we cover every week, how far is a fair ask, and what to put in the first call so the right people turn up.',
    sections: [
      {
        h2: 'Start with the postcode, not the city',
        paragraphs: [
          '“Manchester” can mean the city centre or a field past Oldham. The postcode decides the travel, the induction site and whether we already have people who will take it. The registered office is 259 Wallasey Village, Wallasey, CH45 3LR, company 14358717. The desk is open Monday to Friday, 9am to 5pm, on 0800 772 3959.',
          'CH45 3LR is about 5 miles from Liverpool city centre and about 18 miles from Chester. Widnes and Runcorn sit inside the same week. Greater Manchester is covered from Wallasey, so it needs to be booked the working day before, not at 7am the same morning.',
        ],
      },
      {
        h2: 'What each part of the patch usually wants',
        paragraphs: [
          'The trades do not change much. The mix does. Use the local page for the town, not a generic “Northwest labour” brief.',
        ],
        bullets: [
          'Wirral — Birkenhead, Wallasey, Bromborough, Heswall, plus Ellesmere Port. Labour, groundworkers, plant, and industrial trades heading toward the docks.',
          'Liverpool — city, Bootle, Speke, Knowsley and St Helens. Fit-out and docks in the city, industrial trades at Speke and Kirkby. Trackside rail is under your Sentinel sponsorship. PRL is not a sponsor.',
          'Chester and Cheshire — Chester, Ellesmere Port, Ince, Frodsham and Deeside. This is where the published large job is.',
          'Warrington — Warrington, Birchwood, Widnes and Runcorn. Logistics sheds, civils and night shifts.',
          'Manchester — Salford, Trafford, Stockport, Bolton, Wigan and Oldham. No local office. Same checks, longer travel.',
        ],
      },
      {
        h2: 'The only Northwest numbers we publish',
        paragraphs: [
          'Protos Energy Park at Ince Marsh, Cheshire, is an energy-from-waste plant with carbon capture. Since March 2026 we have placed more than 420 people there for Metlen: electricians, labourers, fire watch, plant, mechanical trades, civils and supervision, days and nights. A further 37 people went to Carey’s on the carbon-capture civils.',
          'There is no published case study for Liverpool, Manchester or Warrington. Those pages do not invent one. The checking standard on them is the same PRISM process used at Ince: CSCS or the right scheme card, right to work, and tickets with expiry dates.',
        ],
      },
      {
        h2: 'A brief that can be filled overnight',
        paragraphs: [
          'In most cases, checked people can be on site the next day. That only works when the brief is specific. Trade and occupation, numbers, postcode, start time, shift, and the ticket the principal contractor will turn someone away for. CSCS colour, CPCS or NPORS category, weld process and position, SMSTS, CCNSG.',
          'Rates, length of hire and whether the role is PAYE or limited company affect who will take the call. If you know them, say them. If the programme has already slipped, say that too. A next-morning start is a normal request.',
        ],
      },
    ],
    faqs: [
      ['Do you have offices in Liverpool and Manchester?', 'No. The registered office is in Wallasey, Wirral. Liverpool is a short run through the tunnels. Manchester is covered from the same desk, with the booking made the day before.'],
      ['Can you cover North Wales?', 'Deeside and nearby Flintshire, yes, as part of the Chester patch. Further into Wales, tell us the postcode and we will say whether we can fill it.'],
      ['Who do I call?', '0800 772 3959, Monday to Friday, 9am to 5pm, or the form on this page. info@prlsitesolutions.co.uk if you would rather write. The Google listing is under PRL Site Solutions.'],
    ],
    relatedPages: ['construction-labour-supply', 'plant-operator-recruitment', 'energy-from-waste-recruitment'],
    relatedGuides: ['which-site-card', 'briefing-a-construction-agency'],
  },
  {
    slug: 'right-to-work-before-a-start',
    nav: 'Right to work',
    title: 'Right to work checks before a construction start | PRL',
    description: 'PRL checks right to work before anyone is placed on a UK site and holds the record on file. What that covers, and what it does not replace for the hirer.',
    h1: 'Right to work checks before someone starts on site',
    lede: 'Nobody is put forward until right to work has been checked and the record is on file. This page is our process. It is not legal advice, and it does not replace a duty you hold as the hirer.',
    sections: [
      {
        h2: 'When the check happens',
        paragraphs: [
          'The check is done before the person is offered to you, not on the morning they arrive at the turnstile. Documents are held on file. If a card, a share code or a date does not stand up, that person does not go onto the list.',
          'The same file holds the site card (CSCS, ECS, CPCS or NPORS), trade tickets and expiry dates, in PRISM. Right to work is one line in that check, not a separate product you have to ask for.',
        ],
      },
      {
        h2: 'What you still need to tell us',
        paragraphs: [
          'Some sites, particularly rail, process plants and energy-from-waste jobs, add their own induction and sponsorship rules on top. Trackside workers on Network Rail infrastructure need PTS on Sentinel and are deployed under your sponsorship or a partner’s. PRL is not a Sentinel sponsor. A right-to-work pass does not put someone on Sentinel.',
          'If your contract says the principal contractor will also inspect documents at induction, say so. We would rather send the pack you need than discover the gap at 6am.',
        ],
      },
      {
        h2: 'Where the official rules sit',
        paragraphs: [
          'Employers follow the Home Office right-to-work check. The official guidance is on GOV.UK, and it changes. We follow that check for the people we place. If you employ people directly, or your contract puts a check on you as well, use the current GOV.UK guidance rather than this page.',
          'We do not give immigration advice, and we do not tell a worker which visa they should hold. If the check fails, they are not put forward.',
        ],
      },
    ],
    faqs: [
      ['Do you check right to work on every placement?', 'Yes. Before anyone is placed, with the record held on file. It sits alongside the CSCS or scheme card and the trade tickets.'],
      ['Does your check replace ours?', 'No. It covers the people we supply. If you are the employer, or your contract requires you to check as well, that duty stays with you. This page is not legal advice.'],
      ['How does this relate to IR35?', 'They are different checks. Right to work is about permission to work in the UK. IR35 is about how a contractor engagement is taxed. We run IR35-compliant engagements as a separate control, not as a substitute for the right-to-work file.'],
    ],
    relatedPages: ['construction-labour-supply', 'rail-recruitment', 'site-management-recruitment'],
    relatedGuides: ['which-site-card', 'briefing-a-construction-agency'],
  },
  {
    slug: 'briefing-a-construction-agency',
    nav: 'Brief an agency',
    title: 'How to brief a construction recruitment agency | PRL',
    description: 'The seven facts that decide whether a construction agency sends the right people: trade, ticket, numbers, postcode, start, shift and how they are paid.',
    h1: 'How to brief a construction agency so the right people turn up',
    lede: 'Most wrong CVs start with a vague order. These are the facts we ask for on 0800 772 3959, and why each one changes who we put forward.',
    sections: [
      {
        h2: 'Seven facts, in this order',
        paragraphs: [
          'You do not need a formal scope. You do need enough that we can say yes or no the same day.',
        ],
        bullets: [
          'Trade and occupation. “Trades” is not an order. Welder, groundworker, electrician, banksman and site supervisor are different people.',
          'The ticket the gate will enforce. CSCS colour and occupation, ECS, CPCS or NPORS category, weld process and position, SMSTS, CCNSG, PTS. If you do not know, say what happened last time someone was refused.',
          'Numbers. Three and thirty are different jobs. So is “two now and six next Monday”.' ,
          'Postcode. Travel is part of whether someone will take the shift. City names are not precise enough on the Wirral, Merseyside or Greater Manchester.',
          'Start date and time. Next morning is normal. Same hour is usually not, because the checks are done before they travel.',
          'Shift. Days, nights, weekends, a possession. We ask the worker before we promise you.',
          'Duration and how they are engaged. A two-day cover and a six-month EfW placement do not come from the same list. PAYE or limited company, if you already know.',
        ],
      },
      {
        h2: 'What we will not pretend',
        paragraphs: [
          'We will not invent a local case study to win a town we have not published. The large published Northwest job is Protos at Ince Marsh. The checking standard everywhere else is the same: card, right to work, tickets, expiry dates in PRISM.',
          'We will tell you if the ticket is scarce. A 6G coded welder with an in-date certificate is not the same phone call as a green-card labourer. Saying “we’ll try” and sending the wrong card is how sites lose a morning.',
        ],
      },
      {
        h2: 'After they start',
        paragraphs: [
          'A project manager is appointed to the customer’s site, and we visit to check our workforce are all right and being treated properly. Timesheets and documents go through the PRISM app. If a ticket is due to expire during the hire, that date is already on the record.',
          'To place the order: call 0800 772 3959, Monday to Friday 9am to 5pm, or use the form. The company is PRL Site Solutions Ltd, 259 Wallasey Village, Wallasey, Wirral, Merseyside, CH45 3LR.',
        ],
      },
    ],
    faqs: [
      ['What if I only know the trade and the town?', 'Call anyway. We would rather fill the gaps on the phone than guess the ticket. You will get fewer, better names than from a one-line email that says “labourers, Liverpool”.'],
      ['Can you start people tomorrow?', 'In most cases, yes, if the brief lands while the checks can still be done. Office hours are 9am to 5pm. The mobilisation promise is the next day, not a guarantee for a call made at midnight.'],
      ['Do you cover the whole UK from this brief?', 'Yes, when we can fill it. The weekly patch without a long travel conversation is the Wirral, Liverpool, Chester and Cheshire, Warrington and Greater Manchester. Further out, the postcode decides.'],
    ],
    relatedPages: ['skilled-trades-recruitment', 'construction-labour-supply', 'site-management-recruitment', 'energy-from-waste-recruitment'],
    relatedGuides: ['which-site-card', 'hiring-construction-labour-northwest', 'right-to-work-before-a-start'],
  },
];

