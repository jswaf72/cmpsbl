import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Studio } from "./components/studio/Studio";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Studio />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
