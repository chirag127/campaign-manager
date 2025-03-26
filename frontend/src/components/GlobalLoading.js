import React from "react";
import { useLoading } from "../context/LoadingContext";
import LoadingOverlay from "./LoadingOverlay";

/**
 * Global loading component that displays a loading overlay
 * when the global loading state is active
 */
const GlobalLoading = () => {
    const { isLoading, loadingMessage } = useLoading();

    return <LoadingOverlay visible={isLoading} message={loadingMessage} />;
};

export default GlobalLoading;
