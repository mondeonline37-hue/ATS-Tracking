import {
  Candidate,
  IcbiDomainKey,
  IcbiJobLevel,
  IcbiSubDomainKey,
  TalentRequest,
} from '../types/ta';

export const STORAGE_KEY_REQUESTS = 'ta_tracker_requests_v3';
export const STORAGE_KEY_CANDIDATES = 'ta_tracker_candidates_v3';

export const SBUS = [
  'SMR',
  'DS',
  'FO',
  'FFO',
  'FP',
  'LMY',
  'PM',
  'LTS',
  'CORP',
  'SSC',
  'EXL',
  'LFI',
] as const;

export const COMPANIES = [
  'LMR',
  'LMY',
  'LIO',
  'LBT',
  'SPM',
  'TCL',
  'EBCCI',
  'LFR',
  'LCT',
  'LTS',
  'MSG CORP',
  'MSG EO',
  'LFI',
  'EXL',
] as const;

export const JOB_LEVELS = ['Non-Supervisor', 'Supervisory', 'Managerial'] as const;

export const WORK_ARRANGEMENTS = ['On-Site', 'Hybrid', 'Work From Home'] as const;

export const APP_SOURCES = [
  'Jobstreet',
  'LinkedIn',
  'Indeed',
  'Social Media',
  'Careers Email',
  'Job Fair',
  'Referral',
  'QR Code',
  'Agency',
  'Rehire',
  'Walk-In',
] as const;

export const RELOCATION_OPTIONS = [
  'Willing to Relocate',
  'Not Willing to Relocate',
  'Open for Discussion',
  'Not Necessary',
] as const;

export const CIVIL_STATUS_OPTIONS = ['Single', 'Married', 'Widowed', 'Separated'] as const;

export const PARENT_STATUS_OPTIONS = ['Alive', 'Deceased', 'Solo Parent', 'Separated'] as const;

export const INDUSTRY_OPTIONS = [
  'Business Administration & Management',
  'Finance & Accounting',
  'Human Resources',
  'Talent Acquisition & Recruitment',
  'Sales & Business Development',
  'Marketing & Brand Management',
  'Digital Marketing & SEO',
  'Customer Service & Support',
  'Customer Success',
  'Retail Operations',
  'Grocery & Convenience Retail',
  'Fashion & Apparel Retail',
  'Electronics & Appliances Retail',
  'Home Improvement & Hardware Retail',
  'Pharmacy Retail',
  'E-commerce & Digital Retail',
  'Merchandising & Visual Display',
  'Cashiering & Front-End Operations',
  'Supply Chain & Logistics',
  'Warehouse & Fulfillment',
  'Purchasing & Procurement',
  'Transport & Driving',
  'Fleet & Last-Mile Delivery',
  'Cold Chain & Temperature-Controlled Logistics',
  'Wholesale & Distribution',
  'Import/Export & Customs',
  'Manufacturing & Production',
  'Engineering',
  'Construction & Architecture',
  'Facilities & Maintenance',
  'HVAC & Plumbing',
  'Electrical & Construction Trades',
  'Heavy Equipment & Material Handling',
  'IT & Data',
  'Software Engineering',
  'Cybersecurity',
  'Cloud & DevOps',
  'Data Science & AI',
  'IT Support & Helpdesk',
  'Creative & Design',
  'UX/UI & Product Design',
  'Media & Communications',
  'Public Relations & Communications',
  'Healthcare & Medical',
  'Pharmaceuticals & Biotechnology',
  'Medical Devices',
  'Mental Health & Counseling',
  'Veterinary Services',
  'Education & Training',
  'Childcare & Early Education',
  'Science & Research',
  'Legal Services',
  'Compliance & Risk Management',
  'Government & Public Administration',
  'Social & Community Services',
  'Nonprofit & NGO',
  'Food & Beverage Operations',
  'Kitchen & Restaurant',
  'Catering & Food Production',
  'Agriculture & Environment',
  'Environmental Services & Waste Management',
  'Energy & Utilities',
  'Renewable Energy',
  'Oil & Gas',
  'Mining & Resources',
  'Telecommunications',
  'Banking & Financial Services',
  'Insurance',
  'Fintech & Payments',
  'Real Estate & Property Management',
  'Security & Safety',
  'Emergency & Public Safety',
  'Quality Assurance & Quality Control (QA/QC)',
  'Internal Audit',
  'Events & Entertainment',
  'Tourism & Hospitality',
  'Hotels & Resorts',
  'Beauty & Wellness',
  'Virtual Assistance & Freelancing',
  'Clerical & Administrative Support',
  'Language & Translation',
  'General Labor & Physical Work',
  'Aviation & Airport Operations',
  'Maritime & Shipping',
  'Rail & Transit',
  'Automotive & Dealership',
  'Aerospace & Defense',
  'Cleaning & Janitorial Services',
  'Landscaping & Grounds Maintenance',
  'Postal & Courier Services',
  'Libraries, Museums & Archives',
  'Publishing & Printing',
  'Broadcasting & Podcasting',
  'Film, TV & Video Production',
  'Music & Performing Arts',
  'Gaming & Esports',
  'Sports & Recreation',
  'Consulting & Advisory',
  'Project & Program Management',
  'Product Management',
  'Market Research & Analytics',
] as const;

export const COMM_DESCRIPTORS: Record<'accent' | 'grammar' | 'structure' | 'fluency', Record<number, string>> = {
  accent: {
    1: 'Pronunciation is often unclear; frequent vowel/consonant errors and uneven syllable stress make the listener work hard to understand.',
    2: 'Pronunciation is generally understandable but strongly influenced by L1; noticeable sound errors and irregular stress occasionally distract the listener.',
    3: 'Pronunciation is clear and intelligible; accent is noticeable but not distracting, and stress/rate are controlled enough to support understanding.',
    4: 'Pronunciation is clear and mostly natural; vowel/consonant sounds, syllable stress, and rate are well controlled, with only rare L1 traces.',
    5: 'Pronunciation is clear, natural, and easy to process; sounds, stress, rhythm, and rate are consistently controlled and support neutral intelligibility.',
  },
  grammar: {
    1: 'Uses limited simple structures; frequent errors in agreement, tenses, pronouns, prepositions, articles, and sentence structure often obscure meaning.',
    2: 'Handles familiar grammar reasonably well, but basic errors in tenses, articles, prepositions, and agreement persist and sometimes affect clarity.',
    3: 'Shows good control of routine grammar; occasional errors in complex tenses, articles, prepositions, or sentence structure occur but rarely cause misunderstanding.',
    4: 'Maintains strong grammatical control; complex sentence structures and varied tenses are used accurately, with only occasional minor slips.',
    5: 'Demonstrates flexible, accurate control of grammar across structures; errors are rare, minor, and easily self-corrected even in complex speech.',
  },
  structure: {
    1: 'Ideas are presented as isolated points or short sequences; overall organization is unclear and transitions between points are mostly absent.',
    2: 'Main points are identifiable but loosely organized; basic connectors are used, though logical structure and transitions may break down in longer responses.',
    3: 'Main points are organized logically using a recognizable pattern (e.g., PREP, FDS, chronological); transitions are generally smooth and support coherence.',
    4: 'Discourse is well structured and easy to follow; complex ideas are developed systematically with flexible, appropriate transitions and cohesive devices.',
    5: 'Produces clear, smoothly flowing, well-structured discourse; organization is sophisticated and transitions are effortless, even when handling complex or abstract ideas.',
  },
  fluency: {
    1: 'Speech is halting and largely reactive; long pauses, dead air, and frequent fillers make it difficult to maintain a flow of communication.',
    2: 'Can keep going on familiar topics but with noticeable hesitation; fillers and pauses are frequent and sometimes distract from the message.',
    3: 'Speaks with reasonable spontaneity and confidence; some hesitation and fillers occur, but they do not seriously disrupt the flow or clarity.',
    4: 'Speaks fluently and spontaneously with little obvious effort; fillers and pauses are occasional and rarely distracting.',
    5: 'Speaks with confident, smooth articulation; hesitation, fillers, and dead air are minimal and do not interfere with natural communication.',
  },
};

