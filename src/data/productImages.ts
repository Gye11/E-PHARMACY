import image from '../assets/medicines/image.jpg';
import image1 from '../assets/medicines/image1.jpg';
import image2 from '../assets/medicines/image2.jpg';
import image3 from '../assets/medicines/image3.jpg';
import image4 from '../assets/medicines/image4.jpg';
import image5 from '../assets/medicines/image5.jpg';
import image6 from '../assets/medicines/image6.jpg';
import image7 from '../assets/medicines/image7.jpg';
import image8 from '../assets/medicines/image8.jpg';
import image9 from '../assets/medicines/image9.jpg';
import image10 from '../assets/medicines/image10.jpg';
import image11 from '../assets/medicines/image11.jpg';
import image12 from '../assets/medicines/image12.jpg';
import image13 from '../assets/medicines/image13.jpg';
import image14 from '../assets/medicines/image14.jpg';
import image15 from '../assets/medicines/image15.jpg';
import image16 from '../assets/medicines/image16.jpg';
import image17 from '../assets/medicines/image17.jpg';
import bluePill from '../assets/medicines/mavihap.jpg';

export const MEDICINE_IMAGES = [
  { name: 'Medical inhaler', src: image },
  { name: 'Moringa supplement', src: image1 },
  { name: 'Hydrochloride tablets', src: image2 },
  { name: 'Occidentalis capsules', src: image3 },
  { name: 'Prednisone medicine', src: image4 },
  { name: 'Calcium supplement', src: image5 },
  { name: 'Antibiotic medicine box', src: image6 },
  { name: 'Capsules', src: image7 },
  { name: 'Moringa supplement set', src: image8 },
  { name: 'Isopropyl alcohol', src: image9 },
  { name: 'Calcium bottle', src: image10 },
  { name: 'Medicine box', src: image11 },
  { name: 'Hydrochloride bottle', src: image12 },
  { name: 'Occidentalis bottle', src: image13 },
  { name: 'Prednisone bottle', src: image14 },
  { name: 'Hand sanitizer', src: image15 },
  { name: 'Skin care lotion', src: image16 },
  { name: 'Vitamin supplement', src: image17 },
  { name: 'Blue medicine pack', src: bluePill },
] as const;

export const DEFAULT_PRODUCT_IMAGE = image1;

const catalogDetails = [
  ['Moringa', 'Plant-based nutritional supplement', 470],
  ['Isopropyl Alcohol', 'Topical antiseptic solution', 54],
  ['Dapsone', 'Prescription medicine', 520],
  ['Heimintohs', 'Over-the-counter medicine', 470],
  ['Alcohol', 'Topical antiseptic solution', 748],
  ['Antibiotic', 'Prescription medicine', 120],
  ['Stomach Medicine', 'Digestive care medicine', 45],
  ['Moringa Plus', 'Daily nutritional supplement', 470],
  ['Moringa Capsules', 'Herbal supplement capsules', 470],
  ['Calcium', 'Calcium supplement', 306],
  ['Antibiotic Pack', 'Prescription medicine pack', 120],
  ['Hydrochloride', 'Prescription medicine', 582],
  ['Occidentalis', 'Prescription medicine', 239],
  ['Prednisone', 'Prescription medicine', 579],
  ['Hand Sanitizer', 'Hand hygiene solution', 354],
  ['Skin Care Lotion', 'Skin care product', 354],
  ['Vitamin C', 'Vitamin supplement', 24],
  ['Blue Capsule Pack', 'Medicine capsules', 239],
  ['Blue Medicine Pack', 'Medicine pack', 239],
] as const;

export const MEDICINE_CATALOG = MEDICINE_IMAGES.map((image, index) => ({
  id: `medicine-${index + 1}`,
  name: catalogDetails[index][0],
  description: catalogDetails[index][1],
  price: catalogDetails[index][2],
  image: image.src,
}));
