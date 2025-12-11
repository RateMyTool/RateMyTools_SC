'use client';

import React,  { useMemo, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Col, Container, Row } from "react-bootstrap";
// import { useSession } from 'next-auth/react';

const mainPage = 'bg-body-tertiary text-black';

const borderPage ='rounded-2 px-1 py-3 my-3 ';

const selectorBorder = `${borderPage}border border-black bg-black text-white text-start hover:opacity-90 flex items-left text-lg font-medium gap-4`;

const selectorText = 'text-black';

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
	rating: number = 5 // Expects input from [0 - 5], where 1 equals one star
	theReview: string = "";
}

interface ToolsCompareProps {
  school: string;
}
interface Tool {
  name: string;
  rating: number;
  totalRatings: number;
  description: string;
  tags: string[];
}

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


export default function ComparePage({ school }: ToolsCompareProps) {
  // PLACEHOLDER
  //const layoutList: boolean = false;// List mode is WIP

  // Taken from ToolsList page

  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToolsAndFirstReviews = async () => {
      try {
        if (school == null || school.length == 0)
        {
          const response = await fetch(`/api/tools`);
          const data = await response.json();
          setTools(data.tools || []);
        }
        else
        {
          const response = await fetch(`/api/school/${encodeURIComponent(school)}/tools`);
          const data = await response.json();
          setTools(data.tools || []);
        }
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToolsAndFirstReviews();
  }, [school]);

  const toolGetData: ToolsCallback = useMemo(() => {
    return new ToolsCallback([...tools], null!, []);
  }, [tools]);

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
                  return "0";
                })()}
              onChange= {(x) => {
                router.push(`/compare/${encodeURIComponent(x.target.value)}`);
              }}
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
            return LoadedNoToolPanel();
          }
      })()}
    </main>
      /* Display the footer */
  );
};

const LoadedNoToolPanel = () => {
  return (
    <Container id="compare-page-panel">
      <div>Select a tool</div>
    </Container>
  )
}

const LoadingPagePanel = () => {
  return (
    <Container id="compare-page-panel">
      <div>Loading tools...</div>
    </Container>
  )
}