export interface IcbiSubDomainConfig {
  key: IcbiSubDomainKey;
  code: string;
  title: string;
  ask: string;
  definitions: Record<1 | 2 | 3 | 4 | 5, string>;
}

export interface IcbiDomainConfig {
  key: IcbiDomainKey;
  code: string;
  title: string;
  weightPercent: number;
  subDomains: IcbiSubDomainConfig[];
}

export const ICBI_NON_SUPERVISORY_DOMAINS: IcbiDomainConfig[] = [
  {
    key: 'motivationFit',
    code: '1',
    title: '1. Motivation Fit',
    weightPercent: 20,
    subDomains: [
      {
        key: 'motivation',
        code: '1.1',
        title: '1.1 Motivation',
        ask: 'Retail peak seasons and long shifts can be physically demanding. Describe a difficult period at work and what kept you driven and dependable.',
        definitions: {
          1: 'Lacks initiative/drive. Requires consistent supervision.',
          2: 'Occasionally motivated. Oftentimes requires guidance.',
          3: 'Consistently motivated. Meets expectation.',
          4: 'Strongly motivated. Consistently dependable; displays a positive attitude toward work, stays engaged even in challenging tasks.',
          5: 'Shows unwavering commitment, takes initiative without prompting, and consistently goes beyond basic expectations to deliver results.',
        },
      },
    ],
  },
  {
    key: 'jobFit',
    code: '2',
    title: '2. Job Fit',
    weightPercent: 50,
    subDomains: [
      {
        key: 'jobKnowledge',
        code: '2.1',
        title: '2.1 Job Knowledge',
        ask: "Walk me through your core duties in your previous retail or service role. How did your daily accuracy and speed directly affect your store or team's daily targets?",
        definitions: {
          1: "Understands basic tasks and requires frequent guidance to complete work; has limited awareness of how tasks relate to the team's output.",
          2: 'Can perform familiar and routine tasks with minimal errors; requires assistance for new or complex assignments.',
          3: 'Applies job knowledge consistently to complete tasks accurately and on time; understands how their work supports team objectives.',
          4: 'Uses job knowledge to work efficiently, solve common work-related issues, and help colleagues understand procedures.',
          5: 'Demonstrates deep job knowledge; applies skills to improve work processes, and share expertise with team members.',
        },
      },
      {
        key: 'cognitiveSkills',
        code: '2.2',
        title: '2.2 Cognitive Skills',
        ask: 'Tell me about a time you had to learn a new POS system, inventory procedure, or multi-step promo rule quickly. How did you avoid mistakes?',
        definitions: {
          1: 'Frequently misunderstands instructions, forgets steps, misses obvious errors, struggles to complete tasks without constant guidance.',
          2: 'Can follow simple instructions but often needs clarification, and works slowly to maintain accuracy.',
          3: 'Consistently follows multi-step instructions, completes tasks on time, maintains acceptable accuracy, solves routine problems independently.',
          4: 'Quickly interprets complex instructions, works faster than average without losing quality, and catches subtle errors.',
          5: 'Foresees potential problems, applies information across tasks, innovates to improve processes, and consistently delivers error-free work ahead of deadlines.',
        },
      },
      {
        key: 'efficiency',
        code: '2.3',
        title: '2.3 Efficiency',
        ask: 'How do you organize your tasks during busy store hours so you finish on time without wasting supplies, stock, or effort?',
        definitions: {
          1: 'Work is frequently delayed and requires repeated correction.',
          2: 'Work is completed but often late and with errors.',
          3: 'Consistently completes work on time and with acceptable quality.',
          4: 'Completes work efficiently with high quality.',
          5: 'Maximizes work output with excellent quality.',
        },
      },
    ],
  },
  {
    key: 'behavioralFit',
    code: '3',
    title: '3. Behavioral Fit',
    weightPercent: 30,
    subDomains: [
      {
        key: 'independence',
        code: '3.1',
        title: '3.1 Independence',
        ask: 'Describe a situation when your supervisor was unavailable and an urgent floor or customer issue came up. How did you handle it on your own?',
        definitions: {
          1: 'Requires continuous supervision and step-by-step instructions to complete tasks; unable to proceed without guidance.',
          2: 'Can work alone on simple, familiar tasks but frequently seeks approval or direction before moving forward.',
          3: 'Completes most tasks without supervision; occasionally checks in for confirmation or guidance.',
          4: 'Works reliably and proactively with minimal supervision; makes sound decisions in most situations and manages own workload well.',
          5: 'Fully self-reliant, demonstrates full initiative and ownership.',
        },
      },
      {
        key: 'accountability',
        code: '3.2',
        title: '3.2 Accountability',
        ask: 'Tell me about a time you made an error on the job or faced a personal schedule conflict. How did you own the situation and ensure your responsibilities were covered?',
        definitions: {
          1: 'Rarely takes responsibility for assigned tasks or outcomes; relies entirely on others for follow-through.',
          2: 'Occasionally accountable and requires reminders to deliver results.',
          3: 'Consistently accountable for assigned responsibilities and outcomes; completes most tasks with minimal follow-through needed.',
          4: 'Demonstrates strong ownership and reliability.',
          5: 'Fully accountable for responsibilities; proactively addresses potential issues, ensures successful outcomes, and takes pride in results.',
        },
      },
      {
        key: 'communication',
        code: '3.3',
        title: '3.3 Communication',
        ask: 'Give an example of how you communicated an urgent stock, pricing, or customer issue to a coworker or supervisor, and how you handled feedback given to you.',
        definitions: {
          1: 'Communication is unclear.',
          2: 'Communicates occasionally but inconsistent.',
          3: 'Often communicates clearly and respectfully with colleagues, supervisors, and other departments to share relevant information.',
          4: 'Consistently communicates clearly, professionally and timely.',
          5: 'Fully communicates in a way that improves teamwork, prevents misunderstandings, and encourages cooperation across teams.',
        },
      },
      {
        key: 'managingInterdependencies',
        code: '3.4',
        title: '3.4 Managing Interdependencies',
        ask: 'In a store or warehouse, delays in one section affect cashiers, baggers, or merchandisers. Tell me about a time you coordinated with another team to keep operations smooth.',
        definitions: {
          1: 'Rarely collaborates and fails to recognize or coordinate with other teams.',
          2: 'Occasionally considers interdependencies but requires guidance.',
          3: 'Recognizes and manages interdependencies adequately.',
          4: 'Effectively manages interdependencies and minimizes process friction.',
          5: 'Fully manages interdependencies and facilitates cross-functional success.',
        },
      },
    ],
  },
];

