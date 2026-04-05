import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function AdminRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="text-border h-8 w-8 animate-spin" />
        </div>
      </Route>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
