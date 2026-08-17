"use client";

import { Search, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";

export interface Action {
 id: string;
 label: string;
 icon: React.ReactNode;
 description?: string;
 short?: string;
 end?: string;
 route?: string;
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

export function ActionSearchBar({
 actions = [],
 defaultOpen = false,
}: {
 actions?: Action[];
 defaultOpen?: boolean;
}) {
 const router = useRouter();
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
 setResult(null);
 setActiveIndex(-1);
 return;
 }

 setResult({ actions: filteredActions });
 setActiveIndex(-1);
 }, [filteredActions, isFocused]);

 const executeAction = useCallback((action: Action) => {
 setSelectedAction(action);
 setQuery("");
 setIsFocused(false);
 if (action.route) {
 router.push(action.route);
 }
 }, [router]);

 const handleInputChange = useCallback(
 (e: React.ChangeEvent<HTMLInputElement>) => {
 setQuery(e.target.value);
 setIsTyping(true);
 setActiveIndex(-1);
 if (!isFocused) setIsFocused(true);
 },
 [isFocused]
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
 executeAction(result.actions[activeIndex]);
 }
 break;
 case "Escape":
 setIsFocused(false);
 setActiveIndex(-1);
 break;
 }
 },
 [result?.actions, activeIndex, executeAction]
 );

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
 <div className="w-full relative">
 <div className="relative w-full">
 <input
 aria-activedescendant={
 activeIndex >= 0
 ? `action-${result?.actions[activeIndex]?.id}`
 : undefined
 }
 aria-autocomplete="list"
 aria-expanded={isFocused && !!result}
 autoComplete="off"
 className="w-full pl-9 pr-9 py-2 text-sm rounded-xl transition-all"
 id="search"
 onBlur={handleBlur}
 onChange={handleInputChange}
 onFocus={handleFocus}
 onKeyDown={handleKeyDown}
 placeholder="Search commands, courses..."
 role="combobox"
 type="text"
 value={query}
 style={{
 background: 'var(--surface)',
 border: '1px solid var(--border)',
 color: 'var(--foreground)',
 outline: 'none',
 }}
 onFocusCapture={(e) => e.target.style.borderColor = 'var(--primary)'}
 onBlurCapture={(e) => e.target.style.borderColor = 'var(--border)'}
 />
 
 <div className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 pointer-events-none">
 <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
 </div>

 <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 pointer-events-none">
 <AnimatePresence mode="popLayout">
 {query.length > 0 && (
 <motion.div
 animate={{ y: 0, opacity: 1, scale: 1 }}
 exit={{ y: 10, opacity: 0, scale: 0.8 }}
 initial={{ y: -10, opacity: 0, scale: 0.8 }}
 key="send"
 transition={{ duration: 0.2 }}
 >
 <Send className="h-4 w-4 text-orange-500" />
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>

 <AnimatePresence>
 {isFocused && result && result.actions.length > 0 && (
 <motion.div
 animate="show"
 aria-label="Search results"
 className="absolute top-full left-0 mt-2 w-full max-h-[400px] overflow-y-auto rounded-xl border bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 z-50 p-2"
 exit="exit"
 initial="hidden"
 role="listbox"
 variants={ANIMATION_VARIANTS.container}
 >
 <motion.ul role="none" className="space-y-1">
 {result.actions.map((action, idx) => (
 <motion.li
 aria-selected={activeIndex === idx}
 className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
 activeIndex === idx
 ? "bg-zinc-100 dark:bg-zinc-900"
 : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
 }`}
 id={`action-${action.id}`}
 key={action.id}
 layout
 onClick={() => executeAction(action)}
 role="option"
 variants={ANIMATION_VARIANTS.item}
 >
 <div className="flex items-center gap-3">
 <span aria-hidden="true" className="flex-shrink-0">
 {action.icon}
 </span>
 <div className="flex flex-col">
 <span className="font-semibold text-zinc-900 text-sm dark:text-zinc-100">
 {action.label}
 </span>
 {action.description && (
 <span className="text-zinc-500 text-xs">
 {action.description}
 </span>
 )}
 </div>
 </div>
 <div className="flex items-center gap-2">
 {action.short && (
 <span
 aria-label={`Keyboard shortcut: ${action.short}`}
 className="text-zinc-400 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded"
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
 <div className="mt-2 border-zinc-100 border-t pt-2 px-2 dark:border-zinc-800">
 <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
 <span>Navigate using arrows</span>
 <span>ESC to cancel</span>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
