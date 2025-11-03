import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Imoveis from "./pages/Imoveis";
import Proprietarios from "./pages/Proprietarios";
import Inquilinos from "./pages/Inquilinos";
import Leads from "./pages/Leads";
import Corretores from "./pages/Corretores";
import Atividades from "./pages/Atividades";
import Comissoes from "./pages/Comissoes";

function Router() {
  return (
    <Switch>
      <Route path="/404" component={NotFound} />
      <Route>
        {() => (
          <DashboardLayout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/imoveis" component={Imoveis} />
              <Route path="/proprietarios" component={Proprietarios} />
              <Route path="/inquilinos" component={Inquilinos} />
              <Route path="/leads" component={Leads} />
              <Route path="/corretores" component={Corretores} />
              <Route path="/atividades" component={Atividades} />
              <Route path="/comissoes" component={Comissoes} />
              <Route component={NotFound} />
            </Switch>
          </DashboardLayout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
