export type PublishChecklist = {
  hasTitle: boolean;
  hasSlug: boolean;
  hasCover: boolean;
  hasReadyImages: boolean;
};

export function evaluatePublishChecklist(input: {
  title: string;
  slug: string;
  coverBelongsToAlbum: boolean;
  readyImageCount: number;
}): PublishChecklist {
  return {
    hasTitle: input.title.trim().length > 0,
    hasSlug: input.slug.trim().length > 0,
    hasCover: input.coverBelongsToAlbum,
    hasReadyImages: input.readyImageCount > 0,
  };
}

export function canPublish(checks: PublishChecklist): boolean {
  return Object.values(checks).every(Boolean);
}
