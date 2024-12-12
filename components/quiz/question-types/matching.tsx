"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MatchingQuestion } from "@/types/quiz";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

interface MatchingProps {
  question: MatchingQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function MatchingQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: MatchingProps) {
  const [matches, setMatches] = useState<number[]>([]);
  const [rightItems, setRightItems] = useState(() =>
    [...question.pairs].map((_, i) => i).sort(() => Math.random() - 0.5)
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(rightItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setRightItems(newItems);
    setMatches(newItems);
  };

  const handleSubmit = () => {
    const isCorrect = matches.every((match, index) => match === index);
    onAnswer(isCorrect);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 gap-8">
          {/* Left column - fixed items */}
          <div className="space-y-4">
            {question.pairs.map((pair, index) => (
              <div
                key={`left-${index}`}
                className="p-4 bg-secondary rounded-lg"
              >
                {pair.left}
              </div>
            ))}
          </div>

          {/* Right column - draggable items */}
          <Droppable droppableId="right-column">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {rightItems.map((itemIndex, index) => (
                  <Draggable
                    key={`right-${itemIndex}`}
                    draggableId={`right-${itemIndex}`}
                    index={index}
                    isDragDisabled={disabled}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 bg-primary/10 rounded-lg cursor-move ${
                          showAnswer
                            ? itemIndex === index
                              ? "border-2 border-green-500"
                              : "border-2 border-red-500"
                            : ""
                        }`}
                      >
                        {question.pairs[itemIndex].right}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {!disabled && (
        <Button onClick={handleSubmit} className="w-full mt-6">
          Submit Matches
        </Button>
      )}
    </Card>
  );
}