'use client'

import React, { Suspense } from "react";
import Header from "@/components/Header";
import Posts from "@/components/Posts";

export default function Home() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div>Loading courses...</div>}>
        <Posts />
      </Suspense>
    </div>
  );
}
