"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HotspotQuestion } from "@/types/quiz";
import { useState } from "react";
import Image from "next/image";

interface HotspotProps {
  question: HotspotQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function HotspotQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: HotspotProps) {
  const [selectedSpot, setSelectedSpot] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSelectedSpot({ x, y });
  };

  const handleSubmit = () => {
    if (!selectedSpot) return;

    const isCorrect = question.hotspots.some((hotspot) => {
      const distance = Math.sqrt(
        Math.pow(selectedSpot.x - hotspot.x, 2) +
          Math.pow(selectedSpot.y - hotspot.y, 2)
      );
      return distance <= hotspot.radius;
    });

    onAnswer(isCorrect);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      <div className="relative aspect-video">
        <Image
          src={question.image}
          alt="Hotspot question image"
          fill
          className="object-contain rounded-lg"
        />
        {selectedSpot && (
          <div
            className="absolute w-4 h-4 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${selectedSpot.x}%`, top: `${selectedSpot.y}%` }}
          />
        )}
        {showAnswer &&
          question.hotspots.map((hotspot, index) => (
            <div
              key={index}
              className="absolute w-4 h-4 bg-green-500 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            >
              <div className="absolute -inset-2 border-2 border-green-500 rounded-full animate-ping" />
              <div className="absolute top-5 left-5 bg-green-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                {hotspot.label}
              </div>
            </div>
          ))}
        <div
          className="absolute inset-0 cursor-crosshair"
          onClick={handleImageClick}
        />
      </div>
      {!disabled && selectedSpot && (
        <Button onClick={handleSubmit} className="w-full mt-6">
          Submit Answer
        </Button>
      )}
    </Card>
  );
}