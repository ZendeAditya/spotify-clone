"use client";
import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import AuthModel from "../components/AuthModel";

const ModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <div>
      <AuthModel />
    </div>
  );
};

export default ModelProvider;
