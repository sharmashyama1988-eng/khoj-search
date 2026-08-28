const { saveDb } = require('../db_helper.js');

// 1. POLITICS & CONSTITUTION
const politicsEntries = [
  {
    id: 'pol-five-constitutional-writs',
    keywords: ['five writs in indian constitution article 32 article 226', 'habeas corpus mandamus quo warranto certiorari prohibition', 'supreme court high court writ jurisdiction'],
    title: 'Five Types of Writs in the Indian Constitution (Articles 32 & 226)',
    category: 'Politics',
    answer: 'The Constitution of India empowers the Supreme Court (Article 32) and High Courts (Article 226) to issue 5 prerogative writs for enforcing Fundamental Rights: (1) Habeas Corpus ("To have the body" — against illegal detention), (2) Mandamus ("We command" — orders public authority to perform official duty), (3) Prohibition (stops lower court from exceeding jurisdiction), (4) Certiorari ("To be certified" — quashes illegal orders of lower courts), (5) Quo Warranto ("By what authority" — prevents illegal usurpation of public office).',
    highlights: [
      'Habeas Corpus: Most powerful safeguard against unlawful arrest or detention by state or private individuals',
      'Mandamus: Issued against public officials, inferior courts, tribunals, or corporations refusing to perform statutory duties',
      'Prohibition vs Certiorari: Prohibition is preventive (during proceedings); Certiorari is curative (after order is passed)',
      'Quo Warranto: Can be filed by ANY interested citizen, not only the aggrieved person (unlike other writs)',
      'Dr. B.R. Ambedkar declared Article 32 as the "Very Soul of the Constitution and the very heart of it"'
    ],
    url: 'https://en.wikipedia.org/wiki/Writ'
  },
  {
    id: 'pol-lok-sabha-vs-rajya-sabha',
    keywords: ['lok sabha vs rajya sabha differences', 'lower house vs upper house indian parliament', 'money bill article 110 rajya sabha 14 days', 'presiding officers speaker chairman'],
    title: 'Lok Sabha vs Rajya Sabha — Structure & Powers of Parliament',
    category: 'Politics',
    answer: 'The Indian Parliament consists of the President and two Houses: Lok Sabha (House of the People / Lower House, up to 543 elected members, 5-year term) and Rajya Sabha (Council of States / Upper House, up to 250 members, permanent body with ⅓ members retiring every 2 years, 6-year tenure). Lok Sabha has exclusive power over Money Bills (Article 110) and Council of Ministers is collectively responsible strictly to Lok Sabha.',
    highlights: [
      'Lok Sabha: 543 seats (all directly elected by citizens under Universal Adult Suffrage); Presided over by Speaker of Lok Sabha',
      'Rajya Sabha: 238 elected by State Legislative Assemblies + 12 nominated by President (Literature, Science, Art, Social Service); Presided over by Vice-President of India as ex-officio Chairman',
      'Money Bill (Article 110): Introduced ONLY in Lok Sabha with President\'s recommendation; Rajya Sabha can only delay for 14 days',
      'Joint Sitting of Parliament (Article 108): Summoned by President, presided over by Lok Sabha Speaker to resolve ordinary bill deadlocks',
      'Rajya Sabha Special Powers (Articles 249 & 312): Authorize Parliament to legislate on State List and create new All India Services (e.g. IAS, IPS, IFS)'
    ],
    url: 'https://en.wikipedia.org/wiki/Parliament_of_India'
  }
];

