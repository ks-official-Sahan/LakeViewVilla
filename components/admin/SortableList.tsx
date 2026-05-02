"use client";

import { useState, useRef, type ReactNode } from "react";

interface SortableItemProps<T> {
  item: T;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  isDragging: boolean;
  dragHandleProps: {
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
    onTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  };
}

interface SortableListProps<T> {
  items: T[];
  keyExtractor: (item: T, index: number) => string;
  onReorder: (newItems: T[]) => void;
  renderItem: (props: SortableItemProps<T>) => ReactNode;
  className?: string;
}

/**
 * Lightweight sortable list without external dependencies.
 * Uses mouse/touch events + keyboard navigation for accessibility.
 */
export function SortableList<T>({
  items,
  keyExtractor,
  onReorder,
  renderItem,
  className = "",
}: SortableListProps<T>) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLElement | null>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    setDraggingIndex(index);
    dragNodeRef.current = e.currentTarget as HTMLElement;

    const handleMove = (clientY: number) => {
      const elements = document.querySelectorAll("[data-sortable-item]");
      for (let i = 0; i < elements.length; i++) {
        const rect = elements[i].getBoundingClientRect();
        if (clientY > rect.top && clientY < rect.bottom) {
          setOverIndex(i);
          break;
        }
      }
    };

    const handleMouseMove = (ev: MouseEvent) => {
      handleMove(ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      if (ev.touches.length > 0) {
        handleMove(ev.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      if (draggingIndex !== null && overIndex !== null && draggingIndex !== overIndex) {
        const newItems = [...items];
        const [moved] = newItems.splice(draggingIndex, 1);
        newItems.splice(overIndex, 0, moved);
        onReorder(newItems);
      }
      setDraggingIndex(null);
      setOverIndex(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };

    if ("button" in e) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
    } else {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleEnd);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      onReorder(newItems);
    } else if (e.key === "ArrowDown" && index < items.length - 1) {
      e.preventDefault();
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      onReorder(newItems);
    }
  };

  return (
    <div className={`space-y-2 ${className}`} role="list">
      {items.map((item, index) => {
        const key = keyExtractor(item, index);
        const isDragging = draggingIndex === index;
        const isOver = overIndex === index && draggingIndex !== index;

        return (
          <div
            key={key}
            data-sortable-item
            role="listitem"
            className={`transition-all duration-150 ${
              isDragging ? "opacity-50 scale-[0.98] shadow-lg" : ""
            } ${isOver ? "border-t-2 border-[var(--color-primary)]" : ""}`}
          >
            {renderItem({
              item,
              index,
              onMove: (from, to) => {
                const newItems = [...items];
                const [moved] = newItems.splice(from, 1);
                newItems.splice(to, 0, moved);
                onReorder(newItems);
              },
              isDragging,
              dragHandleProps: {
                onMouseDown: (e) => handleDragStart(e, index),
                onTouchStart: (e) => handleDragStart(e, index),
                onKeyDown: (e) => handleKeyDown(e, index),
              },
            })}
          </div>
        );
      })}
    </div>
  );
}
