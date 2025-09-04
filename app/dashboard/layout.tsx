import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Props = {
    children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
    
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        redirect("/login");   
    }
    

    return (
        <section>
            {children}
        </section>
    );
}