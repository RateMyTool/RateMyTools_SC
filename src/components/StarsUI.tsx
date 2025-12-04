import { Dispatch, SetStateAction } from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import { Star } from 'react-bootstrap-icons';

const StarType: number = 0;// Note 1 is currently BROKEN due to texture clipping
/*
  0 = Default
  1 = SVG
  2 = react - Emoticon
*/

/* Hand this a RatedTool and it will display a star rating for it on the UI.
     Note: Make star icon for no star, half-star and fullStar */
const ShowToolStarRating = (starFullState: number, scale: number, expand: boolean, clickEvent: 
  Dispatch<SetStateAction<number>>) => {
  if (clickEvent == null)
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clickEvent = (): Dispatch<SetStateAction<number>> => { 
      return null! 
    };
  }

  return (
    /* We make sure our given data yields any ratings, otherwise we ignore. */
    <Container id="ratedTool-Stars" className="align-middle text-center" fluid="sm">
      <Row>
        <div className="flex flex-row">
          {[1, 2, 3, 4, 5].map((n) => 
          {
            if (expand)
            {
              return (
                // eslint-disable-next-line react/no-array-index-key, react/jsx-key
                <Col className="align-middle text-center mx-1">
                  <button
                    type="button"
                    key={n}
                    className={`btn btn-link p-0 me-2 ${n <= starFullState ? 'text-warning' : 'text-secondary'}`}
                    onClick={
                      () => clickEvent(n)
                    }
                  >
                    { displayToolStar(n,clampForStar(starFullState + 1, n), scale) }
                  </button>
                </Col>
              )
            }
            else
            {
              return (
                // eslint-disable-next-line react/no-array-index-key, react/jsx-key
                <button
                  type="button"
                  key={n}
                  className={`btn btn-link p-0 me-2 ${n <= starFullState ? 'text-warning' : 'text-secondary'}`}
                  onClick={
                    () => clickEvent(n)
                  }
                >
                  { displayToolStar(n, clampForStar(starFullState + 1, n), scale) }
                </button>
              )
            }
          })}
        </div>
      </Row>
    </Container>
  )
}
  const clampForStar = (starFullState: number, rangeStart: number): number => {
      starFullState -= rangeStart;
      if (starFullState > 1) starFullState = 1
      else if (starFullState < 0) starFullState = 0
      return starFullState
  }

const displayToolStar = (starIndex: number, starState: number, scale: number) => {
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


const starNone = (scale: number) => (
  <Image className="mx-2" src="/Icon_StarNone.png" width={scale} height={scale} alt="o" />
)
const starHalf = (scale: number) => (
  <Image className="mx-2" src="/Icon_StarHalf.png" width={scale} height={scale} alt="*" />
)
const starFull = (scale: number) => (
  <Image className="mx-2" src="/Icon_StarFull.png" width={scale} height={scale} alt="#" />
)

export default ShowToolStarRating;