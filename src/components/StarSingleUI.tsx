import Image from 'next/image';
import { Star } from 'react-bootstrap-icons';

const StarType: number = 0;// Note 1 is currently BROKEN due to texture clipping
/*
  0 = Default
  1 = SVG
  2 = react - Emoticon
*/

const DisplayToolStar = (starIndex: number, starState: number, scale: number) => {
  switch (StarType)
  {
    case 1:    
      return (
        <svg width={scale} height={scale} viewBox={"0 0 " + scale + " " + scale} 
          fill={(starState > 0) ? 'currentColor' : 'none'} stroke="currentColor" 
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 .587l3.668 7.431L23.4 9.587l-5.7 5.558L19.335 24 12 19.897 4.665 24l1.635-8.855L.6 9.587l7.732-1.569L12 .587z" />
        </svg>
      )
    case 2:
      return (
        <Star
          key={starIndex}
          size={scale}
          className={(starState > 0) ? 'text-warning' : 'text-secondary'}
          style={(starState > 0) ? { fill: '#facc15' } : {}}
        />
      )
    case 0:
    default:
      if (starState == 1) return starFull(scale);
      if (starState == 0.5) return starHalf(scale);
      return starNone(scale);
  }
}
//   <span style={{ color: '#eab308' }}>⭐</span> // The 4th kind


const starNone = (scale: number) => (
  <Image src="/Icon_StarNone.png" width={scale} height={scale} alt="o" />
)
const starHalf = (scale: number) => (
  <Image src="/Icon_StarHalf.png" width={scale} height={scale} alt="*" />
)
const starFull = (scale: number) => (
  <Image src="/Icon_StarFull.png" width={scale} height={scale} alt="#" />
)


export default DisplayToolStar;