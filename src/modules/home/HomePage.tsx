import AppAsyncComponent from "@/components/core/AppAsyncComponent";

export const HomePageContent = AppAsyncComponent(() =>
  import("./index")
);
