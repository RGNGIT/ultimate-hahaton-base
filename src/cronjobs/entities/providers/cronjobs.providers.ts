import constants from "../../../common/constants";
import { Log } from "../log.entity";
import { Status } from "../status.entity";

export const cronjobProvider = [
  {
    provide: constants.STATUS_REPOSITORY,
    useValue: Status,
  },
  {
    provide: constants.LOG_REPOSITORY,
    useValue: Log,
  }
];