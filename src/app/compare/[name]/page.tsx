'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Link from 'next/link';
//import StarsUI from '@/components/StarsUI';

const borderPage = 'rounded-2 px-1 py-1 my-1 mb-2 mt-2';
const selectorBorder = `${borderPage} border border-black bg-black text-white`;

interface Tool {
  name: string;
  rating: number;
  totalRatings: number;
  description: string;
  tags: string[];
}
interface ToolForUI {
  name: string;
  rating: number;
  totalRatings: number;
  description: string;
  tags: string[];
  matchingTags: number;
}

export default function CompareToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolName = decodeURIComponent(params.name as string);
  
  const [mainTool, setMainTool] = useState<Tool | null>(null);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [similarTools, setSimilarTools] = useState<ToolForUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all tools
        const response = await fetch('/api/tools');
        const data = await response.json();
        const tools = data.tools || [];
        setAllTools(tools);

        // Find the main tool
        const main = tools.find((t: Tool) => t.name === toolName);
        if (main) {
          setMainTool(main);

          // Find similar tools based on matching tags
          const similar = tools
            .filter((t: Tool) => t.name !== toolName)
            .map((t: Tool) => {
              const matchingTags = t.tags.filter(tag => main.tags.includes(tag)).length;
              return { ...t, matchingTags };// ToolForUI
            })
            .filter((t: ToolForUI) => t.matchingTags > 0)
            .sort((a: ToolForUI, b: ToolForUI) => b.matchingTags - a.matchingTags)
            .slice(0, 5);

          setSimilarTools(similar);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toolName]);

  if (isLoading) {
    return (
      <main className="bg-body-tertiary text-black">
        <div style={{ height: 80 }} />
        <Container id="compare-page-main">  
          <Row className="mb-4 mt-2">
            <Col>
              <div className="d-flex flex-row">
                <h1>
                  <b className="me-2">
                    Comparing:
                  </b>
                  <b className="text-primary">
                    Loading...
                  </b>
                </h1>
              </div>
              <p className="text-muted">Tools with similar characteristics</p>
            </Col>
          </Row>
          <Row>
            <Card className={selectorBorder}>
              <Card.Body>
                <Link href="/compare" className="mb-2 mb-md-0 text-white">
                  <b>← Back to Compare</b>
                </Link>
              </Card.Body>
            </Card>
          </Row>
        </Container>
        <Container className="py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading comparison...</p>
        </Container>
      </main>
    );
  }

  if (!mainTool) {
    return (
      <main className="bg-body-tertiary text-black">
      <div style={{ height: 80 }} />
        <Container className="compare-page-main">
          <h2>Tool not found</h2>
          <Row>
            <Card className={selectorBorder}>
              <Card.Body>
                <Link href="/compare" className="mb-2 mb-md-0 text-white">
                  <b>← Back to Compare</b>
                </Link>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-body-tertiary text-black">
      <div style={{ height: 80 }} />
      
      <Container id="compare-page-main">
        <Row className="mb-4 mt-2">
          <Col>
            <div className="d-flex flex-row">
              <h1>
                <b className="me-2">
                  Comparing:
                </b>
                <b className="text-primary">
                  {mainTool.name}
                </b>
              </h1>
            </div>
            <p className="text-muted">Tools with similar characteristics</p>
          </Col>
        </Row>
        <Row>
          <Card className={selectorBorder}>
            <Card.Body>
              <Link href="/compare" className="mb-2 mb-md-0 text-white">
                <b>← Back to Compare</b>
              </Link>
            </Card.Body>
          </Card>
        </Row>

        {/* Main Tool Card */}
        <Row className="mb-4">
          <Col>
            <Card className="border-primary" style={{ borderWidth: '3px' }}>
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-start">
                  <h3 className="text-primary"><b>{mainTool.name}</b></h3>
                  <div className="text-end">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                      {mainTool.rating.toFixed(1)}
                    </div>
                    <div className="text-muted small">
                      {mainTool.totalRatings} {mainTool.totalRatings === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                </Card.Title>
                <Card.Text className="mb-3">{mainTool.description}</Card.Text>
                <div className="d-flex flex-wrap gap-2">
                  {mainTool.tags.map((tag, idx) => (
                    <Badge 
                      key={idx} 
                      //bg="primary"
                      bg='success'
                    >
                      {tag}
                    </Badge>
                    
                  ))}
                </div>
                <div className="mt-3">
                  <Link 
                    className="btn btn-outline-dark me-2"
                    //className="btn btn-outline-primary me-2"
                    href={`/tool/${encodeURIComponent(mainTool.name)}`}
                  >
                    View Reviews
                  </Link>
                  <Link href={`/rate?tool=${encodeURIComponent(mainTool.name)}`} className="btn btn-primary">
                    Rate This Tool
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Comparison Section */}
        <Row className="mb-4">
          <Col>
            <h3 className="mb-3">Similar Tools</h3>
            {similarTools.length === 0 ? (
              <Card>
                <Card.Body>
                  <p className="text-muted mb-0">No similar tools found with matching tags.</p>
                </Card.Body>
              </Card>
            ) : (
              <Row>
                {similarTools.map((tool: ToolForUI, idx) => (
                  <Col key={idx} xs={12} md={6} lg={4} className="mb-3">
                    <Card className="h-100">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="d-flex justify-content-between align-items-start">
                          <span><b>{tool.name}</b></span>
                          <div className="text-end">
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                              {tool.rating.toFixed(1)}
                            </div>
                            <div className="text-muted small">
                              {tool.totalRatings} {tool.totalRatings === 1 ? 'review' : 'reviews'}
                            </div>
                          </div>
                        </Card.Title>
                        
                        <Card.Text className="flex-grow-1 small">
                          {tool.description}
                        </Card.Text>

                        <div className="mb-3">
                          <div className="d-flex flex-wrap gap-2">
                            {tool.tags.map((tag: string, tagIdx: number) => (
                              <Badge 
                                key={tagIdx} 
                                bg={mainTool.tags.includes(tag) ? 'success' : 'secondary'}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <small className="text-muted mt-2 d-block">
                            {tool.matchingTags} matching {tool.matchingTags === 1 ? 'tag' : 'tags'}
                          </small>
                        </div>

                        <div className="d-flex gap-2">
                          <Link 
                            href={`/tool/${encodeURIComponent(tool.name)}`} 
                            className="btn btn-sm btn-outline-dark flex-grow-1"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => router.push(`/compare/${encodeURIComponent(tool.name)}`)}
                            className="btn btn-sm btn-dark flex-grow-1"
                          >
                            Compare
                          </button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>

        {/* All Tools Dropdown */}
        <Row className="mb-5">
          <Card className={selectorBorder}>
            <Card.Body>
              <Row>
                <Col xs={12} md={3}>
                  <h5><b>Compare with a different tool:</b></h5>
                </Col>
                <Col xs={12} md={9}>
                  <select
                    className="form-select"
                    value={toolName}
                    onChange={(e) => {
                      if (e.target.value && e.target.value !== toolName) {
                        router.push(`/compare/${encodeURIComponent(e.target.value)}`);
                      }
                    }}
                  >
                    <option value="">-- Choose a tool --</option>
                    {allTools.map((tool, idx) => (
                      <option key={idx} value={tool.name}>
                        {tool.name} ({tool.rating.toFixed(1)}★ - {tool.totalRatings} reviews)
                      </option>
                      //{StarsUI(tool.rating, 64, false, null!)}
                    ))}
                  </select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </main>
  );
}
