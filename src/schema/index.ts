import { createApplication } from "graphql-modules";
import { userModule } from "./user.module";
import { authModule } from "./auth.module";

const application = createApplication({
  modules: [userModule, authModule],
});

export const schema = application.createSchemaForApollo();