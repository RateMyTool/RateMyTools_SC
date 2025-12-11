'use client';

import React,  { useMemo, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Stars from '@/components/StarsUI';
import { Col, Container, Row, Button } from "react-bootstrap";
import ReviewCard from '@/components/ReviewCard';
//import { Review } from "@prisma/client";

const mainPage = 'bg-body-tertiary text-black';

const borderPage ='rounded-2 px-1 py-3 my-3 ';
const borderPanel ='rounded-3 px-3 py-3 ';

const selectorBorder = `${borderPage}border border-black bg-black text-white text-start hover:opacity-90 flex items-left text-lg font-medium gap-4`;
const countBorder = `${borderPage}border border-primary bg-primary-subtle text-black text-start hover:opacity-90 flex items-left text-lg font-medium gap-4`;
const compressedText = 'text-black text-start flex items-left text-lg font-medium gap-4';

const selectorText = 'text-black';

const selectedText = 'text-primary';
const panelClassMain = `${borderPanel} mx-0 bg-white text-black flex items-center text-lg font-medium gap-0`;
const panelClassSelected = `${panelClassMain} border border-primary`;
const panelClass = `${panelClassMain} mx-3 border border-dark-subtle`;
const panelClassEnd = `${panelClassMain} border border-dark-subtle`;

const panelInternalTitle = 'mx-0 mb-2 text-black text-lg font-medium';
const panelInternal = 'mx-0 my-2 text-black text-lg font-medium';
const ratingBorderFilled = `${borderPanel}border border-white bg-body-secondary text-black text-start text-lg font-medium gap-4`;
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
	bestReview: Review = null!;
    constructor(nameIn: string, ratingIn: number, numRatingsIn: number, tagsIn: string[], descIn: string, 
      bestReview: Review = null!, iconIn: string = null!)
    {
        this.name = nameIn;
        this.icon = iconIn;
        this.rating = ratingIn;
        this.numRatings = numRatingsIn;
        this.tags = tagsIn;
        this.desc = descIn;
        this.bestReview = bestReview;
    }
}
interface Review {
  id: number;
  tool: string;
  school: string;
  subject: string | null;
  courseNumber: string | null;
  rating: number;
  reviewText: string;
  createdAt: string;
}
/*
class Rating
{
  reviewer: string = "";
	rating: number = 5 // Expects input from [0 - 5], where 1 equals one star
	theReview: string = "";
}*/


//type SortKey = 'relevance' | 'highest' | 'lowest' | 'most' | 'recent';
interface Tool {
  name: string;
  rating: number;
  totalRatings: number;
  description: string;
  tags: string[];
}

type Params = {
  school: string;
  params: {
    id: string;
  };
};

class ToolsCallback {
  allTools: Tool[];
  mainTool: RatedToolSummary;
  toolsSorted: RatedToolSummary[];
  constructor(allTools: Tool[], mainTool: RatedToolSummary, tools: RatedToolSummary[])
  {
    this.allTools = allTools;
    this.mainTool = mainTool;
    this.toolsSorted = tools;
  }
}


