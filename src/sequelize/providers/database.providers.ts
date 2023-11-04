import { Sequelize } from "sequelize-typescript";
import { sequelizeConfig } from "../../config";
import { Blob } from "src/cdn/entities/blob.entity";
import { Connection } from "src/connections/entities/connection.entity";
import { User } from "src/user/entities/user.entity";
import { Status } from "src/cronjobs/entities/status.entity";
import { Log } from "src/cronjobs/entities/log.entity";

export const dbProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {

      const sequelize = new Sequelize(sequelizeConfig);
      sequelize.addModels([Connection, User, Status, Log]);
      await sequelize.sync({ alter: true });

      return sequelize;
    }
  }
];