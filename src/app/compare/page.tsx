
import React from "react";
import { Col, Container, Row, Image, DropdownMenu, DropdownItem, Dropdown, DropdownToggle } from "react-bootstrap";
import StarFull from '@/Icon_StarFull.png';
import StarHalf from '@/Icon_StarHalf.png';
import StarNone from '@/Icon_StarNone.png';
//import { useSession } from 'next-auth/react';


/* This is sent from the server for each tool */
class RatedToolSummary
{
	name: string;
	desc: string;
	icon: string;
	rating: number;
	tags: string[];
	bestReview: Rating = null!;
    constructor(nameIn: string, ratingIn: number, tagsIn: string[], descIn: string, iconIn: string = null!)
    {
        this.name = nameIn;
        this.icon = iconIn;
        this.rating = ratingIn;
        this.tags = tagsIn;
        this.desc = descIn;
    }
}
class Rating
{
    reviewer: string = "";
	rating: number = 10 // Expects input from [0 - 10], where 2 equals one star
	theReview: string = "";
}

var getTools: RatedToolSummary[] = [];
var selectedTool: RatedToolSummary = null!;

const SetRelated = (toSet: string) => 
{
    selectedTool = getTools[Number.parseInt(toSet)];
}

const ComparePage = () => {
     // PLACEHOLDER
    const getSchool: string = "UH Manoa";

    getTools = [];
    getTools.push(new RatedToolSummary("SelectedTool", 10, ["Fast"], "a default tool used by all"));
    getTools.push(new RatedToolSummary("barry", 10, ["Fast", "Simple UI", "Free"], "Industry standard"));
    getTools.push(new RatedToolSummary("loadPls", 6, ["Cloud Support", "Paid$"], "A slow and laggy tool"));
    getTools.push(new RatedToolSummary("nullrefWannaBee", 0, ["Fast", "Free with Ads"], "An awful tool"));
    getTools.push(new RatedToolSummary("theWhuat", 4, ["Fast", "Paid$$$"], "A confusing tool"));
    getTools.push(new RatedToolSummary("TestRun", 7, ["Fast", "Paid$"], "An experimental tool"));

    

    selectedTool = getTools[0];
    
    var shownTools: RatedToolSummary[] = getTools.slice(0, getTools.length - 1);
    shownTools.splice(0, 1);


    shownTools.sort((a, b) => b.rating - a.rating) // Should be done server-side
    while (shownTools.length > 2)
        shownTools.pop();
    
    return (
        /* Display the header */
        <main>
            {/* Top bar with our search term school */}
            <Container id="compare-page-school" fluid-className="py-3">
                <Row className="align-left text-left">
                    <Col xs={4}>
                        <h2>For Institution: </h2>
                    </Col>
                    <Col className="d-flex flex-column justify-content-left">
                        <h2>
                            {/* Place the name of the college we are filtering by here */}
                            { getSchool }
                        </h2>
                    </Col>
                    <Col className="d-flex flex-column justify-content-left">
                    </Col>
                </Row>
                <Row className="align-left text-left">
                    <h1>Compare Tools</h1>
                    <p>Compare a tool against others based on matching tags</p>
                </Row>
                <Row className="align-left text-left">
                    <Col xs={3} className="d-flex flex-column justify-content-left">
                        Select a tool to compare:
                    </Col>
                    <Col className="d-flex flex-column justify-content-center">
                        <select 
                            //value= {getTools.indexOf(selectedTool)}
                            //onChange= {x => SetRelated(x.target.value) } 
                            className="d-flex flex-column justify-content-center"
                        > 
                            {(() => {
                                const rows: React.JSX.Element[] = [];
                                var num: number = 0;
                                getTools.forEach(x => {
                                    rows.push((
                                        <option value={num.toString()}>{x.name}</option> 
                                    ))
                                    num++;
                                });
                                return rows;
                            })()}
                        </select>
                    </Col>
                </Row>
            </Container>
            { ComparePagePanels(selectedTool, shownTools) }
        </main>
        /* Display the footer */
    );
};

/* Displays two tools, to compare them side by side */
const ComparePagePanels = (selected: RatedToolSummary, theList: RatedToolSummary[]) => {
    // PLACEHOLDER FOR MOCKUP
    var scale: number = 32;

    return (
        <Container id="compare-page-panel" fluid-className="py-3">
            <Row className="align-right text-right">
                <Col xs="2">Comparing</Col>
                <Col xs="2"><b>{selected.name}</b></Col>
                <Col xs="1">with</Col>
                <Col xs="1">{theList.length}</Col>
                <Col xs="5">competing tools with similar tags</Col>
            </Row>
            <Row>
                { ComparePagePanel(selectedTool, scale, "bg-dark")}
                {/* For each rating, we call ComparePagePanel() to display a row for the tool */}
                {(() => {
                    const rows: React.JSX.Element[] = [];
                    theList.forEach(x => 
                        {
                            if (selected != x)
                                rows.push(ComparePagePanel(x, scale, "bg-light"))
                        }
                    );
                    return rows;
                })()}
            </Row>
        </Container>
    )
}
const ComparePagePanel = (theTool: RatedToolSummary, scale: number, className: string) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Col>
            {ShowToolTag(theTool)}
            {ShowToolRatingBIG(theTool, scale)}
            {ShowToolTags(theTool, scale)}
            {ShowDesciption(theTool, scale)}
            {ShowTopReview(theTool)}
        </Col>
    )
}

