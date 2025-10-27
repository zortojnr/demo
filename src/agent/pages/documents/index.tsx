import { Routes, Route } from 'react-router-dom'
import DocumentsHome from './DocumentsHome'
import NewDocument from './NewDocument'
import TemplateLibrary from './TemplateLibrary'
import DocumentViewer from './DocumentViewer'

export default function DocumentsRouter() {
  return (
    <Routes>
      <Route index element={<DocumentsHome />} />
      <Route path="new" element={<NewDocument />} />
      <Route path="library" element={<TemplateLibrary />} />
      <Route path=":id" element={<DocumentViewer />} />
    </Routes>
  )
}