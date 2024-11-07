import { Theme } from "@prisma/client";
import React from "react";
import { colorToRGBString } from "./ColorToRGBString";
import { lighten } from "./lighten";
import { darken } from "./darken";

export function generateSCSSVariables(theme: Theme) : React.CSSProperties {
    return {
    '--primaryLight': colorToRGBString(theme.primaryLightR, theme.primaryLightG, theme.primaryLightB),
    '--primaryLightLighten': colorToRGBString(...lighten(theme.primaryLightR, theme.primaryLightG, theme.primaryLightB)),
    '--primaryLightDarken': colorToRGBString(...darken(theme.primaryLightR, theme.primaryLightG, theme.primaryLightB)),
    '--primaryDark': colorToRGBString(theme.primaryDarkR, theme.primaryDarkG, theme.primaryDarkB),
    '--primaryDarkLighten': colorToRGBString(...lighten(theme.primaryDarkR, theme.primaryDarkG, theme.primaryDarkB)),
    '--primaryDarkDarken': colorToRGBString(...darken(theme.primaryDarkR, theme.primaryDarkG, theme.primaryDarkB)),

    '--secondaryLight': colorToRGBString(theme.secondaryLightR, theme.secondaryLightG, theme.secondaryLightB),
    '--secondaryLightLighten': colorToRGBString(...lighten(theme.secondaryLightR, theme.secondaryLightG, theme.secondaryLightB)),
    '--secondaryLightDarken': colorToRGBString(...darken(theme.secondaryLightR, theme.secondaryLightG, theme.secondaryLightB)),
    '--secondaryDark': colorToRGBString(theme.secondaryDarkR, theme.secondaryDarkG, theme.secondaryDarkB),
    '--secondaryDarkLighten': colorToRGBString(...lighten(theme.secondaryDarkR, theme.secondaryDarkG, theme.secondaryDarkB)),
    '--secondaryDarkDarken': colorToRGBString(...darken(theme.secondaryDarkR, theme.secondaryDarkG, theme.secondaryDarkB)),
    } as React.CSSProperties }