import React from "react";
import { Platform } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { shouldUseNativeDriver } from "../utils/animationUtils";

/**
 * A wrapper for LineChart that makes it compatible with web platform
 * by filtering out responder props that cause warnings on web
 */
export const WebCompatibleLineChart = (props) => {
    // Only apply special handling on web platform
    if (Platform.OS !== "web") {
        return <LineChart {...props} />;
    }

    // Add useNativeDriver: false for web platform
    const chartConfig = {
        ...props.chartConfig,
        useNativeDriver: shouldUseNativeDriver(),
    };

    // Filter out pointerEvents prop and responder props for web platform
    const {
        pointerEvents,
        onStartShouldSetResponder,
        onResponderGrant,
        onResponderMove,
        onResponderRelease,
        onResponderTerminate,
        onResponderTerminationRequest,
        ...otherProps
    } = props;

    // Use style.pointerEvents instead if needed
    const style = props.style ? { ...props.style } : {};
    if (pointerEvents) {
        style.pointerEvents = pointerEvents;
    }

    return (
        <LineChart {...otherProps} chartConfig={chartConfig} style={style} />
    );
};

/**
 * A wrapper for BarChart that makes it compatible with web platform
 * by filtering out responder props that cause warnings on web
 */
export const WebCompatibleBarChart = (props) => {
    // Only apply special handling on web platform
    if (Platform.OS !== "web") {
        return <BarChart {...props} />;
    }

    // Add useNativeDriver: false for web platform
    const chartConfig = {
        ...props.chartConfig,
        useNativeDriver: shouldUseNativeDriver(),
    };

    // Filter out pointerEvents prop and responder props for web platform
    const {
        pointerEvents,
        onStartShouldSetResponder,
        onResponderGrant,
        onResponderMove,
        onResponderRelease,
        onResponderTerminate,
        onResponderTerminationRequest,
        ...otherProps
    } = props;

    // Use style.pointerEvents instead if needed
    const style = props.style ? { ...props.style } : {};
    if (pointerEvents) {
        style.pointerEvents = pointerEvents;
    }

    return <BarChart {...otherProps} chartConfig={chartConfig} style={style} />;
};
