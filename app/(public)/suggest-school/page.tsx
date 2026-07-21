import { redirect } from "next/navigation";

export default function SuggestSchoolPage() {
  redirect("/submit-fees?tab=school");
}
