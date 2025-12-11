'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Link from 'next/link';

interface Tool {
  name: string;
  rating: number;
  totalRatings: number;
  description: string;
  tags: string[];
}

export default function CompareToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolName = decodeURIComponent(params.name as string);
  
  const [mainTool, setMainTool] = useState<Tool | null>(null);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [similarTools, setSimilarTools] = useState<Tool[]>([]);
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
              return { ...t, matchingTags };
            })
            .filter((t: any) => t.matchingTags > 0)
            .sort((a: any, b: any) => b.matchingTags - a.matchingTags)
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
        <div style={{ height: 112 }} />
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
        <div style={{ height: 112 }} />
        <Container className="py-5">
          <h2>Tool not found</h2>
          <Link href="/compare">Back to Compare</Link>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-body-tertiary text-black">
      <div style={{ height: 112 }} />
      
      <Container>
        <Row className="mb-4">
          <Col>
            <Link href="/compare" className="btn btn-outline-secondary mb-3">
              ← Back to Compare
            </Link>
            <h1><b>Comparing: {mainTool.name}</b></h1>
            <p className="text-muted">Tools with similar characteristics</p>
          </Col>
        </Row>

        {/* Main Tool Card */}
        <Row className="mb-4">
          <Col>
            <Card className="border-primary" style={{ borderWidth: '3px' }}>
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <h3>{mainTool.name}</h3>
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
                    <Badge key={idx} bg="primary">{tag}</Badge>
                  ))}
                </div>
                <div className="mt-3">
                  <Link href={`/tool/${encodeURIComponent(mainTool.name)}`} className="btn btn-primary me-2">
                    View Reviews
                  </Link>
                  <Link href={`/rate?tool=${encodeURIComponent(mainTool.name)}`} className="btn btn-outline-primary">
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
                {similarTools.map((tool: any, idx) => (
                  <Col key={idx} xs={12} md={6} lg={4} className="mb-3">
                    <Card className="h-100">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="d-flex justify-content-between align-items-start">
                          <span>{tool.name}</span>
                          <div className="text-end">
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                              {tool.rating.toFixed(1)}
                            </div>
                            <div className="text-muted small">
                              {tool.totalRatings} reviews
                            </div>
                          </div>
                        </Card.Title>
                        
                        <Card.Text className="flex-grow-1 small text-muted">
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
                            className="btn btn-sm btn-outline-primary flex-grow-1"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => router.push(`/compare/${encodeURIComponent(tool.name)}`)}
                            className="btn btn-sm btn-primary flex-grow-1"
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
          <Col>
            <Card>
              <Card.Body>
                <h5>Compare with a different tool:</h5>
                <select
                  className="form-select mt-2"
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
                  ))}
                </select>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
