import type { TeamMember } from '@/types/content'

type WorkingDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

export interface TeamProfile extends TeamMember {
  media: TeamMember['media'] & { src: string }
  slug: string
  shortName: string
  designation: string
  summary: string
  introduction: string
  biography: readonly string[]
  credentials: readonly { label: string; value: string }[]
  personal: string
  focus: readonly string[]
  hours: Readonly<Record<WorkingDay, string | null>>
  metadata: { title: string; description: string }
  sourceUrl: string
}

const doctorHours = {
  Monday: '8:00am – 5:00pm', Tuesday: '8:00am – 5:00pm', Wednesday: '8:00am – 5:00pm',
  Thursday: '8:00am – 1:00pm', Friday: '8:00am – 2:00pm', Saturday: null,
} as const

function identity(slug: string, name: string, role: string) {
  const src = `/media/team/${slug}.webp`
  const sourceUrl = `https://alratadental.com/cmsms_doctor/${slug}/`
  return {
    slug, name, role, href: `/cmsms_doctor/${slug}`, sourceUrl,
    media: {
      src, poster: src, alt: `${name}, ${role.toLowerCase()} at Alrata Art of Dentistry`,
      aspectRatio: 'portrait' as const, placeholder: false, sourceUrl,
    },
  }
}

export const leadDentist: TeamProfile = {
  ...identity('mamdouh-alrata', 'Dr. Mamdouh Alrata, DDS', 'Dentist'),
  media: {
    src: '/media/team/mamdouh-alrata.webp', poster: '/media/team/mamdouh-alrata.webp',
    alt: 'Dr. Mamdouh Alrata, DDS, St. Louis dentist at Alrata Art of Dentistry',
    aspectRatio: 'portrait', placeholder: false,
    sourceUrl: 'https://alratadental.com/cmsms_doctor/mamdouh-alrata/',
  },
  shortName: 'Dr. Alrata', designation: 'DDS',
  summary: 'Thoughtful dental care, grounded in advanced esthetic and restorative training and a personal approach to every smile.',
  introduction: 'Meet the dentist behind your care. Dr. Mamdouh Alrata brings advanced esthetic and restorative training to a thoughtful, personal approach to dentistry in St. Louis.',
  biography: [
    'Dr. Mamdouh Alrata has provided dental care since 2012. At Alrata Art of Dentistry in St. Louis, Missouri, he brings together careful treatment planning and a commitment to helping patients feel informed about their care.',
    'His education at the UCLA School of Dentistry and advanced training in esthetic and restorative dentistry inform his approach to the appearance and function of each smile. His published credentials include certification from the American Board of Operative Dentistry.',
    'In 2023, the PDS organization recognized Dr. Alrata as a top dentist nationwide. This recognition is part of a career centered on attentive patient care and a personal connection with the people he treats.',
  ],
  credentials: [
    { label: 'Education', value: 'UCLA School of Dentistry' },
    { label: 'Board certification', value: 'American Board of Operative Dentistry' },
    { label: 'Area of expertise', value: 'Advanced esthetic and restorative dentistry' },
    { label: 'In practice', value: 'Providing dental care since 2012' },
  ],
  personal: 'Outside the practice, Dr. Alrata enjoys spending time with his daughters, Reema and Layana. Watching movies, getting outdoors, and discovering new restaurants are some of their favorite ways to spend time together.',
  focus: ['Esthetic dentistry', 'Restorative dentistry', 'Personalized treatment planning'],
  hours: doctorHours,
  metadata: {
    title: 'Dr. Mamdouh Alrata, DDS | St. Louis Dentist',
    description: 'Meet Dr. Mamdouh Alrata, DDS, at Alrata Art of Dentistry in St. Louis. Explore his education, restorative dentistry background, and approach to patient care.',
  },
}

