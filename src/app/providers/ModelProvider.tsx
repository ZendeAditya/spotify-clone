"use client";
import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";

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
      <Modal title="test" description="lorem" isOpen onChange={() => {}}>
        children
      </Modal>
    </div>
  );
};

export default ModelProvider;
