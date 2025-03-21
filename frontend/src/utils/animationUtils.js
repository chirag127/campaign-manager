import { Platform } from "react-native";

/**
 * Helper function to determine if useNativeDriver should be used
 * This helps avoid warnings on web platform where native driver isn't available
 *
 * @returns {boolean} Whether to use native driver for animations
 */
export const shouldUseNativeDriver = () => {
    // Only use native driver on iOS and Android, not on web
    return Platform.OS !== "web";
};

/**
 * Get animation config with appropriate useNativeDriver setting
 *
 * @param {Object} config - Animation configuration
 * @returns {Object} Animation configuration with proper useNativeDriver setting
 */
export const getAnimationConfig = (config = {}) => {
    return {
        ...config,
        useNativeDriver: shouldUseNativeDriver(),
    };
};

/**
 * Default animation configurations for common animations
 */
export const AnimationPresets = {
    fade: {
        opacity: {
            from: 0,
            to: 1,
            duration: 300,
            useNativeDriver: shouldUseNativeDriver(),
        },
    },
    slide: {
        translateX: {
            from: 100,
            to: 0,
            duration: 300,
            useNativeDriver: shouldUseNativeDriver(),
        },
    },
    scale: {
        scale: {
            from: 0.8,
            to: 1,
            duration: 300,
            useNativeDriver: shouldUseNativeDriver(),
        },
    },
};

/**
 * Get cross-platform shadow styles
 * This helps avoid warnings about deprecated shadow* props on web
 *
 * @param {Object} shadowProps - Shadow configuration
 * @returns {Object} Platform-specific shadow styles
 */
export const getShadowStyles = (shadowProps = {}) => {
    const {
        shadowColor = "#000",
        shadowOffset = { width: 0, height: 2 },
        shadowOpacity = 0.25,
        shadowRadius = 3.84,
        elevation = 5,
    } = shadowProps;

    if (Platform.OS === "web") {
        // For web, use boxShadow
        const offsetX = shadowOffset.width;
        const offsetY = shadowOffset.height;
        const blurRadius = shadowRadius;
        const color = shadowColor
            .replace("rgb", "rgba")
            .replace(")", `, ${shadowOpacity})`);

        return {
            boxShadow: `${offsetX}px ${offsetY}px ${blurRadius}px ${color}`,
        };
    } else {
        // For native platforms, use the regular shadow props
        return {
            shadowColor,
            shadowOffset,
            shadowOpacity,
            shadowRadius,
            elevation,
        };
    }
};
