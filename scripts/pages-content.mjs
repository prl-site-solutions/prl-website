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