export default function CompareDetailPage({ school, params }: Params) {
   // PLACEHOLDER
  const layoutList: boolean = false;// List mode is WIP
  const mainToolName = decodeURIComponent(params.id);

  // Adapted from ToolsList & Review pages

  const router = useRouter();
  //const [sortBy, setSortBy] = useState<SortKey>('highest');
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToolsAndFirstReviews = async () => {
      try {
        const response = await fetch(`/api/school/${encodeURIComponent(school)}/tools`);
        const data = await response.json();
        setTools(data.tools || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToolsAndFirstReviews();
  }, [school]);

  const toolGetData: ToolsCallback = useMemo(() => {
    const mainToolGet: Tool | undefined = tools.find((a) => {
      return a.name === mainToolName;
    })
    if (mainToolGet != null)
    {
      const selectedTool = new RatedToolSummary(mainToolGet.name, mainToolGet.rating, 
      mainToolGet.totalRatings, mainToolGet.tags, mainToolGet.description);

      const toolMainTags = mainToolGet?.tags;
      const listSelect = tools.filter((a) => {
        return a.name != mainToolName && a.tags.find((x: string) => {
          return toolMainTags.find(y => y == x);
        });
      }, [mainToolName]);
      listSelect.sort((a, b) => b.rating - a.rating);
      while (listSelect.length > 2) listSelect.pop();
      const sortedTools: RatedToolSummary[] = [];
      listSelect.forEach((toolc) => {
        sortedTools.push(new RatedToolSummary(toolc.name, toolc.rating, toolc.totalRatings, toolc.tags, toolc.description));
      });

      return new ToolsCallback([...tools], selectedTool, sortedTools);
    }
    return new ToolsCallback([...tools], null!, []);

  }, [tools, mainToolName]);

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
              {school}
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
              value= {(() =>
                {
                  if (toolGetData.mainTool != null)
                    return toolGetData.mainTool.name;
                  return "0";
                })()}
              onChange= {(x) => {
                router.push(`/compare/${encodeURIComponent(x.target.value)}`);
              }}
              /*
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/compare/${e.}`);
              }}*/
              className={`d-flex flex-column ${selectorText}`}
            >
              {(() => {
                  const rows: React.JSX.Element[] = [];
                  let num: number = 0;
                  toolGetData.allTools.forEach(x => {
                      rows.push((
                        <option key={num} value={x.name}>{x.name}</option>
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
          if (isLoading)
          {
            return LoadingPagePanel();
          }
          else
          {
            if (toolGetData.mainTool == null)
            {
              return LoadedNoToolPanel();
            }
            else
            {
              if (layoutList)
                  { return ComparePageList(toolGetData.mainTool, toolGetData.toolsSorted); }
              return ComparePagePanels(toolGetData.mainTool,  toolGetData.toolsSorted);
            }
          }
      })()}
    </main>
      /* Display the footer */
  );
}
const LoadingPagePanel = () => {
  return (
    <Container id="compare-page-panel">
      <div>Loading tools...</div>
    </Container>
  )
}
const LoadedNoToolPanel = () => {
  return (
    <Container id="compare-page-panel">
      <div>Select a tool</div>
    </Container>
  )
}


/* Displays two tools, to compare them side by side */
const ComparePagePanels = (selected: RatedToolSummary, theList: RatedToolSummary[]) => {
    // PLACEHOLDER FOR MOCKUP
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scale: number = 32;
  let ending: RatedToolSummary | null = null;
  if (theList.length > 0) 
    ending = theList[theList.length - 1];

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
      <Row className="">
        <div className="flex flex-row">
          { ComparePagePanel(selected, scale, selectedText, panelClassSelected)}
          {/* For each rating, we call ComparePagePanel() to display a row for the tool */}
          {(() => {
              const rows: React.JSX.Element[] = [];
              const end: RatedToolSummary = theList[theList.length - 1];
              theList.forEach(x =>
                  {
                      if (selected != x && end != x) rows.push(ComparePagePanel(x, scale, "", panelClass))
                  });
              return rows;
          })()}
          {(() => {
            if (ending != null)
              return ComparePagePanel(ending, scale, "", panelClassEnd)
          })()}
        </div>
      </Row>
    </Container>
  )
}
const ComparePagePanel = (theTool: RatedToolSummary, scale: number, classNameTitle: string, classNameBack: string) =>
  // PLACEHOLDER FOR MOCKUP
  (
    <Col className={`${classNameBack}flex flex-col`}>
      {ShowToolName(theTool, classNameTitle)}
      {ShowToolStarRatingBIG(theTool, scale)}
      {ShowToolTags(theTool)}
      {ShowDesciption(theTool)}
      {ShowTopReview(theTool)}
    </Col>
  )

const ShowToolName = (theTool: RatedToolSummary, classNameTitle: string) =>
  // PLACEHOLDER FOR MOCKUP
  (
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

const ShowToolStarRatingBIG = (theTool: RatedToolSummary, scale: number) =>
  // PLACEHOLDER FOR MOCKUP
  (
    <Container id="compare-page-ratingxl" className={ratingBorderFilled}>
      <Row>
        <Col xs={3}>
          <h2 className="align-middle text-center mx-4">
            {(() => (theTool.rating).toPrecision(2))() }
          </h2>
        </Col>
        <Col>
          {Stars(theTool.rating, scale, true, null!)}
        </Col>
      </Row>
      <div className="d-flex flex-center flex-row gap-1">
        <div className={compressedText}>Based on</div>
        <div className={compressedText}><b>{theTool.numRatings}</b></div>
        <div className={compressedText}>ratings</div>
      </div>
    </Container>
  )

const ShowToolTags = (theTool: RatedToolSummary) =>
  // PLACEHOLDER FOR MOCKUP
  (
    <Container id="compare-page-tags" className={`align-left text-left ${panelInternal}`}>
      <h5 className="align-left text-left">
        Tags:
      </h5>
      <Row className="align-left items-left">
        {(() => {
                const rows: React.JSX.Element[] = [];
                theTool.tags.forEach(x => rows.push(DisplayTag(x)));
                return rows;
            })()}
        <Col className="align-left text-center ms-5" />
      </Row>
    </Container>
  )

const DisplayTag = (text: string) =>
  // PLACEHOLDER FOR MOCKUP
  (
    <Col className="m-0 align-left">
      <Button className={tagClass}>
        {text}
      </Button>
    </Col>
  )

const ShowDesciption = (theTool: RatedToolSummary) =>
  // PLACEHOLDER FOR MOCKUP
  (
    <Container id="compare-page-desc" className={`align-left text-left ${panelInternal}`}>
      <h5 className="align-left text-left">
        Summary:
      </h5>
      <p>
        {theTool.desc}
      </p>
    </Container>
  )

const ShowTopReview = (theTool: RatedToolSummary) =>
  // PLACEHOLDER FOR MOCKUP
  (
    <Container id="compare-page-PopReview" className={`align-left text-left ${panelInternal}`}>
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
          return ShowTextRating(theTool.bestReview);
      })()}
    </Container>
  )

const ShowTextRating = (r: Review) => (
  // INCOMPLETE
  <ReviewCard
    key={r.id}
    id={r.id}
    tool={r.tool}
    school={r.school}
    subject={r.subject}
    courseNumber={r.courseNumber}
    rating={r.rating}
    reviewText={r.reviewText}
    createdAt={r.createdAt}
  />
);

/* Displays a list of tools, ordered from top to bottom in order of rating */
/*  We may need to restrict the number of rows displayed based on database size.
    Perhaps poll for the best 25 then if the user scrolls down we send more over to the client. */
const ComparePageList = (selected: RatedToolSummary, theList: RatedToolSummary[]) => {
  // PLACEHOLDER FOR MOCKUP
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scale: number = 32;

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stringName: string = tool.name;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          { Stars(tool.rating, scale, true, null!) }
        </Col>
      </Row>
    </Container>
  )
}

