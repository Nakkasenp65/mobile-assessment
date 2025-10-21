// src/app/assess/page.tsx

import { Suspense } from "react";
import AssessComponent from "./AssessComponent";
import Layout from "../../components/Layout/Layout";
import Loading from "@/components/ui/Loading";

const LoadingContainer = () => (
  <Layout>
    <Loading />
  </Layout>
);

export default function AssessPage() {
  return (
    <Suspense fallback={<LoadingContainer />}>
      <AssessComponent />
    </Suspense>
  );
}
