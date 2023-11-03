import constants from "../../../common/constants";
import { Status } from "../status.entity";

export const cronjobProvider = [
  {
    provide: constants.STATUS_REPOSITORY,
    useValue: Status,
  }
];