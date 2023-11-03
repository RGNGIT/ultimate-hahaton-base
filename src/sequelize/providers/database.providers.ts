import { Sequelize } from "sequelize-typescript";
import { sequelizeConfig } from "../../config";
import { Blob } from "src/cdn/entities/blob.entity";

export const dbProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {

      const sequelize = new Sequelize(sequelizeConfig);
      sequelize.addModels([Blob]);
      await sequelize.sync(/*{ alter: true }*/);

      return sequelize;
    }
  }
];