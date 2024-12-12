"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderingQuestion } from "@/types/quiz";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

interface OrderingProps {
  question: OrderingQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
  showAnswer?: boolean;
}

export function OrderingQuestion({
  question,
  onAnswer,
  disabled = false,
  showAnswer = false,
}: OrderingProps) {
  const [items, setItems] = useState(() =>
    question.items.map((item, index) => ({ id: index.toString(), content: item }))
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination || disabled) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  const handleSubmit = () => {
    const currentOrder = items.map((item) => parseInt(item.id));
    const isCorrect = currentOrder.every(
      (item, index) => item === question.correctOrder[index]
    );
    onAnswer(isCorrect);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ordering-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={disabled}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-3 p-4 bg-secondary/50 rounded-lg ${
                        showAnswer
                          ? parseInt(item.id) === question.correctOrder[index]
                            ? "border-2 border-green-500"
                            : "border-2 border-red-500"
                          : ""
                      }`}
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                      </div>
                      {item.content}
                      {showAnswer && (
                        <span className="ml-auto text-sm text-muted-foreground">
                          Correct position: {question.correctOrder.indexOf(parseInt(item.id)) + 1}
                        </span>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {!disabled && (
        <Button onClick={handleSubmit} className="w-full mt-6">
          Submit Order
        </Button>
      )}
    </Card>
  );
}