// 2. ECONOMICS
const econEntries = [
  {
    id: 'econ-gdp-gnp-ndp-nnp',
    keywords: ['difference between gdp and gnp', 'gross domestic product vs gross national product', 'net domestic product ndp nnp national income', 'gdp calculation expenditure approach'],
    title: 'GDP, GNP, NDP, NNP & National Income Measurement',
    category: 'Economics',
    answer: 'GDP (Gross Domestic Product) is the total monetary value of all final goods and services produced within a country\'s geographic borders in a year (GDP = C + I + G + (X - M)). GNP (Gross National Product) includes Net Factor Income from Abroad (NFIA): GNP = GDP + NFIA. NDP = GDP - Depreciation. NNP at Factor Cost equals the true National Income of a country.',
    highlights: [
      'GDP Formula (Expenditure Approach): GDP = C (Private Consumption) + I (Gross Investment) + G (Government Spending) + (X - M) (Net Exports)',
      'GNP = GDP + Net Factor Income from Abroad (NFIA = income earned by residents abroad minus income earned by foreigners domestically)',
      'Nominal GDP (at current market prices) vs Real GDP (adjusted for inflation using GDP Deflator)',
      'Purchasing Power Parity (PPP): Compares economic output adjusting for price differences of an identical basket of goods',
      'India ranks 5th in world by Nominal GDP (~$3.75 Trillion) and 3rd in world by PPP (~$13 Trillion in 2024)'
    ],
    url: 'https://en.wikipedia.org/wiki/Gross_domestic_product'
  },
  {
    id: 'econ-fiscal-vs-monetary-policy',
    keywords: ['fiscal policy vs monetary policy differences', 'repo rate reverse repo rate rbi', 'crr slr qualitative quantitative monetary tools', 'fiscal deficit formula revenue deficit'],
    title: 'Fiscal Policy vs Monetary Policy and Central Bank Tools',
    category: 'Economics',
    answer: 'Fiscal Policy is managed by the Ministry of Finance / Government using taxation and public spending to stimulate growth and manage fiscal deficit. Monetary Policy is managed by the Central Bank (RBI in India / Federal Reserve in USA) controlling money supply, interest rates, and inflation using tools like Repo Rate, Reverse Repo Rate, Cash Reserve Ratio (CRR), Statutory Liquidity Ratio (SLR), and Open Market Operations (OMO).',
    highlights: [
      'Repo Rate: Interest rate at which RBI lends short-term funds to commercial banks against government securities',
      'Reverse Repo Rate: Interest rate at which RBI borrows funds from commercial banks to absorb excess liquidity',
      'CRR (Cash Reserve Ratio): Percentage of Net Demand and Time Liabilities (NDTL) banks must hold in cash with RBI with zero interest',
      'SLR (Statutory Liquidity Ratio): Percentage of deposits banks must invest in safe liquid assets (Gold, Government Securities)',
      'Fiscal Deficit = Total Expenditure - Total Receipts (excluding borrowings); financed through market loans and external debt'
    ],
    url: 'https://en.wikipedia.org/wiki/Monetary_policy'
  }
];

