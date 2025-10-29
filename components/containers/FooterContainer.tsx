"use client";

/**
 * FooterContainer
 * - Two-row footer (top: 3 cols, bottom: copyright)
 * - Fixed bottom; auto-height.
 * - ResizeObserver updates --app-footer-height so body/main spacing stays correct.
 */

import React, { useEffect, useRef } from "react";

export default function FooterContainer() {
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const setVar = () => {
      document.documentElement.style.setProperty(
        "--app-footer-height",
        `${el.offsetHeight}px`
      );
    };

    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return (
    <footer className="custom-footer">
      <div ref={footerRef} className="footer-inner">
        {/* Row 1 */}
        <div className="footer-top">
          <div className="footer-col">
            <h4 className="footer-title">La-sani Fluid Power LLP</h4>
            <p className="footer-text">
              Industrial hydraulic solutions — engineering, design,
              commissioning, and lifecycle support.
            </p>
          </div>

          <div className="footer-col">
            <h5 className="footer-subtitle">Contact</h5>
            <ul className="footer-list">
              <li>Doha, Qatar</li>
              <li>+974 5555 5555</li>
              <li>info@la-sani.com</li>
              <li>Sun–Thu, 9:00–18:00</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="footer-subtitle">Website</h5>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="#">
                  Home
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Products
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Services
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Insights
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  About
                </a>
              </li>
              <li>
                <a className="footer-link" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Row 2 */}
        <div className="footer-bottom">
          <hr className="footer-divider" />
          <div className="footer-copy">
            © {new Date().getFullYear()} La-sani Fluid Power LLP. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
