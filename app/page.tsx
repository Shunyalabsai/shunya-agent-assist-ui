import Link from "next/link";
import { Shield, Phone, LayoutDashboard, LogIn, Hourglass } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

const routeCards = [
  {
    title: "Admin Portal",
    description: "Manage organization settings, knowledge base, and system configuration",
    href: ROUTES.ADMIN.ONBOARDING,
    icon: Shield,
    isDisabled: false,
  },
  /*{
    title: "Authentication",
    description: "Sign in or create an account to access the platform",
    href: ROUTES.LOGIN,
    icon: LogIn,
    isDisabled: false,
  },*/
  {
    title: "Agent Interface",
    description: "Access live call support tools and agent assistance features",
    href: ROUTES.AGENT.LIVE_CALL,
    icon: Phone,
    isDisabled: false,
  },
  {
    title: "Manager Dashboard",
    description: "View analytics, monitor performance, and manage sessions",
    href: ROUTES.MANAGER.OVERVIEW,
    icon: LayoutDashboard,
    isDisabled: true,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
            Shunya Agent Assist
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Choose your portal to get started
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {routeCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.isDisabled ? "#" : card.href} className="block">
                <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 flex items-center gap-2 justify-between">
                        <CardTitle className="text-xl">{card.title}</CardTitle>

                        {
                          card.isDisabled && (
                            <div className="inline-flex items-center rounded-lg bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-500 inset-ring inset-ring-yellow-400/20">
                              <Hourglass className="mr-1 h-3.5 w-3.5" />
                              <span>In Progress</span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
