"use client";

import React, { useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RadarTooltip,
  BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, CartesianGrid
} from 'recharts';
import { UserProgress } from '@/lib/types';
import { getChapterById } from '@/lib/data/chapters';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { BrainCircuit, CalendarClock } from 'lucide-react';

interface Props {
  progress: UserProgress;
}

export function AnalyticsCharts({ progress }: Props) {
  const { items, isLoaded } = useSpacedRepetition();

  // --- Process Radar Chart Data (Top 6 attempted chapters) ---
  const radarData = useMemo(() => {
    const entries = Object.entries(progress.chapterProgress);
    if (entries.length === 0) return [];
    
    return entries
      .sort((a, b) => b[1].questions_attempted - a[1].questions_attempted)
      .slice(0, 6)
      .map(([key, mastery]) => {
        const chap = getChapterById(mastery.chapter);
        // Truncate name for radar chart labels
        let name = chap?.name || mastery.chapter;
        if (name.length > 15) name = name.substring(0, 15) + '...';
        
        return {
          subject: name,
          accuracy: mastery.accuracy_pct,
          fullMark: 100
        };
      });
  }, [progress]);

  // --- Process Workload Bar Chart Data ---
  const workloadData = useMemo(() => {
    if (!isLoaded) return [];

    const now = new Date();
    now.setHours(0, 0, 0, 0); // start of today

    const counts = {
      Today: 0,
      Tomorrow: 0,
      '2 Days': 0,
      '3 Days': 0,
      '4-7 Days': 0,
      'Later': 0
    };

    Object.values(items).forEach(item => {
      const reviewDate = new Date(item.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      
      const diffTime = reviewDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) counts.Today++;
      else if (diffDays === 1) counts.Tomorrow++;
      else if (diffDays === 2) counts['2 Days']++;
      else if (diffDays === 3) counts['3 Days']++;
      else if (diffDays >= 4 && diffDays <= 7) counts['4-7 Days']++;
      else counts.Later++;
    });

    return [
      { name: 'Today', items: counts.Today },
      { name: 'Tmrw', items: counts.Tomorrow },
      { name: '+2d', items: counts['2 Days'] },
      { name: '+3d', items: counts['3 Days'] },
      { name: '4-7d', items: counts['4-7 Days'] },
    ];
  }, [items, isLoaded]);

  if (!isLoaded) return null;

  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      {/* Subject Mastery Radar */}
      <div className="clean-card rounded-3xl p-6 sm:p-7 flex flex-col">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          Subject Strengths
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Accuracy profile across your top chapters
        </p>
        
        {radarData.length >= 3 ? (
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <RadarTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
                />
                <Radar 
                  name="Accuracy %" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[250px] text-center border-2 border-dashed border-border rounded-xl bg-muted/20">
            <p className="text-sm text-muted-foreground font-medium px-6">
              Attempt at least 3 chapters to unlock your mastery profile.
            </p>
          </div>
        )}
      </div>

      {/* Review Workload Bar Chart */}
      <div className="clean-card rounded-3xl p-6 sm:p-7 flex flex-col">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2">
          <CalendarClock className="w-5 h-5 text-amber-500" />
          Review Workload
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Upcoming questions scheduled by spaced repetition
        </p>
        
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                allowDecimals={false}
              />
              <BarTooltip 
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: 'hsl(var(--amber-500))', fontWeight: 600 }}
              />
              <Bar 
                dataKey="items" 
                name="Questions Due"
                fill="hsl(var(--amber-500))" 
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
