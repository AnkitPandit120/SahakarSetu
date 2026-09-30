import { KnowledgeDocument, SourceItem } from '../types';

export const VERIFIED_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'drive-farmer-laws-india-1',
    title: 'farmer_related_laws_india (1).txt',
    authority: 'Ministry of Agriculture & Farmers Welfare & Ministry of Cooperation, Govt of India',
    category: 'Agriculture, Farmers & Cooperative Laws',
    yearOrVersion: 'Updated Statutory Compendium 2024',
    officialUrl: 'https://agricoop.gov.in',
    description: 'Comprehensive statutory guide to Indian farmer laws, Model Bye-laws for Multipurpose PACS (2023), PMFBY Crop Insurance rules & 72-hour localized loss intimation, Kisan Credit Card (KCC) 4% effective interest subvention, Seeds Act, Fertilizer Control Order (FCO), and PPV&FRA farmers rights.',
    keySections: [
      {
        section: 'PACS Model Bye-Laws 2023',
        title: 'Multipurpose Cooperative Mandate & Democratic Governance',
        content: 'PACS are empowered to operate 25+ activities including fertilizer dealership, custom hiring centres, cold storage, LPG retail outlets, and CSC centres. Every regular member has strictly One Member One Vote.'
      },
      {
        section: 'PMFBY Crop Insurance & 72-Hour Rule',
        title: 'Capped Farmer Premiums & Loss Intimation Protocol',
        content: 'Farmer premiums are strictly capped at 2.0% for Kharif crops, 1.5% for Rabi crops, and 5.0% for commercial crops. In case of localized calamity (hailstorm, inundation), loss must be reported within 72 hours via Toll-Free 14447 or Crop Insurance App.'
      },
      {
        section: 'Kisan Credit Card (KCC)',
        title: 'Interest Subvention & 4% Effective Net Interest',
        content: 'Normal bank crop loan interest is 7% up to ₹3,00,000. Farmers who repay on time receive 3% Prompt Repayment Incentive, making net effective interest 4% per annum. Collateral-free limit is ₹1.60 lakh.'
      },
      {
        section: 'Seeds Act & Essential Commodities Act (ECA)',
        title: 'Quality Standards, MRP Enforcement & Farmers Seed Rights',
        content: 'Selling substandard seeds or charging above MRP for fertilizers is punishable under ECA 1955. Under PPV&FRA 2001, farmers retain full statutory rights to save, use, sow, resow, and exchange farm-saved seeds.'
      }
    ]
  },
  {
    id: 'drive-indian-laws-quick-ref',
    title: 'Indian_Laws_Quick_Reference.txt',
    authority: 'Ministry of Law and Justice, Government of India',
    category: 'Constitutional, Criminal, RTI & Consumer Laws',
    yearOrVersion: 'Statutory Quick Reference Manual',
    officialUrl: 'https://lawmin.gov.in',
    description: 'Essential quick reference of Indian laws including Constitutional Rights (Articles 14, 19, 21, 43B Cooperative Directive Principle), Zero FIR & arrest safeguards for women (CrPC / BNSS), Right to Information (RTI) 30-day compliance timelines, and Consumer Protection Act 2019.',
    keySections: [
      {
        section: 'Constitution Articles 19(1)(c) & 43B',
        title: 'Right to Form Cooperatives & Directive Principles',
        content: 'Article 19(1)(c) guarantees fundamental right to form cooperative societies. Article 43B mandates the State to promote voluntary formation, autonomous functioning, and democratic management of cooperatives.'
      },
      {
        section: 'Zero FIR & Arrest Safeguards',
        title: 'Jurisdiction-Free FIR & Women Protection Guidelines',
        content: 'Zero FIR can be registered at any police station without jurisdictional hindrance and transferred later. Women cannot be arrested between sunset and sunrise without prior written permission from a Judicial Magistrate.'
      },
      {
        section: 'Right to Information (RTI) Act 2005',
        title: '30-Day Mandatory Disclosure & Penalty on Delay',
        content: 'Public Information Officers (PIO) must supply information within 30 days (48 hours if concerning life and liberty). First appeal lies within 30 days to First Appellate Authority.'
      },
      {
        section: 'Consumer Protection & Cooperative Ombudsman',
        title: 'Grievance Redressal Forums & CRCS Ombudsman',
        content: '3-tier consumer courts for consumer dispute claims. Section 85A of MSCS Act establishes Cooperative Ombudsman for prompt resolution of member deposit disputes and irregularities.'
      }
    ]
  },
  {
    id: 'drive-vehicle-traffic-laws-1',
    title: 'Indian_Vehicle_and_Traffic_Laws (1).txt',
    authority: 'Ministry of Road Transport and Highways (MoRTH), Govt of India',
    category: 'Motor Vehicles, Traffic Fines & Road Safety',
    yearOrVersion: 'Motor Vehicles (Amendment) Act & Rules',
    officialUrl: 'https://morth.nic.in',
    description: 'Comprehensive compendium of Motor Vehicles Act rules, traffic fines (Helmet Section 194D ₹1000 + 3-month DL suspension, Seatbelt Section 194B ₹1000, Drunk Driving Section 185 ₹10000/jail), DigiLocker/mParivahan electronic document validity, Section 134A Good Samaritan legal protection, and agricultural tractor transport norms.',
    keySections: [
      {
        section: 'Section 185, 194B & 194D',
        title: 'Traffic Offences, Compounding Fines & Licence Disqualification',
        content: 'Helmet violation carries ₹1,000 fine and 3-month licence suspension. Seatbelt violation is ₹1,000. Drunk driving (>30mg/100ml blood) carries up to ₹10,000 fine and/or 6 months jail for first offence, ₹15,000/2 years for second.'
      },
      {
        section: 'DigiLocker & mParivahan Acceptance',
        title: 'Legally Binding Electronic DL, RC & Insurance',
        content: 'Under Rule 139 of Central Motor Vehicles Rules and MoRTH notifications, digital documents presented in DigiLocker/mParivahan are on par with original physical certificates and must be accepted by traffic police.'
      },
      {
        section: 'Section 134A Good Samaritan Protection',
        title: 'Civil & Criminal Immunity for Accident Rescuers',
        content: 'Good Samaritans helping road accident victims cannot be held liable, harassed by police, forced to disclose identity, or required to pay hospital admission charges.'
      },
      {
        section: 'Agricultural Tractor & Trailer Norms',
        title: 'Exemptions for Farm Use & Third-Party Insurance Mandate',
        content: 'Tractors and farm trailers used exclusively for agricultural operations are exempt from commercial road permit taxes. Compulsory third-party insurance is legally mandatory for all motorized vehicles.'
      }
    ]
  },
  {
    id: 'drive-land-laws-verified-sources',
    title: 'land_laws_verified_sources.txt',
    authority: 'Department of Land Resources & Ministry of Panchayati Raj',
    category: 'Land Revenue, SVAMITVA, RERA & Land Acquisition',
    yearOrVersion: 'Land Governance & Statutory Property Acts',
    officialUrl: 'https://dolr.gov.in',
    description: 'Complete statutory guide on Land Revenue Codes, Mutation (Dakhil Kharij / 7/12 / Jamabandi / RoR), SVAMITVA Scheme drone survey and rural Property Cards (Gharoni), Right to Fair Compensation in Land Acquisition Act (RFCTLARR 2013 - 4x rural market value compensation), RERA protections, and daughter equal coparcenary inheritance rights under Hindu Succession Act 2005.',
    keySections: [
      {
        section: 'Land Mutation (Dakhil Kharij / 7/12)',
        title: 'Revenue Record of Rights & Time-Bound Mutation',
        content: 'Land mutation records change in ownership in revenue records (7/12, Jamabandi, Khasra-Khatauni). Uncontested mutations must be processed within 30 to 45 days after deed registration.'
      },
      {
        section: 'SVAMITVA Scheme & Property Cards',
        title: 'Drone Survey of Rural Abadi Land & Legal Ownership Titles',
        content: 'SVAMITVA provides official Property Cards (Sampatti Card / Gharoni) for rural inhabited lands, providing clear legal titles usable as collateral for bank credit and building loans.'
      },
      {
        section: 'RFCTLARR Act 2013 (Land Acquisition)',
        title: '4x Rural Market Value Compensation & Mandatory SIA',
        content: 'Guarantees up to 4 times market value compensation in rural areas (2x in urban), mandatory Social Impact Assessment (SIA), and rehabilitation & resettlement (R&R) packages.'
      },
      {
        section: 'Hindu Succession Act 2005 & Land Purchase',
        title: 'Daughters Equal Coparcenary Rights & Agricultural Land Buying Rules',
        content: 'Daughters have equal birthright in ancestral agricultural property. In states like Maharashtra, Gujarat and Karnataka, agricultural land can only be purchased by certified agriculturists.'
      }
    ]
  }
];

