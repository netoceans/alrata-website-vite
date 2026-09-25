import { clinicImage, servicePhotos } from '@/data/media'
import { contact } from '@/data/clinic'
import type { AspectRatio, MediaAsset, VideoItem, Offer, Statistic, JourneyStep } from '@/types/content'
export { leadDentist as doctorProfile, homeTeam as team } from '@/features/team/content'

const localVideoFiles: Record<string, string> = {
  '5889024': `/media/dental-care-hero.mp4`,
  '5356598': `/media/dental-consultation.mp4`,
  '5889025': `/media/dental-treatment-closeup.mp4`,
  '5889135': `/media/dental-patient-care.mp4`,
  '5889017': `/media/dental-consultation.mp4`,
  '5889022': `/media/dental-treatment-closeup.mp4`,
  '5889028': `/media/dental-patient-care.mp4`,
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

const upcomingOfferArtwork: MediaAsset = {
  src: '/media/new-patient-offer.svg',
  poster: '/media/new-patient-offer.svg',
  alt: 'Decorative Alrata offer artwork',
  aspectRatio: 'wide',
  placeholder: false,
};

export const offers: Offer[] = [
  {
    category: 'Your first visit',
    name: 'New Patient Special',
    price: '$150',
    description: 'A comprehensive exam, cleaning, and X-ray for new patients.',
    availability: 'Contact the clinic to confirm current availability and terms.',
    href: contact.bookingHref,
    placeholder: false,
    media: clinicImage(
      servicePhotos.cleaning,
      'A patient receiving a professional dental cleaning',
      'wide',
    ),
  },
  {
    category: 'Offer preview 02',
    name: 'New offer coming soon',
    price: null,
    description: 'We are preparing another way to make your next visit feel even more worthwhile.',
    availability: 'Details will be shared here once this offer is confirmed by the clinic.',
    href: null,
    placeholder: true,
    media: upcomingOfferArtwork,
  },
  {
    category: 'Offer preview 03',
    name: 'More to smile about',
    price: null,
    description: 'A future clinic offer will appear here with complete pricing and eligibility details.',
    availability: 'This is a design preview and is not currently available for booking.',
    href: null,
    placeholder: true,
    media: upcomingOfferArtwork,
  },
];

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
