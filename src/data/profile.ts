export interface ExperienceEntry {
  company: string;
  role: string;
  /** YYYY-MM */
  startDate: string;
  /** YYYY-MM or the literal 'present' */
  endDate: string | 'present';
  location?: string;
  /** At least one responsibility or achievement. */
  highlights: string[];
  technologies?: string[];
}

export interface EducationEntry {
  institution: string;
  qualification: string;
  /** YYYY or YYYY-MM */
  startDate?: string;
  /** YYYY or YYYY-MM */
  endDate: string;
  credentialUrl?: string;
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Language {
  name: string;
  level: string;
}

export interface Profile {
  name: string;
  title: string;
  /** Short, hero-length positioning statement (also used as the landing page meta description). */
  summary: string;
  /** Longer-form introduction for the About page. */
  about: string;
  photo?: string;
  photoAlt?: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  location?: string;
  /** At least three, so a visitor can name three technologies within 30s (SC-001). Curated for the hero/chip display. */
  skills: string[];
  /** Full categorized technical skill set, shown on the About page. */
  skillCategories: SkillCategory[];
  /** Core competencies / value proposition, shown on the About page. */
  focusAreas: FocusArea[];
  languages: Language[];
  resumePdf?: string;
  /** Newest first. */
  experience: ExperienceEntry[];
  education: EducationEntry[];
}

export const profile: Profile = {
  name: 'Roman Mykhailovych',
  title: 'Senior Software Engineer & Software Architect (.NET)',
  summary:
    'Expert Software Engineer and Architect with 15+ years building robust, scalable, ' +
    'mission-critical systems on the .NET stack — from ERP and supply-chain platforms to ' +
    'real-time sync and applied-AI decision support.',
  about:
    'Expert Software Engineer and Architect with 15+ years building robust, scalable, ' +
    'mission-critical systems on the .NET stack. Deep hands-on background in ERP and resource ' +
    'accounting, logistics and supply-chain / procurement, real-time data synchronization across ' +
    'disconnected clients, role-based workflow systems, and monitoring / alerting. Owns ' +
    'architecture end to end — from documented decisions (C4, ADR, fitness functions, FR/NFR) to ' +
    'backend, data design, and operator-facing desktop clients. Currently working on enterprise ' +
    'solutions incorporating applied AI (LLMs, RAG, Agentic AI) for decision support and ' +
    'automation. Comfortable across cloud (Azure, AWS) and on-premise / restricted-network ' +
    'deployments.',
  photo: '/images/profile-photo.svg',
  photoAlt: 'Portrait placeholder for Roman Mykhailovych',
  email: 'rmyhaylovych@msn.com',
  githubUrl: 'https://github.com/lapsick',
  linkedinUrl: 'https://www.linkedin.com/in/roman-mykhailovych/',
  location: 'Lviv Region, Ukraine',
  skills: [
    '.NET / ASP.NET Core',
    'Software Architecture',
    'C4, ADR, Fitness Functions',
    'Azure / AWS / On-Prem',
    'ERP & Supply Chain Systems',
    'Real-Time Sync',
    'Agentic AI / RAG',
    'TypeScript / Angular',
    'PostgreSQL / MongoDB / Qdrant',
    'WPF / Windows Forms',
    'System Design',
    'DDD / TDD'
  ],
  skillCategories: [
    {
      name: 'Architecture',
      skills: [
        'Multi-tiered',
        'Clean Architecture',
        'Modular Monolith',
        'Service-based',
        'C4',
        'UML',
        'Architecture-as-Code',
        'FR/NFR',
        'ASR/ADR',
        'Fitness Functions',
        'draw.io',
        'Lucid',
        'Miro',
      ],
    },
    {
      name: 'Backend (.NET)',
      skills: [
        'ASP.NET Core',
        'Web API',
        'MVC',
        'Entity Framework',
        'ASP.NET Zero / ABP',
        'WCF',
        'Web Forms (legacy)',
      ],
    },
    {
      name: 'Messaging & Caching',
      skills: ['Kafka', 'RabbitMQ', 'Redis', 'Hangfire'],
    },
    {
      name: 'Desktop / Operator UI',
      skills: ['WPF', 'Windows Forms'],
    },
    {
      name: 'Data & Storage',
      skills: ['MS SQL Server', 'PostgreSQL', 'MongoDB', 'Cassandra', 'MySQL', 'SQLite', 'Qdrant (vector)'],
    },
    {
      name: 'Applied AI / ML',
      skills: [
        'GenAI',
        'LLMs',
        'Agentic AI',
        'ML',
        'RAG',
        'Agentic RAG',
        'MCP',
        'Semantic Kernel',
        'Microsoft Agents Framework',
      ],
    },
    {
      name: 'Cloud & On-Prem',
      skills: [
        'Azure Functions',
        'Azure Service Bus',
        'Cosmos DB',
        'Table Storage',
        'Bot Framework',
        'Azure AI Search',
        'Azure AI Foundry',
        'AWS Lambda',
        'AWS S3',
        'On-premise / restricted-network',
      ],
    },
    {
      name: 'Frontend',
      skills: ['TypeScript', 'JavaScript', 'Angular', 'AngularJS', 'jQuery', 'HTML/CSS/LESS'],
    },
    {
      name: 'Tooling',
      skills: ['Visual Studio', 'VS Code', 'Cursor', 'GitHub Copilot', 'Claude Code'],
    },
  ],
  focusAreas: [
    {
      title: 'ERP, supply chain & resource accounting',
      description:
        '8+ years building ERP platforms with integrated inventory, procurement, and logistics.',
    },
    {
      title: 'Disconnected-first sync & real-time state',
      description:
        'Synchronization layers and offline-capable clients; real-time multi-user collaboration ' +
        'and live event / notification flows.',
    },
    {
      title: 'Logistics & operations platforms',
      description:
        'Yard / shipment management, work-order dispatch, fleet / lead management, ' +
        'completion-metrics dashboards.',
    },
    {
      title: 'Role-based, workflow-driven systems',
      description: 'Multi-role access, configurable wizards, process splitting across users.',
    },
    {
      title: 'Monitoring & alerting',
      description:
        'Status aggregation and time-sensitive notifications across distributed client environments.',
    },
    {
      title: 'Architecture ownership',
      description:
        'Translating hard NFRs (reliability, scale, security) into documented, defensible designs.',
    },
    {
      title: 'Applied AI for decision support',
      description:
        'LLM / RAG / Agentic pipelines for analysis, document processing, and back-office automation.',
    },
  ],
  languages: [
    { name: 'Ukrainian', level: 'Native' },
    { name: 'English', level: 'B2' },
  ],
  resumePdf: '/resume.pdf',
  experience: [
    {
      company: 'Rocket Harbor',
      role: 'Senior Software Engineer / Software Architect',
      startDate: '2017-12',
      endDate: 'present',
      location: 'Lviv Region, Ukraine',
      highlights: [
        'Architect and lead engineer for a portfolio of enterprise ERP, logistics, and supply-chain platforms, owning system design, data models, and architecture decisions (C4, ADR, fitness functions) end to end.',
        'CubeMonk — ERP with integrated logistics and supply management (inventory, procurement, order / shipment tracking, resource accounting).',
        'Cerve — ERP + logistics platform.',
        'Cend — ERP + supplies / procurement platform.',
        'Tektiles — ERP for MSP (managed service provider) operations: asset, vendor, and service management.',
        'MSP Customer Agent — designed and built an Agentic AI assistant on Microsoft Foundry (LLM / RAG / Agentic AI, Semantic Kernel, MCP) automating customer support and decision workflows.',
      ],
      technologies: ['ASP.NET Core', 'ABP', 'Azure', 'PostgreSQL', 'Qdrant', 'Angular', 'TypeScript'],
    },
    {
      company: 'Neadevis',
      role: 'Software Engineer',
      startDate: '2016-03',
      endDate: '2017-08',
      location: 'Lviv, Ukraine',
      highlights: [
        'Built a real-time collaborative editing platform letting multiple users edit web documents simultaneously — concurrency control, conflict resolution, live sync.',
        'Delivered Backup Radar, a backup-monitoring and alerting product — status aggregation and notifications across many client environments.',
      ],
    },
    {
      company: 'Artelogic',
      role: '.NET Developer',
      startDate: '2013-03',
      endDate: '2016-03',
      location: 'Lviv, Ukraine',
      highlights: [
        'Vehicle Inspection Management System — owned architecture and database design; built the backend and offline-capable mobile clients (Android / iOS / Windows 8) with a synchronization layer for disconnected operation; role-based access and configurable wizard workflows.',
        'Web Synapse (Yard Manager) — real-time yard / shipment logistics management with event tracking and notifications for time-sensitive shipments.',
        'Titan SolvOne (Work Order Manager) — centralized facility operations dashboard: vendor / technician management, dispatch tracking, completion metrics, invoicing.',
        'InkProPlus / Mover Technologies — scalable business- and lead-management platforms; owned architecture and DB design.',
      ],
    },
    {
      company: 'Freelance',
      role: '.NET Web Developer',
      startDate: '2017-01',
      endDate: '2018-12',
      highlights: ['Freelance .NET web development, in parallel with the full-time role at Rocket Harbor.'],
    },
    {
      company: 'Abto Software',
      role: '.NET Developer',
      startDate: '2011-12',
      endDate: '2012-08',
      highlights: ['MS Dynamics CRM solutions.'],
    },
    {
      company: 'ViSoft GmbH',
      role: '.NET Developer',
      startDate: '2011-07',
      endDate: '2011-12',
      highlights: ['Silverlight applications.'],
    },
    {
      company: 'Edvantis',
      role: '.NET Developer',
      startDate: '2010-04',
      endDate: '2011-07',
      highlights: ['ASP.NET web development.'],
    },
    {
      company: 'DMD Ukraine',
      role: '.NET Developer',
      startDate: '2007-12',
      endDate: '2010-01',
      highlights: ['WinForms desktop apps and web services.'],
    },
  ],
  education: [
    {
      institution: 'Ivan Franko National University of Lviv',
      qualification: "Bachelor's Degree",      
      endDate: '2005',
    },
  ],
};
