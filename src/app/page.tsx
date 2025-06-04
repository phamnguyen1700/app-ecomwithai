import { redirect } from "next/navigation";
import "@/app/globals.css";
import { routesConfig } from "@/routes/config";

export default function Home() {
  redirect(routesConfig.home);
}
