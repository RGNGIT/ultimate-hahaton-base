import constants from "../../common/constants";
import { Blob } from "../entities/blob.entity";

export const blobProvider = [
  {
    provide: constants.BLOB_REPOSIRORY,
    useValue: Blob,
  },
];