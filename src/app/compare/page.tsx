import React from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import StarFull from '@/Icon_StarFull.png';
import StarHalf from '@/Icon_StarHalf.png';
import StarNone from '@/Icon_StarNone.png';
//import { useSession } from 'next-auth/react';


/* This is sent from the server for each tool */
class RatedToolSummary
{
	name: string;
	rating: number;
    constructor(nameIn: string, ratingIn: number)
    {
        this.name = nameIn;
        this.rating = ratingIn;        
    }
}



/* Displays a list of tools, ordered from top to bottom in order of rating */
/*  We may need to restrict the number of rows displayed based on database size.
    Perhaps poll for the best 25 then if the user scrolls down we send more over to the client. */
const ComparePage = () => {
    // PLACEHOLDER FOR MOCKUP
    const getSchool: string = "UH Manoa";
    var selectedTool: RatedToolSummary;
    var getTools: RatedToolSummary[] = [];
    var scale: number = 32;

     // PLACEHOLDER
    getTools.push(new RatedToolSummary("barry", 10));
    getTools.push(new RatedToolSummary("loadPls", 6));
    getTools.push(new RatedToolSummary("nullrefWannaBee", 0));
    getTools.push(new RatedToolSummary("theWhuat", 4));
    getTools.push(new RatedToolSummary("TestRun", 7));

    getTools.sort(x => x.rating) // Should be done server-side
    
    return (
        /* Display the header */
        <main>
            <Container id="compare-page-list" fluid-className="py-3">
                {/* Top bar with our search term school */}
                <Container id="compare-page-school" fluid-className="py-3">
                    <Row className="align-middle text-center">
                        <Col>
                            <h1>For Institution: </h1>
                        </Col>
                        <Col>
                            <h1>
                                {/* Place the name of the college we are filtering by here */}
                                { getSchool }
                            </h1>
                        </Col>
                    </Row>
                </Container>
                <Row className="align-middle text-center">
                    <Col xs={8} className="d-flex flex-column justify-content-center">
                        <h1>Compare Tools</h1>
                        <p>Compare your tools here (WIP)</p>
                    </Col>
                </Row>
                {/* The list of tools we have found */}
                <Container className="bg-light" id="compare-page-list-element" fluid-className="py-3">
                    <Container className="bg-light" id="ratedTool-bar-top" fluid-className="py-3">
                        <Row className="align-middle text-center">
                            <Col xs={4}>
                                <b>
                                    Name
                                </b>
                            </Col>
                            <Col xs={8} className="d-flex flex-column justify-content-center">
                                <b>
                                    Rating
                                </b>
                            </Col>
                        </Row>
                    </Container>
                    {/* For each rating, we call displayToolRowIfNeeded() to display a row for the tool */}
                    {(() => {
                        const rows: React.JSX.Element[] = [];
                        getTools.forEach(x => rows.push(displayToolRowIfNeeded(x, scale)));
                        return rows;
                    })()}
                </Container>
            </Container>
        </main>
        /* Display the footer */
    )
}


/* Display a summary of the tool in a brief row.
    We may need to restrict the number of rows displayed based on database size.
    Perhaps poll for the best 25 then if the user scrolls down we send more over to the client. 
    The database should have already pruned those tools that yield no ratings before reaching the client! */
const displayToolRowIfNeeded = (tool: RatedToolSummary, scale: number) => {
    const stringName: string = tool.name;
    const starRatingFull: number = tool.rating;
    return (
        /* We make sure our given data yields any ratings, otherwise we ignore. */
        <Container className="bg-light" id="ratedTool-bar" fluid-className="py-3">
            <Row className="align-middle text-center">
                <Col xs={4}>
                    <b>
                        {/* Place the name of the tool here */}
                        { tool.name }
                    </b>
                </Col>
                <Col xs={8} className="d-flex flex-column justify-content-center">
                    {/* Display the rating of the tool here */}
                    { displayToolRating(tool.rating, scale) }
                </Col>
            </Row>
        </Container>
    )
}

/* Hand this a RatedTool and it will display a star rating for it on the UI. 
     Note: Make star icon for no star, half-star and fullStar*/
const displayToolRating = (starFullState: number, scale: number) => {

    return (
        /* We make sure our given data yields any ratings, otherwise we ignore. */
        <Container id="ratedTool-Stars" fluid="sm">
            <Row className="align-middle text-center">
                <Col xs={1}>
                    { displayToolStar(clampForStar(starFullState, 0), scale) }
                </Col>
                <Col xs={1}>
                    { displayToolStar(clampForStar(starFullState, 2), scale) }
                </Col>
                <Col xs={1}>
                    { displayToolStar(clampForStar(starFullState, 4), scale) }
                </Col>
                <Col xs={1}>
                    { displayToolStar(clampForStar(starFullState, 6), scale) }
                </Col>
                <Col xs={1}>
                    { displayToolStar(clampForStar(starFullState, 8), scale) }
                </Col>
            </Row>
        </Container>
    )
}
const clampForStar = (starFullState: number, rangeStart: number): number => {
    starFullState -= rangeStart;
    if (starFullState > 2)
        starFullState = 2
    else if (starFullState < 0)
        starFullState = 0
    return starFullState
}

const displayToolStar = (starState: number, scale: number) => {
    if (starState == 2)
        return starFull(scale);
    else if (starState == 1)
        return starHalf(scale);
    else
        return starNone(scale);
}

const starNone = (scale: number) =>
(
    <img src={StarNone.src} width={scale} height={scale} alt="o" />
)
const starHalf = (scale: number) =>
(
    <img src={StarHalf.src} width={scale} height={scale} alt="*" />
)
const starFull = (scale: number) =>
(
    <img src={StarFull.src} width={scale} height={scale} alt="#" />
)


/* Displays two tools, to compare them side by side */
const ComparePageDual = () =>
(
    /* Display the header */
    <main>
        <Container id="compare-page-dual" fluid-className="py-3">
            <Row className="align-middle text-center">
                <Col xs={4}>
                    /* create */
                    <Image src="logo.png" width="150px" alt="" />
                </Col>

                <Col xs={8} className="d-flex flex-column justify-content-center">
                    <h1>Compare Tools</h1>
                    <p>Compare your tools here (WIP)</p>
                </Col>
            </Row>
        </Container>
    </main>
    /* Display the footer */
)


/* Forms a self-scaling display with the rating summary to be placed in */
const displayToolPanel = () =>
(
    <Container id="ratedTool-panel" fluid-className="py-3">
        <Row className="align-middle text-center">
            <Col xs={4}>
                /* create */
                <Image src="logo.png" width="150px" alt="" />
            </Col>

            <Col xs={8} className="d-flex flex-column justify-content-center">
                <h1>Compare Tools</h1>
                <p>Compare your tools here (WIP)</p>
            </Col>
        </Row>
    </Container>
)


/* To be displayed within any Col to provide context on the given tool */
const displaySummaryShort = () =>
(
    <Container id="compare-page" fluid-className="py-3">
        <Row className="align-middle text-center">
        {/* Display the header */}
        </Row>
        <Row className="align-middle text-center">
            <Col xs={4}>
                /* create */
                <Image src="logo.png" width="150px" alt="" />
            </Col>

            <Col xs={8} className="d-flex flex-column justify-content-center">
                <h1>Compare Tools</h1>
                <p>Compare your tools here (WIP)</p>
            </Col>
        </Row>
    </Container>
)


export default ComparePage;

//export default comparePageDual;
