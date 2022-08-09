const arrayChunk = <T>(array: T[], size: number): T[][] => {
  let chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, Math.min(array.length, i + size)));
  }

  return chunks;
};

export default arrayChunk;
