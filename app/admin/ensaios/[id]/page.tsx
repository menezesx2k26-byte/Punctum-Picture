import { AlbumEditor } from "../../components/AlbumEditor";

export const metadata = { title: "Editar ensaio" };
export const dynamic = "force-dynamic";

export default async function AlbumEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AlbumEditor albumId={id} />;
}
