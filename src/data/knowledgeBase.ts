import { KnowledgeDocument, SourceItem } from '../types';

export const VERIFIED_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'mscs-act-2023',
    title: 'Multi-State Co-operative Societies Act, 2002 & (Amendment) Act, 2023',
    authority: 'Ministry of Cooperation, Government of India',
    category: 'Cooperative Law & Governance',
    yearOrVersion: 'Act No. 39 of 2002 (Amended 2023)',
    officialUrl: 'https://cooperation.gov.in',
    description: 'Statutory framework governing multi-state cooperative societies in India including board composition, democratic elections, auditing, and member rights.',
    keySections: [
      {
        section: 'Section 29',
        title: 'Disqualification for being a member',
        content: 'No person shall be admitted as a member of a multi-state cooperative society if he has not applied in writing, or has been convicted of an offence involving moral turpitude, or is in default of payment of any loan or money due to the society.'
      },
      {
        section: 'Section 30',
        title: 'Rights of Members',
        content: 'Every member has the right to vote in the general meetings (one member, one vote principle), inspect books of accounts and annual audit reports, attend general meetings, receive dividends if approved, and receive copy of by-laws.'
      },
      {
        section: 'Section 45',
        title: 'Co-operative Election Authority',
        content: 'The Central Government shall constitute a Co-operative Election Authority to conduct elections of the board of multi-state cooperative societies, ensuring free, fair, and timely democratic process.'
      },
      {
        section: 'Section 70',
        title: 'Auditing of Multi-State Co-operative Societies',
        content: 'Every multi-state co-operative society must have its accounts audited annually by an auditor selected from an approved panel maintained by the Central Registrar.'
      },
      {
        section: 'Section 84',
        title: 'Disputes which may be referred to Arbitration',
        content: 'Notwithstanding anything contained in any other law, any dispute touching the constitution, management, elections, or business of a multi-state co-operative society shall be referred to arbitration.'
      },
      {
        section: 'Section 85A',
        title: 'Co-operative Ombudsman',
        content: 'Introduced by 2023 Amendment: The Central Government appoints one or more Co-operative Ombudsman for resolving member grievances relating to non-receipt of share certificate, loan irregularities, election delays, or corruption.'
      }
    ]
  },
  {
    id: 'pacs-model-byelaws-2023',
    title: 'Model Bye-Laws for Primary Agricultural Credit Societies (PACS)',
    authority: 'Ministry of Cooperation & National Council for Cooperative Training (NCCT)',
    category: 'PACS Services & Rural Governance',
    yearOrVersion: '2023 Guidelines',
    officialUrl: 'https://cooperation.gov.in/pacs-model-byelaws',
    description: 'Transformative model bye-laws enabling PACS to expand into multipurpose entities including Common Service Centres (CSC), dairy, fishery, custom hiring centres, and fertilizer distribution.',
    keySections: [
      {
        section: 'Clause 4',
        title: 'Objectives of Model PACS',
        content: 'To promote economic interests of members by providing short-term, medium-term agricultural credit, inputs (seeds, fertilizers), warehousing, Common Service Centre (CSC) digital services, dairy and fisheries operations, and LPG/Petrol retail outlets.'
      },
      {
        section: 'Clause 8',
        title: 'Membership & Eligibility',
        content: 'Any individual residing within the area of operation of the PACS who is a farmer, agricultural labourer, artisan, or small entrepreneur is eligible for regular voting membership upon purchasing at least one share and paying the admission fee.'
      },
      {
        section: 'Clause 14',
        title: 'Borrowing Power and Credit Assessment',
        content: 'Loans for crop cultivation are disbursed based on scale of finance fixed by District Level Technical Committee (DLTC), linked directly with Kisan Credit Card (KCC) limits.'
      },
      {
        section: 'Clause 22',
        title: 'Digital PACS & Computerization Standards',
        content: 'PACS must maintain accounts on standard ERP software linked with NABARD and District Central Cooperative Banks (DCCB) to ensure transparency and instant subsidy credit.'
      }
    ]
  },
  {
    id: 'pmfby-guidelines',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) Operational Guidelines',
    authority: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    category: 'Agriculture & Crop Insurance',
    yearOrVersion: 'Revised Operational Guidelines',
    officialUrl: 'https://pmfby.gov.in',
    description: 'Comprehensive risk coverage for crops against non-preventable natural risks from pre-sowing to post-harvest stages.',
    keySections: [
      {
        section: 'Chapter 2, Section 2.1',
        title: 'Coverage of Farmers',
        content: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers are eligible for coverage. Scheme is voluntary for all farmers.'
      },
      {
        section: 'Chapter 3, Section 3.2',
        title: 'Premium Rates Payable by Farmers',
        content: 'Maximum premium payable by farmer is strictly capped at 2.0% for Kharif food and oilseed crops, 1.5% for Rabi food and oilseed crops, and 5.0% for annual commercial/horticultural crops. Balance actuarial premium is subsidized 50:50 by Central and State Governments.'
      },
      {
        section: 'Chapter 4, Section 4.2',
        title: 'Loss Intimation in Case of Localized Calamities',
        content: 'In case of localized calamities (hailstorm, landslide, inundation, cloudburst) or post-harvest losses (cyclone, unseasonal rains), the insured farmer MUST intimate loss within 72 hours through the Crop Insurance App, Toll-free Number 14447, or nearest bank/PACS branch.'
      },
      {
        section: 'Chapter 5, Section 5.4',
        title: 'Claim Assessment & Direct Bank Transfer',
        content: 'Claims are assessed based on Crop Cutting Experiments (CCE) and localized joint surveys, and transferred directly to the farmer bank account via Aadhaar Enabled Payment System (AEPS).'
      }
    ]
  },
  {
    id: 'kcc-guidelines',
    title: 'Kisan Credit Card (KCC) Scheme & Revised Interest Subvention',
    authority: 'Reserve Bank of India (RBI) & NABARD',
    category: 'Finance & Financial Literacy',
    yearOrVersion: 'Master Circular on KCC',
    officialUrl: 'https://www.nabard.org',
    description: 'Adequate and timely credit support from the banking system under a single window with flexible and simplified procedures for cultivation and allied activities.',
    keySections: [
      {
        section: 'Section 3',
        title: 'Quantum of Credit & Scale of Finance',
        content: 'Credit limit for 1st year = Crop scale of finance x Extent of area cultivated + 10% for post-harvest/household + 20% for maintenance of farm assets. Valid for 5 years with 10% increase every year.'
      },
      {
        section: 'Section 6',
        title: 'Interest Subvention Scheme (ISS)',
        content: 'Short-term crop loans up to Rs 3,00,000 are provided at an effective interest rate of 4% per annum (7% normal rate minus 3% Prompt Repayment Incentive) to farmers who repay on or before due date.'
      },
      {
        section: 'Section 7',
        title: 'Collateral-free Loan Threshold',
        content: 'No collateral security or hypothecation is required for KCC crop loans up to Rs 1,60,000 (extended up to Rs 2,00,000 under specific tie-up agreements with PACS/sugar mills).'
      }
    ]
  },
  {
    id: 'pm-kisan-guidelines',
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) Guidelines',
    authority: 'Ministry of Agriculture and Farmers Welfare',
    category: 'Government Schemes',
    yearOrVersion: 'Operational Modalities',
    officialUrl: 'https://pmkisan.gov.in',
    description: 'Income support scheme providing financial benefit of Rs 6,000 per annum to all landholding farmer families across the country.',
    keySections: [
      {
        section: 'Clause 2',
        title: 'Benefit Quantum and Distribution',
        content: 'Rs 6,000 per year transferred directly into bank accounts in three equal 4-monthly installments of Rs 2,000 each via DBT.'
      },
      {
        section: 'Clause 3',
        title: 'Mandatory e-KYC and Land Seeding',
        content: 'To receive PM-KISAN benefits, farmer must have verified e-KYC (via OTP, Biometrics, or Face Authentication app), land ownership document seeded with state land registry, and Aadhaar-seeded active bank account (NPCI DBT enabled).'
      },
      {
        section: 'Clause 5',
        title: 'Exclusion Categories',
        content: 'Institutional landholders, current/former constitutional post holders, serving/retired government employees (except Group D/Multi Tasking Staff), income tax payees in last assessment year, and professionals (doctors, engineers, lawyers, CA) are not eligible.'
      }
    ]
  },
  {
    id: 'grievance-crcs-cpgrams',
    title: 'Cooperative Grievance Redressal Mechanism & CPGRAMS Guidelines',
    authority: 'Central Registrar of Cooperative Societies (CRCS) & DARPG',
    category: 'Grievance Redressal',
    yearOrVersion: 'Citizen Charter & Portal Manual',
    officialUrl: 'https://crcs.gov.in',
    description: 'Procedural guidance for filing and tracking complaints against cooperative societies, refund delays, electoral malpractices, and staff misconduct.',
    keySections: [
      {
        section: 'Procedure 1',
        title: 'Primary Resolution with Managing Committee / Secretary',
        content: 'Member must first submit written representation to the PACS Secretary or Cooperative Society Board, obtaining signed acknowledgement receipt. The society has 30 days to resolve the grievance.'
      },
      {
        section: 'Procedure 2',
        title: 'Escalation to District Deputy Registrar (DDR) / RCS',
        content: 'If unresolved within 30 days, file statutory appeal under State Cooperative Societies Act to the Assistant/Deputy Registrar of Cooperative Societies of the respective district.'
      },
      {
        section: 'Procedure 3',
        title: 'Multi-State Societies Portal (CRCS) & Cooperative Ombudsman',
        content: 'For Multi-State societies, file complaint directly online at crcs.gov.in or pgportal.gov.in under Ministry of Cooperation. Time-bound investigation is mandated within 60 days.'
      }
    ]
  },
  {
    id: 'property-land-records',
    title: 'Land Records, 7/12 Extract, and Cooperative Mortgage Procedures',
    authority: 'Department of Land Resources & State Revenue Departments',
    category: 'Property & Documents',
    yearOrVersion: 'Digital India Land Records Modernization Programme (DILRMP)',
    officialUrl: 'https://dilrmp.gov.in',
    description: 'Documentation requirements for agricultural land verification, crop loan hypothecation, non-encumbrance certificates, and inheritance mutation.',
    keySections: [
      {
        section: 'Rule 1',
        title: 'Record of Rights (RoR / 7/12 / Khasra-Khatauni)',
        content: 'Essential document proving land ownership, survey number, area, crop details, and existing encumbrances or bank charges (Bhoomi/Anyror/Mahabhulekh/BanglarBhumi).'
      },
      {
        section: 'Rule 2',
        title: 'Creation of Charge (Gehan / Mortgage / Bojh)',
        content: 'Under Cooperative Acts, when a member obtains an agricultural loan from PACS, a statutory charge is created on the land without physical transfer of title deed, registered electronically with the sub-registrar.'
      },
      {
        section: 'Rule 3',
        title: 'No Objection Certificate (NOC) and Discharge of Charge',
        content: 'Upon full repayment of the cooperative loan, the PACS issues a Loan Clearance Certificate, and the Secretary submits an e-mutation application to remove the bank charge from the land record within 15 days.'
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