// 3. HEALTH & MEDICINE
const healthDeepEntries = [
  {
    id: 'health-immune-system-b-t-cells',
    keywords: ['immune system innate vs adaptive immunity', 'b cells vs t cells antibodies humors', 'cd4 helper t cells cd8 cytotoxic t cells', 'vaccines immunological memory'],
    title: 'Human Immune System — Innate & Adaptive Immunity (B & T Cells)',
    category: 'Health & Medicine',
    answer: 'The human immune system provides dual defense: (1) Innate Immunity (non-specific, immediate defense: skin physical barrier, stomach acid chemical barrier, neutrophils, macrophages, complement system), and (2) Adaptive Immunity (antigen-specific, creates long-term immunological memory): Humoral Immunity mediated by B cells producing Antibodies (IgG, IgM, IgA, IgE, IgD) and Cell-Mediated Immunity mediated by T cells (CD4+ Helper T cells activating responses and CD8+ Cytotoxic T cells destroying virus-infected/cancer cells).',
    highlights: [
      'B Lymphocytes (mature in Bone marrow): Differentiate into Plasma cells (secreting thousands of antibodies/sec) and Memory B cells',
      'T Lymphocytes (mature in Thymus): CD4+ T-Helper cells direct immune response (target of HIV virus); CD8+ Cytotoxic T-cells trigger apoptosis in infected cells via perforin and granzymes',
      'Antibody classes: IgG (most abundant 80%, crosses placenta), IgM (first responder, pentamer), IgA (in secretions: tears, saliva, breast milk), IgE (allergic reactions and parasites), IgD (B-cell receptor)',
      'Active Immunity (induced by infection or vaccines with memory) vs Passive Immunity (preformed antibodies: anti-venom, mother\'s colostrum)'
    ],
    url: 'https://en.wikipedia.org/wiki/Immune_system'
  },
  {
    id: 'health-insulin-diabetes-physiology',
    keywords: ['diabetes mellitus type 1 vs type 2 physiology', 'insulin glucagon mechanism islets of langerhans', 'hba1c test fasting blood sugar levels', 'ketoacidosis insulin resistance'],
    title: 'Insulin, Glucagon & Diabetes Mellitus Physiology',
    category: 'Health & Medicine',
    answer: 'Blood glucose homeostasis is maintained by pancreatic Islets of Langerhans: Beta (β) cells secrete Insulin to facilitate cellular glucose uptake via GLUT-4 transporters and promote glycogenesis in liver/muscle; Alpha (α) cells secrete Glucagon to stimulate glycogenolysis and gluconeogenesis during fasting. Type 1 Diabetes is an autoimmune destruction of pancreatic β-cells (absolute insulin deficiency); Type 2 Diabetes is characterized by peripheral insulin resistance and progressive secretory defect.',
    highlights: [
      'Normal Fasting Blood Sugar: 70–99 mg/dL (Prediabetes: 100–125 mg/dL; Diabetes: ≥126 mg/dL)',
      'Postprandial (2-hour after meal) Blood Sugar: <140 mg/dL (Diabetes: ≥200 mg/dL)',
      'HbA1c (Glycated Hemoglobin): Reflects average blood sugar over past 3 months; Normal <5.7%, Prediabetes 5.7–6.4%, Diabetes ≥6.5%',
      'Diabetic Ketoacidosis (DKA): Life-threatening complication primarily in Type 1 where extreme insulin absence forces fatty acid breakdown into acidic ketone bodies (acetone, acetoacetate, β-hydroxybutyrate)',
      'Metformin: First-line oral drug for Type 2 diabetes that inhibits hepatic gluconeogenesis via AMPK activation'
    ],
    url: 'https://en.wikipedia.org/wiki/Diabetes'
  }
];

// 4. LANGUAGES & LITERATURE
const langLitEntries = [
  {
    id: 'lit-classical-languages-india',
    keywords: ['classical languages of india criteria list', 'sanskrit tamil telugu kannada malayalam odia marathi pali prakrit assamese bengali', 'ministry of culture classical status'],
    title: 'Classical Languages of India — Complete List & Criteria',
    category: 'Languages & Literature',
    answer: 'India officially recognizes 11 Classical Languages having high antiquity (early texts recorded over 1,500–2,000 years), ancient literature considered valuable heritage, and original literary tradition: Tamil (declared 2004), Sanskrit (2005), Kannada (2008), Telugu (2008), Malayalam (2013), Odia (2014), and expanded in October 2024 to include Marathi, Pali, Prakrit, Assamese, and Bengali.',
    highlights: [
      'Tamil: First language to receive Classical status in 2004 (Sangam literature dating back to 300 BCE)',
      'Sanskrit: Declared in 2005 (Vedas, Upanishads, Panini\'s Ashtadhyayi grammar (~500 BCE))',
      'Kannada & Telugu: Declared in 2008 (Kavirajamarga in Kannada, Nannayya\'s Mahabharata in Telugu)',
      'Malayalam (2013) and Odia (2014)',
      'New Additions (October 2024): Marathi, Pali, Prakrit, Assamese, and Bengali approved by Union Cabinet'
    ],
    url: 'https://en.wikipedia.org/wiki/Classical_languages_of_India'
  }
];

saveDb('politics.json', politicsEntries);
saveDb('economics.json', econEntries);
saveDb('health_medicine.json', healthDeepEntries);
saveDb('languages_literature.json', langLitEntries);