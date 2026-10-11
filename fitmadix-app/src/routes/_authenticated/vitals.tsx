import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { VitalsView } from "@/components/vitals/VitalsView";
import { AuthenticatedContext } from "./route";

export const Route = createFileRoute("/_authenticated/vitals")({
  component: VitalsComponent,
});

function VitalsComponent() {
  const context = useContext(AuthenticatedContext);
  if (!context) return null;

  const { vitals } = context;

  return <VitalsView vitals={vitals} />;
}
