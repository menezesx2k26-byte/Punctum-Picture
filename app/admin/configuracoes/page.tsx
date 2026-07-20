import { SettingsManager } from "../components/SettingsManager";

export const metadata = { title: "Configurações" };
export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return <SettingsManager />;
}
