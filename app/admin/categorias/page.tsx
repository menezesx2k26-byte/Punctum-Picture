import { CategoriesManager } from "../components/CategoriesManager";

export const metadata = { title: "Categorias" };
export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  return <CategoriesManager />;
}
