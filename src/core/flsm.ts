import { prefixToMask } from "./ip.js";
import { computeSubnet } from "./subnet.js";
import { fail, ok, type Result, type SubnetInfo, type Uint32 } from "./types.js";

/** Largest number of rows rendered per table. Larger lists report `truncated`. */
export const MAX_ROWS = 256;

export type FlsmRequest =
  | { kind: "subnets"; count: number }
  | { kind: "hosts"; hosts: number };

export interface FlsmResult {
  originalPrefix: number;
  newPrefix: number;
  mask: Uint32;
  /** Subnets handed out. In hosts mode this is every block that fits. */
  subnetCount: number;
  /** Same-size blocks that fit in the base network (a power of two). */
  slotCount: number;
  /** Blocks left over after allocation. */
  freeCount: number;
  hostsPerSubnet: number;
  subnets: SubnetInfo[];
  subnetsTruncated: boolean;
  free: SubnetInfo[];
  freeTruncated: boolean;
}

/** Smallest number of bits b such that 2^b >= value. */
function bitsFor(value: number): number {
  let bits = 0;
  while (2 ** bits < value) bits++;
  return bits;
}

/** Build `count` consecutive blocks of size 2^(32-prefix), starting at block index `from`. */
function blocksFrom(firstNetwork: Uint32, prefix: number, from: number, count: number): SubnetInfo[] {
  const size = 2 ** (32 - prefix);
  const out: SubnetInfo[] = [];
  for (let i = from; i < from + count; i++) {
    out.push(computeSubnet((firstNetwork + i * size) >>> 0, prefix));
  }
  return out;
}

/**
 * Fixed Length Subnet Mask split. Every subnet has the same size.
 *  - subnets: borrow enough bits for N subnets. The remaining blocks are free.
 *  - hosts: take the smallest block that fits the requested usable hosts.
 *    Every block that fits is allocated, so no free blocks remain.
 */
export function splitFixedLength(
  address: Uint32,
  prefix: number,
  request: FlsmRequest,
): Result<FlsmResult> {
  let newPrefix: number;
  let allocatedCount: number;

  if (request.kind === "subnets") {
    const count = request.count;
    if (!Number.isInteger(count) || count < 1) {
      return fail("No. of Subnets must be a whole number, at least 1.");
    }
    newPrefix = prefix + bitsFor(count);
    if (newPrefix > 32) {
      return fail(
        `${count} subnets do not fit in /${prefix}. The most this network can hold is ${2 ** (32 - prefix)}.`,
      );
    }
    allocatedCount = count;
  } else {
    const hosts = request.hosts;
    if (!Number.isInteger(hosts) || hosts < 1) {
      return fail("Hosts per Subnet must be a whole number, at least 1.");
    }
    // Usable hosts = 2^h - 2, so the block needs 2^h >= hosts + 2.
    newPrefix = 32 - bitsFor(hosts + 2);
    if (newPrefix < prefix) {
      return fail(`${hosts} hosts per subnet is larger than the whole /${prefix} network.`);
    }
    allocatedCount = 2 ** (newPrefix - prefix);
  }

  const firstNetwork = (address & prefixToMask(prefix)) >>> 0;
  const slotCount = 2 ** (newPrefix - prefix);
  const freeCount = slotCount - allocatedCount;

  const subnetsListed = Math.min(allocatedCount, MAX_ROWS);
  const freeListed = Math.min(freeCount, MAX_ROWS);
  const subnets = blocksFrom(firstNetwork, newPrefix, 0, subnetsListed);
  const free = blocksFrom(firstNetwork, newPrefix, allocatedCount, freeListed);

  const sample = subnets[0] ?? computeSubnet(firstNetwork, newPrefix);

  return ok({
    originalPrefix: prefix,
    newPrefix,
    mask: prefixToMask(newPrefix),
    subnetCount: allocatedCount,
    slotCount,
    freeCount,
    hostsPerSubnet: sample.usableHosts,
    subnets,
    subnetsTruncated: allocatedCount > subnetsListed,
    free,
    freeTruncated: freeCount > freeListed,
  });
}