export const ICBI_SUPERVISORY_DOMAINS: IcbiDomainConfig[] = [
  {
    key: 'motivationFit',
    code: '1',
    title: '1. Motivation Fit',
    weightPercent: 15,
    subDomains: [
      {
        key: 'motivation',
        code: '1.1',
        title: '1.1 Motivation',
        ask: 'Tell me about a sustained turnaround or high-pressure retail campaign where setbacks tested your resilience. How did you maintain personal momentum and keep supervisors energized?',
        definitions: {
          1: 'Rarely demonstrates initiative. Struggles to maintain focus, and fails to inspire or drive the team/colleagues toward results.',
          2: 'Motivation is inconsistent. Sometimes lacks drive to complete tasks or inspire others, especially during setbacks. Requires frequent direction to stay focused.',
          3: 'Consistently displays sufficient motivation to fulfill job requirements. Stays committed to achieving goals and supports the team/colleagues, but may occasionally require reminders.',
          4: 'Strongly shows motivation. Works proactively toward goals, encourages team effort, and maintains momentum despite challenges.',
          5: 'Fully demonstrates outstanding drive and commitment. Maintains high energy and focus even under pressure.',
        },
      },
    ],
  },
  {
    key: 'jobFit',
    code: '2',
    title: '2. Job Fit',
    weightPercent: 40,
    subDomains: [
      {
        key: 'jobKnowledge',
        code: '2.1',
        title: '2.1 Job Knowledge',
        ask: 'How do you ensure your shift leads and store associates understand not just store SOPs, but how their daily execution impacts branch sales and shrinkage goals?',
        definitions: {
          1: 'Limited knowledge and unable to guide team/colleagues. Cannot connect team tasks to organizational goals.',
          2: 'Understands basic supervisory functions within their area but provides limited guidance to team/colleagues; able to answer only routine questions.',
          3: 'Demonstrates solid knowledge of functional processes; explains procedures and their importance to others; ensures team members understand their roles in achieving department objectives.',
          4: 'Applies broad knowledge to solve challenges; aligns activities with departmental and organizational objectives; mentors team members to strengthen their skills.',
          5: 'Uses deep functional expertise to improve processes, anticipate needs, and contribute to strategic plans; develops team capabilities to operate effectively without constant oversight.',
        },
      },
      {
        key: 'cognitiveSkills',
        code: '2.2',
        title: '2.2 Cognitive Skills',
        ask: 'Describe a recurring operational bottleneck or inventory discrepancy you uncovered on the floor. How did you analyze the data and prevent it from recurring?',
        definitions: {
          1: 'Limited analytical or problem-solving ability for decision-making.',
          2: 'Understands basic cognitive skills but often needs guidance for complex issues.',
          3: 'Consistently applies cognitive skills effectively.',
          4: 'Demonstrates strong cognitive skill and anticipates and prevents issues.',
          5: 'Exemplary cognitive skill ability. Strategic thinker.',
        },
      },
      {
        key: 'efficiency',
        code: '2.3',
        title: '2.3 Efficiency',
        ask: 'Tell me about a time when store traffic spiked unexpectedly or staffing was short during a peak hour. How did you reallocate floor tasks to meet targets without overtime or service delays?',
        definitions: {
          1: 'Unable to ensure team/work group tasks are completed on time or within budget; lacks planning and prioritization.',
          2: 'Manages to deliver some team/work group outputs but often exceeds time or resource limits; team performance is inconsistent.',
          3: 'Ensures most team/work group tasks are completed within deadlines and resource limits; occasional delays or rework occur.',
          4: 'Consistently delivers team/work group outputs on time and within resource limits; adapts team plans effectively to workload changes.',
          5: 'Consistently achieves or exceeds targets with optimal use of resources; maintains superior productivity and quality under pressure.',
        },
      },
      {
        key: 'strategicThinking',
        code: '2.4',
        title: '2.4 Strategic Thinking',
        ask: 'Beyond daily shift checklists, how do you anticipate upcoming seasonal trends or staffing gaps in your section over a 1-to-3 month horizon?',
        definitions: {
          1: 'Focuses only on immediate tasks without considering long-term impact.',
          2: 'Occasionally considers the bigger picture but focuses mostly on short-term goals.',
          3: "Aligns team/section's objectives with departmental priorities; considers medium-term implications of decisions.",
          4: 'Anticipates future challenges and opportunities; adapts strategies to meet evolving business needs.',
          5: 'Shapes team/section strategies that influence organizational direction; consistently positions the team/section for future success.',
        },
      },
      {
        key: 'marketCustomerOrientation',
        code: '2.5',
        title: '2.5 Market & Customer Orientation',
        ask: "How do you gather feedback from shoppers and monitor nearby competitor promos to adjust your section's merchandising or service approach?",
        definitions: {
          1: "Limited customer needs awareness or market trends affecting the team/section's work.",
          2: 'Basic awareness of customer needs and/or competitor activities; occasionally applies insights to work planning.',
          3: 'Consistently considers customer feedback and/or market information when making decisions.',
          4: 'Proactively gathers and uses market and customer insights to adjust plans and improve service delivery.',
          5: 'Fully anticipates customer needs and market changes; leads initiatives that strengthen competitive advantage.',
        },
      },
      {
        key: 'planningOrganizing',
        code: '2.6',
        title: '2.6 Planning & Organizing',
        ask: 'Walk me through how you build weekly shift schedules, assign restocking zones, and enforce daily SOP and safety compliance checks.',
        definitions: {
          1: 'Poor planning and organizing. Tasks often missed or deadlines not met.',
          2: 'Inconsistent basic work plans and may overlook priorities or dependencies.',
          3: 'Consistently develops clear, realistic plans that meet most deadlines and resource requirements.',
          4: 'Strongly coordinates complex activities; adjusts plans quickly when conditions change.',
          5: 'Fully optimizes team workload and resources for maximum productivity; sets the standard for effective planning in the organization.',
        },
      },
      {
        key: 'effectiveDelegation',
        code: '2.7',
        title: '2.7 Effective Delegation',
        ask: 'How do you decide which tasks to delegate to senior associates versus handling yourself, and how do you track completion without micromanaging?',
        definitions: {
          1: 'Poorly assigns or coordinates tasks without clarity; fails to follow up on progress or outcomes.',
          2: 'Inconsistently delegates or requests assistance for basic tasks but may overload or underutilize others.',
          3: "Consistently assigns or coordinates tasks based on others' skills; provides clear instructions and checks progress periodically.",
          4: 'Strongly delegates or shares responsibilities strategically to enhance efficiency and support capability development.',
          5: 'Fully empowers others to take ownership of tasks; uses delegation and collaboration to strengthen accountability and build confidence.',
        },
      },
      {
        key: 'financialAcumen',
        code: '2.8',
        title: '2.8 Financial Acumen',
        ask: 'What practical actions do you take at the supervisory level to control store operating expenses—such as shrinkage, damaged goods, supplies, and overtime?',
        definitions: {
          1: 'Poorly understands how actions affect costs or resource use; does not consider financial impact in decisions.',
          2: 'Inconsistently understands basic financial terms and cost drivers; needs guidance to apply cost-conscious practices.',
          3: 'Consistently applies financial awareness in routine decisions; uses resources responsibly and supports cost-control initiatives.',
          4: 'Strongly identifies ways to reduce waste and improve operational efficiency; encourages team/workgroup to work within available resources.',
          5: 'Fully demonstrates financial awareness; anticipates cost implications of decisions and recommends improvements that support financial goals.',
        },
      },
    ],
  },
  {
    key: 'behavioralFit',
    code: '3',
    title: '3. Behavioral Fit',
    weightPercent: 45,
    subDomains: [
      {
        key: 'independence',
        code: '3.1',
        title: '3.1 Independence',
        ask: 'Tell me about a non-routine floor emergency or high-value customer dispute you resolved independently before escalating to your Store Manager.',
        definitions: {
          1: 'Requires close supervision from higher management; cannot make decisions or delegate without step-by-step guidance.',
          2: 'Can oversee routine team/work group tasks but frequently seeks approval before making decisions; hesitant to act independently in non-routine situations.',
          3: 'Oversees team/work group with minimal intervention from higher management; consults only on complex issues or high-impact decisions.',
          4: 'Works with high autonomy; makes sound supervisory decisions; effectively balances delegation with oversight.',
          5: 'Operates fully independently; takes full initiative in managing people and processes from start to finish; consistently makes effective decisions without reliance on higher management.',
        },
      },
      {
        key: 'accountability',
        code: '3.2',
        title: '3.2 Accountability',
        ask: 'Describe a time when your section missed a key KPI or failed an internal audit check. How did you take ownership and drive corrective action?',
        definitions: {
          1: 'Rarely takes responsibility for team/workgroup outcomes; shifts accountability to others or external factors.',
          2: 'Often accepts responsibility for team/workgroup outcomes but fails to follow through or ensure completion without reminders.',
          3: 'Consistently accountable for both own and team/workgroup outputs; follows up to ensure satisfactory results with minimal oversight.',
          4: 'Strongly takes responsibility for both team/workgroup and personal results; resolves potential issues before they escalate.',
          5: 'Fully accountable for all supervisory responsibilities; addresses potential risks in advance; drives continuous improvement.',
        },
      },
      {
        key: 'communication',
        code: '3.3',
        title: '3.3 Communication',
        ask: 'As a supervisor, you must deliver daily huddles, give corrective feedback, and relay unpopular policy updates. How do you adapt your communication so your team stays aligned?',
        definitions: {
          1: 'Rarely shares information with the team/colleagues; messages are unclear or incomplete; avoids or struggles in giving feedback.',
          2: 'Occasionally communicates basic instructions clearly but may overlook context; listens to concerns but does not always address them effectively.',
          3: 'Consistently communicates with the team/colleagues; encourages open dialogue; provides clear feedback that supports task completion.',
          4: 'Strongly communicates expectations and goals clearly; adapts communication style to different audiences; actively facilitates problem-solving discussions.',
          5: 'Fully influences and inspires the team and other stakeholders through compelling communication; skillfully handles difficult conversations; builds strong networks.',
        },
      },
      {
        key: 'managingInterdependencies',
        code: '3.4',
        title: '3.4 Managing Interdependencies',
        ask: 'How do you coordinate between selling floor staff, receiving/warehouse, and front-end cashiers during major promo rollouts or deliveries to prevent bottlenecks?',
        definitions: {
          1: "Focuses only on own team/section's tasks without considering dependencies; unaware of how delays or errors affect other teams.",
          2: 'Limited coordination with team members/colleagues and may require reminders or guidance.',
          3: "Consistently coordinates with other teams to align schedules, share information, and resolve simple interdependency issues; ensures own team's work supports broader goals.",
          4: 'Proactively anticipates and addresses potential bottlenecks between teams/workgroups; facilitates problem-solving discussions to maintain smooth workflows.',
          5: 'Fully leads cross-functional initiatives involving multiple teams; aligns priorities and resources to ensure seamless delivery of interrelated work.',
        },
      },
      {
        key: 'ethicalDecisionMaking',
        code: '3.5',
        title: '3.5 Ethical & Responsible Decision-Making',
        ask: 'Tell me about a time you discovered a policy violation, cash/inventory discrepancy, or timekeeping abuse by a peer or subordinate. How did you handle it?',
        definitions: {
          1: 'Shows limited awareness of ethical standards; may overlook compliance requirements.',
          2: 'Follows rules when reminded; applies ethical standards inconsistently.',
          3: 'Consistently applies company policies and ethical guidelines in decision-making.',
          4: 'Proactively identifies potential ethical risks and addresses them before issues arise.',
          5: 'Acts as a role model for integrity; influences others to uphold ethical standards in all business dealings.',
        },
      },
      {
        key: 'changeManagement',
        code: '3.6',
        title: '3.6 Change Management',
        ask: 'Describe a time headquarters rolled out a new POS tool, inventory system, or store policy that your staff initially resisted. How did you drive smooth adoption?',
        definitions: {
          1: 'Poorly manages change initiatives and relies on others to explain or implement changes.',
          2: 'Inconsistently understands the need for change.',
          3: 'Consistently supports change by sharing information, clarifying expectations, and helping colleagues adapt to new processes.',
          4: 'Strongly facilitates change by communicating effectively, addressing concerns, and suggesting practical improvements to ensure smooth implementation.',
          5: 'Fully serves as a change champion; anticipates challenges, influences others to embrace change, and contributes to transition plans.',
        },
      },
      {
        key: 'developsTalent',
        code: '3.7',
        title: '3.7 Develops Talent',
        ask: 'How do you cross-train associates and prepare high-potential staff on your shift to step up into lead roles?',
        definitions: {
          1: "Rarely supports team/colleagues' development or knowledge sharing.",
          2: 'Inconsistently recognizes the importance of development and occasionally provides informal guidance when prompted.',
          3: 'Consistently supports others through coaching, feedback, or knowledge sharing; helps identify development needs and encourages continuous learning.',
          4: 'Strongly mentors or guides colleagues; creates learning opportunities through project assignments, collaboration, or skills transfer.',
          5: "Fully serves as a role model for learning and development; consistently builds others' capability and fosters a culture of growth.",
        },
      },
      {
        key: 'drivesPerformance',
        code: '3.8',
        title: '3.8 Drives Performance',
        ask: 'Describe a time you had to coach an underperforming team member. What specific metrics did you set, how did you monitor progress, and what was the outcome?',
        definitions: {
          1: 'Rarely sets or monitors team/workgroup performance goals. Focuses only on completing personal tasks.',
          2: 'Inconsistently communicates performance expectations; tracks progress occasionally.',
          3: 'Consistently sets clear team goals and performance measures; monitors results and provides timely feedback.',
          4: 'Strongly implements performance management processes effectively; recognizes high performers and addresses underperformance promptly.',
          5: 'Fully creates a high-performance culture; consistently achieves or exceeds team objectives while improving long-term productivity.',
        },
      },
    ],
  },
];