export const supportingTeam: readonly TeamProfile[] = [
  {
    ...identity('danya-kazzaz', 'Danya', 'Office Manager'),
    shortName: 'Danya', designation: 'OM',
    summary: 'Clear answers, thoughtful scheduling, and guidance through your treatment options and dental benefits.',
    introduction: 'From your first question to your next appointment, Danya helps make navigating your dental care feel simpler and more personal.',
    biography: [
      'As office manager at Alrata Art of Dentistry in St. Louis, Danya focuses on clear, effective communication. She helps patients understand their treatment plans and available options so they can make informed decisions about their dental care.',
      'Danya works with patients to find appointments that fit their schedules and helps them understand how their dental benefits relate to their planned care and budget. Her aim is to make the administrative side of a dental visit easier to navigate.',
      'With a bachelor’s degree in dental surgery and a master’s degree in healthcare administration, Danya brings both a dental education and an understanding of practice management to her role as office manager.',
    ],
    credentials: [
      { label: 'Education', value: 'Bachelor’s degree in Dental Surgery' },
      { label: 'Graduate education', value: 'Master’s degree in Healthcare Administration' },
      { label: 'Role at Alrata', value: 'Office management and patient communication' },
    ],
    personal: 'Danya enjoys getting lost in a good book; Gone with the Wind is her favorite novel, and The Notebook is her favorite movie. Most of all, she cherishes time with her two daughters and watching them grow.',
    focus: ['Patient communication', 'Appointment coordination', 'Dental benefits guidance'],
    hours: doctorHours,
    metadata: {
      title: 'Danya | Dental Office Manager in St. Louis',
      description: 'Meet Danya, office manager at Alrata Art of Dentistry in St. Louis. Learn how she supports patients with scheduling, treatment-plan questions, and benefits.',
    },
  },
  {
    ...identity('shelly', 'Shelly', 'Healthcare Coordinator'),
    shortName: 'Shelly', designation: 'HCC',
    summary: 'An experienced guide to the details of your visit, from patient coordination to insurance and billing questions.',
    introduction: 'A welcoming visit begins with someone who can help with the details. Shelly brings extensive dental office experience to patient coordination at Alrata.',
    biography: [
      'Shelly is the healthcare coordinator at Alrata Art of Dentistry in St. Louis, Missouri. With more than two decades of experience in the dental field, she helps coordinate patient care and manage the administrative details that support each visit.',
      'Insurance and billing are particular areas of experience for Shelly. She helps patients navigate these questions alongside the practical arrangements of their care, bringing an organized, experienced perspective to the front office.',
      'Her education in medical administrative assistance at Joliet Junior College supports her work in healthcare coordination and dental practice administration.',
    ],
    credentials: [
      { label: 'Education', value: 'Medical Administrative Assistant, Joliet Junior College' },
      { label: 'Area of experience', value: 'Patient coordination, insurance, and billing' },
      { label: 'Professional background', value: 'More than two decades in the dental field' },
    ],
    personal: 'Shelly values quality time with her family. She and her husband enjoy camping, exploring nature, and deep-sea fishing in Florida—opportunities to unwind and make memories together.',
    focus: ['Patient coordination', 'Insurance questions', 'Billing support'],
    hours: { ...doctorHours, Thursday: null, Friday: null },
    metadata: {
      title: 'Shelly | Dental Healthcare Coordinator in St. Louis',
      description: 'Meet Shelly, healthcare coordinator at Alrata Art of Dentistry in St. Louis. Learn about her experience in patient coordination, dental insurance, and billing.',
    },
  },
  {
    ...identity('vanessa-rosas', 'Vanessa', 'Registered Dental Hygienist'),
    shortName: 'Vanessa', designation: 'RDH',
    summary: 'A caring approach to dental hygiene, with communication in English and Spanish to help patients feel understood.',
    introduction: 'Vanessa combines her enthusiasm for oral health with a welcoming approach, helping patients feel comfortable and understood in English or Spanish.',
    biography: [
      'Vanessa is a registered dental hygienist at Alrata Art of Dentistry in St. Louis. A 2020 graduate of the St. Louis Community College–Forest Park Dental Hygiene program, she is passionate about supporting her patients’ oral health and overall well-being.',
      'As a Mexican American, Vanessa takes pride in communicating with patients in both English and Spanish. She values making each person feel understood and comfortable during their dental hygiene visit.',
      'Originally from a small town in southwest Missouri, Vanessa brings a friendly, personal perspective to her work and an enthusiasm for caring for the community she serves.',
    ],
    credentials: [
      { label: 'Education', value: 'St. Louis Community College–Forest Park, Dental Hygiene' },
      { label: 'Graduation', value: '2020' },
      { label: 'Professional role', value: 'Registered Dental Hygienist' },
      { label: 'Languages', value: 'English and Spanish' },
    ],
    personal: 'Vanessa loves spending time outdoors with her husband and twin boys. Their family enjoys traveling, baking, and sharing new adventures, with a talkative pet bird adding even more energy to life at home.',
    focus: ['Dental hygiene', 'Patient comfort', 'English & Spanish'],
    hours: { ...doctorHours, Wednesday: null, Friday: null },
    metadata: {
      title: 'Vanessa, RDH | Dental Hygienist in St. Louis',
      description: 'Meet Vanessa, a registered dental hygienist at Alrata Art of Dentistry in St. Louis who communicates with patients in English and Spanish.',
    },
  },
  {
    ...identity('janet', 'Janet', 'Registered Dental Hygienist'),
    shortName: 'Janet', designation: 'RDH',
    summary: 'Decades of dental hygiene experience, an outgoing personality, and a lasting commitment to her community.',
    introduction: 'For Janet, caring for patients and serving her community go hand in hand. She brings an outgoing personality and decades of experience to dental hygiene at Alrata.',
    biography: [
      'Janet is a registered dental hygienist at Alrata Art of Dentistry in St. Louis, Missouri. With more than four decades of experience, she brings a detail-oriented approach and a positive, welcoming presence to patient care.',
      'Educated at St. Louis Community College–Forest Park, Janet values organization, thoughtful work, and the opportunity to meet new challenges. Her enthusiasm for dental hygiene is matched by her commitment to the people and community around her.',
      'Her community involvement includes board service with the St. Louis Italian Open Children’s Charities. This charitable work reflects a personal commitment to service beyond the dental office.',
    ],
    credentials: [
      { label: 'Education', value: 'St. Louis Community College–Forest Park' },
      { label: 'Professional role', value: 'Registered Dental Hygienist' },
      { label: 'Professional background', value: 'More than four decades in dental hygiene' },
      { label: 'Community service', value: 'Board service, St. Louis Italian Open Children’s Charities' },
    ],
    personal: 'Janet is proud of her Italian heritage and values her family connections. Her outgoing nature and passion for community service are an important part of who she is, both in and outside the practice.',
    focus: ['Dental hygiene', 'Attentive patient care', 'Community service'],
    hours: { ...doctorHours, Thursday: null },
    metadata: {
      title: 'Janet, RDH | Dental Hygienist in St. Louis',
      description: 'Meet Janet, registered dental hygienist at Alrata Art of Dentistry in St. Louis. Explore her dental hygiene experience, education, and community involvement.',
    },
  },
]

export const teamProfiles: readonly TeamProfile[] = [leadDentist, ...supportingTeam]

// Preserve the existing homepage's display order independently of the directory.
export const homeTeam: readonly TeamProfile[] = [...supportingTeam].reverse()

export function getTeamProfile(slug: string) {
  return teamProfiles.find(member => member.slug === slug)
}

export const teamTitle = 'Our Dental Team in St. Louis, MO'
export const teamDescription = 'Meet Dr. Mamdouh Alrata and the dental hygiene and patient support team at Alrata Art of Dentistry in St. Louis. Explore their backgrounds and approach to care.'
