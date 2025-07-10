'use client';

import React from 'react';

const RadarStyles: React.FC = () => (
    <style
        dangerouslySetInnerHTML={{
            __html: `
        @keyframes smooth-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse-glow { 0%,100%{filter:brightness(1.1) saturate(1.3)}50%{filter:brightness(1.2) saturate(1.5)} }

        .radar-container {
          position: relative;
          display: inline-block;
          border-radius: 50%;
          padding: 15px;
          overflow: hidden;
        }
        .radar-background {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          transition: background-color .8s;
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .green-bg { background: linear-gradient(135deg, #2e7d7d, #3698A2, #55BDC7, #4fb3bd);
                     box-shadow:0 0 20px rgba(54,152,162,0.5), inset 0 0 10px rgba(46,125,125,0.3); }
        .blue-bg  { background: linear-gradient(135deg, #2d7bc0, #4199E0, #71BFFF, #5cb3f0);
                     box-shadow:0 0 20px rgba(65,153,224,0.5), inset 0 0 10px rgba(45,123,192,0.3); }
        .orange-bg{ background: linear-gradient(135deg, #e6806a, #FF947A, #FFCAAD, #ffb299);
                     box-shadow:0 0 20px rgba(255,148,122,0.5), inset 0 0 10px rgba(230,128,106,0.3); }
        .purple-bg{ background: linear-gradient(135deg, #7a5c95, #8B68A5, #C0A2D7, #a385c1);
                     box-shadow:0 0 20px rgba(139,104,165,0.5), inset 0 0 10px rgba(122,92,149,0.3); }

        .radar-sweep {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: smooth-rotate 2.5s linear infinite;
          transition: background .8s;
        }
        .green-sweep  { background: conic-gradient(from 0deg, transparent 55%, rgba(54,152,162,0.7) 70%, transparent 100%); }
        .blue-sweep   { background: conic-gradient(from 0deg, transparent 55%, rgba(65,153,224,0.7) 70%, transparent 100%); }
        .orange-sweep { background: conic-gradient(from 0deg, transparent 55%, rgba(255,148,122,0.7) 70%, transparent 100%); }
        .purple-sweep { background: conic-gradient(from 0deg, transparent 55%, rgba(139,104,165,0.7) 70%, transparent 100%); }

        .inner-white-mask {
          position: absolute;
          top: 50%; left: 50%;
          width: 5rem; height: 5rem;
          background: white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
        }
      `,
        }}
    />
);

export default RadarStyles;
