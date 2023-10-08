import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const DashBoardPage = () => {
  const { getUser } = getKindeServerSession();

  const user = getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const dbUser = db.user.findFirst({ where: { id: user.id } });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <Dashboard />;
};

export default DashBoardPage;