export function searchKnowledgeBase(query: string): { doc: KnowledgeDocument; sectionMatch?: { section: string; title: string; content: string }; score: number }[] {
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery.split(/\s+/).filter(t => t.length > 2);

  const results: { doc: KnowledgeDocument; sectionMatch?: { section: string; title: string; content: string }; score: number }[] = [];

  for (const doc of VERIFIED_KNOWLEDGE_DOCUMENTS) {
    let docScore = 0;
    let bestSection: { section: string; title: string; content: string } | undefined = undefined;
    let bestSectionScore = 0;

    // Check title and category
    for (const token of queryTokens) {
      if (doc.title.toLowerCase().includes(token)) docScore += 3;
      if (doc.category.toLowerCase().includes(token)) docScore += 2;
      if (doc.description.toLowerCase().includes(token)) docScore += 1.5;
    }

    // Check sections
    for (const sec of doc.keySections) {
      let secScore = 0;
      const secText = (sec.section + ' ' + sec.title + ' ' + sec.content).toLowerCase();
      for (const token of queryTokens) {
        if (secText.includes(token)) secScore += 2;
      }
      if (secScore > bestSectionScore) {
        bestSectionScore = secScore;
        bestSection = sec;
      }
    }

    const totalScore = docScore + bestSectionScore;
    if (totalScore > 0) {
      results.push({
        doc,
        sectionMatch: bestSection || doc.keySections[0],
        score: totalScore
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
