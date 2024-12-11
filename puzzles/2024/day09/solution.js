export const formatInput = input => {
  const disk = input.split('').map((num, index) => ({ size: +num, free: index % 2 === 1, id: index / 2 }));
  return [disk, disk.filter(block => block.free)];
};

const getChecksum = disk => disk.flatMap(({ size, id, free }) => new Array(size).fill(free ? 0 : id)).sum((num, i) => num * i);

export const part1 = ([disk, freeBlocks]) => {
  while (freeBlocks.length) {
    const block = disk.pop();
    if (block.free) {
      // free blocks are in the same order as disk
      freeBlocks.pop();
      continue;
    }
    const free = freeBlocks[0];
    if (block.size >= free.size) {
      if (block.size !== free.size) {
        disk.push({ id: block.id, size: block.size - free.size });
      }
      free.free = false;
      free.id = block.id;
      freeBlocks.shift();
    } else {
      disk.splice(disk.indexOf(free), 0, block);
      free.size -= block.size;
    }
  }
  return getChecksum(disk);
};

export const part2 = ([disk, freeBlocks]) => {
  let index = disk.length - 1;
  while (freeBlocks.length && index > 1) {
    const block = disk[index];
    index -= 1;
    if (block.moved) {
      continue;
    }

    const freeIndex = freeBlocks.findIndex(({ size }) => block.size <= size);
    if (freeIndex >= 0) {
      const free = freeBlocks[freeIndex];
      disk.splice(disk.indexOf(free), 0, { ...block, moved: true });
      free.size -= block.size;
      block.free = true;
    } else {
      index -= 1;
    }
    freeBlocks.pop();
  }
  return getChecksum(disk);
};
