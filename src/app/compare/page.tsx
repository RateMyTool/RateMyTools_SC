'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card } from 'react-bootstrap';
//import StarsUI from '@/components/StarsUI';

const mainPage = 'bg-body-tertiary text-black';
const borderPage = 'rounded-2 px-1 py-1 my-1 mb-2 mt-2';
const selectorBorder = `${borderPage} border border-black bg-black text-white`;

interface Tool {
  name: string;
  rating: number;
  totalRatings: number;
  description: string;
  tags: string[];
}

export default function ComparePage() {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string>('');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        const data = await response.json();
        setTools(data.tools || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleToolSelect = (toolName: string) => {
    if (toolName && toolName !== '0') {
      router.push(`/compare/${encodeURIComponent(toolName)}`);
    }
  };

  return (
    <main className={mainPage}>
      <div style={{ height: 80 }} />
      
      <Container id="compare-page-main">
        <Row className="align-left text-left mt-2 mb-4">
          <h1><b>Compare Tools</b></h1>
          <p className="text-muted">Select a tool to compare against others with similar tags</p>
        </Row>

        <Row>
          <Card className={selectorBorder}>
            <Card.Body>
              <Row>
                <Col xs={12} md={3}>
                  <h5><b>Select a tool to compare:</b></h5>
                </Col>
                <Col xs={12} md={9}>
                  {isLoading ? (
                    <div className="text-white">Loading tools...</div>
                  ) : tools.length === 0 ? (
                    <div className="text-white">No tools available. Add some reviews first!</div>
                  ) : (
                    <select
                      value={selectedTool}
                      onChange={(e) => {
                        setSelectedTool(e.target.value);
                        handleToolSelect(e.target.value);
                      }}
                      className="form-select text-black"
                      style={{ width: '100%' }}
                    >
                      <option value="0">-- Choose a tool --</option>
                      {tools.map((tool, index) => (
                        <option key={index} value={tool.name}>
                          {tool.name} ({tool.rating.toFixed(1)}★ - {tool.totalRatings} reviews)
                        </option>
                      ))}
                    </select>
                    //{StarsUI(tool.rating, 64, false, null!)}
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>

        <Container id="compare-page-panel" className="mt-4">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading tools...</p>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <p>Select a tool from the dropdown above to see comparisons</p>
            </div>
          )}
        </Container>
      </Container>
    </main>
  );
}
