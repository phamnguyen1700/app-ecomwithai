import { createMetadata } from "@/components/core/AppPageMeta";
import { AppTypes } from "@/enum/home";
import { ProfilePage } from "@/modules/profile/ProfilePage";
import { Metadata } from "next";
export const metadata: Metadata = createMetadata({
    title: AppTypes.PROFILE,
    description: AppTypes.DESCRIPTION,
});
export default function Home() {
  return (
    <>
      <ProfilePage />
    </>
  )
}
