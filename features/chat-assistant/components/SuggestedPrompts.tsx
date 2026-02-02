'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category?: string;
  description?: string;
}

export interface SuggestedPromptsProps {
  prompts?: PromptTemplate[];
  onPromptSelect?: (prompt: string) => void;
  className?: string;
}

const defaultPrompts: PromptTemplate[] = [
  {
    id: '1',
    title: 'Explain Product Feature',
    prompt: 'Can you explain the key features of this product?',
    category: 'Product',
  },
  {
    id: '2',
    title: 'Handle Complaint',
    prompt: 'How should I handle this customer complaint professionally?',
    category: 'Support',
  },
  {
    id: '3',
    title: 'Upsell Opportunity',
    prompt: 'What are good upsell opportunities for this customer?',
    category: 'Sales',
  },
  {
    id: '4',
    title: 'Technical Support',
    prompt: 'Help me troubleshoot this technical issue step by step.',
    category: 'Technical',
  },
];

export function SuggestedPrompts({
  prompts = defaultPrompts,
  onPromptSelect,
  className,
}: SuggestedPromptsProps) {
  const groupedPrompts = React.useMemo(() => {
    const groups: Record<string, PromptTemplate[]> = {};
    prompts.forEach((prompt) => {
      const category = prompt.category || 'General';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(prompt);
    });
    return groups;
  }, [prompts]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Suggested Prompts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedPrompts).map(([category, categoryPrompts]) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            </div>
            <div className="space-y-1">
              {categoryPrompts.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => onPromptSelect?.(prompt.prompt)}
                >
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{prompt.title}</p>
                    {prompt.description && (
                      <p className="text-xs text-muted-foreground">
                        {prompt.description}
                      </p>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