export const ICBI_MANAGERIAL_DOMAINS: IcbiDomainConfig[] = [
  {
    key: 'motivationFit',
    code: '1',
    title: '1. Motivation Fit',
    weightPercent: 15,
    subDomains: [
      {
        key: 'motivation',
        code: '1.1',
        title: '1.1 Motivation',
        ask: 'Tell me about a sustained turnaround or high-pressure retail campaign where setbacks tested your resilience. How did you maintain personal momentum and keep supervisors energized?',
        definitions: {
          1: 'Rarely demonstrates initiative. Struggles to maintain focus, and fails to inspire or drive the team/colleagues toward results.',
          2: 'Motivation is inconsistent. Sometimes lacks drive to complete tasks or inspire others, especially during setbacks. Requires frequent direction to stay focused.',
          3: 'Consistently displays sufficient motivation to fulfill job requirements. Stays committed to achieving goals and supports the team/colleagues, but may occasionally require reminders.',
          4: 'Strongly shows motivation. Works proactively toward goals, encourages team effort, and maintains momentum despite challenges.',
          5: 'Fully demonstrates outstanding drive and commitment. Maintains high energy and focus even under pressure.',
        },
      },
    ],
  },
  {
    key: 'jobFit',
    code: '2',
    title: '2. Job Fit',
    weightPercent: 40,
    subDomains: [
      {
        key: 'jobKnowledge',
        code: '2.1',
        title: '2.1 Job Knowledge',
        ask: "What does 'Our Best For You' mean to you as a retail leader at LCC, and how do you translate deep retail operations expertise into branch-wide profitability and service standards?",
        definitions: {
          1: 'Poorly understands key functional or business areas and relies heavily on top management for direction.',
          2: 'Inconsistently demonstrates understanding of operational and business processes; requires guidance in applying knowledge to decisions or problem-solving.',
          3: 'Consistently possesses solid knowledge of the function and business operations; applies expertise to manage routine situations and contributes to problem-solving and decision-making.',
          4: 'Strongly demonstrates broad job knowledge across functional and cross-functional areas; applies expertise to improve processes, support team capability, and meet organizational objectives.',
          5: 'Fully possesses expert-level understanding of the business, industry trends, and organizational dynamics; applies strategic insight to drive innovation, influence direction, and mentor others.',
        },
      },
      {
        key: 'cognitiveSkills',
        code: '2.2',
        title: '2.2 Cognitive Skill',
        ask: 'Describe a complex multi-department operational or supply chain problem you diagnosed using store data. How did you structure your analysis and implement a lasting solution?',
        definitions: {
          1: 'Rarely demonstrates the cognitive skills required. Has difficulty understanding and analyzing information, leading to poor or delayed decision-making.',
          2: 'Cognitive skills are inconsistent. Sometimes struggles to analyze information accurately or make timely and sound decisions. Requires frequent guidance for problem-solving.',
          3: 'Consistently demonstrates adequate cognitive skills for the role. Can analyze, evaluate, and make reasonable decisions for routine and moderately complex issues.',
          4: 'Strongly shows cognitive abilities. Analyzes data effectively, identifies solutions, and makes sound judgments.',
          5: 'Fully demonstrates outstanding analytical thinking, problem-solving, and decision-making. Anticipates challenges, identifies innovative solutions, and applies complex information with accuracy and speed.',
        },
      },
      {
        key: 'efficiency',
        code: '2.3',
        title: '2.3 Efficiency',
        ask: 'Tell me about a time you re-engineered store workflows, labor allocation, or inventory turnover to significantly boost branch output while reducing operating waste.',
        definitions: {
          1: 'Rarely demonstrates efficiency. Misses deadlines, overuses resources, and requires frequent intervention to meet objectives.',
          2: 'Inconsistently balances time, quality, and resources. Deadlines may slip, and inefficiencies remain unaddressed without prompting.',
          3: 'Consistently completes goals within expected timeframes and resource limits. Organizes and delegates well.',
          4: 'Strongly balances time, quality, and resources. Identifies and implements process improvements that enhance productivity.',
          5: 'Fully maximizes results with optimal use of time, quality, and resources.',
        },
      },
      {
        key: 'strategicThinking',
        code: '2.4',
        title: '2.4 Strategic Thinking',
        ask: 'How do you translate corporate retail strategy into an annual branch roadmap while anticipating shifting Bicol regional consumer behavior and competitive threats?',
        definitions: {
          1: 'Lacks strategic perspective. Makes decisions without considering long-term goals or the wider organizational impact.',
          2: 'Inconsistently focuses on long-term goals. Requires guidance to align decisions with broader organizational goals.',
          3: 'Consistently understands long-term organizational goals and incorporates them into routine decision-making.',
          4: 'Strongly applies strategic thinking in planning and problem-solving. Connects daily activities to organizational objectives and adapts effectively to changes.',
          5: 'Fully demonstrates a forward-looking perspective, anticipating challenges and opportunities. Aligns actions with long-term goals, makes data-driven decisions, and inspires others.',
        },
      },
      {
        key: 'marketCustomerOrientation',
        code: '2.5',
        title: '2.5 Market & Customer Orientation',
        ask: 'Share an example of how you used local market intelligence, foot-traffic patterns, or customer insights to reposition product mix or service experience and grow market share.',
        definitions: {
          1: 'Limited awareness of market and customer priorities. Provides inadequate service, and fails to consider customer needs in decision-making.',
          2: 'Inconsistent understanding of market trends or customer expectations. Reacts rather than anticipates, and requires guidance to address customer needs effectively.',
          3: 'Consistently understands basic market trends and customer requirements. Delivers satisfactory service and adapts to customer needs in routine situations.',
          4: 'Strongly applies market and customer insights to guide decisions and improve service. Responds effectively to changing needs and fosters positive, lasting customer relationships.',
          5: 'Fully demonstrates deep understanding of market trends and customer needs. Anticipates changes, adapts strategies proactively, and builds strong customer relationships that drive growth.',
        },
      },
      {
        key: 'planningOrganizing',
        code: '2.6',
        title: '2.6 Planning & Organizing',
        ask: 'How do you structure multi-unit operational governance, audit cadences, and resource allocation so SOPs are consistently executed without micromanagement?',
        definitions: {
          1: 'Rarely demonstrates effective planning or organization leading to delays, missed goals, and poor resource use.',
          2: 'Inconsistent planning and organization. Priorities are frequently unclear, deadlines often missed, and resources misused.',
          3: 'Consistently plans and organizes work to meet requirements. Sets priorities and deadlines.',
          4: 'Strongly plans and organizes work efficiently. Sets clear priorities, manages resources well, and adjusts plans proactively when challenges arise.',
          5: 'Fully develops clear, actionable plans with well-defined priorities and timelines. Allocates resources effectively, anticipates obstacles, and ensures seamless execution.',
        },
      },
      {
        key: 'financialAcumen',
        code: '2.7',
        title: '2.7 Financial Acumen',
        ask: 'Walk me through how you analyze a branch P&L—specifically gross margin, shrinkage, labor-to-sales ratio, and OPEX—to uncover revenue drivers and stop cost leakage.',
        definitions: {
          1: 'Shows limited understanding of financial principles or cost implications of decisions; overlooks financial impact and requires significant guidance.',
          2: 'Inconsistently demonstrates awareness of financial concepts.',
          3: 'Consistently applies financial understanding to manage resources responsibly and make sound operational decisions; provides reasonable financial input for planning.',
          4: 'Strongly uses financial information to guide decisions, control costs, and identify opportunities for efficiency; ensures actions and recommendations align with financial goals.',
          5: 'Fully demonstrates strong financial insight and strategic thinking; interprets financial trends and data to drive performance, optimize resource use, and support sustainability.',
        },
      },
      {
        key: 'effectiveDelegation',
        code: '2.8',
        title: '2.8 Effective Delegation',
        ask: 'How do you empower your department heads and supervisors with real decision-making authority while maintaining clear accountability checkpoints?',
        definitions: {
          1: 'Poorly delegates or coordinates work effectively.',
          2: 'Inconsistently delegates or coordinates work effectively. Provides limited guidance, resources, or authority.',
          3: 'Consistently delegates or coordinates routine tasks with clear instructions and basic follow-through.',
          4: 'Strongly delegates and coordinates responsibilities strategically, providing clear direction and appropriate authority; monitors progress constructively and offers support.',
          5: 'Fully demonstrates exceptional skill in delegation and coordination; empowers others to take ownership, leverages strengths across teams, and uses delegation to build capability.',
        },
      },
    ],
  },
  {
    key: 'behavioralFit',
    code: '3',
    title: '3. Behavioral Fit',
    weightPercent: 45,
    subDomains: [
      {
        key: 'independence',
        code: '3.1',
        title: '3.1 Independence',
        ask: 'Describe a major operational crisis (e.g., system outage, typhoon disruption, acute stockout) where you had to make autonomous executive calls to protect business continuity.',
        definitions: {
          1: 'Poorly makes decisions independently; frequently seeks approval for routine matters and shows limited confidence in judgment.',
          2: 'Inconsistently makes basic operational decisions but often relies on senior guidance for direction.',
          3: 'Consistently manages day-to-day responsibilities independently; makes informed decisions within defined authority and seeks input for complex or strategic matters.',
          4: 'Strongly exercises judgment and initiative; works independently on strategic and operational priorities while keeping leadership informed of key developments.',
          5: 'Fully demonstrates high-level autonomy and accountability; makes sound, strategic decisions that advance organizational goals and proactively addresses challenges with minimal oversight.',
        },
      },
      {
        key: 'accountability',
        code: '3.2',
        title: '3.2 Accountability',
        ask: 'Tell me about a time a branch or strategic initiative under your leadership fell short of target. How did you own the outcome with executive leadership and turn results around?',
        definitions: {
          1: 'Rarely demonstrates accountability. Frequently fails to meet commitments, avoids responsibility for outcomes, and does not take corrective action when needed.',
          2: 'Accountability is inconsistent. Sometimes avoids responsibility, delays action on problems, or shifts blame. Requires frequent follow-through to ensure commitments are met.',
          3: 'Consistently accepts responsibility for work and meets commitments.',
          4: 'Strongly demonstrates accountability. Delivers on commitments, accepts responsibility for outcomes, and actively works to correct issues when they arise.',
          5: 'Fully takes responsibility for decisions, actions, and results. Owns both successes and failures, learns from mistakes, and ensures commitments are met or exceeded without reminders.',
        },
      },
      {
        key: 'communication',
        code: '3.3',
        title: '3.3 Communication',
        ask: 'Describe a high-stakes negotiation or sensitive alignment discussion with corporate support teams, suppliers, or store leaders where your communication shifted the decision.',
        definitions: {
          1: 'Ineffectively communicates or listens. Poor influence on decision-making.',
          2: 'Inconsistently delivers clear or complete messages. Limited influence on decision-making.',
          3: 'Consistently communicates clearly and listens adequately. Can influence decisions on routine matters but may need support in high-stakes situations.',
          4: 'Strongly communicates clearly and listens attentively. Able to influence decisions through logical reasoning and respectful discussion.',
          5: 'Fully conveys messages with clarity and precision, ensuring understanding at all levels. Actively listens and responds thoughtfully. Persuasively influences decisions through well-reasoned arguments.',
        },
      },
      {
        key: 'managingInterdependencies',
        code: '3.4',
        title: '3.4 Managing Interdependencies',
        ask: 'How do you align Merchandising, Logistics, HR, and Store Operations across units to eliminate cross-departmental friction during major branch launches or seasonal peaks?',
        definitions: {
          1: 'Poorly engages in effective collaboration. Resists working with others outside their own team/department, withholds resources or information.',
          2: 'Inconsistently collaborates across teams and/or departments.',
          3: 'Consistently works with colleagues and other teams to meet goals. Shares information and resources when needed.',
          4: "Strongly collaborates effectively across teams and departments. Leverages others' strengths, shares resources, and maintains positive working relationships.",
          5: 'Fully builds trust-based relationships within and across departments. Actively seeks input, resources, and expertise from others, fostering interdependence to achieve exceptional results.',
        },
      },
      {
        key: 'ethicalDecisionMaking',
        code: '3.5',
        title: '3.5 Ethical & Responsible Decision-Making',
        ask: 'As a manager, you may uncover confidential audit flags, supplier kickback attempts, or compliance breaches involving senior staff. How do you uphold governance and integrity?',
        definitions: {
          1: 'Poorly considers ethical implications.',
          2: 'Inconsistent ethical considerations in decision-making. Sometimes overlooks long-term consequences or organizational standards.',
          3: 'Consistently makes responsible decisions that generally align with ethical standards and organizational values.',
          4: 'Strongly demonstrates sound judgment and fairness in decision-making.',
          5: 'Fully makes decisions guided by integrity, fairness, and organizational values. Anticipates ethical implications, takes responsibility for outcomes, and serves as a role model.',
        },
      },
      {
        key: 'changeManagement',
        code: '3.6',
        title: '3.6 Change Management',
        ask: 'Tell me about a major organizational transformation (e.g., HRIS/ATS rollout, store restructuring, or new operating model) you led. How did you overcome resistance and sustain productivity?',
        definitions: {
          1: 'Poorly manages change initiatives and provides little communication or direction.',
          2: 'Inconsistently supports change and provides limited guidance, resulting in uneven team understanding and reduced productivity during transitions.',
          3: 'Consistently implements change as directed. Communicates key messages to the team, addresses basic concerns, and maintains stable performance during transitions.',
          4: 'Strongly manages change initiatives. Communicates the purpose and benefits clearly, involves the team in problem-solving, and minimizes disruption through proactive support.',
          5: 'Fully leads change with clarity, empathy, and strategic foresight. Anticipates challenges, addresses resistance constructively, and inspires confidence and commitment.',
        },
      },
      {
        key: 'developsTalent',
        code: '3.7',
        title: '3.7 Develops Talent',
        ask: 'What is your approach to succession planning, and how have you identified, mentored, and promoted internal supervisors into managerial roles?',
        definitions: {
          1: "Rarely supports team/colleagues' development or knowledge sharing.",
          2: 'Inconsistently recognizes the importance of development and occasionally provides informal guidance or assistance to colleagues when prompted.',
          3: 'Consistently supports teams/colleagues through coaching, feedback, or knowledge sharing; helps identify development needs and encourages continuous learning.',
          4: 'Strongly mentors or guides teams/colleagues; creates learning opportunities through project assignments, collaboration, or skills transfer.',
          5: "Fully serves as a role model for learning and development; consistently builds others' capability, fosters a culture of growth, and prepares teams for future roles.",
        },
      },
      {
        key: 'drivesPerformance',
        code: '3.8',
        title: '3.8 Drives Performance',
        ask: 'How do you cascade branch KPIs into scorecards for your supervisors, recognize top performers, and execute decisive performance improvement plans for underperformers?',
        definitions: {
          1: 'Poorly drives performance effectively. Fails to set clear goals, monitor progress, or address underperformance, leading to poor team results.',
          2: 'Inconsistent performance management. Goals are unclear, follow-up is limited, and corrective actions are delayed or insufficient.',
          3: 'Consistently sets goals and monitors progress to ensure targets are met. Addresses performance issues when necessary.',
          4: 'Strongly sets clear expectations, supports the team in meeting objectives, and takes timely action to overcome challenges. Encourages high performance through recognition.',
          5: 'Fully sets clear, ambitious yet achievable goals aligned with organizational goals and motivates the team to achieve outstanding results. Monitors proactively and uses data-driven strategies.',
        },
      },
    ],
  },
];

