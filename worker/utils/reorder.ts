export function orderedPositions(imageIds: string[]): Array<{
  imageId: string;
  position: number;
}> {
  return imageIds.map((imageId, index) => ({
    imageId,
    position: (index + 1) * 1000,
  }));
}
