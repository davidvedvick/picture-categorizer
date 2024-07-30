import { Tag } from "../../../transfer/index.js";

export interface ManageTags {
    addAndGetTag(tag: string): Promise<Tag>;
}
