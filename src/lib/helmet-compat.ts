// Interop for react-helmet-async (CJS) under Vite SSR:
// named exports aren't statically analyzable, so re-export via the default.
import * as helmetNs from "react-helmet-async";
import type { Helmet as HelmetType, HelmetProvider as HelmetProviderType } from "react-helmet-async";

const pkg = ((helmetNs as unknown as { default?: unknown }).default ?? helmetNs) as {
  Helmet: typeof HelmetType;
  HelmetProvider: typeof HelmetProviderType;
};

export const Helmet = pkg.Helmet;
export const HelmetProvider = pkg.HelmetProvider;
