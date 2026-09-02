export type AspectRatio = 'landscape' | 'portrait' | 'wide' | 'square';

export interface MediaAsset {
  src: string | null;
  poster: string;
  alt: string;
  aspectRatio: AspectRatio;
  placeholder: boolean;
  credit?: string;
  sourceUrl?: string;
}

export interface Service {
  name: string;
  description: string;
  href: string;
  media: MediaAsset;
}
export interface VideoItem {
  title: string;
  meta: string;
  description: string;
  media: MediaAsset;
}
export interface TeamMember {
  name: string;
  role: string;
  href: string;
  media: MediaAsset;
}
export interface Offer {
  name: string;
  price: string;
  description: string;
  availability: string;
  href: string;
  media: MediaAsset;
}
export interface Statistic {
  value: number | null;
  suffix: string;
  label: string;
  placeholder: string;
}
export interface JourneyStep {
  title: string;
  description: string;
}
export interface ClinicContact {
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  address: string;
  mapHref: string;
  bookingHref: string;
}

const clinicImage = (
  src: string,
  alt: string,
  aspectRatio: AspectRatio = 'landscape',
): MediaAsset => ({
  src,
  poster: src,
  alt,
  aspectRatio,
  placeholder: false,

  sourceUrl: 'https://alratadental.com/',
});

const localVideoFiles: Record<string, string> = {
  '5889024': '/media/dental-care-hero.mp4',
  '5356598': '/media/dental-consultation.mp4',
  '5889025': '/media/dental-treatment-closeup.mp4',
  '5889135': '/media/dental-patient-care.mp4',
  '5889017': '/media/dental-consultation.mp4',
  '5889022': '/media/dental-treatment-closeup.mp4',
  '5889028': '/media/dental-patient-care.mp4',
};

const pexelsVideo = (
  id: string,
  _file: string,
  alt: string,
  aspectRatio: AspectRatio = 'portrait',
): MediaAsset => ({
  src: localVideoFiles[id],
  poster: `https://images.pexels.com/videos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`,
  alt,
  aspectRatio,
  placeholder: false,
  credit: 'Demonstration footage · Gustavo Fring / Pexels',
  sourceUrl: `https://www.pexels.com/video/${id}/`,
});

const servicePhotos = {
  implants:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/09/dental-implants-dentist-discussing-a-treatment-pl-2023-11-27-05-35-23-utc-min-scaled.jpg?resize=2048%2C1365&ssl=1',
  surgery:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/09/dentist-with-tooth-anatomy-model-oral-teeth-decay-2024-03-26-16-10-19-utc-min-scaled-e1726524843879.jpg?resize=2048%2C1416&ssl=1',
  aligners:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/09/closeup-man-hand-holding-transparent-retainer-with-unrecognizable-bearded-man-face-unfocused-background-white-backgrou-min-scaled.jpg?fit=1024%2C683&ssl=1',
  cleaning:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/09/woman-undergo-dental-scaling-treatment-2023-11-27-04-56-03-utc-min-scaled.jpg?resize=2048%2C1080&ssl=1',
  smile:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/09/perfect-teeth-close-up-shot-white-teeth-scaled-e1727299544869.jpg?resize=2048%2C1308&ssl=1',
  whitening:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/08/dentist-whiting-teeth-scaled.jpg?resize=2048%2C1365&ssl=1',
};

export const contact: ClinicContact = {
  phoneDisplay: '+1 (314) 821-2650',
  phoneHref: 'tel:+13148212650',
  email: 'info@alratadental.com',
  address: '10038 Manchester Rd #226, St. Louis, MO 63122',
  mapHref:
    'https://maps.google.com/?q=10038+Manchester+Rd+%23226+St.+Louis+MO+63122',
  bookingHref: 'https://alratadental.com/appointment/',
};

export const heroVideo = pexelsVideo(
  '5889024',
  '5889024-sd_960_540_30fps.mp4',
  'A dentist and assistant providing treatment in a modern dental clinic',
  'portrait',
);

