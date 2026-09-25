export interface AboutTechnologyItem {
  title: string
  description: string
}

export interface AboutFaqItem {
  id: string
  question: string
  answer: string
  phoneCta?: boolean
}

export interface AboutChecklistItem {
  label: string
}

export const aboutHero = {
  eyebrow: 'About our practice',
  title: 'About Alrata Art of Dentistry',
  lead: 'Patient-first dentistry in St. Louis, combining modern clinical care with clear guidance and genuine attention to your comfort.',
  media: {
    src: '/media/about/about-team.webp',
    alt: 'The dental team at Alrata Art of Dentistry in St. Louis',
  },
} as const

export const overview = {
  eyebrow: 'Our practice',
  title: 'A dental team you can feel confident choosing.',
  lead: 'Trust begins with being heard. At Alrata Art of Dentistry, every visit starts with your concerns, your goals, and a conversation you can understand.',
  paragraphs: [
    'Our Kirkwood-area practice welcomes new patients for preventive, restorative, and cosmetic dental care. Whether you are visiting for a routine exam or considering veneers, dental implants, clear aligners, or professional teeth whitening, the team will help you understand your options without rushing the decision.',
    'Dr. Mamdouh Alrata and the clinical team pair thoughtful treatment planning with a comfortable, approachable environment so you can move forward feeling informed.',
  ],
  media: {
    src: '/media/about/dr-alrata.webp',
    alt: 'Dr. Mamdouh Alrata, DDS, dentist at Alrata Art of Dentistry',
  },
} as const

export const technology = {
  eyebrow: 'Technology',
  title: 'Modern tools for precise, comfortable care.',
  description: 'The practice uses digital technology to make examinations clearer, treatment planning more precise, and appointments more efficient. Your dentist will explain what each tool is showing and how it relates to your care.',
  items: [
    {
      title: 'Intraoral camera',
      description: 'Detailed images help you see what your dental team sees and understand recommended care.',
    },
    {
      title: 'CEREC CAD/CAM',
      description: 'Digital design and fabrication support carefully planned, custom dental restorations.',
    },
    {
      title: 'Digital X-rays',
      description: 'High-quality diagnostic images help the team assess areas that cannot be seen during a visual exam.',
    },
  ] satisfies AboutTechnologyItem[],
  media: {
    smile: {
      src: '/media/about/technology-smile.webp',
      alt: 'Close-up of a healthy smile',
    },
    care: {
      src: '/media/about/chairside-care.webp',
      alt: 'A dentist speaking with a patient beside digital dental X-rays',
    },
    team: {
      src: '/media/about/about-team.webp',
      alt: 'The Alrata Art of Dentistry team in St. Louis',
    },
  },
} as const

export const faqs = [
  {
    id: 'emergency',
    question: 'I have a dental emergency. Can you fit me in today?',
    answer: 'Dental emergencies can be stressful. Call us as soon as possible and our team will do its best to help you find the earliest available visit.',
    phoneCta: true,
  },
  {
    id: 'insurance',
    question: 'Will insurance cover my treatment?',
    answer: 'Coverage depends on your dental insurance policy and the treatment you need. We recommend contacting your insurance provider for plan-specific details. Our team can also help you understand the information available for your visit.',
  },
  {
    id: 'first-appointment',
    question: 'What should I bring to my first appointment?',
    answer: 'Please bring a photo ID, your dental insurance card if available, your dental and medical history, and a current medication list. Patients under 18 should attend with a parent or legal guardian.',
  },
  {
    id: 'new-patients',
    question: 'Do you accept new patients?',
    answer: 'Yes. Alrata Art of Dentistry welcomes new patients, and the team looks forward to learning about your dental needs and goals.',
  },
  {
    id: 'new-patient-special',
    question: 'Do you have any New Patient specials?',
    answer: 'Yes, we do have a New Patient Special only for September, We have a $59 New Patient Special that includes a comprehensive oral exam, x-rays, and a cleaning in absence of periodontal (gum) disease.',
  },
] satisfies AboutFaqItem[]

export const visitChecklist = [
  { label: 'Arrive 15 minutes before your appointment' },
  { label: 'Bring your dental and medical insurance card, if applicable' },
  { label: 'Bring your dental and medical history information' },
  { label: 'Bring a list of your current prescribed medications' },
] satisfies AboutChecklistItem[]

export const visitMedia = {
  src: '/media/about/dental-equipment.webp',
  alt: 'Dental mirror and instruments arranged beside a question mark',
} as const

export const aboutCta = {
  title: 'Ready to plan your visit?',
  description: 'Book online or call the clinic. Our team will help you choose the right next step and answer questions before your appointment.',
  media: {
    src: '/media/about/chairside-care.webp',
    alt: 'A dentist discussing care with a patient at Alrata Art of Dentistry',
  },
} as const
