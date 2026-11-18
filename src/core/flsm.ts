import { prefixToMask } from "./ip.js";
import { computeSubnet } from "./subnet.js";
import { fail, ok, type Result, type SubnetInfo, type Uint32 } from "./types.js";

/** Largest number of subnet rows rendered. Larger splits report `truncated`. */
export const MAX_ROWS = 256;

export type FlsmRequest =
  | { kind: "subnets"; count: number }
  | { kind: "hosts"; hosts: number };

export interface FlsmResult {
  originalPrefix: number;
  newPrefix: number;
  mask: Uint32;
  subnetCount: number;
  hostsPerSubnet: number;
  subnets: SubnetInfo[];
  truncated: boolean;
}

/** Smallest number of bits b such that 2^b >= value. */
function bitsFor(value: number): number {
  let bits = 0;
  while (2 ** bits < value) bits++;
  return bits;
}

/**
 * Split a network into equal-size subnets (fixed length subnet mask).
 * Either ask for a number of subnets (bits are borrowed from the host part)
 * or for usable hosts per subnet (the smallest block that fits them).
 */
export function splitFixedLength(
  address: Uint32,
  prefix: number,
  request: FlsmRequest,
): Result<FlsmResult> {
  let newPrefix: number;

  if (request.kind === "subnets") {
    const count = request.count;
    if (!Number.isInteger(count) || count < 1) {
      return fail("Number of subnets must be a whole number, at least 1.");
    }
    newPrefix = prefix + bitsFor(count);
    if (newPrefix > 32) {
      return fail(
        `${count} subnets do not fit in /${prefix}. The most this network can hold is ${2 ** (32 - prefix)}.`,
      );
    }
  } else {
    const hosts = request.hosts;
    if (!Number.isInteger(hosts) || hosts < 1) {
      return fail("Hosts per subnet must be a whole number, at least 1.");
    }
    // Usable hosts = 2^h - 2, so the block needs 2^h >= hosts + 2.
    newPrefix = 32 - bitsFor(hosts + 2);
    if (newPrefix < prefix) {
      return fail(`${hosts} hosts per subnet is larger than the whole /${prefix} network.`);
    }
  }

  const networkMask = prefixToMask(prefix);
  const firstNetwork = (address & networkMask) >>> 0;
  const subnetCount = 2 ** (newPrefix - prefix);
  const blockSize = 2 ** (32 - newPrefix);
  const listed = Math.min(subnetCount, MAX_ROWS);

  const subnets: SubnetInfo[] = [];
  for (let i = 0; i < listed; i++) {
    const network = (firstNetwork + i * blockSize) >>> 0;
    subnets.push(computeSubnet(network, newPrefix));
  }

  const sample = subnets[0] ?? computeSubnet(firstNetwork, newPrefix);

  return ok({
    originalPrefix: prefix,
    newPrefix,
    mask: prefixToMask(newPrefix),
    subnetCount,
    hostsPerSubnet: sample.usableHosts,
    subnets,
    truncated: subnetCount > listed,
  });
}
