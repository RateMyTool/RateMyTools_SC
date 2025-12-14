'use client';

import MiddleMenu from '@/components/MiddleMenu';
import FooterMenu from '@/components/FooterMenu';
import { useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState('TOOLS');
  
  return (
    <main style={{ marginTop: 0, paddingTop: 0 }}>
      <MiddleMenu title={title} setTitle={setTitle} />
      <FooterMenu />
    </main>
  );
}
