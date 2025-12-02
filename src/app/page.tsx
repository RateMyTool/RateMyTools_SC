'use client';

import TopMenu from '@/components/TopMenu';
import MiddleMenu from '@/components/MiddleMenu';
import FooterMenu from '@/components/FooterMenu';
import { useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState('TOOLS');

  return (
    <main>
      <TopMenu title={title} />
      <MiddleMenu setTitle={setTitle} title={title} />
      <FooterMenu />
    </main>
  );
}
