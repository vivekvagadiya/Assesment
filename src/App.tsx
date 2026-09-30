import React from 'react';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { Compass, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: 'var(--space-3) 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Compass size={24} color="var(--color-accent)" />
            <h1 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
              Developer Intelligence Dashboard
            </h1>
          </div>
          <Badge variant="primary" size="sm">
            <Sparkles size={12} style={{ marginRight: 4 }} />
            Sprint 1: Ready
          </Badge>
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: 'var(--space-8) var(--space-4)' }}>
        <Card padding="lg">
          <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-2)' }}>
            Design System Foundation
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Design tokens, responsive grid, strict TypeScript, and accessible UI primitives have been established.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button variant="primary">Explore Repositories</Button>
            <Button variant="outline">Search Developers</Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default App;