const ShowToolTag = (theTool: RatedToolSummary) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Container id="compare-page-panel" fluid-className="py-3">
            <Row>
                { (() => {
                    if (theTool.icon != null)
                    {
                        return (
                            <Col>
                                {theTool.icon}
                            </Col>
                        )
                    }
                })()}
                <Col>
                    <h3>
                        {theTool.name}
                    </h3>
                    Development Tool
                </Col>
            </Row>
        </Container>
    )
}
const ShowToolRatingBIG = (theTool: RatedToolSummary, scale: number) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Container id="compare-page-ratingxl"  className="bg-light align-middle text-center" fluid-className="py-3">
            <h2 className="align-middle text-center">
                {(() => {
                    return (theTool.rating / 2).toPrecision(2);
                })() }
            </h2>
            <Container id="compare-page-ratingxl"  className="bg-light align-right text-right" fluid-className="py-3">
                {displayToolRating(theTool.rating, scale)}
            </Container>
            <p>
                Based on X ratings
            </p>
        </Container>
    )
}
const ShowToolTags = (theTool: RatedToolSummary, scale: number) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Container id="compare-page-tags"  className="align-left text-left" fluid-className="py-3">
            <h5 className="align-left text-left">
                Tags:
            </h5>
            <Row className="align-middle text-center">
                {(() => {
                    const rows: React.JSX.Element[] = [];
                    theTool.tags.forEach(x => rows.push(DisplayTag(x)));
                    return rows;
                })()}
            </Row>
        </Container>
    )
}
const DisplayTag = (text: string) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Col className="bg-light align-middle text-center">
            <p>
                {text}
            </p>
        </Col>
    )
}

const ShowDesciption = (theTool: RatedToolSummary, scale: number) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Container id="compare-page-desc"  className="align-left text-left" fluid-className="py-3">
            <h5 className="align-left text-left">
                Summary:
            </h5>
            <p>
                {theTool.desc}
            </p>
        </Container>
    )
}

const ShowTopReview = (theTool: RatedToolSummary) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Container id="compare-page-PopReview"  className="align-left text-left" fluid-className="py-3">
            <h5 className="align-left text-left">
                Popular Review:
            </h5>
            {(() => {
                if (theTool.bestReview == null)
                {
                   return (
                        <p>
                            No reviews yet.
                        </p>
                   )
                }
                else
                {
                   return ShowRating(theTool.bestReview);
                }
            })()}
        </Container>
    )
}

const ShowRating = (theRating: Rating) => {
    // INCOMPLETE
    return (
        <p>
            yes
        </p>
    )
}






/* Displays a list of tools, ordered from top to bottom in order of rating */
/*  We may need to restrict the number of rows displayed based on database size.
    Perhaps poll for the best 25 then if the user scrolls down we send more over to the client. */
const ComparePageList = (selected: RatedToolSummary, theList: RatedToolSummary[]) => {
    // PLACEHOLDER FOR MOCKUP
    const getSchool: string = "UH Manoa";
    var scale: number = 32;

    return (
        <Container id="compare-page-list" fluid-className="py-3">
            <Container id="compare-page-list-element" fluid-className="py-3">
                <Container className="bg-light" id="ratedTool-bar-top" fluid-className="py-3">
                    <Row className="align-middle text-center">
                        <Col>
                            <b>
                                Name
                            </b>
                        </Col>
                        <Col xs={5} className="d-flex flex-column justify-content-right">
                            <b>
                                Rating
                            </b>
                        </Col>
                    </Row>
                </Container>
                {/* The main tool to compare against */}
                { displayToolRowIfNeeded(selected, scale, "") }
                {/* The list of tools we have found */}
                {/* For each rating, we call displayToolRowIfNeeded() to display a row for the tool */}
                {(() => {
                    const rows: React.JSX.Element[] = [];
                    theList.forEach(x => rows.push(displayToolRowIfNeeded(x, scale, "bg-light")));
                    return rows;
                })()}
            </Container>
        </Container>
    )
}


/* Display a summary of the tool in a brief row.
    We may need to restrict the number of rows displayed based on database size.
    Perhaps poll for the best 25 then if the user scrolls down we send more over to the client. 
    The database should have already pruned those tools that yield no ratings before reaching the client! */
const displayToolRowIfNeeded = (tool: RatedToolSummary, scale: number, className: string) => {
    const stringName: string = tool.name;
    const starRatingFull: number = tool.rating;
    return (
        /* We make sure our given data yields any ratings, otherwise we ignore. */
        <Container className={className} id="ratedTool-bar" fluid-className="py-3">
            <Row className="align-middle text-center">
                <Col>
                    <b>
                        {/* Place the name of the tool here */}
                        { tool.name }
                    </b>
                </Col>
                <Col xs={5} className="d-flex flex-column justify-content-right">
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
        <Container id="ratedTool-Stars" className="align-middle text-center" fluid="sm">
            <Row>
                <Col xs={1} className="align-middle text-center">
                    { displayToolStar(clampForStar(starFullState, 0), scale) }
                </Col>
                <Col xs={1} className="align-middle text-center">
                    { displayToolStar(clampForStar(starFullState, 2), scale) }
                </Col>
                <Col xs={1} className="align-middle text-center">
                    { displayToolStar(clampForStar(starFullState, 4), scale) }
                </Col>
                <Col xs={1} className="align-middle text-center">
                    { displayToolStar(clampForStar(starFullState, 6), scale) }
                </Col>
                <Col xs={1} className="align-middle text-center">
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


export default ComparePage;

//export default comparePageDual;