export const patientStories: VideoItem[] = [
  {
    title: 'Patient story layout 01',
    meta: 'Stock preview · replace with an approved patient story',
    description:
      'A working video preview showing how a future patient account will appear.',
    media: pexelsVideo(
      '5356598',
      '5356598-sd_640_360_25fps.mp4',
      'Dentist speaking with a patient in a dental clinic',
      'wide',
    ),
  },
  {
    title: 'Patient story layout 02',
    meta: 'Stock preview · not an Alrata patient testimonial',
    description:
      'Demonstration footage used only to preview pacing and interaction.',
    media: pexelsVideo(
      '5889025',
      '5889025-sd_640_360_30fps.mp4',
      'Dental professional caring for a patient',
    ),
  },
  {
    title: 'Patient story layout 03',
    meta: 'Stock preview · not an Alrata patient testimonial',
    description:
      'Demonstration footage used only to preview pacing and interaction.',
    media: pexelsVideo(
      '5889135',
      '5889135-sd_640_360_30fps.mp4',
      'A patient receiving care in a dental clinic',
    ),
  },
];

export const aboutMedia = clinicImage(
  servicePhotos.cleaning,
  'A patient receiving a professional dental cleaning',
  'wide',
);

export const services: Service[] = [
  {
    name: 'Dental Implants',
    description:
      'Explore implant treatment designed to restore function, comfort, and confidence.',
    href: 'https://alratadental.com/dental-implants/',
    media: clinicImage(
      servicePhotos.implants,
      'A dentist discussing dental implant treatment with a patient',
      'wide',
    ),
  },
  {
    name: 'Oral Surgery & Extractions',
    description:
      'Thoughtful surgical care with clear guidance before and after treatment.',
    href: 'https://alratadental.com/oral-surgery-extraction/',
    media: clinicImage(
      servicePhotos.surgery,
      'A dentist explaining tooth anatomy with a dental model',
    ),
  },
  {
    name: 'Root Canal Treatment',
    description:
      'Endodontic care focused on relieving discomfort and preserving your natural tooth.',
    href: 'https://alratadental.com/root-canal-endodontics/',
    media: clinicImage(
      servicePhotos.surgery,
      'A dentist using a tooth anatomy model to explain treatment',
    ),
  },
  {
    name: 'Clear Aligners',
    description:
      'A discreet path toward straighter teeth with a treatment plan made for you.',
    href: 'https://alratadental.com/clear-aligners/',
    media: clinicImage(
      servicePhotos.aligners,
      'A man holding a transparent dental aligner',
    ),
  },
  {
    name: 'Dental Veneers',
    description:
      'Personalized cosmetic treatment for shape, proportion, and a natural-looking smile.',
    href: 'https://alratadental.com/dental-veneers/',
    media: clinicImage(
      servicePhotos.smile,
      'Close-up of natural-looking teeth',
    ),
  },
  {
    name: 'Teeth Whitening',
    description:
      'Professional whitening options guided by your dentist and your goals.',
    href: 'https://alratadental.com/teeth-whitening/',
    media: clinicImage(
      servicePhotos.whitening,
      'Professional teeth whitening treatment',
    ),
  },
];

export const educationVideos: VideoItem[] = [
  {
    title: 'What to expect at an implant consultation',
    meta: 'Visual demonstration · sample video',
    description:
      'A working media preview for a future clinic-recorded explanation.',
    media: pexelsVideo(
      '5889017',
      '5889017-sd_640_360_30fps.mp4',
      'A dentist examining a patient',
    ),
  },
  {
    title: 'Veneers: questions to ask first',
    meta: 'Visual demonstration · sample video',
    description:
      'A working media preview for a future clinic-recorded explanation.',
    media: pexelsVideo(
      '5889022',
      '5889022-sd_640_360_30fps.mp4',
      'Dental care being performed in a clinic',
    ),
  },
  {
    title: 'Clear aligners or braces?',
    meta: 'Visual demonstration · sample video',
    description:
      'A working media preview for a future clinic-recorded explanation.',
    media: pexelsVideo(
      '5889028',
      '5889028-sd_640_360_30fps.mp4',
      'Dentist and patient during an appointment',
    ),
  },
];

