# Páginas públicas

## Home

```text
+------------------------------------------------------+
| PUNCTUM PICTURE                                      |
| imagem hero cheia                                    |
| frase curta                                          |
| [Ver portfólio] [Pedir orçamento]                    |
+------------------------------------------------------+
| ensaios em destaque                                  |
| [card] [card] [card]                                 |
+------------------------------------------------------+
| sobre + instagram + contato + whatsapp               |
+------------------------------------------------------+
```

A primeira dobra usa composição editorial, título grande e CTA claro. O HTML
inicial contém headings e metadados críticos. Imagens fora da dobra usam lazy
load por meio do componente de imagem.

## Portfólio

Lista apenas ensaios publicados, com capa pronta e não deletada. O primeiro
HTML recebe os dados diretamente do D1 no servidor; o filtro de categoria
opera no cliente sobre esse estado canônico, sem catálogo estático alternativo.

## Ensaio

```text
+------------------------------------------------------+
| capa grande                                          |
| título / subtítulo / descrição curta                 |
+------------------------------------------------------+
| grid editorial de fotos                              |
| [img] [img] [img]                                    |
| [img] [img] [img]                                    |
+------------------------------------------------------+
```

Draft, archived, pending, failed e soft-deleted nunca aparecem. Cada foto usa
alt text administrável e dimensões estáveis para reduzir CLS.

## Contato

Formulário curto, honeypot invisível, limites por campo e rate limit por IP. O
CTA de WhatsApp só aparece quando o número está configurado. Não há CRM, agenda
ou pagamento.
