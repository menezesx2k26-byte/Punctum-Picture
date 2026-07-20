# Fluxos do painel

Todo o painel vive em `/admin/*` e é protegido por Cloudflare Access. Não há
senha própria.

## Ensaio

```text
+------------------------------------------------------+
| sidebar | título do ensaio               [Publicar]  |
|         | status: Rascunho                           |
+------------------------------------------------------+
| Dropzone                                             |
| [soltar arquivos aqui]                               |
+------------------------------------------------------+
| checklist publicação                                 |
| [x] título  [x] capa  [x] fotos prontas              |
+------------------------------------------------------+
| grid ordenável                                       |
| [thumb][thumb][thumb]                                |
| [thumb][thumb][thumb]                                |
+------------------------------------------------------+
```

1. Entrar via Access e tocar em “Novo ensaio”.
2. Informar título; o servidor cria slug e rascunho.
3. Editar texto, data, local, SEO e categorias.
4. Soltar/selecionar JPG, PNG ou WebP de até 25 MB.
5. Acompanhar progresso total e por arquivo; “Tentar de novo” repete somente a
   falha.
6. Ordenar por toque/arraste ou botões subir/descer.
7. Escolher a capa e preencher alt text.
8. Publicar somente quando todos os checks estiverem verdes.
9. Arquivar retira do site sem apagar o registro.

## Checklist de publicação

- Título definido.
- Slug válido e reservado pelo registro.
- Capa selecionada e pertencente ao álbum.
- Pelo menos uma imagem pronta.
- URL pública derivável.

O servidor repete todas as verificações; o checklist visual não é uma barreira
de segurança.

## Categorias, configurações e contatos

- Categorias: criar, ocultar/exibir e excluir quando não houver vínculo.
- Configurações: textos, SEO, WhatsApp, Instagram e e-mail.
- Contatos: visualizar, marcar como lido e arquivar.

## Recuperação de erro

- Upload falhou: manter os demais e repetir o item.
- Ordem não persistiu: recarregar a ordem do servidor e exibir erro.
- Publicação bloqueada: manter rascunho e listar o check faltante.
- Sessão Access expirada: o próximo request é recusado e a camada Access pede
  autenticação novamente.
