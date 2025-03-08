"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

export default function SuggestionInput({
    placeholder = "Search...",
    fetchSuggestions,
    onSelect,
    allowCustomInput = false,
    containerProps = {},
    InputProps = {},
    DropdownProps = {},
    ItemProps = {},
    debounceTimeout = 300,
    children,
}) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [dropdownAbove, setDropdownAbove] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        const delay = setTimeout(() => {
            fetchSuggestions(query).then(setSuggestions).catch(console.error);
        }, debounceTimeout);

        return () => clearTimeout(delay);
    }, [query, fetchSuggestions]);

    useEffect(() => {
        if (inputRef.current && dropdownRef.current) {
            const inputBox = inputRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const dropdownHeight = dropdownRef.current.offsetHeight || 200;

            const spaceBelow = windowHeight - inputBox.bottom;
            const spaceAbove = inputBox.top;

            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropdownAbove(true);
            } else {
                setDropdownAbove(false);
            }
        }
    }, [suggestions]);

    useEffect(() => {
        if (dropdownRef.current && highlightedIndex !== -1) {
            const highlightedItem = dropdownRef.current.children[highlightedIndex];
            if (highlightedItem) {
                highlightedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }
    }, [highlightedIndex]);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex !== -1) {
                onSelect(suggestions[highlightedIndex]);
            } else if (allowCustomInput) {
                onSelect(query.trim());
            }
            closeSuggestions();
        } else if (e.key === "Escape") {
            closeSuggestions(false);
        }

        if (InputProps.onKeyDown) {
            InputProps.onKeyDown(e);
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);

        if (InputProps.onChange) {
            InputProps.onChange(e);
        }
    };

    const closeSuggestions = (clear_query = true) => {
        if (clear_query) {
            setQuery("");
        }
        setSuggestions([]);
        setHighlightedIndex(-1);
    };

    return (
        <div {...containerProps} className={clsx("relative w-full", containerProps.className)}>
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                {...InputProps}
                className={clsx("input-box p-4", InputProps.className)}
            />

            {suggestions.length > 0 && (
                <ul
                    ref={dropdownRef}
                    {...DropdownProps}
                    className={clsx(
                        "absolute bg-white border w-full mt-1 rounded-md shadow-md max-h-40 overflow-y-auto p-2",
                        dropdownAbove ? "mb-1 bottom-full" : "mt-1",
                        DropdownProps.className
                    )}
                >
                    {suggestions.map((item, index) => (
                        <li
                            key={index}
                            {...ItemProps}
                            className={clsx(
                                "p-2 cursor-pointer hover:bg-gray-200 rounded-md",
                                index === highlightedIndex && "bg-gray-300",
                                ItemProps.className
                            )}
                            // onMouseEnter={() => setHighlightedIndex(index)}
                            onMouseDown={() => {
                                closeSuggestions();
                                onSelect(item);
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
            {children}
        </div>
    );
}
