"use client";

/**
 * @author: @kokonutui
 * @description: A modern search bar component with action buttons and suggestions
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import {
  AudioLines,
  BarChart2,
  LayoutGrid,
  PlaneTakeoff,
  Search,
  Send,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// Adding a simple Input component since it was missing
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
import React from 'react';

// Added simple useDebounce hook implementation inline
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
}

interface SearchResult {
  actions: Action[];
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.4 },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  },
} as const;

const allActionsSample = [
  {
    id: "1",
    label: "Explore Courses",
    icon: <LayoutGrid className="h-4 w-4 text-orange-500" />,
    description: "Learn new skills",
    short: "⌘K",
    end: "Courses",
  },
  {
    id: "2",
    label: "View Dashboard",
    icon: <BarChart2 className="h-4 w-4 text-orange-500" />,
    description: "Analytics",
    short: "⌘D",
    end: "App",
  },
  {
    id: "3",
    label: "Join Lecture",
    icon: <Video className="h-4 w-4 text-orange-500" />,
    description: "Live",
    short: "",
    end: "Meeting",
  },
];

export default function ActionSearchBar({
  actions = allActionsSample,
  defaultOpen = false,
}: {
  actions?: Action[];
  defaultOpen?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isFocused, setIsFocused] = useState(defaultOpen);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 200);

  const filteredActions = useMemo(() => {
    if (!debouncedQuery) return actions;

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    return actions.filter((action) => {
      const searchableText =
        `${action.label} ${action.description || ""}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [debouncedQuery, actions]);

  useEffect(() => {
    if (!isFocused) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex(-1);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult({ actions: filteredActions });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(-1);
  }, [filteredActions, isFocused]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setIsTyping(true);
      setActiveIndex(-1);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!result?.actions.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < result.actions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : result.actions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && result.actions[activeIndex]) {
            setSelectedAction(result.actions[activeIndex]);
          }
          break;
        case "Escape":
          setIsFocused(false);
          setActiveIndex(-1);
          break;
      }
    },
    [result, activeIndex]
  );

  const handleActionClick = useCallback((action: Action) => {
    setSelectedAction(action);
  }, []);

  const handleFocus = useCallback(() => {
    setSelectedAction(null);
    setIsFocused(true);
    setActiveIndex(-1);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setActiveIndex(-1);
    }, 200);
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative flex min-h-[300px] flex-col items-center justify-start">
        <div className="sticky top-0 z-10 w-full max-w-sm bg-transparent pt-4 pb-1">
          <label
            className="mb-1 block font-medium text-zinc-500 text-xs dark:text-zinc-400"
            htmlFor="search"
          >
            Search Commands
          </label>
          <div className="relative">
            <Input
              aria-activedescendant={
                activeIndex >= 0
                  ? `action-${result?.actions[activeIndex]?.id}`
                  : undefined
              }
              aria-autocomplete="list"
              aria-expanded={isFocused && !!result}
              autoComplete="off"
              className="h-9 rounded-lg py-1.5 pr-9 pl-3 text-sm focus-visible:ring-offset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-zinc-200 dark:border-zinc-800"
              id="search"
              onBlur={handleBlur}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder="What are you looking for?"
              role="combobox"
              type="text"
              value={query}
            />
            <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    initial={{ y: -20, opacity: 0 }}
                    key="send"
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    initial={{ y: -20, opacity: 0 }}
                    key="search"
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <AnimatePresence>
            {isFocused && result && !selectedAction && (
              <motion.div
                animate="show"
                aria-label="Search results"
                className="mt-1 w-full overflow-hidden rounded-md border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                exit="exit"
                initial="hidden"
                role="listbox"
                variants={ANIMATION_VARIANTS.container}
              >
                <motion.ul role="none">
                  {result.actions.map((action) => (
                    <motion.li
                      aria-selected={
                        activeIndex === result.actions.indexOf(action)
                      }
                      className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
                        activeIndex === result.actions.indexOf(action)
                          ? "bg-zinc-100 dark:bg-zinc-900"
                          : ""
                      }`}
                      id={`action-${action.id}`}
                      key={action.id}
                      layout
                      onClick={() => handleActionClick(action)}
                      role="option"
                      variants={ANIMATION_VARIANTS.item}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span aria-hidden="true" className="text-zinc-500">
                            {action.icon}
                          </span>
                          <span className="font-medium text-zinc-900 text-sm dark:text-zinc-100">
                            {action.label}
                          </span>
                          {action.description && (
                            <span className="text-zinc-400 text-xs">
                              {action.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {action.short && (
                          <span
                            aria-label={`Keyboard shortcut: ${action.short}`}
                            className="text-zinc-400 text-xs"
                          >
                            {action.short}
                          </span>
                        )}
                        {action.end && (
                          <span className="text-right text-zinc-400 text-xs">
                            {action.end}
                          </span>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                <div className="mt-2 border-zinc-100 border-t px-3 py-2 dark:border-zinc-800/50">
                  <div className="flex items-center justify-between text-zinc-500 text-xs">
                    <span>Press ⌘K to open commands</span>
                    <span>ESC to cancel</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
