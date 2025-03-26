import React, { createContext, useState, useContext, useCallback } from "react";

// Create the loading context
export const LoadingContext = createContext();

/**
 * Provider component for managing global loading states
 * Allows showing/hiding loading indicators from anywhere in the app
 */
export const LoadingProvider = ({ children }) => {
    // State for global loading
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    // State for section-specific loading
    const [loadingSections, setLoadingSections] = useState({});

    // Show global loading
    const showLoading = useCallback((message = "Loading...") => {
        setLoadingMessage(message);
        setIsLoading(true);
    }, []);

    // Hide global loading
    const hideLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    // Set section loading state
    const setSectionLoading = useCallback((sectionId, isLoading, message = "") => {
        setLoadingSections(prev => ({
            ...prev,
            [sectionId]: { isLoading, message }
        }));
    }, []);

    // Check if a specific section is loading
    const isSectionLoading = useCallback((sectionId) => {
        return loadingSections[sectionId]?.isLoading || false;
    }, [loadingSections]);

    // Get section loading message
    const getSectionLoadingMessage = useCallback((sectionId) => {
        return loadingSections[sectionId]?.message || "Loading...";
    }, [loadingSections]);

    // Create a loading wrapper for async functions
    const withLoading = useCallback(async (asyncFn, message = "Loading...") => {
        showLoading(message);
        try {
            return await asyncFn();
        } finally {
            hideLoading();
        }
    }, [showLoading, hideLoading]);

    // Create a section loading wrapper for async functions
    const withSectionLoading = useCallback(async (sectionId, asyncFn, message = "Loading...") => {
        setSectionLoading(sectionId, true, message);
        try {
            return await asyncFn();
        } finally {
            setSectionLoading(sectionId, false);
        }
    }, [setSectionLoading]);

    // Expose the loading context globally for web platform
    if (typeof window !== "undefined") {
        window.__LOADING_CONTEXT__ = {
            showLoading,
            hideLoading,
            setSectionLoading,
            isSectionLoading,
        };
    }

    return (
        <LoadingContext.Provider
            value={{
                isLoading,
                loadingMessage,
                showLoading,
                hideLoading,
                setSectionLoading,
                isSectionLoading,
                getSectionLoadingMessage,
                withLoading,
                withSectionLoading,
                loadingSections,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

/**
 * Custom hook to use the loading context
 * @returns {Object} Loading context
 */
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};

/**
 * Standalone function to show global loading
 * Can be used outside of React components
 * @param {string} message - Loading message
 */
export const showGlobalLoading = (message = "Loading...") => {
    if (typeof window !== "undefined" && window.__LOADING_CONTEXT__) {
        window.__LOADING_CONTEXT__.showLoading(message);
    }
};

/**
 * Standalone function to hide global loading
 * Can be used outside of React components
 */
export const hideGlobalLoading = () => {
    if (typeof window !== "undefined" && window.__LOADING_CONTEXT__) {
        window.__LOADING_CONTEXT__.hideLoading();
    }
};

export default LoadingContext;
