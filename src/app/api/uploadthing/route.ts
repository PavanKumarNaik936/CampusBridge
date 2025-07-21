import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export route handler
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
