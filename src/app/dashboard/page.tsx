import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const DashBoardPage = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user) redirect("/auth-callback?origin=dashboard");

  return <div>Hello from dash board page</div>;
};

export default DashBoardPage;
