"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

function ThemeProviderBase({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export const ThemeProvider = dynamic(() => Promise.resolve(ThemeProviderBase), {
  ssr: false,
});
