"use client";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import "@uploadthing/react/styles.css";
// import type { FileWithPath } from "react-dropzone"; 
export function ProfileImageUpload({
    onUpload,
    
  }: {
    onUpload: (url: string, fileName: string) => void;
    
  }) {
    return (
      <UploadDropzone<OurFileRouter, "profileImageUploader">
        endpoint="profileImageUploader"
        
        onClientUploadComplete={(res) => {
        
          const url = res?.[0]?.ufsUrl;
          const name = res?.[0]?.name;
          if (url && name) onUpload(url, name);
        }}
        onUploadError={(error) => {
          alert("Upload failed: " + error.message);
        }}
      />
    );
  }
  
export function ResumeUpload({
    onUpload,
  }: {
    onUpload: (url: string, fileName: string) => void;
  }) {
    return (
      <UploadDropzone<OurFileRouter, "resumeUploader">
        endpoint="resumeUploader"
        onClientUploadComplete={(res) => {
        // console.log("Upload complete:", res);
          const url = res?.[0]?.ufsUrl;
          const name = res?.[0]?.name; // ✅ get file name
          if (url && name) onUpload(url, name);
        }}
        onUploadError={(error) => {
          alert("Upload failed: " + error.message);
        }}
      />
    );
  }
  