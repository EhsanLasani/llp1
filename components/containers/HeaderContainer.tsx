"use client";

/**
 * HeaderContainer
 * - Carbon header with brand/logo, navigation, and actions
 * - Styled via .custom-header and header tweaks in globals.scss
 */

import React from "react";
import {
  Header as CarbonHeader,
  HeaderContainer as Shell,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from "@carbon/react";
import { Search } from "@carbon/icons-react";

export default function HeaderContainer() {
  return (
    <Shell
      render={() => (
        <CarbonHeader aria-label="La-sani" className="custom-header">
          <SkipToContent />
          {/* Centering wrapper */}
          <div className="cw header-inner">
            <HeaderName href="/" prefix="">
              <img src="/images/logo.png" alt="La-sani" className="brand" />
              <span className="brand-text">La-sani</span>
            </HeaderName>

            <HeaderNavigation aria-label="Main" className="nav">
              <HeaderMenuItem href="#">Home</HeaderMenuItem>
              <HeaderMenuItem href="#">Products</HeaderMenuItem>
              <HeaderMenuItem href="#">Services</HeaderMenuItem>
              <HeaderMenuItem href="#">Insights</HeaderMenuItem>
              <HeaderMenuItem href="#">About</HeaderMenuItem>
              <HeaderMenuItem href="#">Contact</HeaderMenuItem>
            </HeaderNavigation>

            <HeaderGlobalBar>
              <HeaderGlobalAction aria-label="Search">
                <Search size={20} />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          </div>
        </CarbonHeader>
      )}
    />
  );
}
