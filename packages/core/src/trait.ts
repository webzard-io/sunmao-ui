import { JSONSchema4 } from "json-schema";
import { Metadata } from "./metadata";
import { MethodSchema } from "./method";
import { parseVersion, Version } from "./version";

// spec

export type Trait = {
  version: string;
  kind: "Trait";
  metadata: Metadata;
  spec: TraitSpec;
};

type TraitSpec = {
  properties: Array<JSONSchema4 & { name: string }>;
  state: JSONSchema4;
  methods: MethodSchema[];
};

// extended runtime
export type RuntimeTrait = Trait & {
  parsedVersion: Version;
};

export function createTrait(options: Omit<Trait, "kind">): RuntimeTrait {
  return {
    ...options,
    kind: "Trait",
    parsedVersion: parseVersion(options.version),
  };
}
