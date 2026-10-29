/// <reference types="vite/client" />

declare module "virtual:journal-posts" {
  const posts: import("./types/post").Post[];
  export default posts;
}
