// src/app/assess/page.tsx

import { Suspense } from "react";
import AssessComponent from "./AssessComponent";

const Loading = () => {
  return <div>Loading...</div>;
};

export default function AssessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AssessComponent />
    </Suspense>
  );
}
