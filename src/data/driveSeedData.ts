/**
 * Sahakar Documents Seed Data for Google Drive Folder Hierarchy Initialization
 */

export interface FolderStructureDefinition {
  mainFolderName: string;
  subFolders: {
    folderName: string;
    description: string;
    documents: {
      fileName: string;
      mimeType: 'text/markdown' | 'application/vnd.google-apps.document' | 'text/plain';
      title: string;
      category: string;
      content: string;
    }[];
  }[];
}

export const SAHAKAR_COOPERATIVE_DRIVE_STRUCTURE: FolderStructureDefinition = {
  mainFolderName: 'SahakarSetu - PACS & Cooperative Governance Hub',
  subFolders: [
    {
      folderName: '01_Model_Byelaws_and_Statutory_Rules',
      description: 'Official model bylaws for Primary Agricultural Credit Societies (PACS) and state cooperative rules.',
      documents: [
        {
          fileName: 'PACS_Model_Byelaws_2023_Ministry_of_Cooperation.md',
          mimeType: 'text/markdown',
          title: 'Model Byelaws for Primary Agricultural Credit Societies (PACS) - Ministry of Cooperation',
          category: 'Statutory Byelaws',
          content: `# MODEL BYELAWS FOR PRIMARY AGRICULTURAL CREDIT SOCIETIES (PACS)
**Issued by:** Ministry of Cooperation, Government of India (Comprehensive Cooperative Harmonization Framework)
**Classification:** Statutory Operational Model Rules for Primary Cooperatives

---

### CHAPTER I: PRELIMINARY AND OBJECTIVES
1. **Name and Area of Operation:**
   The Society shall be called Primary Agricultural Credit Society (PACS) Limited. The area of operation shall be defined at village/panchayat cluster level.
2. **Multi-Functional Objectives:**
   - Provide short-term, medium-term, and long-term agricultural production and investment credit to member farmers.
   - Supply high-quality certified seeds, balanced fertilizers, micronutrients, bio-pesticides, and farm equipment on hire/sale.
   - Establish and manage Common Service Centers (CSC) offering 300+ e-governance, banking correspondent (BC), and digital citizen services.
   - Establish modern grain storage warehouses, custom hiring centers (CHC), cold rooms, and decentralized LPG/fertilizer retail distribution outlets.
   - Facilitate farmer producer group marketing, dairy collection, and aggregation for fair remunerative price realization.

---

### CHAPTER II: MEMBERSHIP RIGHTS, VOTING & SHARE CAPITAL
1. **Eligibility Criteria for Regular (Class A) Membership:**
   - Any individual who resides within the area of operation, owns or cultivates agricultural land (including tenant farmers, sharecroppers, and oral lessees).
   - Minimum age: 18 years, having legal contractual capacity.
   - Minimum shareholding: At least 1 share of Face Value ₹100 along with one-time entrance fee of ₹10.
2. **Nominal / Associate Members (Class B):**
   - Self Help Groups (SHGs), Joint Liability Groups (JLGs), village artisans, and non-agricultural rural entrepreneurs.
   - Class B members have access to credit/services but possess no voting rights in General Body elections.
3. **Democratic Voting Principle:**
   - Strictly **"One Member, One Vote"** irrespective of the number of shares held (Section 27 of Cooperative Societies Act).
   - No proxy voting shall be permitted in the General Body or Managing Committee elections.
4. **Member Disqualifications:**
   - Defaulting on PACS loan repayment continuously for over 12 months after formal notice.
   - Engaging in business directly competing with the society without Board approval.
   - Conviction by a court for an offence involving moral turpitude.

---

### CHAPTER III: MANAGEMENT AND BOARD OF DIRECTORS
1. **Composition of Managing Committee:**
   - The Board of Directors shall consist of **11 to 15 elected members**, including:
     - Mandatory statutory reservation: Minimum **2 seats for Women**.
     - Mandatory statutory reservation: Minimum **1 seat for Scheduled Caste (SC) / Scheduled Tribe (ST)** members.
     - Mandatory statutory reservation: Minimum **1 seat for Small / Marginal Farmers**.
2. **Tenure and Term Limits:**
   - The tenure of the elected Board shall be **5 years** from the date of the first meeting after election.
   - The President and Vice-President can serve maximum **two consecutive terms** to ensure democratic rotation.
3. **Quorum for Meetings:**
   - **Managing Committee Meeting:** Minimum 50% of the total elected directors (minimum 6 directors). Meetings must be held at least once every month.
   - **Annual General Body Meeting (AGM):** Minimum **25% of total regular voting members** or **100 voting members**, whichever is lower.
   - If quorum is not present within 30 minutes of scheduled time, the meeting stands adjourned to the same day next week at the same time and place.

---

### CHAPTER IV: AUDIT, RESERVE FUNDS & DIVIDEND DISTRIBUTION
1. **Statutory Net Profit Allocation (Section 43):**
   - **Reserve Fund:** Minimum **25%** of net profit must be compulsorily transferred to the Permanent Reserve Fund.
   - **Cooperative Education & Training Fund:** **1% to 2%** to the National/State Cooperative Union.
   - **Bad Debt Reserve & Price Fluctuation Fund:** Minimum **10%** of net surplus.
2. **Maximum Dividend on Shares:**
   - Maximum dividend payable to members on paid-up share capital shall not exceed **12% per annum**.
   - Patronage dividend (bonus rebate) based on volume of business done by members with the society is strongly encouraged.
3. **Mandatory Annual Audit:**
   - Financial accounts must be audited annually by a Chartered Accountant empanelled with the Registrar of Cooperative Societies (RCS) within 6 months of financial year end (before 30th September).

---

### CHAPTER V: DISPUTE RESOLUTION & ARBITRATION
1. Any dispute concerning constitution, elections, management, business transactions, or liquidation shall be referred to the **Registrar of Cooperative Societies (RCS)** under Section 84 of the MSCS Act / State Cooperative Societies Act.
2. Civil court jurisdiction is barred for matters covered under the statutory arbitration clause.`
        },
        {
          fileName: 'State_Cooperative_Elections_and_Term_Rules.md',
          mimeType: 'text/markdown',
          title: 'Statutory Guidelines on Cooperative Society Elections and Tenure',
          category: 'Election Rules',
          content: `# STATUTORY GUIDELINES ON COOPERATIVE ELECTIONS AND GOVERNANCE
**Reference:** State Cooperative Societies Rules & 97th Constitutional Amendment Framework

---

### 1. ELECTION AUTHORITY & SUPERINTENDENCE
- All elections to the Board of Directors of Cooperative Societies (Primary, Central, and Apex) shall be conducted under the superintendence, direction, and control of the **State Cooperative Election Authority (SCEA)**.
- The Secretary/CEO of the society must submit the authenticated voter list to the Returning Officer at least 60 days before the expiry of the incumbent Board's term.

### 2. VOTER LIST & ELIGIBILITY CRITERIA
To be eligible to vote or contest in the Board elections, a member must satisfy:
1. Must be a Class-A regular shareholder for at least **12 consecutive months** prior to the date of election notification.
2. Must have utilized minimum services or products of the cooperative (e.g. deposited produce, transacted credit, or purchased farm inputs) in at least 2 out of the last 3 financial years.
3. Must **NOT be a willful defaulter** in respect of any loan or advance taken from the society or any financial institution.

### 3. NOMINATION & SCRUTINY PROCEDURES
- Candidate nomination forms must be accompanied by non-refundable security deposit:
  - General category: ₹1,000
  - SC/ST/Women reserved seats: ₹500
- Scrutiny of nominations shall be conducted publicly by the appointed Returning Officer (RO).
- Objections must be decided within 48 hours in writing with reasons recorded.

### 4. CODE OF CONDUCT & PENALTIES FOR MALPRACTICE
- Inducement, intimidation, bribery, or liquor distribution to electors shall result in immediate disqualification and prosecution under the Indian Penal Code and Cooperative Act.
- Society funds, vehicles, or infrastructure cannot be utilized for campaigning by any candidate.`
        }
      ]
    },
    {
      folderName: '02_Government_Schemes_and_Circulars',
      description: 'Official subsidy guidelines, interest subvention circulars, and PM-KMY/AIF guidelines.',
      documents: [
        {
          fileName: 'Kisan_Credit_Card_and_Interest_Subvention_Rules_2024_25.md',
          mimeType: 'text/markdown',
          title: 'Modified Interest Subvention Scheme (MISS) & KCC Operational Guidelines',
          category: 'Credit & Subsidy',
          content: `# MODIFIED INTEREST SUBVENTION SCHEME (MISS) & KISAN CREDIT CARD (KCC)
**Authority:** Department of Agriculture & Farmers Welfare (DA&FW) / RBI / NABARD

---

### 1. SHORT-TERM CROP LOAN INTEREST STRUCTURE
- **Benchmark Base Interest Rate:** 7.0% per annum for short-term crop loans up to **₹3,00,000 (3 Lakhs)**.
- **Central Government Interest Subvention:** **1.5% per annum** provided directly to lending banks/PACS.
- **Prompt Repayment Incentive (PRI):** **3.0% per annum** provided as rebate to farmers who repay their dues on or before the due date (1 year or crop harvest cycle).
- **Effective Net Interest Rate for Farmers:** **4.0% per annum** upon timely repayment.

### 2. EXTENSION TO ANIMAL HUSBANDRY & FISHERIES
- Farmers engaged in dairy, poultry, sheep/goat rearing, and fisheries can avail KCC working capital limit up to **₹2,00,000 (2 Lakhs)** at the subsidized 4.0% interest rate within the overall ceiling of ₹3 Lakhs.

### 3. COLLATERAL-FREE CREDIT LIMIT
- Short-term agricultural loans up to **₹1,60,000 (1.6 Lakhs)** (extendable to ₹2,00,000 for tie-up arrangements with milk unions/PACS) require **ZERO collateral security or land mortgage**. Only hypothecation of standing crops/assets is taken.

### 4. STEPS FOR KCC LOAN SANCTION THROUGH PACS
1. Farmer submits standard one-page application with Aadhaar, Land Record (7/12, Khasra/Khatauni), and crop plan.
2. PACS Secretary verifies landholding and issues PACS credit limit passbook within **14 working days**.
3. Credit is disbursed in RuPay KCC card format enabling ATM withdrawals and PoS fertilizer purchases.`
        },
        {
          fileName: 'Agriculture_Infrastructure_Fund_AIF_PACS_Conversion.md',
          mimeType: 'text/markdown',
          title: 'Agriculture Infrastructure Fund (AIF) & Decentralized PACS Godown Scheme',
          category: 'Infrastructure & Grants',
          content: `# AGRICULTURE INFRASTRUCTURE FUND (AIF) - PACS CONVERSION SCHEME
**Authority:** Ministry of Agriculture & Ministry of Cooperation, GoI

---

### 1. OBJECTIVE OF SCHEME
Transform 100,000 Primary Agricultural Credit Societies into vibrant **Multi-Service Centers (MSC)** with post-harvest storage, grain assaying labs, custom hiring centers, and decentralized cold chains.

### 2. FINANCIAL ASSISTANCE & CONCESSIONS
- **Maximum Project Cost:** Up to **₹2 Crore** eligible for interest subvention per project.
- **Interest Subvention Rate:** **3.0% per annum** on bank term loan for a period of up to **7 years**.
- **Credit Guarantee Coverage:** 100% CGTMSE fee borne by the Central Government for loans up to ₹2 Crore (no third-party guarantee needed).
- **Convergence with State Subsidies:** PACS can club AIF interest subvention with 33% capital subsidy under the Agricultural Marketing Infrastructure (AMI) scheme.

### 3. ELIGIBLE POST-HARVEST INFRASTRUCTURE PROJECTS
1. Scientific grain warehouses (100 MT to 2,000 MT capacity).
2. Solar-powered cold storage units for perishables (fruits, vegetables, milk).
3. Primary processing & grading/sorting facilities (dal mills, oil expellers, flour mills).
4. Custom Hiring Centers (CHC) for modern tractors, combine harvesters, drone sprayers.
5. Common Service Centers with solar microgrids and digital connectivity kiosks.`
        }
      ]
    },
    {
      folderName: '03_Dispute_Resolution_and_Arbitration',
      description: 'Standard operating procedures for PACS arbitration, member appeals, and audit rectifications.',
      documents: [
        {
          fileName: 'PACS_Arbitration_and_RCS_Dispute_Resolution_SOP.md',
          mimeType: 'text/markdown',
          title: 'Standard Operating Procedure for Cooperative Arbitration and Section 84 Disputes',
          category: 'Legal Remedies',
          content: `# STANDARD OPERATING PROCEDURE: COOPERATIVE ARBITRATION & RCS DISPUTES
**Authority:** Legal Directorate, Cooperative Governance Portal

---

### 1. JURISDICTION OF COOPERATIVE ARBITRATION
Under Section 84 of the Multi-State Cooperative Societies Act & Corresponding State Acts, all disputes among:
- Member and Society (concerning loans, dividends, shares, or membership termination).
- Employee / Board of Directors and the Society (concerning surcharges, fraud, or misfeasance).
- Between two different cooperative societies.

**Civil Court Bar:** Regular civil courts have no jurisdiction to entertain suits regarding business, elections, or management of registered cooperatives.

### 2. FILING PROCEDURE BEFORE THE ARBITRATOR / REGISTRAR
1. **Preparation of Dispute Memorandum (Form D):**
   - Must contain name and registration of PACS, identity of parties, precise cause of action, chronology of events, and specific reliefs claimed.
2. **Statutory Limitation Period:**
   - **Loan Recovery / Financial Defaults:** 6 years from the date the cause of action arose.
   - **Election Disputes:** 30 days from the declaration of election results.
   - **General Management Disputes:** 3 years from the date of the disputed resolution.
3. **Statutory Court Fee:**
   - Dispute involving monetary claim: 1% to 2% of claim value (capped at ₹5,000 in most states).
   - Non-monetary governance dispute: Fixed fee of ₹250 to ₹500.

### 3. ENFORCEMENT OF ARBITRATION AWARD
- An arbitration award passed by the RCS Arbitrator is deemed a **decree of a Civil Court**.
- It can be executed directly through the Revenue Recovery Act (land revenue attachment) or civil execution warrant.

---

### 4. APPEALS PROCEDURE
- Any party aggrieved by the Arbitrator's award may file an Appeal before the **Cooperative Appellate Tribunal** within **60 days** of communication of the order.
- No stay on recovery of admitted dues shall be granted unless the appellant deposits minimum 25% of the awarded amount.`
        }
      ]
    }
  ]
};
