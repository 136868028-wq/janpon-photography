import { redirect } from "next/navigation";

export const metadata = { title: "แพ็กเกจและราคา" };

export default function ServicesPage() {
  redirect("/packages");
}

