import { User } from "../entities/user.entity";
import constants from "../../common/constants";

export const usersProvider = [
  {
    provide: constants.USERS_REPOSITORY,
    useValue: User,
  }
];