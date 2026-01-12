import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { AudioProvider } from "./context/AudioContext"

import { AccountProvider } from "./context/AccountContext"
import { SceneProvider } from "./context/SceneContext"
import { ViewProvider } from "./context/ViewContext"



import LoadingOverlay from "./components/LoadingOverlay"

import App from "./components/App"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AudioProvider>
      <ViewProvider>
        <SceneProvider>
        <LoadingOverlay />
          <Suspense>
            <App />
          </Suspense>
        </SceneProvider>
      </ViewProvider>
    </AudioProvider>
  </React.StrictMode>,
)
