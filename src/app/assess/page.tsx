import { Suspense } from "react";
import AssessComponent from "./AssessComponent";

// You can create a more sophisticated loading skeleton component here
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
