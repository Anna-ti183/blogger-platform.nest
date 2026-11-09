import { INestApplication } from "@nestjs/common";
import { pipesSetup } from "./pipes.setup.js";
import { globalPrefixSetup } from "./global-prefix.settings.js";
import { swaggerSetup } from "./swagger.setup.js";


export function appSetup(app: INestApplication) {
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app);
}