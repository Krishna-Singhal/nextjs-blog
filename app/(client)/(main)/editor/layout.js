import { EditorProvider } from "@context/EditorContext";

export default function EditorLayout({ children }) {
    return <EditorProvider>{children}</EditorProvider>;
}
