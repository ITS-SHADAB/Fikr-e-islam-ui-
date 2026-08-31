// components/index.js — Global barrel for all shared UI components
// Import any component using: import { Button, Card } from '../components';

// Input components (already structured)
export * from "./Input";

// Route guard
export * from "./AdminRoute";

// Card components
export * from "./ArticleCard";
export * from "./EventCard";
export * from "./FatwaCard";
export * from "./LectureCard";
export * from "./PublicationCard";

// Layout helper components
export * from "./FeatureCards";
export * from "./PageContainer";
export * from "./ThreeColumns";

// Editor
export * from "./RichTextEditor";

// PDF Viewer
export * from "./PdfViewer";

// Image Viewer
export { default as ImageViewer } from "./ImageViewer";

// Table component
export * from "./Table";

// Comments
export { default as CommentsSection } from "./CommentsSection";
export * from "./Modal";
export * from "./ConfirmationBox";
export * from "./SectionSidebar";
export * from "./Loader";
