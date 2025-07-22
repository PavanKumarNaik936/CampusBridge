import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  profileImageUploader: f({ image: { maxFileSize: "2MB" } })
    .onUploadComplete(({ file }) => {
      console.log("Image uploaded:", file.url);
    }),

  resumeUploader: f({ pdf: { maxFileSize: "4MB" } })
    .onUploadComplete(({ file }) => {
      console.log("Resume uploaded:", file.url);
    }),
  eventImageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(({ file }) => {
      console.log("Event image uploaded:", file.url);
    }),
    pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .onUploadComplete(({ file }) => {
      console.log("Pdf uploaded:", file.url);
    })
} satisfies FileRouter;


export type OurFileRouter = typeof ourFileRouter;
