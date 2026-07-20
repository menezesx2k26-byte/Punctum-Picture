"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isVisible: boolean;
};

type CategoriesResponse = {
  categories?: Category[];
  error?: { message?: string };
};

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/admin/api/categories");
    const body = (await response.json()) as CategoriesResponse;
    if (!response.ok) throw new Error(body.error?.message ?? "Falha ao carregar.");
    setCategories(body.categories ?? []);
  }, []);

  useEffect(() => {
    void Promise.resolve()
      .then(load)
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : "Falha ao carregar."),
      );
  }, [load]);

  async function create(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/admin/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = (await response.json()) as CategoriesResponse;
    if (!response.ok) {
      setError(body.error?.message ?? "Não foi possível criar.");
      return;
    }
    setName("");
    await load();
  }

  async function toggle(category: Category) {
    await fetch(`/admin/api/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !category.isVisible }),
    });
    await load();
  }

  async function remove(category: Category) {
    if (!window.confirm(`Excluir a categoria “${category.name}”?`)) return;
    await fetch(`/admin/api/categories/${category.id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <p className="eyebrow">Organização</p>
          <h1>Categorias</h1>
        </div>
      </div>
      <section className="admin-card full">
        <h2>Nova categoria</h2>
        <form className="admin-form-row" onSubmit={create}>
          <input
            className="admin-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Famílias"
            minLength={2}
            maxLength={100}
            required
          />
          <button className="button" type="submit">
            <Plus size={16} /> Criar categoria
          </button>
        </form>
        {error && <p role="alert">{error}</p>}
      </section>
      <section className="admin-list" style={{ marginTop: "1rem" }}>
        {categories.map((category) => (
          <div className="admin-list-item" key={category.id}>
            <div>
              <strong>{category.name}</strong>
              <div className="admin-muted">/{category.slug}</div>
            </div>
            <div className="button-row">
              <button
                className={`button small${category.isVisible ? "" : " ghost"}`}
                type="button"
                onClick={() => toggle(category)}
              >
                {category.isVisible ? "Visível" : "Oculta"}
              </button>
              <button
                className="icon-button"
                type="button"
                aria-label={`Excluir ${category.name}`}
                onClick={() => remove(category)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
