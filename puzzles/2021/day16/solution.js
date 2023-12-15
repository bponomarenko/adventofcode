export const formatInput = input => input.split('').map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join('');

const parsePackets = bits => {
  // will contain parsed packets
  const packets = [];
  let pointer = 0;

  // Utils
  const slice = num => bits.slice(pointer, pointer + num);
  const read = num => {
    // read and parse value to integer
    const value = parseInt(slice(num), 2);
    // advance pointer to the next portion of data
    pointer += num;
    return value;
  };

  const parsePacket = () => {
    const version = read(3);
    const type = read(3);

    if (type === 4) {
      // Literal value
      let valueBin = '';
      let controlBit;
      do {
        const block = read(5);
        controlBit = block >> 4;
        valueBin += (block & 15).toString(2).padStart(4, '0');
      } while (controlBit === 1); // stops right after last bit with "0" as a control bit is read
      return { version, type, value: parseInt(valueBin, 2) };
    }

    if (read(1) === 1) {
      // Exact sub-packets number
      return {
        version,
        type,
        packets: new Array(read(11)).fill(0).map(() => parsePacket()),
      };
    }

    // Read sub-packets from the bits of specific length
    const length = read(15);
    const packet = { version, type, packets: parsePackets(slice(length)) };
    pointer += length;
    return packet;
  };

  let packet;
  do {
    packet = parsePacket();
    if (packet) {
      packets.push(packet);
    }
  } while (bits.length - pointer > 10); // There should be at least 10 bits – 3 (version) + 3 (type) + [5 (literal value bit) or 6 (sub-packet version)]
  return packets;
};

const sumVersions = pckts => pckts.sum(({ version, packets }) => version + (packets ? sumVersions(packets) : 0));

export const part1 = input => sumVersions(parsePackets(input));

const getValue = ({ type, packets, value }) => {
  switch (type) {
    case 0:
      return packets.reduce((acc, packet) => acc + getValue(packet), 0);
    case 1:
      return packets.reduce((acc, packet) => acc * getValue(packet), 1);
    case 2:
      return Math.min(...packets.map(packet => getValue(packet)));
    case 3:
      return Math.max(...packets.map(packet => getValue(packet)));
    case 4:
      return value;
    case 5:
      return getValue(packets[0]) > getValue(packets[1]) ? 1 : 0;
    case 6:
      return getValue(packets[0]) < getValue(packets[1]) ? 1 : 0;
    case 7:
      return getValue(packets[0]) === getValue(packets[1]) ? 1 : 0;
  }
  throw new Error(`Unexpected packet type: ${type}`);
};

export const part2 = input => getValue(parsePackets(input)[0]);
