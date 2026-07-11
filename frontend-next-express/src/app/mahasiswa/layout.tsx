import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("crud-faizan-token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <>{children}</>;
}
