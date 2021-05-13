import { createApplication } from "graphql-modules";
import { userModule } from "./user.module";

const application = createApplication({
  modules: [userModule],
});

export const schema = application.createSchemaForApollo();