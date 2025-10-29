"use client";

/**
 * BodyContainer
 * - Thin wrapper for page body content.
 * - Great place to mount future "block renderer" fed by a CMS.
 */

import React, { ReactNode } from "react";

export default function BodyContainer({ children }: { children: ReactNode }) {
  return <div className="body-container">{children}</div>;
}
