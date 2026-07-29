import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/all.css'
import { createHashRouter, RouterProvider } from "react-router-dom"
import routes from "./routes/index.jsx"

const router = createHashRouter(routes)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)