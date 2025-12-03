
'use client';

import React, { useState } from "react";
import { Col, Container, Row, Image, DropdownMenu, DropdownItem, Dropdown, DropdownToggle, Button } from "react-bootstrap";
import TopMenu from "@/components/TopMenu";
import FooterMenu from "@/components/FooterMenu";
//import { useSession } from 'next-auth/react';


const mainPage = 'bg-body-tertiary text-black';

const borderPage ='rounded-2 px-1 py-3 my-3 ';
const borderPanel ='rounded-3 px-3 py-3 ';

const selectorBorder = borderPage + 'border border-black bg-black text-white text-start hover:opacity-90 flex items-left text-lg font-medium gap-4';
const countBorder = borderPage + 'border border-primary bg-primary-subtle text-black text-start hover:opacity-90 flex items-left text-lg font-medium gap-4';
const compressedText = 'text-black text-start flex items-left text-lg font-medium gap-4';

const selectorText = 'text-black';


const selectedText = 'text-primary';
const panelClassMain = borderPanel + ' mx-0 bg-white text-black flex items-center text-lg font-medium gap-0';
const panelClassSelected = panelClassMain + ' border border-primary';
const panelClass = panelClassMain + ' mx-3 border border-dark-subtle';
const panelClassEnd = panelClassMain + ' border border-dark-subtle';

const panelInternalTitle = 'mx-0 mb-2 text-black text-lg font-medium';
const panelInternal = 'mx-0 my-2 text-black text-lg font-medium';
const ratingBorderFilled = borderPanel + 'border border-white bg-body-secondary text-black text-start text-lg font-medium gap-4';
const tagClass = 'm-0 border border-white-subtle bg-dark-subtle text-black hover:opacity-95 text-center rounded-3 px-2 py-1 text-lg font-small gap-1';

/* This is sent from the server for each tool */
class RatedToolSummary
{
	name: string;
	desc: string;
	icon: string;
	rating: number;
	numRatings: number;
	tags: string[];
	bestReview: Rating = null!;
    constructor(nameIn: string, ratingIn: number, numRatingsIn: number, tagsIn: string[], descIn: string, iconIn: string = null!)
    {
        this.name = nameIn;
        this.icon = iconIn;
        this.rating = ratingIn;
        this.numRatings = numRatingsIn;
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
    const [title, setTitle] = useState('TOOLS');
     // PLACEHOLDER
    const getSchool: string = "UH Manoa";
    const layoutList: boolean = false;// List mode is WIP

    getTools = [];
    getTools.push(new RatedToolSummary("SelectedTool", 10, 51, ["Fast"], "a default tool used by all"));
    getTools.push(new RatedToolSummary("barry", 10, 1367, ["Fast", "Simple", "Free"], "Industry standard"));
    getTools.push(new RatedToolSummary("loadPls", 6, 473, ["Cloud", "Paid$"], "A slow and laggy tool"));
    getTools.push(new RatedToolSummary("nullrefWannaBee", 0, 342, ["Fast", "Ads"], "An awful tool"));
    getTools.push(new RatedToolSummary("theWhuat", 4, 168, ["Fast", "Paid$$$"], "A confusing tool"));
    getTools.push(new RatedToolSummary("TestRun", 7, 21, ["Fast", "Paid$"], "An experimental tool"));

    selectedTool = getTools[0];
    
    var shownTools: RatedToolSummary[] = getTools.slice(0, getTools.length - 1);
    shownTools.splice(0, 1);


    shownTools.sort((a, b) => b.rating - a.rating) // Should be done server-side
    while (shownTools.length > 2)
        shownTools.pop();
    
    return (
        /* Display the header */
        <main className={mainPage}>
            <div style={{ height: 112 }} />
            {/* Top bar with our search term school */}
            <Container id="compare-page-school">
                <div className="d-flex flex-row">
                    <div className="me-2">
                        <h2>For College: </h2>
                    </div>
                    <div>
                        <h2 className="text-success">
                            {/* Place the name of the college we are filtering by here */}
                            { getSchool }
                        </h2>
                    </div>
                </div>
                <Row className="align-left text-left mt-2">
                    <h1><b>Compare Tools</b></h1>
                    <p>Compare a tool against others based on matching tags</p>
                </Row>
                <Row className={selectorBorder}>
                    <Col xs={3}>
                        <b>Select a tool to compare:</b>
                    </Col>
                    <Col className="d-flex flex-column">
                        <select 
                            //value= {getTools.indexOf(selectedTool)}
                            //onChange= {x => SetRelated(x.target.value) } 
                            className={"d-flex flex-column " + selectorText}
                        > 
                            {(() => {
                                const rows: React.JSX.Element[] = [];
                                var num: number = 0;
                                getTools.forEach(x => {
                                    rows.push((
                                        <option key={num} value={num.toString()}>{x.name}</option> 
                                    ))
                                    num++;
                                });
                                return rows;
                            })()}
                        </select>
                    </Col>
                </Row>
            </Container>
            {(() => {
                if (layoutList) 
                    return ComparePageList(selectedTool, shownTools);
                else
                    return ComparePagePanels(selectedTool, shownTools);
            })()}
        </main>
        /* Display the footer */
    );
};

/* Displays two tools, to compare them side by side */
const ComparePagePanels = (selected: RatedToolSummary, theList: RatedToolSummary[]) => {
    // PLACEHOLDER FOR MOCKUP
    var scale: number = 32;
    const ending: RatedToolSummary = theList[theList.length - 1];

    return (
        <Container id="compare-page-panel">
            <Row className={countBorder}>
                <div className="d-flex flex-row gap-1">
                    <div className={compressedText}>Comparing</div>
                    <div className={compressedText}><b>{selected.name}</b></div>
                    <div className={compressedText}>with</div>
                    <div className={compressedText}>{theList.length}</div>
                    <div className={compressedText}> other closely matching tools</div>
                    <div className="flex" />
                </div>
            </Row>
            <Row  className="">
                <div className="flex flex-row">
                    { ComparePagePanel(selectedTool, scale, selectedText, panelClassSelected)}
                    {/* For each rating, we call ComparePagePanel() to display a row for the tool */}
                    {(() => {
                        const rows: React.JSX.Element[] = [];
                        const end: RatedToolSummary = theList[theList.length - 1];
                        theList.forEach(x => 
                            {
                                if (selected != x && end != x )
                                    rows.push(ComparePagePanel(x, scale, "", panelClass))
                            }
                        );
                        return rows;
                    })()}
                    { ComparePagePanel(ending, scale, "", panelClassEnd)}
                </div>
            </Row>
        </Container>
    )
}
const ComparePagePanel = (theTool: RatedToolSummary, scale: number, classNameTitle: string, classNameBack: string) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Col className={classNameBack + "flex flex-col"}>
            {ShowToolName(theTool, classNameTitle)}
            {ShowToolStarRatingBIG(theTool, scale)}
            {ShowToolTags(theTool, scale)}
            {ShowDesciption(theTool, scale)}
            {ShowTopReview(theTool)}
        </Col>
    )
}