export const ICBI_JOB_LEVELS: IcbiJobLevel[] = ['Non-Supervisory', 'Supervisory', 'Managerial'];

export const ICBI_MATRICES: Record<IcbiJobLevel, IcbiDomainConfig[]> = {
  'Non-Supervisory': ICBI_NON_SUPERVISORY_DOMAINS,
  Supervisory: ICBI_SUPERVISORY_DOMAINS,
  Managerial: ICBI_MANAGERIAL_DOMAINS,
};

export const ICBI_DOMAINS: IcbiDomainConfig[] = ICBI_NON_SUPERVISORY_DOMAINS;

export const INITIAL_SEED_REQUESTS: TalentRequest[] = [
  {
    id: 'REQ-101',
    etrfNumber: 'TRF-2026-1001',
    position: 'Store Branch Operations Manager',
    location: 'Legazpi City, Albay',
    sbu: 'SMR',
    company: 'LMR',
    department: 'Store Operations',
    workArrangement: 'On-Site',
    jobLevel: 'Managerial',
    dateRequested: '2026-11-20',
    salaryGrade: '₱45,000 / month',
    negotiable: true,
    maxSalary: '₱55,000 / month',
    areaManager: 'Roberto Gomez',
    storeManager: 'Elena Vance',
    hrbp: 'Mark Anthony Ramos',
    srHrbp: 'Patricia Villanueva',
    hrOps: 'Jerome Cortez',
  },
  {
    id: 'REQ-102',
    etrfNumber: 'TRF-2026-1002',
    position: 'HR Talent Acquisition Specialist',
    location: 'Naga City, Camarines Sur',
    sbu: 'CORP',
    company: 'MSG CORP',
    department: 'Human Resources',
    workArrangement: 'Hybrid',
    jobLevel: 'Supervisory',
    dateRequested: '2026-11-22',
    salaryGrade: '₱28,000 / month',
    negotiable: false,
    maxSalary: '',
    areaManager: 'Roberto Gomez',
    storeManager: 'Melissa Cruz',
    hrbp: 'Mark Anthony Ramos',
    srHrbp: 'Patricia Villanueva',
    hrOps: 'Jerome Cortez',
  },
  {
    id: 'REQ-103',
    etrfNumber: 'TRF-2026-1003',
    position: 'Logistics & Warehouse Supervisor',
    location: 'Daraga, Albay',
    sbu: 'EXL',
    company: 'EXL',
    department: 'Supply Chain & Logistics',
    workArrangement: 'On-Site',
    jobLevel: 'Supervisory',
    dateRequested: '2026-11-24',
    salaryGrade: '₱24,000 / month',
    negotiable: true,
    maxSalary: '₱28,000 / month',
    areaManager: 'Salvador Tan',
    storeManager: 'Lorna Diaz',
    hrbp: 'Janice Morales',
    srHrbp: 'Patricia Villanueva',
    hrOps: 'Arthur Santos',
  },
];

