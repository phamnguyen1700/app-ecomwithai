import AppAsyncComponent from "@/components/core/AppAsyncComponent";

export const ProductPage = AppAsyncComponent(() =>
  import("./index")
);
