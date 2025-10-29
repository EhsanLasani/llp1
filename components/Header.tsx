// components/layout/Header.tsx
"use client";

import React from "react";
import {
  Header as CarbonHeader,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from "@carbon/react";
import { Search } from "@carbon/icons-react";

export default function AppHeader() {
  return (
    <HeaderContainer
      render={() => (
        <CarbonHeader aria-label="Apple Books" className="custom-header">
          {/* Skip link for accessibility */}
          <SkipToContent />

          {/* Brand / Logo */}
          <HeaderName
            href="/"
            prefix=""
            className="logo-tight"
            aria-label="Apple Books"
            // style={{ marginInlineEnd: 50 }}
          >
            <img
              src="/images/logo.png" // public/images/logo.png
              alt="Apple Books"
              style={{
                height: 24,
                verticalAlign: "middle",
                marginRight: 8,
                display: "inline-block",
              }}
            />
            {/* If you want *only* the logo visible, keep a visually-hidden name: */}
            {/* <span className="brand-text">Apple Books</span> */}
          </HeaderName>

          {/* Navigation items */}
          <HeaderNavigation aria-label="Lasani" className="nav-tight">
            <HeaderMenuItem href="#">Home</HeaderMenuItem>
            <HeaderMenuItem href="#">Product</HeaderMenuItem>
            <HeaderMenuItem href="#">Service</HeaderMenuItem>
            <HeaderMenuItem href="#">Insight</HeaderMenuItem>
            <HeaderMenuItem href="#">About</HeaderMenuItem>
            <HeaderMenuItem href="#">ContactUs</HeaderMenuItem>
          </HeaderNavigation>

          {/* Global actions (icons on right side) */}
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Search"
              onClick={() => console.log("Search clicked")}
            >
              <Search size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </CarbonHeader>
      )}
    />
  );
}
