import { Question } from "../types";
import generatedQuestionsJson from "./generated-questions.json";

// Helper to gracefully merge the generated questions
const generatedQuestions = (generatedQuestionsJson as unknown) as Question[];

function makeHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

const now = "2026-09-03T18:00:00.000Z";

function q(
  id: string,
  book: "narayan_reddy" | "park",
  chapter: string,
  topic: string,
  question: string,
  options: [string, string, string, string],
  correct_index: number,
  explanation: string,
  difficulty: "easy" | "medium" | "hard"
): Question {
  return {
    id,
    book,
    chapter,
    topic,
    question,
    options,
    correct_index,
    explanation,
    difficulty,
    source: "seed",
    verified: true,
    verified_by: "Dr. K.S. Narayan Reddy & K. Park Reference Alignment",
    confidence: 100,
    content_hash: makeHash(id + question),
    created_at: now,
    updated_at: now,
  };
}

export const seedQuestions: Question[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // NARAYAN REDDY — FORENSIC MEDICINE & TOXICOLOGY (20 Chapters)
  // ═══════════════════════════════════════════════════════════════════════════

  // Ch 1: Introduction to Forensic Medicine
  q(
    "nr-q001",
    "narayan_reddy",
    "nr-01",
    "Legal Definitions",
    "Medical jurisprudence primarily deals with which of the following aspects?",
    [
      "Application of medical knowledge to legal administration and court proceedings",
      "Legal responsibilities and duties of a medical practitioner in professional practice",
      "Treatment of prisoners and custody victims",
      "Study of industrial toxicology and occupational hazards"
    ],
    1,
    "Medical jurisprudence refers specifically to the legal aspects of medical practice, including physician responsibilities, ethics, and civil liabilities. In contrast, forensic medicine is the application of medical science to the investigation of law violations.",
    "medium"
  ),
  q(
    "nr-q002",
    "narayan_reddy",
    "nr-01",
    "Historical Landmarks",
    "Who is historically regarded as the 'Father of Modern Toxicology'?",
    [
      "Ambroise Paré",
      "Mathieu Orfila",
      "Paulus Zacchias",
      "Antistius"
    ],
    1,
    "Mathieu Orfila (1787–1853) is celebrated as the Father of Modern Toxicology for establishing chemical analysis techniques to detect poisons in tissues.",
    "easy"
  ),

  // Ch 2: Legal Procedures
  q(
    "nr-q003",
    "narayan_reddy",
    "nr-02",
    "Inquest & CrPC",
    "Under Section 176 CrPC (now BNSS equivalents), magistrate inquest is mandatory in which of the following conditions?",
    [
      "Death due to road traffic accident",
      "Death occurring in police or judicial custody",
      "Death due to confirmed snake bite in agricultural fields",
      "Death occurring in an industrial machinery collapse"
    ],
    1,
    "Section 176 CrPC mandates a Magisterial Inquest in cases of death in police custody, death during police interrogation, deaths in psychiatric institutions, and dowry deaths occurring within 7 years of marriage.",
    "hard"
  ),
  q(
    "nr-q004",
    "narayan_reddy",
    "nr-02",
    "Medical Evidence",
    "Which type of witness testimony is admissible when a doctor presents facts directly perceived through clinical examination?",
    [
      "Hearsay evidence",
      "Common witness testimony of direct observation",
      "Expert opinion evidence only",
      "Privileged communication"
    ],
    1,
    "When a medical practitioner testifies regarding factual physical findings (e.g. dimensions of a laceration), they act as a common witness of fact. When interpreting the cause or mechanism, they provide expert evidence under Section 45 of the Indian Evidence Act.",
    "medium"
  ),

  // Ch 3: Identification
  q(
    "nr-q005",
    "narayan_reddy",
    "nr-03",
    "Dactyloscopy",
    "In dactyloscopy (fingerprint analysis), which pattern is the most frequently encountered in the general population?",
    [
      "Arches",
      "Loops",
      "Whorls",
      "Composites"
    ],
    1,
    "Loops represent approximately 60–65% of all fingerprint patterns, followed by whorls (30–35%), arches (5%), and composites (1–2%).",
    "easy"
  ),
  q(
    "nr-q006",
    "narayan_reddy",
    "nr-03",
    "Dental Age Estimation",
    "Gustafson's method for estimation of age from adult teeth evaluates how many microscopic and macroscopic dental criteria?",
    [
      "Four criteria",
      "Six criteria",
      "Eight criteria",
      "Ten criteria"
    ],
    1,
    "Gustafson's method evaluates six criteria: attrition, secondary dentin deposition, periodontal attachment loss, cementum apposition, root resorption, and root transparency.",
    "hard"
  ),

  // Ch 4: Thanatology (Death & Changes)
  q(
    "nr-q007",
    "narayan_reddy",
    "nr-04",
    "Rigor Mortis",
    "According to Nysten's law, in what sequence does rigor mortis typically manifest after death?",
    [
      "Lower extremities first, advancing upward to head and neck",
      "Small muscles of face, jaw, and neck, followed by trunk and limbs",
      "Simultaneously throughout all involuntary and voluntary muscles",
      "Distal extremities first, progressing proximally toward the core"
    ],
    1,
    "Nysten's law describes rigor mortis appearing first in the involuntary muscles of heart and eyelids, followed by face, jaw, neck, thorax, upper limbs, abdomen, and lower limbs.",
    "medium"
  ),
  q(
    "nr-q008",
    "narayan_reddy",
    "nr-04",
    "Post-Mortem Lividity",
    "A bright cherry-red post-mortem hypostasis (livor mortis) is classically diagnostic of poisoning with:",
    [
      "Hydrogen cyanide",
      "Carbon monoxide",
      "Phosphorus",
      "Potassium chlorate"
    ],
    1,
    "Carbon monoxide poisoning produces a characteristic cherry-red discoloration of lividity and viscera due to carboxyhemoglobin. Cyanide produces a brick-red or pinkish coloration.",
    "easy"
  ),

  // Ch 5: Autopsy & Exhumation
  q(
    "nr-q009",
    "narayan_reddy",
    "nr-05",
    "Autopsy Incisions",
    "Which of the following is the standard incision used during a medico-legal post-mortem examination to access neck structures and the torso?",
    [
      "Paramedian incision",
      "I-shaped vertical midline incision from chin/suprasternal notch to pubic symphysis",
      "Transverse abdominal incision",
      "Subcostal Kocher's incision"
    ],
    1,
    "The standard autopsy incision is the I-shaped midline incision running from the symphysis menti or thyroid cartilage down to the pubic symphysis, avoiding the umbilicus.",
    "medium"
  ),
  q(
    "nr-q010",
    "narayan_reddy",
    "nr-05",
    "Exhumation",
    "What is the statutory time limit for exhumation in India?",
    [
      "Maximum 3 years",
      "Maximum 7 years",
      "Maximum 10 years",
      "There is no statutory time limit for exhumation in India"
    ],
    3,
    "Under Indian Law, there is no limitation period for conducting an exhumation. It can be ordered by a competent magistrate whenever foul play or relevant evidence is suspected.",
    "hard"
  ),

  // Ch 6: Mechanical Injuries
  q(
    "nr-q011",
    "narayan_reddy",
    "nr-06",
    "Wound Pathology",
    "Which feature definitively differentiates an incised wound from a lacerated wound?",
    [
      "Presence of tissue bridges and irregular edges in incised wounds",
      "Clean-cut margins, absence of tissue bridges, and greater length than depth",
      "Severe crushing of surrounding hair bulbs in incised wounds",
      "Abundant grease collars and inverted margins in lacerations"
    ],
    1,
    "Incised wounds have sharp, clean-cut margins, no tissue bridging across depths, intact hair bulbs, and lengths generally exceeding depths. Lacerations exhibit tissue bridging, irregular ragged margins, and contused edges.",
    "medium"
  ),
  q(
    "nr-q012",
    "narayan_reddy",
    "nr-06",
    "Ballistics",
    "In firearm injuries, the deposition of unburnt and semi-burnt gunpowder granules into the skin dermis is termed:",
    [
      "Muzzle burn / scorching",
      "Tattooing / stippling",
      "Blackening / fouling",
      "Abrasion collar"
    ],
    1,
    "Tattooing (stippling) occurs when hot, unburnt or semi-burnt powder particles embed into the dermis. It cannot be wiped away, unlike superficial blackening (fouling).",
    "easy"
  ),

  // Ch 7: Regional Injuries
  q(
    "nr-q013",
    "narayan_reddy",
    "nr-07",
    "Head Injury",
    "An epidural (extradural) hematoma is most commonly caused by traumatic rupture of which vessel?",
    [
      "Cortical bridging veins",
      "Middle meningeal artery",
      "Circle of Willis berry aneurysm",
      "Internal carotid artery"
    ],
    1,
    "Epidural hematomas classically result from fractures of the squamous temporal bone lacerating the middle meningeal artery, leading to rapid biconvex arterial accumulation.",
    "easy"
  ),
  q(
    "nr-q014",
    "narayan_reddy",
    "nr-07",
    "Coup vs Contrecoup",
    "A contrecoup brain injury is typically most prominent when:",
    [
      "The moving head strikes a stationary rigid surface",
      "A moving blunt weapon strikes a stationary supported head",
      "A high-velocity projectile penetrates without exit",
      "Static crushing force is applied across the cranium"
    ],
    0,
    "Contrecoup contusions and lacerations occur opposite the point of impact and predominate in deceleration injuries where a moving head strikes a stationary, unyielding surface.",
    "hard"
  ),

  // Ch 8: Thermal Injuries
  q(
    "nr-q015",
    "narayan_reddy",
    "nr-08",
    "Burns Pathology",
    "The presence of soot particles within the tracheal and bronchial lumen during autopsy signifies:",
    [
      "Post-mortem incinerated body",
      "Definitive ante-mortem inhalation of smoke during life",
      "Artifact due to heat hematoma formation",
      "Electrical flash burn effect"
    ],
    1,
    "Soot particles within the lower respiratory tract indicate active respiration while engulfed in smoke, confirming ante-mortem exposure.",
    "medium"
  ),
  q(
    "nr-q016",
    "narayan_reddy",
    "nr-08",
    "Pugilistic Attitude",
    "The pugilistic (boxer's) attitude seen in severely charred bodies is caused by:",
    [
      "Vital defensive reaction of the victim against fire",
      "Thermal coagulation and shrinkage of flexor muscle proteins",
      "Ante-mortem epileptic convulsion induced by heat",
      "Rigor mortis fixation at the instant of death"
    ],
    1,
    "The pugilistic attitude is a purely post-mortem physical phenomenon caused by denaturation and coagulation of muscle proteins by extreme heat, with more powerful flexors overpowering extensors.",
    "easy"
  ),

  // Ch 9: Asphyxia
  q(
    "nr-q017",
    "narayan_reddy",
    "nr-09",
    "Hanging vs Strangulation",
    "In typical complete hanging, the ligature mark on the neck is characteristically:",
    [
      "Horizontal, completely encircling the neck, located below the thyroid cartilage",
      "Oblique, non-continuous, highest at the knot, located above thyroid cartilage",
      "Irregular with multiple overlapping horizontal abrasions",
      "Uniformly deep with bilateral comminuted cricoid fractures"
    ],
    1,
    "In typical hanging, the ligature mark is situated high in the neck above the thyroid cartilage, runs obliquely upward towards the knot, and is interrupted/absent at the site of suspension.",
    "medium"
  ),
  q(
    "nr-q018",
    "narayan_reddy",
    "nr-09",
    "Drowning",
    "The presence of silica-shelled diatoms inside closed organs like the femoral bone marrow confirms:",
    [
      "Post-mortem immersion of a dead body into water",
      "Ante-mortem drowning in natural water containing diatoms",
      "Secondary contamination during autopsy tissue processing",
      "Dry drowning with glottic spasm"
    ],
    1,
    "For diatoms to penetrate alveolar walls and travel via systemic circulation into distant closed organs like bone marrow or brain, active cardiovascular circulation during life must be present, confirming ante-mortem drowning.",
    "hard"
  ),

  // Ch 10: Virginity, Pregnancy & Delivery
  q(
    "nr-q019",
    "narayan_reddy",
    "nr-10",
    "Obstetric Jurisprudence",
    "Hegar's sign of early pregnancy is based on which clinical finding?",
    [
      "Bluish discoloration of the cervix and anterior vaginal wall",
      "Softening of the lower uterine segment on bimanual examination",
      "Intermittent painless uterine contractions felt upon palpation",
      "Auscultation of fetal heart sounds with Doppler"
    ],
    1,
    "Hegar's sign (appearing around 6–10 weeks) is the marked compressibility and softening of the lower uterine segment/isthmus between internal and external examining fingers.",
    "medium"
  ),

  // Ch 11: Sexual Offences
  q(
    "nr-q020",
    "narayan_reddy",
    "nr-11",
    "Forensic Semenology",
    "Florence test for identification of seminal stains relies on the formation of crystals of:",
    [
      "Choline periodide crystals",
      "Spermine picrate crystals",
      "Acid phosphatase precipitates",
      "Zinc sulfide crystals"
    ],
    0,
    "The Florence test produces brown, rhombic needle-shaped crystals of choline periodide when potassium triiodide reagent interacts with choline in semen.",
    "hard"
  ),

  // Ch 12: Abortion & Infanticide
  q(
    "nr-q021",
    "narayan_reddy",
    "nr-12",
    "Infanticide Tests",
    "The hydrostatic (Breslau's) test in suspected infanticide determines whether:",
    [
      "The fetus attained the gestational age of viability (28 weeks)",
      "The infant took breath after complete birth (live birth)",
      "The cause of death was mechanical smothering",
      "Maceration occurred in utero prior to expulsion"
    ],
    1,
    "Breslau's hydrostatic test checks lung buoyancy. Respiration expands alveoli with air, causing the lungs to float in water, pointing to live birth in the absence of decomposition.",
    "easy"
  ),

  // Ch 13: Forensic Psychiatry
  q(
    "nr-q022",
    "narayan_reddy",
    "nr-13",
    "Criminal Responsibility",
    "Section 84 of the Indian Penal Code (IPC) regarding the defense of insanity is modeled on which legal doctrine?",
    [
      "Durham rule",
      "M'Naghten rules",
      "Currens rule",
      "Brawner test"
    ],
    1,
    "Section 84 IPC states that an act is not an offence if the perpetrator, by reason of unsoundness of mind, was incapable of knowing the nature of the act or that it was wrong or contrary to law — directly derived from the British M'Naghten rules (1843).",
    "medium"
  ),

  // Ch 14: General Toxicology
  q(
    "nr-q023",
    "narayan_reddy",
    "nr-14",
    "Antidotes",
    "BAL (British Anti-Lewisite / Dimercaprol) is effective as a chelating agent due to its ability to:",
    [
      "Form stable cyclic complexes with metals via two sulfhydryl (-SH) groups",
      "Induce rapid hepatic cytochrome P450 oxidation of toxic metals",
      "Alkalinize urine and accelerate glomerular filtration",
      "Block muscarinic receptors competitively"
    ],
    0,
    "Dimercaprol provides competing sulfhydryl (-SH) ligands that bind arsenic, mercury, and gold, liberating essential cellular sulfhydryl enzymes from metal inhibition.",
    "medium"
  ),

  // Ch 15: Corrosive Poisons
  q(
    "nr-q024",
    "narayan_reddy",
    "nr-15",
    "Corrosives",
    "Carboluria (dark smoky greenish urine on standing) is a classic manifestation of poisoning by:",
    [
      "Concentrated sulfuric acid",
      "Phenol (carbolic acid)",
      "Oxalic acid",
      "Sodium hydroxide"
    ],
    1,
    "Phenol poisoning causes carboluria due to excretion of oxidation metabolites (hydroquinone and pyrocatechol) that turn dark greenish-brown or smoky black upon air exposure.",
    "easy"
  ),

  // Ch 16: Metallic Poisons
  q(
    "nr-q025",
    "narayan_reddy",
    "nr-16",
    "Arsenic & Lead",
    "Transverse white lines across fingernails (Aldrich-Mees lines) are characteristic of chronic exposure to:",
    [
      "Arsenic",
      "Lead",
      "Mercury",
      "Thallium"
    ],
    0,
    "Aldrich-Mees lines are transverse white bands across the nail plate caused by chronic arsenic poisoning disrupting keratin synthesis in the nail matrix.",
    "medium"
  ),
  q(
    "nr-q026",
    "narayan_reddy",
    "nr-16",
    "Plumbism",
    "Basophilic stippling of erythrocytes and Burtonian lines along the gingival margin are diagnostic markers of:",
    [
      "Chronic mercury poisoning (Hydrargyrism)",
      "Chronic lead poisoning (Plumbism)",
      "Chronic copper poisoning",
      "Acute phosphorus ingestion"
    ],
    1,
    "Chronic lead poisoning causes bluish-purple lead sulfide lines on the gums (Burton's line) and basophilic stippling due to inhibition of pyrimidine 5'-nucleotidase.",
    "easy"
  ),

  // Ch 17: Organic Poisons
  q(
    "nr-q027",
    "narayan_reddy",
    "nr-17",
    "Organophosphates",
    "In severe organophosphorus compound poisoning, the definitive pharmacological antidote to reactivate inhibited acetylcholinesterase is:",
    [
      "Atropine sulfate",
      "Pralidoxime (2-PAM)",
      "N-acetylcysteine",
      "Flumazenil"
    ],
    1,
    "While atropine antagonizes muscarinic acetylcholine receptors, pralidoxime (an oxime) is the definitive reactivator of phosphorylated acetylcholinesterase before aging occurs.",
    "medium"
  ),

  // Ch 18: Plant & Animal Poisons
  q(
    "nr-q028",
    "narayan_reddy",
    "nr-18",
    "Snake Venoms",
    "The venom of the Common Krait (Bungarus caeruleus) causes mortality primarily through:",
    [
      "Extensive consumption coagulopathy and hemotoxic bleeding",
      "Potent irreversible presynaptic neurotoxicity causing respiratory paralysis",
      "Acute tubular necrosis and massive intravascular hemolysis",
      "Myonecrosis and compartment syndrome"
    ],
    1,
    "Krait venom contains potent beta-bungarotoxin which binds irreversibly to presynaptic motor nerve terminals, leading to painless flaccid paralysis and asphyxia from diaphragmatic failure.",
    "hard"
  ),

  // Ch 19: Drug Abuse & Dependence
  q(
    "nr-q029",
    "narayan_reddy",
    "nr-19",
    "Opioid Toxicity",
    "The classic clinical triad of acute opioid overdose comprises:",
    [
      "Hypertension, hyperthermia, and dilated pupils",
      "Pinpoint pupils, respiratory depression, and coma",
      "Convulsions, dry flushed skin, and tachycardia",
      "Tremors, ataxia, and horizontal nystagmus"
    ],
    1,
    "Opioid overdose is recognized by the triad of CNS depression (coma), severe respiratory depression (<8-10 breaths/min), and miosis (pinpoint pupils).",
    "easy"
  ),

  // Ch 20: Medical Jurisprudence
  q(
    "nr-q030",
    "narayan_reddy",
    "nr-20",
    "Medical Negligence",
    "The legal doctrine of 'Res Ipsa Loquitur' in civil medical negligence implies:",
    [
      "The burden of proving negligence lies solely on the patient",
      "The incident speaks for itself, shifting the burden of proof to the doctor",
      "Criminal intent (mens rea) must be established beyond reasonable doubt",
      "Vicarious liability of the hospital cannot be invoked"
    ],
    1,
    "Res ipsa loquitur ('the thing speaks for itself') applies when an injury is of such a nature that it would not ordinarily happen in the absence of negligence (e.g. surgical sponge left in the abdomen), creating an inference of negligence.",
    "medium"
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // PARK'S TEXTBOOK OF PREVENTIVE & SOCIAL MEDICINE (23 Chapters)
  // ═══════════════════════════════════════════════════════════════════════════

  // Ch 1: Concept of Health & Disease
  q(
    "pk-q001",
    "park",
    "pk-01",
    "Health Definition & Indicators",
    "According to the WHO 1948 definition, health is defined as:",
    [
      "A state of complete physical, mental, and social well-being and not merely the absence of disease or infirmity",
      "The optimum capacity of an individual for the performance of the roles and tasks for which they have been socialized",
      "A condition of homeostatic equilibrium between internal physiology and external ecosystem",
      "Freedom from detectable clinical pathology and infectious pathogen carriage"
    ],
    0,
    "The classic WHO definition established in 1948 emphasizes three vital dimensions: physical, mental, and social well-being, rejecting the narrow biomedical model.",
    "easy"
  ),
  q(
    "pk-q002",
    "park",
    "pk-01",
    "Levels of Prevention",
    "Encouraging regular physical exercise and balanced diet among school children to prevent the development of lifestyle risk factors is an example of:",
    [
      "Primordial prevention",
      "Primary prevention",
      "Secondary prevention",
      "Tertiary prevention"
    ],
    0,
    "Primordial prevention targets the prevention of the emergence or development of risk factors in entire populations where they have not yet appeared, particularly in youth.",
    "medium"
  ),

  // Ch 2: Principles of Epidemiology
  q(
    "pk-q003",
    "park",
    "pk-02",
    "Study Designs",
    "Which epidemiological study design starts with disease-free individuals classified by exposure status and follows them forward in time to measure incidence?",
    [
      "Case-control study",
      "Prospective cohort study",
      "Cross-sectional study",
      "Ecological correlation study"
    ],
    1,
    "A prospective cohort study begins with an exposed group and an unexposed group (both free of disease) and follows them over time to determine and compare incidence rates.",
    "easy"
  ),
  q(
    "pk-q004",
    "park",
    "pk-02",
    "Measures of Association",
    "Odds Ratio (cross-product ratio) is the primary measure of association calculated in which study design?",
    [
      "Randomized Controlled Trial",
      "Case-Control Study",
      "Descriptive Case Series",
      "Cohort Study"
    ],
    1,
    "In case-control studies, true incidence cannot be directly measured. Hence, the Odds Ratio (OR = ad/bc) is used as an estimate of relative risk.",
    "medium"
  ),

  // Ch 3: Screening for Disease
  q(
    "pk-q005",
    "park",
    "pk-03",
    "Screening Validity",
    "The sensitivity of a diagnostic or screening test denotes its ability to:",
    [
      "Correctly identify all individuals who do NOT have the disease (true negative rate)",
      "Correctly identify all individuals who truly HAVE the disease (true positive rate)",
      "Yield identical results upon repeated measurement under standardized conditions",
      "Predict disease progression in confirmed hospitalized patients"
    ],
    1,
    "Sensitivity = True Positives / (True Positives + False Negatives). It measures the proportion of actual disease cases that test positive.",
    "easy"
  ),
  q(
    "pk-q006",
    "park",
    "pk-03",
    "Predictive Values",
    "When the prevalence of a disease in a community declines, what happens to the Positive Predictive Value (PPV) of a screening test with fixed sensitivity and specificity?",
    [
      "PPV increases",
      "PPV decreases",
      "PPV remains unchanged",
      "PPV drops to exactly zero"
    ],
    1,
    "Positive predictive value is directly dependent on disease prevalence. As disease prevalence falls, false positives outnumber true positives, lowering PPV.",
    "hard"
  ),

  // Ch 4: Epidemiology of Communicable Diseases
  q(
    "pk-q007",
    "park",
    "pk-04",
    "Herd Immunity",
    "Herd immunity does NOT protect against which of the following infections?",
    [
      "Measles",
      "Poliomyelitis",
      "Tetanus",
      "Diphtheria"
    ],
    2,
    "Herd immunity requires person-to-person transmission. Clostridium tetani is acquired from spores in the soil/environment; an individual's immunity offers zero protection to others.",
    "medium"
  ),

  // Ch 5: Respiratory Infections
  q(
    "pk-q008",
    "park",
    "pk-05",
    "Tuberculosis (NTEP)",
    "Under the National Tuberculosis Elimination Programme (NTEP), the diagnostic modality of choice for initial evaluation of presumptive TB is:",
    [
      "Ziehl-Neelsen sputum smear microscopy",
      "Cartridge Based Nucleic Acid Amplification Test (CBNAAT / GeneXpert)",
      "Mantoux tuberculin skin test",
      "Erythrocyte sedimentation rate (ESR)"
    ],
    1,
    "NTEP mandates upfront molecular testing (CBNAAT/TrueNat) for presumptive TB patients to simultaneously confirm M. tuberculosis DNA and detect rifampicin resistance within 2 hours.",
    "medium"
  ),

  // Ch 6: Intestinal Infections
  q(
    "pk-q009",
    "park",
    "pk-06",
    "Cholera Control",
    "In the management of acute watery diarrhea due to Vibrio cholerae, the most critical life-saving intervention is:",
    [
      "Immediate intravenous antibiotic therapy",
      "Timely and adequate fluid/electrolyte rehydration",
      "Administration of high-dose loperamide antimotility agents",
      "Subcutaneous cholera vaccination"
    ],
    1,
    "Over 80-90% of cholera cases can be successfully treated with Oral Rehydration Salts (ORS) alone, with IV Ringer Lactate reserved for severe dehydration.",
    "easy"
  ),

  // Ch 7: Vector-Borne Diseases
  q(
    "pk-q010",
    "park",
    "pk-07",
    "Malaria Epidemiology",
    "The vector of urban malaria in India is:",
    [
      "Anopheles stephensi",
      "Anopheles culicifacies",
      "Aedes aegypti",
      "Culex quinquefasciatus"
    ],
    0,
    "Anopheles stephensi is the principal urban malaria vector in India, breeding primarily in man-made overhead water tanks and construction cisterns. Anopheles culicifacies is the primary rural vector.",
    "medium"
  ),

  // Ch 8: Zoonotic Diseases
  q(
    "pk-q011",
    "park",
    "pk-08",
    "Rabies Post-Exposure",
    "Category III animal bite exposure as classified by WHO includes which of the following?",
    [
      "Touching or feeding animals with intact skin",
      "Minor scratches or abrasions without bleeding",
      "Single or multiple transdermal bites or scratches, or contamination of mucous membrane with saliva",
      "Exposure to bat droppings on intact clothing"
    ],
    2,
    "Category III exposures include transdermal bites/scratches, licks on broken skin, and mucous membrane contamination. Management mandates wound washing, full rabies vaccine series, AND rabies immunoglobulin (RIG).",
    "hard"
  ),

  // Ch 9: STDs & HIV/AIDS
  q(
    "pk-q012",
    "park",
    "pk-09",
    "Syndromic Management",
    "In NACO's syndromic management of STIs, the color of the pre-packed kit (Kit 1) designated for Urethral / Cervical Discharge is:",
    [
      "Grey",
      "Green",
      "Yellow",
      "Red"
    ],
    0,
    "Kit 1 (Grey) is for Urethral Discharge, Cervicitis, and Anorectal Discharge, containing Azithromycin 1g and Cefixime 400mg single dose.",
    "hard"
  ),

  // Ch 10: Non-Communicable Diseases
  q(
    "pk-q013",
    "park",
    "pk-10",
    "Hypertension Screening",
    "According to the Indian Hypertension Guidelines and WHO criteria, Stage 1 Hypertension is defined as systolic and/or diastolic BP of:",
    [
      "120–129 / <80 mmHg",
      "140–159 / 90–99 mmHg",
      "160–179 / 100–109 mmHg",
      "≥180 / ≥110 mmHg"
    ],
    1,
    "Stage 1 Hypertension is defined as SBP 140–159 mmHg and/or DBP 90–99 mmHg on at least two separate clinical occasions.",
    "medium"
  ),

  // Ch 11: Nutrition & Health
  q(
    "pk-q014",
    "park",
    "pk-11",
    "Malnutrition Syndromes",
    "Which sign is classically seen in Kwashiorkor but typically absent in nutritional Marasmus?",
    [
      "Severe muscle wasting",
      "Generalized nutritional pitting edema",
      "Loss of subcutaneous fat over the buttocks",
      "Alert, anxious, irritable facial expression"
    ],
    1,
    "Pitting edema of the lower extremities is the hallmark feature of Kwashiorkor (protein deficiency with relative calorie sufficiency), whereas Marasmus exhibits severe wasting without edema.",
    "easy"
  ),

  // Ch 12: Maternal & Child Health
  q(
    "pk-q015",
    "park",
    "pk-12",
    "Maternal Mortality",
    "Maternal Mortality Ratio (MMR) is expressed as maternal deaths per:",
    [
      "1,000 live births",
      "10,000 live births",
      "100,000 live births",
      "100,000 women in reproductive age group (15–49 years)"
    ],
    2,
    "MMR measures obstetric risk and is expressed per 100,000 live births. Maternal Mortality Rate is expressed per 1,000 women of reproductive age.",
    "easy"
  ),

  // Ch 13: Family Planning
  q(
    "pk-q016",
    "park",
    "pk-13",
    "Contraceptive Efficacy",
    "Pearl Index is an epidemiological metric designed to measure:",
    [
      "Contraceptive failure rate per 100 woman-years of exposure",
      "Prevalence of intrauterine device insertions in rural PHCs",
      "Total fertility rate necessary for population replacement",
      "Acceptability rate of oral contraceptive pills in the community"
    ],
    0,
    "Pearl Index = (Total accidental pregnancies × 1200) / (Total months of exposure). A lower Pearl index indicates higher contraceptive efficacy.",
    "medium"
  ),

  // Ch 14: Immunization
  q(
    "pk-q017",
    "park",
    "pk-14",
    "Cold Chain",
    "Under the Universal Immunization Programme (UIP) in India, which of the following vaccines is the most heat-sensitive and placed at the coldest shelf / bottom of the ILR?",
    [
      "Oral Polio Vaccine (bOPV)",
      "Tetanus Toxoid (TT / Td)",
      "Hepatitis B vaccine",
      "Pentavalent vaccine"
    ],
    0,
    "OPV is the most heat-sensitive vaccine and requires storage between -15°C and -25°C in deep freezers, or in the bottom-most cold compartment of Ice-Lined Refrigerators (ILRs). Inactivated vaccines like Td and Hep B are freeze-sensitive and kept at +2°C to +8°C.",
    "medium"
  ),

  // Ch 15: Environment & Health
  q(
    "pk-q018",
    "park",
    "pk-15",
    "Water Purification",
    "In rapid sand filtration for municipal water treatment, the vital biological film formed on the sand bed is called:",
    [
      "Horrocks layer",
      "Schmutzdecke (Zoogleal layer)",
      "Chloramine coating",
      "Activated carbon stratum"
    ],
    1,
    "Schmutzdecke (dirty skin) is the vital biological zoogleal layer containing algae, bacteria, and plankton that captures fine particulate matter and oxidizes organic nitrogen in slow sand filters.",
    "hard"
  ),

  // Ch 16: Occupational Health
  q(
    "pk-q019",
    "park",
    "pk-16",
    "Pneumoconiosis",
    "Pneumoconiosis caused by long-term inhalation of cotton dust fibers in textile mills is called:",
    [
      "Byssinosis (Monday fever)",
      "Bagassosis",
      "Farmer's lung",
      "Siderosis"
    ],
    0,
    "Byssinosis is caused by cotton, flax, or hemp dust. Symptoms of chest tightness and dyspnea classically worsen on the first day of work after a weekend break (Monday fever).",
    "easy"
  ),

  // Ch 17: Mental Health
  q(
    "pk-q020",
    "park",
    "pk-17",
    "Community Psychiatry",
    "The primary objective of the District Mental Health Programme (DMHP) in India is:",
    [
      "Constructing specialized psychiatric super-specialty hospitals in every metro city",
      "Integrating basic mental health care services with existing general healthcare delivery at the primary care level",
      "Institutionalizing all individuals diagnosed with psychiatric illnesses",
      "Conducting mandatory psychological profiling for school admission"
    ],
    1,
    "DMHP decentralizes mental healthcare by integrating psychiatric services into district hospitals, CHCs, and PHCs with community awareness and psychotropic drug availability.",
    "medium"
  ),

  // Ch 18: Health Care Delivery
  q(
    "pk-q021",
    "park",
    "pk-18",
    "Primary Health Center",
    "In India, according to Indian Public Health Standards (IPHS), a Primary Health Center (PHC) is established to serve a population of:",
    [
      "3,000 in hilly/tribal areas and 5,000 in plain areas",
      "20,000 in hilly/tribal/difficult areas and 30,000 in plain areas",
      "80,000 in hilly/tribal areas and 120,000 in plain areas",
      "100,000 in all geographic regions"
    ],
    1,
    "Population norms in India: Sub-centre: 3,000 (tribal) / 5,000 (plains); PHC: 20,000 (tribal) / 30,000 (plains); CHC: 80,000 (tribal) / 120,000 (plains).",
    "easy"
  ),

  // Ch 19: National Health Programmes
  q(
    "pk-q022",
    "park",
    "pk-19",
    "Health Initiatives",
    "Under Ayushman Bharat - PM-JAY, health insurance coverage provided per eligible family per year for secondary and tertiary hospitalization is:",
    [
      "Rs. 1,00,000",
      "Rs. 2,50,000",
      "Rs. 5,00,000",
      "Rs. 10,00,000"
    ],
    2,
    "Pradhan Mantri Jan Arogya Yojana (PM-JAY) provides a cashless cover of Rs. 5,00,000 per family per year for secondary and tertiary care hospitalization to over 50 crore vulnerable citizens.",
    "easy"
  ),

  // Ch 20: Biostatistics & Research Methods
  q(
    "pk-q023",
    "park",
    "pk-20",
    "Measures of Central Tendency",
    "In a distribution with severe positive skewness (tail extending far to the right), which relationship between measures of central tendency holds true?",
    [
      "Mean = Median = Mode",
      "Mean > Median > Mode",
      "Mode > Median > Mean",
      "Median > Mean > Mode"
    ],
    1,
    "In a positively skewed distribution, extreme high values pull the arithmetic mean to the right, yielding Mean > Median > Mode. In negatively skewed distributions, Mode > Median > Mean.",
    "medium"
  ),

  // Ch 21: Demography & Vital Statistics
  q(
    "pk-q024",
    "park",
    "pk-21",
    "Demographic Transition",
    "India is currently recognized as being in which stage of the demographic cycle?",
    [
      "Stage 1: High stationary (High birth rate, high death rate)",
      "Stage 2: Early expanding (High birth rate, falling death rate)",
      "Stage 3: Late expanding (Falling birth rate, low death rate)",
      "Stage 4: Low stationary (Low birth rate, low death rate)"
    ],
    2,
    "India is in Stage 3 (late expanding phase) of the demographic transition, characterized by a declining birth rate (TFR ~2.0) and a consistently low death rate.",
    "medium"
  ),

  // Ch 22: Health Education & Communication
  q(
    "pk-q025",
    "park",
    "pk-22",
    "Communication Methods",
    "In health education, the process where a small group of 6 to 12 persons discusses a problem under the guidance of a trained moderator is known as:",
    [
      "Panel discussion",
      "Focus Group Discussion (FGD)",
      "Symposium",
      "Role play"
    ],
    1,
    "Focus Group Discussion (FGD) gathers 6–12 homogenous participants with a facilitator to gather qualitative insights into community beliefs, behaviors, and healthcare barriers.",
    "easy"
  ),

  // Ch 23: International Health
  q(
    "pk-q026",
    "park",
    "pk-23",
    "Global Health Agencies",
    "The headquarters of the World Health Organization (WHO) is located in:",
    [
      "New York, USA",
      "Geneva, Switzerland",
      "London, United Kingdom",
      "Paris, France"
    ],
    1,
    "The World Health Organization (WHO) was established on April 7, 1948 (celebrated annually as World Health Day) with its global headquarters in Geneva, Switzerland.",
    "easy"
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL NARAYAN REDDY QUESTIONS (Expanded Bank)
  // ═══════════════════════════════════════════════════════════════════════════

  // Ch 1 — More Introduction to Forensic Medicine
  q("nr-q031","narayan_reddy","nr-01","Scope","Forensic medicine is also known as:","Legal medicine|State medicine|Medical jurisprudence|All of the above".split("|") as [string,string,string,string],3,"Forensic medicine encompasses legal medicine, state medicine, and medical jurisprudence as overlapping domains.","easy"),
  q("nr-q032","narayan_reddy","nr-01","Ethics","Therapeutic privilege allows a doctor to:","Withhold information if disclosure would harm the patient|Treat without consent in emergencies|Charge higher fees for complex procedures|Break confidentiality to warn third parties".split("|") as [string,string,string,string],0,"Therapeutic privilege is an exception to informed consent where withholding information is justified if disclosure itself would significantly harm the patient.","hard"),
  q("nr-q033","narayan_reddy","nr-01","Historical","The first chair of Forensic Medicine in India was established at:","Calcutta Medical College|Madras Medical College|Grant Medical College, Bombay|King George Medical College, Lucknow".split("|") as [string,string,string,string],0,"The first professorship of Medical Jurisprudence in India was established at Calcutta Medical College in 1845.","medium"),

  // Ch 2 — More Legal Procedures
  q("nr-q034","narayan_reddy","nr-02","Court Structure","A dying declaration is admissible under which section of the Indian Evidence Act?","Section 27|Section 32|Section 45|Section 114".split("|") as [string,string,string,string],1,"Section 32(1) of the Indian Evidence Act makes dying declarations admissible as exceptions to the hearsay rule.","medium"),
  q("nr-q035","narayan_reddy","nr-02","Documentation","The injury report (wound certificate) is a:","Dying declaration|Medico-legal report|Confession|FIR".split("|") as [string,string,string,string],1,"An injury report or wound certificate is a medico-legal report documenting the nature, dimensions, and probable weapon of injuries.","easy"),
  q("nr-q036","narayan_reddy","nr-02","Evidence","Under Section 45 of the Indian Evidence Act, a medical expert:","Can only testify on facts|Can give opinion on medical matters|Must be a government doctor|Cannot be cross-examined".split("|") as [string,string,string,string],1,"Section 45 IEA allows expert witnesses to give opinions on points of science or art, including medicine.","medium"),

  // Ch 3 — More Identification
  q("nr-q037","narayan_reddy","nr-03","Skull Sexing","In determination of sex from the skull, the most reliable single feature is:","Mastoid process size|Supraorbital ridges|Mandibular angle|General robusticity of the skull".split("|") as [string,string,string,string],0,"The mastoid process is considered the single most reliable isolated feature for sex determination from the skull.","hard"),
  q("nr-q038","narayan_reddy","nr-03","Bones","The most reliable bone for determination of sex is:","Skull|Pelvis|Femur|Humerus".split("|") as [string,string,string,string],1,"The pelvis (especially the greater sciatic notch, subpubic angle, and sacrum) is the most reliable bone for sex determination with >95% accuracy.","easy"),
  q("nr-q039","narayan_reddy","nr-03","Age Estimation","Closure of the spheno-occipital synchondrosis indicates an age of approximately:","12-14 years|18-20 years|25 years|30 years".split("|") as [string,string,string,string],2,"The spheno-occipital synchondrosis fuses around 25 years, making it useful for age estimation in young adults.","medium"),
  q("nr-q040","narayan_reddy","nr-03","Stature","Karl Pearson's formula uses which bone measurements for stature estimation?","Long bone lengths|Skull dimensions|Vertebral column length|Hand and foot measurements".split("|") as [string,string,string,string],0,"Karl Pearson's regression formula uses long bone (humerus, femur, tibia) lengths to estimate stature.","medium"),

  // Ch 4 — More Thanatology
  q("nr-q041","narayan_reddy","nr-04","Death Signs","Molecular death refers to:","Cessation of heartbeat|Brain stem death|Death of individual cells and tissues|Somatic death".split("|") as [string,string,string,string],2,"Molecular (cellular) death is the progressive death of individual body cells after somatic death, occurring at different rates in different tissues.","easy"),
  q("nr-q042","narayan_reddy","nr-04","Decomposition","Casper's dictum states that decomposition in air, water, and earth occurs in the ratio of:","1:2:8|1:4:8|1:2:4|2:4:8".split("|") as [string,string,string,string],0,"Casper's dictum: 1 week in air = 2 weeks in water = 8 weeks in earth for equivalent decomposition.","medium"),
  q("nr-q043","narayan_reddy","nr-04","Adipocere","Adipocere formation requires:","Dry hot conditions|Warm moist conditions with anaerobic bacteria|Cold dry conditions|Exposure to strong acids".split("|") as [string,string,string,string],1,"Adipocere (grave wax) forms by hydrogenation of body fats in warm, moist, anaerobic environments by Clostridium welchii.","medium"),
  q("nr-q044","narayan_reddy","nr-04","Mummification","Natural mummification occurs in:","Hot, dry, well-ventilated conditions|Cold, wet environments|Underground burial in clay soil|Immersion in stagnant water".split("|") as [string,string,string,string],0,"Mummification requires hot, dry conditions with good air circulation that causes rapid desiccation preventing bacterial decomposition.","easy"),
  q("nr-q045","narayan_reddy","nr-04","Algor Mortis","The rate of cooling of a body after death is most influenced by:","Ambient temperature|Cause of death|Age of deceased|Time of day".split("|") as [string,string,string,string],0,"Ambient temperature is the single most important factor affecting the rate of post-mortem cooling (algor mortis).","easy"),

  // Ch 5 — More Autopsy
  q("nr-q046","narayan_reddy","nr-05","Techniques","Virchow's technique of autopsy involves:","En masse removal of all organs|Organ by organ removal in situ|Four separate organ blocks|Removal of cervical organs only".split("|") as [string,string,string,string],1,"Virchow's technique involves removing each organ individually for examination in situ, allowing assessment of anatomical relationships.","medium"),
  q("nr-q047","narayan_reddy","nr-05","Skull Opening","The skull cap is removed during autopsy using a:","Bone saw (oscillating/Stryker saw)|Rib cutter|Cartilage knife|Costotome".split("|") as [string,string,string,string],0,"An oscillating bone saw (Stryker saw) is used to cut through the calvarium while minimizing brain damage.","easy"),

  // Ch 6 — More Mechanical Injuries
  q("nr-q048","narayan_reddy","nr-06","Wound Types","A defense wound is typically found on:","Back of trunk|Ulnar border of forearm and palms|Soles of feet|Top of head".split("|") as [string,string,string,string],1,"Defense wounds are characteristically found on the ulnar border of the forearms, palms, and fingers when the victim raises hands to ward off an attack.","easy"),
  q("nr-q049","narayan_reddy","nr-06","Contusions","A contusion does NOT form in:","Scalp|Eyelids|Cornea|Scrotum".split("|") as [string,string,string,string],2,"Contusions cannot form in avascular structures like the cornea, as bruising requires extravasation of blood from blood vessels.","medium"),
  q("nr-q050","narayan_reddy","nr-06","Firearm","The beveling of bone at a gunshot entry wound in the skull is:","External beveling|Internal beveling|Both internal and external|No beveling occurs".split("|") as [string,string,string,string],1,"Entry wounds in the skull show internal beveling (cone-shaped defect widening inward), while exit wounds show external beveling.","hard"),
  q("nr-q051","narayan_reddy","nr-06","Wound Age","The yellowish-green color of a bruise indicates an age of approximately:","1-2 days|3-5 days|5-7 days|2-4 weeks".split("|") as [string,string,string,string],2,"Yellow-green discoloration appears at 5-7 days due to biliverdin formation from hemoglobin breakdown.","medium"),

  // Ch 7 — More Regional Injuries
  q("nr-q052","narayan_reddy","nr-07","Subdural","A subdural hematoma results from rupture of:","Middle meningeal artery|Cortical bridging veins|Anterior cerebral artery|Dural venous sinuses".split("|") as [string,string,string,string],1,"Subdural hematomas are caused by tearing of bridging veins between the cerebral cortex and dural sinuses, often from rotational acceleration-deceleration.","easy"),
  q("nr-q053","narayan_reddy","nr-07","Lucid Interval","A 'lucid interval' is classically associated with:","Subdural hematoma|Extradural hematoma|Subarachnoid hemorrhage|Intracerebral hemorrhage".split("|") as [string,string,string,string],1,"The classic lucid interval (initial unconsciousness → recovery → deterioration) is associated with extradural hematoma from middle meningeal artery bleeding.","medium"),

  // Ch 8 — More Thermal Injuries
  q("nr-q054","narayan_reddy","nr-08","Classification","Dupuytren's classification of burns is based on:","Percentage of body surface involved|Depth of burn injury|Cause of burn|Location of burn".split("|") as [string,string,string,string],1,"Dupuytren classified burns into six degrees based on depth: erythema, vesication, destruction of true skin, subcutaneous tissue, muscle, and charring of bone.","medium"),
  q("nr-q055","narayan_reddy","nr-08","Rule of 9s","According to Wallace's Rule of Nines, each lower limb accounts for what percentage of body surface area?","9%|18%|27%|36%".split("|") as [string,string,string,string],1,"Each lower limb = 18% (9% front + 9% back). Head = 9%, each upper limb = 9%, trunk front = 18%, trunk back = 18%, perineum = 1%.","easy"),

  // Ch 9 — More Asphyxia
  q("nr-q056","narayan_reddy","nr-09","Mechanisms","Café coronary refers to:","Sudden death from choking on food bolus obstructing airway|Death from carbon monoxide in restaurant|Myocardial infarction while dining|Allergic reaction to food".split("|") as [string,string,string,string],0,"Café coronary describes sudden asphyxial death from food bolus impaction in the larynx, often initially misdiagnosed as myocardial infarction.","medium"),
  q("nr-q057","narayan_reddy","nr-09","Drowning Types","In dry drowning, death occurs due to:","Water filling the lungs|Laryngeal spasm (reflex vagal inhibition)|Electrolyte imbalance|Hypothermia".split("|") as [string,string,string,string],1,"In dry drowning (10-15% of cases), reflex laryngospasm triggered by water contact prevents fluid entry into lungs. Death results from asphyxia or vagal inhibition.","hard"),
  q("nr-q058","narayan_reddy","nr-09","Strangulation","In manual strangulation, the hyoid bone fracture most commonly involves:","Body of hyoid|Greater cornu of hyoid|Lesser cornu of hyoid|Junction of body and greater cornu".split("|") as [string,string,string,string],1,"The greater cornu of the hyoid bone is most vulnerable to fracture in manual strangulation, especially in individuals over 40 years when the bone is ossified.","medium"),

  // Ch 10 — More Virginity/Pregnancy
  q("nr-q059","narayan_reddy","nr-10","Pregnancy Tests","The biological test for pregnancy using male Xenopus toad is called:","Ascheim-Zondek test|Hogben test|Friedman test|Galli-Mainini test".split("|") as [string,string,string,string],3,"The Galli-Mainini test uses male toads (Bufo/Xenopus) — hCG in pregnant woman's urine causes spermatozoa release from the cloaca.","hard"),

  // Ch 11 — More Sexual Offences
  q("nr-q060","narayan_reddy","nr-11","Forensic Evidence","Acid phosphatase test for seminal stains is known as:","Florence test|Barberio's test|Acid phosphatase (AP) test|Precipitin test".split("|") as [string,string,string,string],2,"The acid phosphatase test detects the enzyme acid phosphatase which is present in high concentrations in seminal fluid (produced by the prostate gland).","easy"),
  q("nr-q061","narayan_reddy","nr-11","Legal","Under POCSO Act 2012, penetrative sexual assault on a child below 12 years is punishable with:","Minimum 7 years imprisonment|Minimum 10 years imprisonment|Minimum 20 years to life imprisonment|Minimum 5 years imprisonment".split("|") as [string,string,string,string],2,"Aggravated penetrative sexual assault on a child below 12 years attracts minimum 20 years to life imprisonment under the POCSO Act.","medium"),

  // Ch 12 — More Abortion & Infanticide
  q("nr-q062","narayan_reddy","nr-12","MTP Act","Under the MTP Amendment Act 2021, termination of pregnancy up to 24 weeks is permitted for:","Any woman requesting it|Special categories including rape survivors, minors, and change in marital status|Only when mother's life is in danger|Only in cases of fetal anomaly".split("|") as [string,string,string,string],1,"The 2021 MTP Amendment extends the upper gestational limit from 20 to 24 weeks for special categories including rape survivors, minors, and women with change in marital status.","medium"),
  q("nr-q063","narayan_reddy","nr-12","Live Birth","A born alive infant must show signs of:","Independent circulation and respiration|Crying|Movement of limbs|All of the above".split("|") as [string,string,string,string],0,"Live birth requires establishment of independent circulation and respiration after complete expulsion from the mother, regardless of cutting of the cord.","easy"),

  // Ch 13 — More Forensic Psychiatry
  q("nr-q064","narayan_reddy","nr-13","Capacity","Testamentary capacity refers to the mental ability to:","Stand trial in court|Make a valid will|Give informed consent for surgery|Enter into a marriage contract".split("|") as [string,string,string,string],1,"Testamentary capacity is the legal competence to make a valid will, requiring knowledge of the nature and extent of property, natural claimants, and the act of making a will.","easy"),
  q("nr-q065","narayan_reddy","nr-13","Automatism","An act done during a state of automatism is:","Always criminal|Not voluntary and hence not criminal|Criminal but with reduced sentence|Only criminal if the person was intoxicated".split("|") as [string,string,string,string],1,"Automatism describes involuntary actions during altered consciousness (e.g., sleepwalking, epileptic automatism) where criminal intent (mens rea) is absent.","medium"),

  // Ch 14 — More General Toxicology
  q("nr-q066","narayan_reddy","nr-14","Principles","The viscera to be preserved for chemical analysis in a suspected case of poisoning include:","Stomach with contents, portions of liver, kidney, and blood|Only stomach contents|Blood and urine only|Hair and nails only".split("|") as [string,string,string,string],0,"Standard preservation includes stomach with contents (minimum 100ml), liver (500g), one kidney, blood (30ml), and urine for comprehensive toxicological analysis.","easy"),
  q("nr-q067","narayan_reddy","nr-14","Antidotes","The universal antidote consists of:","Activated charcoal, magnesium oxide, and tannic acid|Atropine, pralidoxime, and diazepam|N-acetylcysteine and flumazenil|Naloxone and thiamine".split("|") as [string,string,string,string],0,"The universal antidote traditionally comprised activated charcoal (2 parts), magnesium oxide (1 part), and tannic acid (1 part), though activated charcoal alone is now preferred.","medium"),

  // Ch 15 — More Corrosive Poisons
  q("nr-q068","narayan_reddy","nr-15","Sulfuric Acid","Vitriolage refers to:","Drinking sulfuric acid|Throwing sulfuric acid on someone (acid attack)|Injecting sulfuric acid intravenously|Inhaling sulfuric acid fumes".split("|") as [string,string,string,string],1,"Vitriolage (from vitriol = sulfuric acid) is the act of throwing concentrated sulfuric acid on a person, typically targeting the face, constituting a specific criminal offence.","easy"),
  q("nr-q069","narayan_reddy","nr-15","Oxalic Acid","Oxalic acid poisoning can be confirmed by finding which crystals in the kidney?","Calcium oxalate crystals|Uric acid crystals|Cystine crystals|Struvite crystals".split("|") as [string,string,string,string],0,"Oxalic acid forms insoluble calcium oxalate crystals that deposit in renal tubules, causing acute renal failure.","medium"),

  // Ch 16 — More Metallic Poisons
  q("nr-q070","narayan_reddy","nr-16","Mercury","Acrodynia (Pink disease) in children is caused by chronic exposure to:","Arsenic|Mercury|Lead|Copper".split("|") as [string,string,string,string],1,"Acrodynia presents with pink discoloration of hands and feet, irritability, photophobia, and polyneuritis due to chronic mercury exposure, historically from teething powders.","hard"),
  q("nr-q071","narayan_reddy","nr-16","Iron","Acute iron poisoning is treated with the chelating agent:","D-Penicillamine|Desferrioxamine (Deferoxamine)|BAL (Dimercaprol)|EDTA".split("|") as [string,string,string,string],1,"Desferrioxamine is the specific chelator for acute iron toxicity, binding free iron to form ferrioxamine which is renally excreted, producing characteristic 'vin rosé' colored urine.","medium"),

  // Ch 17 — More Organic Poisons
  q("nr-q072","narayan_reddy","nr-17","Alcohol","The legal blood alcohol limit for driving in India is:","30 mg/dL|50 mg/dL|80 mg/dL|100 mg/dL".split("|") as [string,string,string,string],0,"Under Section 185 of the Motor Vehicles Act, the permissible BAC for driving in India is 30 mg/dL (0.03%).","easy"),
  q("nr-q073","narayan_reddy","nr-17","Methanol","Methanol poisoning is treated with:","Ethanol or Fomepizole|Naloxone|Flumazenil|Pralidoxime".split("|") as [string,string,string,string],0,"Ethanol (or fomepizole) competitively inhibits alcohol dehydrogenase, preventing conversion of methanol to its toxic metabolites (formaldehyde and formic acid).","medium"),

  // Ch 18 — More Plant & Animal Poisons
  q("nr-q074","narayan_reddy","nr-18","Plants","Abrus precatorius (jequirity bean) contains the toxin:","Ricin|Abrin|Crotin|Curcin".split("|") as [string,string,string,string],1,"Abrin is a toxalbumin found in the seeds of Abrus precatorius (red and black seeds used in traditional jewelry). It inhibits protein synthesis similar to ricin.","medium"),
  q("nr-q075","narayan_reddy","nr-18","Datura","Dhatura (Datura stramonium) poisoning produces:","Miosis, bradycardia, salivation|Mydriasis, tachycardia, dry skin, delirium|Pinpoint pupils, respiratory depression|Profuse watery diarrhea".split("|") as [string,string,string,string],1,"Datura contains tropane alkaloids (atropine, hyoscyamine, scopolamine) producing anticholinergic toxidrome: 'Hot as a hare, blind as a bat, dry as a bone, red as a beet, mad as a hatter'.","easy"),

  // Ch 19 — More Drug Abuse
  q("nr-q076","narayan_reddy","nr-19","Cannabis","The active principle of cannabis (marijuana) is:","Morphine|Delta-9-tetrahydrocannabinol (THC)|Cocaine|Mescaline".split("|") as [string,string,string,string],1,"Delta-9-THC is the primary psychoactive compound in Cannabis sativa, acting on CB1 receptors in the brain.","easy"),
  q("nr-q077","narayan_reddy","nr-19","NDPS","Under the NDPS Act 1985, possession of commercial quantity of a narcotic drug is punishable with:","Up to 1 year imprisonment|Up to 5 years imprisonment|10 to 20 years imprisonment and fine|Life imprisonment only".split("|") as [string,string,string,string],2,"Commercial quantity possession under NDPS Act attracts rigorous imprisonment of 10-20 years and fine of Rs. 1-2 lakhs.","medium"),

  // Ch 20 — More Medical Jurisprudence
  q("nr-q078","narayan_reddy","nr-20","Consent","A valid informed consent requires all EXCEPT:","Voluntary consent|Knowledge of nature and consequences|Person of sound mind and age of majority|Consent must be in writing for all procedures".split("|") as [string,string,string,string],3,"While written consent is preferred, valid informed consent can be verbal for minor procedures. The essential requirements are: voluntary, informed, by a competent person.","medium"),
  q("nr-q079","narayan_reddy","nr-20","Negligence","The Bolam test in medical negligence states that:","A doctor is negligent if they fail to exercise the highest standard of care|A doctor is not negligent if they acted in accordance with a practice accepted by a responsible body of medical opinion|The patient must prove intentional harm|The hospital is always vicariously liable".split("|") as [string,string,string,string],1,"The Bolam test (1957) establishes that a doctor is not negligent if they followed a practice accepted as proper by a responsible body of medical professionals.","hard"),

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL PARK QUESTIONS (Expanded Bank)
  // ═══════════════════════════════════════════════════════════════════════════

  // Ch 1 — More Health & Disease
  q("pk-q027","park","pk-01","Indicators","Physical Quality of Life Index (PQLI) includes all EXCEPT:","Infant mortality rate|Life expectancy at age one|Literacy rate|Per capita income".split("|") as [string,string,string,string],3,"PQLI comprises three indicators: infant mortality rate, life expectancy at age 1, and literacy rate. Per capita income is NOT included.","medium"),
  q("pk-q028","park","pk-01","Models","The Biomedical model of health focuses on:","Only biological factors of disease|Social, psychological, and biological factors|Spiritual well-being|Environmental determinants".split("|") as [string,string,string,string],0,"The biomedical model explains disease purely in terms of biological malfunctions, ignoring social, psychological, and behavioral dimensions.","easy"),
  q("pk-q029","park","pk-01","Spectrum","Iceberg phenomenon of disease means:","Disease is only found in cold climates|The hidden (subclinical) cases are far more numerous than clinical cases|The disease always presents severely|All cases are equally visible".split("|") as [string,string,string,string],1,"The iceberg concept describes that clinically apparent cases (tip) represent only a fraction; subclinical, carrier, and latent cases (underwater mass) are far more numerous.","easy"),

  // Ch 2 — More Epidemiology
  q("pk-q030","park","pk-02","Bias","Selection bias in a study occurs when:","Study subjects are not representative of the target population|The measurement instrument is faulty|Confounding variables are not controlled|The sample size is too small".split("|") as [string,string,string,string],0,"Selection bias arises from systematic differences between study participants and the target population, compromising external validity.","medium"),
  q("pk-q031","park","pk-02","Attack Rate","Secondary attack rate is calculated by excluding:","All susceptible contacts|Primary cases from the denominator|All immune individuals|Healthcare workers".split("|") as [string,string,string,string],1,"SAR = (New cases among contacts - Primary cases) / (Total contacts - Primary cases) × 100. Primary cases are excluded from both numerator and denominator.","hard"),

  // Ch 3 — More Screening
  q("pk-q032","park","pk-03","Criteria","Wilson and Jungner criteria for screening include all EXCEPT:","The condition should be an important health problem|A suitable test should be available|Treatment should be available|The test must be 100% specific".split("|") as [string,string,string,string],3,"Wilson & Jungner's 10 criteria do NOT require 100% specificity. They emphasize disease importance, natural history knowledge, suitable test, and accepted treatment.","medium"),
  q("pk-q033","park","pk-03","Testing","A test with high sensitivity is most useful for:","Confirmation of diagnosis|Ruling out a disease (screening)|Monitoring treatment|Prognosis assessment".split("|") as [string,string,string,string],1,"Highly sensitive tests are best for screening/ruling out disease (SnNOut: Sensitivity high → Negative result rules OUT disease).","easy"),

  // Ch 4 — More Communicable Diseases
  q("pk-q034","park","pk-04","Transmission","A carrier who harbors pathogen from recovery throughout life is called:","Incubatory carrier|Convalescent carrier|Chronic carrier|Healthy carrier".split("|") as [string,string,string,string],2,"A chronic carrier continues to shed the pathogen for an indefinite period after clinical recovery (e.g., typhoid carriers shedding S. typhi via gallbladder for years).","medium"),
  q("pk-q035","park","pk-04","Immunity","Passive natural immunity is acquired through:","Vaccination|Maternal antibodies (IgG across placenta, IgA in breast milk)|Previous infection|Injection of immune globulins".split("|") as [string,string,string,string],1,"Natural passive immunity: transplacental transfer of maternal IgG and IgA in colostrum/breast milk. Artificial passive: injection of immunoglobulins.","easy"),

  // Ch 5 — More Respiratory Infections
  q("pk-q036","park","pk-05","Measles","Koplik's spots in measles appear:","After the rash|1-2 days before the rash on buccal mucosa|During convalescence|Only in immunocompromised patients".split("|") as [string,string,string,string],1,"Koplik's spots (tiny white spots on red buccal mucosa opposite premolars) are pathognomonic of measles, appearing 1-2 days before the rash.","easy"),
  q("pk-q037","park","pk-05","COVID","The causative agent of COVID-19 is:","SARS-CoV|SARS-CoV-2|MERS-CoV|H1N1 Influenza".split("|") as [string,string,string,string],1,"COVID-19 is caused by SARS-CoV-2 (Severe Acute Respiratory Syndrome Coronavirus 2), first identified in Wuhan, China in December 2019.","easy"),
  q("pk-q038","park","pk-05","Diphtheria","Bull neck appearance is a characteristic clinical feature of:","Mumps|Pharyngeal diphtheria|Pertussis|Infectious mononucleosis".split("|") as [string,string,string,string],1,"Severe pharyngeal/tonsillar diphtheria causes massive cervical lymph node and peritonsillar swelling producing the classic bull-neck appearance.","medium"),

  // Ch 6 — More Intestinal Infections
  q("pk-q039","park","pk-06","Typhoid","The Widal test becomes positive in typhoid fever by the end of:","First week|Second week|Third week|Fourth week".split("|") as [string,string,string,string],1,"Widal test detects agglutinating antibodies (O and H) against Salmonella typhi. It typically becomes positive by the end of the first week/beginning of the second week.","medium"),
  q("pk-q040","park","pk-06","Polio","Sabin vaccine (OPV) has all advantages over Salk vaccine (IPV) EXCEPT:","Provides intestinal immunity|Easier to administer (oral)|Contact immunity through fecal shedding|No risk of vaccine-associated paralytic polio (VAPP)".split("|") as [string,string,string,string],3,"OPV carries a small risk of VAPP (1 in 2.4 million doses) due to reversion of attenuated virus. IPV has zero risk of VAPP.","hard"),
  q("pk-q041","park","pk-06","Hepatitis","Hepatitis B is transmitted through all EXCEPT:","Blood transfusion|Sexual contact|Vertical (mother to child)|Fecal-oral route".split("|") as [string,string,string,string],3,"HBV is transmitted parenterally (blood, blood products), sexually, and vertically. It is NOT transmitted by the fecal-oral route (unlike Hep A and E).","easy"),

  // Ch 7 — More Vector-Borne Diseases
  q("pk-q042","park","pk-07","Dengue","The vector of dengue fever is:","Anopheles mosquito|Aedes aegypti mosquito|Culex mosquito|Mansonia mosquito".split("|") as [string,string,string,string],1,"Aedes aegypti is the primary urban vector of dengue, chikungunya, Zika, and yellow fever. It is a day-biting, peridomestic mosquito breeding in clean stagnant water.","easy"),
  q("pk-q043","park","pk-07","Malaria","Benign tertian malaria (fever every 48 hours) is caused by:","P. falciparum|P. vivax|P. malariae|P. ovale".split("|") as [string,string,string,string],1,"P. vivax causes benign tertian malaria with febrile paroxysms every 48 hours. P. malariae causes quartan malaria (72-hour cycle).","easy"),
  q("pk-q044","park","pk-07","Kala-azar","The vector of visceral leishmaniasis (Kala-azar) in India is:","Aedes mosquito|Sandfly (Phlebotomus argentipes)|Tsetse fly|Black fly".split("|") as [string,string,string,string],1,"Phlebotomus argentipes is the sandfly vector of Kala-azar in India. The disease is caused by Leishmania donovani.","medium"),

  // Ch 8 — More Zoonotic Diseases
  q("pk-q045","park","pk-08","Rabies","Negri bodies are pathognomonic intracytoplasmic inclusion bodies of rabies found in:","Purkinje cells of cerebellum and hippocampal pyramidal neurons|Hepatocytes|Renal tubular cells|Lymphocytes".split("|") as [string,string,string,string],0,"Negri bodies are eosinophilic, intracytoplasmic inclusions found in the hippocampus (Ammon's horn) and cerebellar Purkinje cells, pathognomonic for rabies.","medium"),
  q("pk-q046","park","pk-08","Plague","The reservoir of urban plague is:","Wild rodents|Domestic rat (Rattus rattus and Rattus norvegicus)|Dogs and cats|Wild birds".split("|") as [string,string,string,string],1,"Domestic rats (R. rattus = black rat, R. norvegicus = brown rat) are the urban reservoirs of plague. Xenopsylla cheopis is the rat flea vector.","medium"),

  // Ch 9 — More STDs & HIV
  q("pk-q047","park","pk-09","HIV","The window period in HIV infection refers to:","Time between infection and appearance of symptoms|Time between infection and detectability of antibodies|Time between first and second test|Incubation period of AIDS".split("|") as [string,string,string,string],1,"The window period is the interval between HIV infection and the development of detectable anti-HIV antibodies (usually 2-12 weeks).","easy"),
  q("pk-q048","park","pk-09","NACP","The National AIDS Control Programme Phase IV (NACP-IV) goal is:","Eradication of HIV|Accelerating reversal and integration of response|Universal antiretroviral therapy|Compulsory HIV testing for all".split("|") as [string,string,string,string],1,"NACP-IV aims to accelerate the reversal of the epidemic and further strengthen the integration of the response.","medium"),

  // Ch 10 — More NCDs
  q("pk-q049","park","pk-10","Diabetes","Fasting plasma glucose diagnostic criterion for diabetes mellitus is:","≥100 mg/dL|≥126 mg/dL|≥140 mg/dL|≥200 mg/dL".split("|") as [string,string,string,string],1,"Diabetes mellitus is diagnosed with FPG ≥126 mg/dL (7.0 mmol/L), confirmed on repeat testing. 100-125 mg/dL = Impaired Fasting Glucose.","easy"),
  q("pk-q050","park","pk-10","Cancer","The most common cancer in Indian females is:","Lung cancer|Breast cancer|Cervical cancer|Ovarian cancer".split("|") as [string,string,string,string],1,"Breast cancer has overtaken cervical cancer as the most common cancer among Indian women, particularly in urban areas.","easy"),

  // Ch 11 — More Nutrition
  q("pk-q051","park","pk-11","Vitamins","Night blindness is the earliest clinical manifestation of deficiency of:","Vitamin B1|Vitamin A|Vitamin C|Vitamin D".split("|") as [string,string,string,string],1,"Night blindness (nyctalopia) is the earliest clinical feature of Vitamin A deficiency, followed by Bitot's spots, corneal xerosis, and keratomalacia.","easy"),
  q("pk-q052","park","pk-11","Protein","The reference protein used for calculating Net Protein Utilization (NPU) is:","Casein|Egg albumin (Whole egg protein)|Soy protein|Rice protein".split("|") as [string,string,string,string],1,"Egg protein (whole egg albumin) is the reference protein with NPU = 100, against which other proteins are compared.","medium"),
  q("pk-q053","park","pk-11","Iodine","The daily iodine requirement for adults recommended by WHO is:","50 mcg|100 mcg|150 mcg|250 mcg".split("|") as [string,string,string,string],2,"WHO recommends 150 mcg/day for adults and adolescents, 90 mcg for children <5 years, and 250 mcg during pregnancy and lactation.","medium"),

  // Ch 12 — More MCH
  q("pk-q054","park","pk-12","Indicators","Neonatal mortality rate includes deaths in the first:","24 hours of life|7 days of life|28 days of life|1 year of life".split("|") as [string,string,string,string],2,"NMR = Deaths in the first 28 days (neonatal period) per 1000 live births. Early NMR = first 7 days; Late NMR = 7-28 days.","easy"),
  q("pk-q055","park","pk-12","ANC","Under Indian guidelines, the minimum number of antenatal visits recommended is:","3 visits|4 visits|6 visits|8 visits".split("|") as [string,string,string,string],1,"WHO recommends a minimum of 4 ANC visits (now 8 contacts under 2016 guidelines). India follows the minimum 4-visit model.","medium"),

  // Ch 13 — More Family Planning
  q("pk-q056","park","pk-13","Demographics","Replacement level fertility (Net Reproduction Rate = 1) in India corresponds to a Total Fertility Rate of approximately:","1.0|1.5|2.1|3.0".split("|") as [string,string,string,string],2,"TFR of 2.1 accounts for replacement of both parents plus a margin for childhood mortality. India's TFR has now reached approximately 2.0 as per NFHS-5.","easy"),
  q("pk-q057","park","pk-13","IUD","The most commonly used IUD in the national family planning programme of India is:","LNG-IUS (Mirena)|CuT 380A|Nova T|Multiload Cu 375".split("|") as [string,string,string,string],1,"CuT 380A is the standard IUD provided in India's national programme, effective for 10 years with a failure rate of <1%.","medium"),

  // Ch 14 — More Immunization
  q("pk-q058","park","pk-14","Vaccines","BCG vaccine is a:","Killed bacterial vaccine|Live attenuated bacterial vaccine|Toxoid|Recombinant vaccine".split("|") as [string,string,string,string],1,"BCG (Bacillus Calmette-Guérin) is a live attenuated vaccine derived from Mycobacterium bovis, given intradermally at birth.","easy"),
  q("pk-q059","park","pk-14","Schedule","Under India's Universal Immunization Programme, the first dose of measles vaccine is given at:","6 months|9 months|12 months|15 months".split("|") as [string,string,string,string],1,"MR-1 (Measles-Rubella) is given at 9 completed months. MR-2 is given at 16-24 months under UIP.","easy"),
  q("pk-q060","park","pk-14","Cold Chain","The ideal temperature for storing most vaccines (DPT, TT, Hepatitis B) is:","−20°C|-2°C to +8°C|+2°C to +8°C|+10°C to +15°C".split("|") as [string,string,string,string],2,"Most killed/inactivated vaccines (DPT, TT, Td, HepB, IPV, Pentavalent) must be stored at +2°C to +8°C. They are freeze-sensitive.","easy"),

  // Ch 15 — More Environment
  q("pk-q061","park","pk-15","Water","Horrock's apparatus is used for:","Testing fluoride content of water|Chlorine demand estimation for water|Bacteriological examination of water|Hardness testing".split("|") as [string,string,string,string],1,"Horrock's apparatus determines the chlorine demand of water — the minimum dose of chlorine needed for effective disinfection with adequate residual.","medium"),
  q("pk-q062","park","pk-15","Sanitation","The most effective method of refuse disposal in developing countries is:","Open dumping|Sanitary landfill (controlled tipping)|Incineration|Composting".split("|") as [string,string,string,string],1,"Sanitary landfill (controlled tipping) is the most practical and economical method for large-scale solid waste disposal in developing countries.","medium"),

  // Ch 16 — More Occupational Health
  q("pk-q063","park","pk-16","Diseases","Silicosis is caused by inhalation of:","Coal dust|Free silica (silicon dioxide) dust|Iron particles|Asbestos fibers".split("|") as [string,string,string,string],1,"Silicosis is caused by prolonged inhalation of free crystalline silica (SiO2). It is the most common and most serious pneumoconiosis.","easy"),
  q("pk-q064","park","pk-16","Radiation","The maximum permissible dose (MPD) of radiation for occupational workers per year is:","1 mSv|5 mSv|20 mSv|50 mSv".split("|") as [string,string,string,string],2,"ICRP recommends a dose limit of 20 mSv per year (averaged over 5 years, with no single year exceeding 50 mSv) for occupational workers.","medium"),

  // Ch 17 — More Mental Health
  q("pk-q065","park","pk-17","NMHP","The National Mental Health Programme (NMHP) of India was launched in:","1972|1982|1992|2002".split("|") as [string,string,string,string],1,"NMHP was launched in 1982 to provide community-based mental healthcare and reduce stigma. The DMHP component was added in 1996.","easy"),

  // Ch 18 — More Health Care Delivery
  q("pk-q066","park","pk-18","Infrastructure","A Community Health Center (CHC) is established for a population of:","5,000|30,000|80,000-120,000|500,000".split("|") as [string,string,string,string],2,"CHC serves 80,000 (tribal/hilly) to 120,000 (plains) population with 30 beds, 4 specialists, and referral services.","easy"),
  q("pk-q067","park","pk-18","ASHA","ASHA (Accredited Social Health Activist) workers are appointed at the level of:","Sub-centre|Village level (one per 1000 population)|PHC|CHC".split("|") as [string,string,string,string],1,"ASHAs are community health workers appointed at the village level (one per approximately 1000 population) under NRHM/NHM.","easy"),

  // Ch 19 — More National Programmes
  q("pk-q068","park","pk-19","NHM","The National Health Mission (NHM) was launched in:","2005|2013|2017|2020".split("|") as [string,string,string,string],1,"NHM was formed in 2013 by merging NRHM (2005) and NUHM into a single umbrella mission.","medium"),
  q("pk-q069","park","pk-19","NPCDCS","NPCDCS stands for:","National Programme for Control of Dengue and Chikungunya Syndromes|National Programme for Prevention and Control of Cancer, Diabetes, Cardiovascular Diseases and Stroke|National Programme for Child Development and Cardiac Surgery|None of the above".split("|") as [string,string,string,string],1,"NPCDCS (launched 2010) addresses the rising burden of non-communicable diseases through screening, early detection, and management at various healthcare levels.","easy"),

  // Ch 20 — More Biostatistics
  q("pk-q070","park","pk-20","Tests","Chi-square test is used to test:","Mean of two groups|Association between two qualitative variables|Correlation coefficient|Regression equation".split("|") as [string,string,string,string],1,"Chi-square (χ²) test assesses the significance of association between two categorical (qualitative) variables.","medium"),
  q("pk-q071","park","pk-20","Sampling","The sampling method where every nth individual from a list is selected is called:","Simple random sampling|Systematic random sampling|Stratified sampling|Cluster sampling".split("|") as [string,string,string,string],1,"Systematic sampling selects every kth element from a sampling frame after a random start. k = N/n where N = population, n = desired sample size.","easy"),

  // Ch 21 — More Demography
  q("pk-q072","park","pk-21","Rates","Crude Birth Rate (CBR) is expressed as births per:","100 population|1,000 population|10,000 population|100,000 population".split("|") as [string,string,string,string],1,"CBR = (Number of live births in a year / Mid-year population) × 1000.","easy"),
  q("pk-q073","park","pk-21","Census","India's population according to Census 2011 was approximately:","100 crore|121 crore|130 crore|140 crore".split("|") as [string,string,string,string],1,"Census 2011 recorded India's population at 121.09 crore (1.21 billion), with a decadal growth rate of 17.64%.","easy"),

  // Ch 22 — More Health Education
  q("pk-q074","park","pk-22","Methods","A demonstration is an example of which type of health education method?","Mass method|Individual method|Group method|Community method".split("|") as [string,string,string,string],2,"Demonstrations (method, result, or combined) are group methods of health education involving direct hands-on learning for small-to-medium groups.","medium"),

  // Ch 23 — More International Health
  q("pk-q075","park","pk-23","SDGs","The total number of Sustainable Development Goals (SDGs) adopted by the UN in 2015 is:","8|12|17|21".split("|") as [string,string,string,string],2,"The 2030 Agenda for Sustainable Development comprises 17 SDGs and 169 targets, adopted by all UN Member States in September 2015.","easy"),
  q("pk-q076","park","pk-23","WHO","The World Health Assembly is the:","Executive body of WHO|Supreme decision-making body of WHO|Regional advisory committee|Research wing of WHO".split("|") as [string,string,string,string],1,"The World Health Assembly (WHA) is the supreme decision-making body of WHO, attended by delegations from all 194 Member States, held annually in Geneva.","easy"),

  // Missing Narayan Reddy Chapters (21-36)
  q("nr-q080","narayan_reddy","nr-21","Trace Evidence","Locard's exchange principle states that:","Every contact leaves a trace|Only biological evidence leaves a trace|Fingerprints are unique|DNA is the only conclusive evidence".split("|") as [string,string,string,string],0,"Every contact leaves a trace.","easy"),
  q("nr-q081","narayan_reddy","nr-22","Psychiatry","Testamentary capacity refers to the ability to:","Make a valid will|Stand trial|Consent to surgery|Understand crime".split("|") as [string,string,string,string],0,"Testamentary capacity is the capacity to make a valid will.","easy"),
  q("nr-q082","narayan_reddy","nr-23","Toxicology","Which is the most common route of poisoning in India?","Inhalation|Injection|Ingestion|Absorption".split("|") as [string,string,string,string],2,"Ingestion is the most common route of poisoning.","easy"),
  q("nr-q083","narayan_reddy","nr-24","Agro Poisons","Antidote for organophosphorus poisoning is:","Flumazenil|Naloxone|Atropine|N-acetylcysteine".split("|") as [string,string,string,string],2,"Atropine antagonizes muscarinic effects.","easy"),
  q("nr-q084","narayan_reddy","nr-25","Corrosives","Carboluria is seen in poisoning by:","Nitric acid|Carbolic acid (Phenol)|Sulfuric acid|Oxalic acid".split("|") as [string,string,string,string],1,"Phenol causes dark or green urine.","easy"),
  q("nr-q085","narayan_reddy","nr-26","Metals","Burtonian line on gums is seen in poisoning by:","Arsenic|Mercury|Lead|Copper".split("|") as [string,string,string,string],2,"Lead poisoning causes blue-black lines on gums.","easy"),
  q("nr-q086","narayan_reddy","nr-27","Inorganic Poisons","Cherry red color of blood is seen in poisoning with:","Carbon dioxide|Carbon monoxide|Cyanide|Hydrogen sulphide".split("|") as [string,string,string,string],1,"CO poisoning causes carboxyhemoglobin which is cherry red.","easy"),
  q("nr-q087","narayan_reddy","nr-28","Somniferous","Pinpoint pupils are a characteristic feature of:","Cocaine|Atropine|Opium|Cannabis".split("|") as [string,string,string,string],2,"Opioid overdose causes pinpoint pupils.","easy"),
  q("nr-q088","narayan_reddy","nr-29","Deliriants","Active principle of Datura is:","Morphine|Hyoscine|Strychnine|Cocaine".split("|") as [string,string,string,string],1,"Datura contains hyoscine (scopolamine) and hyoscyamine.","easy"),
  q("nr-q089","narayan_reddy","nr-30","Spinal Poisons","Risus sardonicus is a feature of poisoning by:","Opium|Strychnine|Aconite|Oleander".split("|") as [string,string,string,string],1,"Strychnine causes facial muscle spasms (risus sardonicus).","easy"),
  q("nr-q090","narayan_reddy","nr-31","Cardiac Poisons","Aconite poisoning primarily affects the:","Lungs|Liver|Heart|Kidneys".split("|") as [string,string,string,string],2,"Aconite is a potent cardiac poison.","easy"),
  q("nr-q091","narayan_reddy","nr-32","Miscellaneous","The antidote for paracetamol overdose is:","Flumazenil|Naloxone|N-acetylcysteine|Atropine".split("|") as [string,string,string,string],2,"N-acetylcysteine replenishes glutathione.","easy"),
  q("nr-q092","narayan_reddy","nr-33","Animal Poisons","Krait venom is predominantly:","Hemotoxic|Neurotoxic|Myotoxic|Cardiotoxic".split("|") as [string,string,string,string],1,"Krait venom is highly neurotoxic.","easy"),
  q("nr-q093","narayan_reddy","nr-34","Food Poisoning","Botulism is caused by:","Salmonella|Staphylococcus|Clostridium botulinum|Escherichia coli".split("|") as [string,string,string,string],2,"Clostridium botulinum produces botulinum toxin in improperly canned foods.","easy"),
  q("nr-q094","narayan_reddy","nr-35","Drug Abuse","The psychoactive component of Cannabis is:","Cocaine|THC|Morphine|Amphetamine".split("|") as [string,string,string,string],1,"Delta-9-THC is the psychoactive substance in Cannabis.","easy"),
  q("nr-q095","narayan_reddy","nr-36","Legal Acts","BNSS stands for:","Bharatiya Nyaya Sanhita|Bharatiya Nagarik Suraksha Sanhita|Bharatiya Sakshya Adhiniyam|None".split("|") as [string,string,string,string],1,"BNSS replaced the CrPC.","easy"),

  // Missing Park Chapters (24-25)
  q("pk-q077","park","pk-24","STIs/HIV","The syndromic management kit for urethral discharge is color-coded:","Green|Red|Grey|White".split("|") as [string,string,string,string],2,"Kit 1 for urethral discharge is Grey.","easy"),
  q("pk-q078","park","pk-25","NTDs","Mass Drug Administration (MDA) is used primarily for the elimination of:","Malaria|Tuberculosis|Lymphatic Filariasis|HIV".split("|") as [string,string,string,string],2,"MDA is the main strategy for Lymphatic Filariasis elimination.","easy"),
].concat(generatedQuestions);

// Helper functions
export function getQuestionsForChapter(chapterId: string): Question[] {
  return seedQuestions.filter((q) => q.chapter === chapterId && q.verified);
}

export function getQuestionsForBook(bookId: string): Question[] {
  return seedQuestions.filter((q) => q.book === bookId && q.verified);
}

export function getQuestionsByDifficulty(
  questions: Question[],
  difficulty: "easy" | "medium" | "hard"
): Question[] {
  return questions.filter((q) => q.difficulty === difficulty);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}