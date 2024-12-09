export const formatInput = input => input.split('').map((num, index) => (index % 2 ? { size: +num } : { id: index / 2, size: +num }));

export const part1 = disk => {
  let freeIndex;
  do {
    const block = disk.pop();
    if (block.id == null) {
      continue;
    }
    freeIndex = disk.findIndex(({ id }) => id == null);
    if (freeIndex !== -1) {
      const free = disk.at(freeIndex);
      if (block.size <= free.size) {
        const sameSize = block.size === free.size;
        disk.splice(freeIndex, sameSize ? 1 : 0, block);
        free.size -= block.size;
      } else {
        disk.splice(freeIndex, 1, { id: block.id, size: free.size });
        disk.push({ id: block.id, size: block.size - free.size });
      }
    } else {
      disk.push(block);
    }
  } while (freeIndex !== -1);
  return disk.flatMap(({ size, id }) => new Array(size).fill(id ?? 0)).sum((num, i) => num * i);
};

export const part2 = disk => {
  let blockIndex;
  do {
    blockIndex = disk.findLastIndex(({ id, skip }) => id != null && !skip);
    if (blockIndex >= 0) {
      const block = disk.at(blockIndex);
      const freeIndex = disk.findIndex(({ id, size }, i) => id == null && size >= block.size && i < blockIndex);
      if (freeIndex >= 0) {
        disk.splice(blockIndex, 1, { size: block.size });
        const free = disk.at(freeIndex);
        const sameSize = block.size === free.size;
        disk.splice(freeIndex, sameSize ? 1 : 0, block);
        free.size -= block.size;
      } else {
        block.skip = true;
        // No more space even for the smallest block – finish early
        if (block.size === 1) {
          blockIndex = -1;
        }
      }
    }
  } while (blockIndex !== -1);
  return disk.flatMap(({ size, id }) => new Array(size).fill(id ?? 0)).sum((num, i) => num * i);
};