export const whyMedia = clinicImage(
  servicePhotos.surgery,
  'A dental professional using a tooth model to explain treatment',
  'portrait',
);

export const resultMedia: [MediaAsset, MediaAsset] = [
  clinicImage(
    servicePhotos.whitening,
    'Professional dental whitening treatment in progress',
    'portrait',
  ),
  clinicImage(
    servicePhotos.smile,
    'Close-up of a bright, healthy-looking smile',
    'portrait',
  ),
];

export const statistics: Statistic[] = [
  {
    value: 10,
    suffix: '+',
    label: 'Years serving patients',
    placeholder: 'Add verified figure',
  },
  {
    value: 1000,
    suffix: '+',
    label: 'Patients cared for',
    placeholder: 'Add verified figure',
  },
  {
    value: 10,
    suffix: '',
    label: 'Dental professionals',
    placeholder: 'Add verified figure',
  },
  {
    value: 5,
    suffix: '+',
    label: 'Treatments available',
    placeholder: 'Add verified figure',
  },
];

export const team: TeamMember[] = [
  {
    name: 'Dr. Mamdouh Alrata',
    role: 'Dentist',
    href: 'https://alratadental.com/cmsms_doctor/mamdouh-alrata/',
    media: clinicImage(
      'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/08/DSC3809-scaled-e1724332938383.jpg?w=1696&ssl=1',
      'Dr. Mamdouh Alrata',
      'portrait',
    ),
  },
  {
    name: 'Janet',
    role: 'RDH',
    href: 'https://alratadental.com/cmsms_doctor/janet/',
    media: clinicImage(
      'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/08/janet-hygenist--scaled-e1724333619327.jpg?w=1696&ssl=1',
      'Janet, registered dental hygienist',
      'portrait',
    ),
  },
  {
    name: 'Vanessa',
    role: 'RDH',
    href: 'https://alratadental.com/cmsms_doctor/vanessa-rosas/',
    media: clinicImage(
      'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/08/vanessa.-hygenist-JPG-scaled-e1724333131690.jpg?w=1696&ssl=1',
      'Vanessa, registered dental hygienist',
      'portrait',
    ),
  },
  {
    name: 'Shelly',
    role: 'HCC',
    href: 'https://alratadental.com/cmsms_doctor/shelly/',
    media: clinicImage(
      'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/08/Shelly-Front-desk-scaled-e1724333296585.jpg?w=1696&ssl=1',
      'Shelly, Alrata team member',
      'portrait',
    ),
  },
  {
    name: 'Danya',
    role: 'OM',
    href: 'https://alratadental.com/cmsms_doctor/danya-kazzaz/',
    media: clinicImage(
      'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/08/danya.-office-mangerJPG-scaled-e1724173455464.jpg?w=1696&ssl=1',
      'Danya, office manager',
      'portrait',
    ),
  },
];

export const offer: Offer = {
  name: 'New Patient Special',
  price: '$150',
  description: 'A comprehensive exam, cleaning, and X-ray for new patients.',
  availability: 'Contact the clinic to confirm current availability and terms.',
  href: 'https://alratadental.com/appointment/',
  media: clinicImage(
    servicePhotos.cleaning,
    'A patient receiving a professional dental cleaning',
    'wide',
  ),
};

export const journey: JourneyStep[] = [
  {
    title: 'Book your appointment',
    description: 'Choose a convenient time online or call the clinic.',
  },
  {
    title: 'Consultation & assessment',
    description:
      'Talk through your concerns and receive a careful examination.',
  },
  {
    title: 'Your treatment plan',
    description:
      'Review clear recommendations and ask every question you have.',
  },
  {
    title: 'Begin treatment',
    description: 'Move forward at a pace that feels informed and comfortable.',
  },
  {
    title: 'Continued care',
    description: 'Stay supported with follow-up and preventive care.',
  },
];