export const INITIAL_SEED_CANDIDATES: Candidate[] = [
  {
    id: 'CAND-201',
    etrfId: 'REQ-101',
    appDate: '2026-11-21',
    appSource: 'LinkedIn',
    relocation: 'Willing to Relocate',
    industry: 'Retail Operations',
    name: 'Camilla Reyes',
    age: 29,
    email: 'camilla.reyes@example.com',
    phone: '+63 917 888 1234',
    phone2: '0918-555-4321',
    birthdate: '1997-04-12',
    civilStatus: 'Single',
    address: 'Old Albay District, Legazpi City',
    father: { name: 'Fernando Reyes', status: 'Alive', work: 'Civil Engineer' },
    mother: { name: 'Clara Reyes', status: 'Alive', work: 'High School Principal' },
    school: 'Ateneo de Naga University',
    degree: 'BS Business Administration',
    major: 'Operations Management',
    yearGraduated: '2018',
    additionalEducations: [
      {
        school: 'Asian Institute of Management',
        degree: 'Diploma in Retail Management',
        major: 'Retail Strategy',
        year: '2021',
      },
    ],
    licenses: [
      { title: 'PRC Registered Manager Specialist', number: 'PRC-998123', exp: '2028-05-12' },
    ],
    certifications: [
      { name: 'Certified Retail Specialist (CRS)', issuer: 'Philippine Retailers Association', year: '2022' },
      { name: 'Lean Six Sigma Yellow Belt', issuer: 'Six Sigma PH', year: '2020' },
    ],
    workExperiences: [
      {
        position: 'Assistant Store Manager',
        jobLevel: 'Supervisory',
        company: 'Ayala Malls Retail Inc.',
        fromDate: '2021-03-01',
        toDate: '2026-10-31',
        totalMonths: 68,
        reason: 'Career Advancement',
      },
      {
        position: 'Retail Operations Trainee',
        jobLevel: 'Non-Supervisor',
        company: 'SM Department Store',
        fromDate: '2018-06-01',
        toDate: '2021-02-28',
        totalMonths: 33,
        reason: 'Promoted to Management',
      },
    ],
    commAssessment: {
      waiverEnabled: false,
      accentRating: 4,
      grammarRating: 4,
      structureRating: 4,
      fluencyRating: 4,
      totalScore: 80,
      cefrLevel: 'C1 (Advanced - High CEFR Level)',
      result: 'Pass',
      interviewerNotes:
        '<b>Strong Candidate:</b> Exceptional articulation and confidence.<br><ul><li>Handled situation questions using PREP structure.</li><li>Demonstrated high potential for store leadership.</li></ul>',
    },
    icbiAssessment: {
      waiverEnabled: false,
      remarks:
        '<b>Strong Store Leadership Profile:</b> Consistently scored 4–5 across store leadership, accountability, and ethical judgment.<ul><li>Demonstrated strong holiday peak planning and shrink control (&lt;0.8%).</li><li>Recommended for immediate Branch Manager onboarding.</li></ul>',
      scores: {
        motivation: {
          rating: 4,
          evidence:
            'Led store opening and holiday peak shifts across 14 consecutive days with zero absenteeism; rallied floor associates with morning huddles.',
        },
        jobKnowledge: {
          rating: 4,
          evidence:
            'Managed daily POS reconciliation, markdown audits, and replenishment accuracy, keeping shrinkage below 0.8%.',
        },
        cognitiveSkills: {
          rating: 4,
          evidence:
            'Learned new cloud POS promo engine in 2 days and created a visual one-page cheat sheet for cashiers.',
        },
        efficiency: {
          rating: 4,
          evidence:
            'Batched shelf tag updates prior to store opening and cut receiving turnaround by 25%.',
        },
        strategicThinking: {
          rating: 4,
          evidence:
            'Forecasted holiday peak manpower 6 weeks ahead and pre-trained seasonal associates.',
        },
        marketCustomerOrientation: {
          rating: 4,
          evidence:
            'Tracked weekend shopper traffic feedback and adjusted promo endcaps to lift basket size.',
        },
        planningOrganizing: {
          rating: 4,
          evidence:
            'Built weekly shift rosters and daily SOP safety checklists across 3 floor zones.',
        },
        effectiveDelegation: {
          rating: 4,
          evidence:
            'Delegated receiving audits to senior stock leads with midday progress checkpoints.',
        },
        financialAcumen: {
          rating: 4,
          evidence:
            'Reduced overtime by 12% through staggered shift coverage and tighter shrinkage logs.',
        },
        independence: {
          rating: 4,
          evidence:
            'Resolved a POS outage and VIP refund escalation independently while Store Manager was off-site.',
        },
        accountability: {
          rating: 5,
          evidence:
            'Proactively owned a mislabeled promo display, corrected price integrity immediately, and documented root-cause checks.',
        },
        communication: {
          rating: 4,
          evidence:
            'Briefed receiving and front-end leads clearly before rush hours and welcomed regional audit coaching.',
        },
        managingInterdependencies: {
          rating: 4,
          evidence:
            'Coordinated warehouse staging lanes with baggers and cashiers during weekend promos to prevent checkout bottlenecks.',
        },
        ethicalDecisionMaking: {
          rating: 5,
          evidence:
            'Reported and documented a void-transaction discrepancy transparently per store audit SOP.',
        },
        changeManagement: {
          rating: 4,
          evidence:
            'Ran hands-on huddle demos so associates adopted the new handheld inventory scanner in 1 week.',
        },
        developsTalent: {
          rating: 4,
          evidence:
            'Cross-trained 3 senior cashiers into shift-lead backup duties.',
        },
        drivesPerformance: {
          rating: 4,
          evidence:
            'Set weekly checkout-speed targets and coached underperforming associates with 1-on-1 reviews.',
        },
      },
    },
  },
  {
    id: 'CAND-202',
    etrfId: 'REQ-102',
    appDate: '2026-11-23',
    appSource: 'Jobstreet',
    relocation: 'Open for Discussion',
    industry: 'Human Resources',
    name: 'Juan Carlo Mendoza',
    age: 26,
    email: 'jc.mendoza@example.com',
    phone: '+63 917 442 8910',
    phone2: '',
    birthdate: '2000-08-25',
    civilStatus: 'Single',
    address: 'Concepcion Pequeña, Naga City',
    father: { name: 'Carlos Mendoza', status: 'Alive', work: 'Accountant' },
    mother: { name: 'Maria Teresa Mendoza', status: 'Deceased', work: '' },
    school: 'Bicol University',
    degree: 'BS Psychology',
    major: 'Industrial Psychology',
    yearGraduated: '2021',
    additionalEducations: [],
    licenses: [
      { title: 'PRC Registered Psychometrician (RPM)', number: 'RPM-004521', exp: '2027-08-25' },
    ],
    certifications: [
      { name: 'Certified Human Resources Associate (CHRA)', issuer: 'HRAAP Philippines', year: '2022' },
    ],
    workExperiences: [
      {
        position: 'Recruitment Associate',
        jobLevel: 'Non-Supervisor',
        company: 'BPO Talent Solutions Inc.',
        fromDate: '2021-09-01',
        toDate: '2026-11-15',
        totalMonths: 62,
        reason: 'Looking for Corporate HR Role',
      },
    ],
    commAssessment: {
      waiverEnabled: true,
      accentRating: 2,
      grammarRating: 3,
      structureRating: 4,
      fluencyRating: 3,
      totalScore: 62,
      cefrLevel: 'B2 (Vantage / Upper Intermediate - High CEFR Level)',
      result: 'Pass (Local Dialect Waiver)',
      interviewerNotes: '',
    },
    icbiAssessment: {
      waiverEnabled: false,
      remarks:
        '<b>Solid Recruitment Execution:</b> Meets supervisory expectations in stakeholder communication and SLA tracking.<ul><li>Recommended for final HRBP panel interview.</li></ul>',
      scores: {
        motivation: {
          rating: 4,
          evidence:
            'Handled Q4 mass-hiring drives while maintaining 95% interview show-up follow-through.',
        },
        jobKnowledge: {
          rating: 4,
          evidence:
            'Managed end-to-end applicant sourcing, psychometric scheduling, and pre-employment compliance trackers.',
        },
        cognitiveSkills: {
          rating: 3,
          evidence:
            'Follows multi-step ATS screening rubrics accurately and verifies applicant credentials via structured checklists.',
        },
        efficiency: {
          rating: 3,
          evidence:
            'Schedules batch interviews consistently on time with zero double-booking.',
        },
        strategicThinking: {
          rating: 3,
          evidence:
            'Plans regional school recruitment pipelines 1–2 months before graduation peaks.',
        },
        marketCustomerOrientation: {
          rating: 4,
          evidence:
            'Tracks local salary benchmarks and applicant feedback to adjust job post messaging.',
        },
        planningOrganizing: {
          rating: 4,
          evidence:
            'Organizes weekly hiring-manager calibration calendars and candidate assessment packs.',
        },
        effectiveDelegation: {
          rating: 3,
          evidence:
            'Coordinates screening call batches with junior recruitment coordinators.',
        },
        financialAcumen: {
          rating: 3,
          evidence:
            'Monitors job-board ad spend and prioritizes zero-cost referral channels first.',
        },
        independence: {
          rating: 4,
          evidence:
            'Ran campus job fair booth solo when hiring lead was pulled into an urgent briefing.',
        },
        accountability: {
          rating: 4,
          evidence:
            'Owned a scheduling mix-up, immediately rescheduled candidate and notified hiring manager with backup slots.',
        },
        communication: {
          rating: 4,
          evidence:
            'Provides timely pipeline status summaries to HRBPs and incorporates feedback into sourcing screens.',
        },
        managingInterdependencies: {
          rating: 3,
          evidence:
            'Coordinates background check handoffs smoothly with HR Operations and onboarding coordinators.',
        },
        ethicalDecisionMaking: {
          rating: 4,
          evidence:
            'Maintains strict data privacy and conflict-of-interest checks on employee referrals.',
        },
        changeManagement: {
          rating: 3,
          evidence:
            'Supported transition to digital candidate forms and guided hiring managers through scorecards.',
        },
        developsTalent: {
          rating: 3,
          evidence:
            'Shares sourcing Boolean guides and interview note templates with new team members.',
        },
        drivesPerformance: {
          rating: 4,
          evidence:
            'Tracks time-to-fill SLAs weekly and follows up promptly on stalled requisition feedback.',
        },
      },
    },
  },
];