const ShowToolName = (theTool: RatedToolSummary, classNameTitle: string) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Container id="compare-page-panel" className={panelInternalTitle}>
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
                    <b>
                        <h3 className={classNameTitle}>
                            {theTool.name}
                        </h3>
                    </b>
                    Development Tool
                </Col>
            </Row> 
        </Container>
    )
}
const ShowToolStarRatingBIG = (theTool: RatedToolSummary, scale: number) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Container id="compare-page-ratingxl" className={ratingBorderFilled}>
            <Row>
                <Col xs={4}>
                    <h2 className="align-middle text-center">
                        {(() => {
                            return (theTool.rating / 2).toPrecision(2);
                        })() }
                    </h2>
                </Col>
                <Col>
                    {ShowToolStarRating(theTool.rating, scale)}
                </Col>
            </Row>
            <div className="d-flex flex-center flex-row gap-1">
                <div className={compressedText}>Based on</div>
                <div className={compressedText}><b>{theTool.numRatings}</b></div>
                <div className={compressedText}>ratings</div>
            </div>
        </Container>
    )
}
const ShowToolTags = (theTool: RatedToolSummary, scale: number) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Container id="compare-page-tags"  className={"align-left text-left " + panelInternal}>
            <h5 className="align-left text-left">
                Tags:
            </h5>
            <Row className="align-left items-left">
                {(() => {
                    const rows: React.JSX.Element[] = [];
                    theTool.tags.forEach(x => rows.push(DisplayTag(x)));
                    return rows;
                })()}
                <Col className="align-left text-center ms-5"></Col>
            </Row>
        </Container>
    )
}
const DisplayTag = (text: string) => {
    // PLACEHOLDER FOR MOCKUP
    return ( 
        <Col className="m-0">
            <Button className={tagClass}>
                {text}
            </Button>
        </Col>
    )
}

const ShowDesciption = (theTool: RatedToolSummary, scale: number) => {
    // PLACEHOLDER FOR MOCKUP
    return (
        <Container id="compare-page-desc"  className={"align-left text-left " + panelInternal}>
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
        <Container id="compare-page-PopReview"  className={"align-left text-left " + panelInternal}>
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
                   return ShowTextRating(theTool.bestReview);
                }
            })()}
        </Container>
    )
}

const ShowTextRating = (theRating: Rating) => {
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
                <Container className="bg-light" id="ratedTool-bar-top">
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
        <Container className={className} id="ratedTool-bar">
            <Row className="align-middle text-center">
                <Col xs={2}>
                    <b>
                        {/* Place the name of the tool here */}
                        { tool.name }
                    </b>
                </Col>
                <Col xs={5} className="d-flex flex-row items-left">
                    {/* Display the rating of the tool here */}
                    { ShowToolStarRating(tool.rating, scale) }
                </Col>
            </Row>
        </Container>
    )
}

/* Hand this a RatedTool and it will display a star rating for it on the UI. 
     Note: Make star icon for no star, half-star and fullStar*/
const ShowToolStarRating = (starFullState: number, scale: number) => {

    return (
        /* We make sure our given data yields any ratings, otherwise we ignore. */
        <Container id="ratedTool-Stars" className="align-middle text-center" fluid="sm">
            <Row>
                
                <div className="flex flex-row">
                <Col className="align-middle text-center mx-1">
                    { displayToolStar(clampForStar(starFullState, 0), scale) }
                </Col>
                <Col className="align-middle text-center mx-1">
                    { displayToolStar(clampForStar(starFullState, 2), scale) }
                </Col>
                <Col className="align-middle text-center mx-1">
                    { displayToolStar(clampForStar(starFullState, 4), scale) }
                </Col>
                <Col className="align-middle text-center mx-1">
                    { displayToolStar(clampForStar(starFullState, 6), scale) }
                </Col>
                <Col className="align-middle text-center mx-1">
                    { displayToolStar(clampForStar(starFullState, 8), scale) }
                </Col>
                </div>
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
    <img className="mx-2" src="/Icon_StarNone.png" width={scale} height={scale} alt="o" />
)
const starHalf = (scale: number) =>
(
    <img className="mx-2" src="/Icon_StarHalf.png" width={scale} height={scale} alt="*" />
)
const starFull = (scale: number) =>
(
    <img className="mx-2" src="/Icon_StarFull.png" width={scale} height={scale} alt="#" />
)


export default ComparePage;

//export default comparePageDual;
