import type { MediaAsset, AspectRatio } from '@/types/content'

export const clinicImage = (
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

export const servicePhotos = {
  implants:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/09/dental-implants-dentist-discussing-a-treatment-pl-2023-11-27-05-35-23-utc-min-scaled.jpg?resize=2048%2C1365&ssl=1',
  surgery:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/09/dentist-with-tooth-anatomy-model-oral-teeth-decay-2024-03-26-16-10-19-utc-min-scaled-e1726524843879.jpg?resize=2048%2C1416&ssl=1',
  aligners:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/09/closeup-man-hand-holding-transparent-retainer-with-unrecognizable-bearded-man-face-unfocused-background-white-backgrou-min-scaled.jpg?fit=1024%2C683&ssl=1',
  cleaning:
    '/media/services/professional-cleaning.webp',
  smile:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/09/perfect-teeth-close-up-shot-white-teeth-scaled-e1727299544869.jpg?resize=2048%2C1308&ssl=1',
  whitening:
    'https://i0.wp.com/alratadental.com/wp-content/uploads/2024/08/dentist-whiting-teeth-scaled.jpg?resize=2048%2C1365&ssl=1',
};
