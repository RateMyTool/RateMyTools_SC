import { Dispatch, SetStateAction } from "react";
import { Col, Container, Row } from "react-bootstrap";

import StarSingle from '@/components/StarSingleUI';


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
                    { StarSingle(n,clampForStar(starFullState + 1, n), scale) }
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
                  { StarSingle(n, clampForStar(starFullState + 1, n), scale) }
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


export default ShowToolStarRating;