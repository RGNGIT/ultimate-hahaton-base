import { User } from "src/user/entities/user.entity";
import constants from "../../common/constants";
import { Connection } from "../entities/connection.entity";

export const connectionProvider = [
  {
    provide: constants.CONNECTIONS_REPOSITOTY,
    useValue: Connection,
  },
  {
    provide: constants.USERS_REPOSITORY,
    useValue: User,
  }
];