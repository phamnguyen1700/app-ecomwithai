import dynamic, { DynamicOptions, Loader } from "next/dynamic";
import AppLoader from "../AppLoader";

export const ApploadClientComponent = (
  importComponent: Loader,
  options?: DynamicOptions
) => {
  return dynamic(importComponent, {
    loading: () => <AppLoader />,
    ...options,
  });
};