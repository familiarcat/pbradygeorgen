'use client';

import React, { useState } from 'react';
import AxiomProvider from '@/components/axiom-ui/AxiomProvider';
import AxiomContainer from '@/components/axiom-ui/AxiomContainer';
import AxiomTransition from '@/components/axiom-ui/AxiomTransition';
import AxiomSelector from '@/components/axiom-ui/AxiomSelector';
import { DanteLogger } from '@/utils/DanteLogger';
import Link from 'next/link';

export default function AxiomDemoPage() {
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  
  // Handle demo selection
  const handleDemoSelect = (demo: string) => {
    setActiveDemo(demo);
    DanteLogger.success.ux(`Selected demo: ${demo}`);
    
    // Show appropriate panels based on demo
    if (demo === 'fluid-positioning') {
      setShowLeftPanel(true);
      setTimeout(() => setShowRightPanel(true), 1000);
    } else if (demo === 'predictive-ui') {
      setShowRightPanel(true);
      setTimeout(() => setShowLeftPanel(true), 1000);
    } else {
      setShowLeftPanel(false);
      setShowRightPanel(false);
    }
  };
  
  return (
    <AxiomProvider>
      <div className="min-h-screen bg-[#F5F3E7] text-[#49423D] flex flex-col">
        {/* Header */}
        <header className="bg-[#D4D1BE] p-6 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold font-mono">Axiom of Choice UI</h1>
            <Link 
              href="/"
              className="px-4 py-2 bg-[#7E4E2D] text-white rounded hover:bg-[#8F5A35] transition-colors"
            >
              Back to Main App
            </Link>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 font-mono">The Axiom of Choice in UI Design</h2>
              <p className="mb-4">
                The Axiom of Choice is a mathematical principle that states that for any collection of non-empty sets, 
                it's possible to select exactly one element from each set to form a new set. In UI terms, this translates 
                to dynamically selecting optimal UI elements based on context, creating fluid transitions between states, 
                and anticipating user needs before they're explicitly expressed.
              </p>
              <p>
                This demo showcases how the Axiom of Choice can be applied to create responsive, 
                animated UI structures that adapt to user behavior and content.
              </p>
            </section>
            
            {/* Demo selection */}
            <section className="mb-12">
              <h3 className="text-xl font-bold mb-4 font-mono">Select a Demo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleDemoSelect('fluid-positioning')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activeDemo === 'fluid-positioning'
                      ? 'border-[#7E4E2D] bg-[#7E4E2D] text-white'
                      : 'border-[#7E4E2D] text-[#7E4E2D] hover:bg-[rgba(126,78,45,0.1)]'
                  }`}
                >
                  <h4 className="text-lg font-bold mb-2">Fluid Positioning</h4>
                  <p className="text-sm">
                    Demonstrates how UI elements can dynamically reposition themselves based on context.
                  </p>
                </button>
                
                <button
                  onClick={() => handleDemoSelect('predictive-ui')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activeDemo === 'predictive-ui'
                      ? 'border-[#7E4E2D] bg-[#7E4E2D] text-white'
                      : 'border-[#7E4E2D] text-[#7E4E2D] hover:bg-[rgba(126,78,45,0.1)]'
                  }`}
                >
                  <h4 className="text-lg font-bold mb-2">Predictive UI</h4>
                  <p className="text-sm">
                    Shows how the UI can anticipate user needs and suggest next actions.
                  </p>
                </button>
                
                <button
                  onClick={() => handleDemoSelect('adaptive-layout')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activeDemo === 'adaptive-layout'
                      ? 'border-[#7E4E2D] bg-[#7E4E2D] text-white'
                      : 'border-[#7E4E2D] text-[#7E4E2D] hover:bg-[rgba(126,78,45,0.1)]'
                  }`}
                >
                  <h4 className="text-lg font-bold mb-2">Adaptive Layout</h4>
                  <p className="text-sm">
                    Demonstrates how layouts can adapt based on content and user behavior.
                  </p>
                </button>
              </div>
            </section>
            
            {/* Demo area */}
            <section className="relative min-h-[500px] border-2 border-[#D4D1BE] rounded-lg bg-white p-4">
              <h3 className="text-xl font-bold mb-4 font-mono">Demo Area</h3>
              
              {activeDemo === null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-lg text-[#7E6233]">Select a demo to begin</p>
                </div>
              )}
              
              {/* Fluid Positioning Demo */}
              {activeDemo === 'fluid-positioning' && (
                <div className="relative min-h-[400px]">
                  <p className="mb-4">
                    This demo shows how UI elements can dynamically position themselves based on context.
                    Notice how the panels adjust their position to avoid overlapping.
                  </p>
                  
                  {/* Left Panel */}
                  <AxiomTransition
                    show={showLeftPanel}
                    type="slide"
                    direction="left"
                    duration={500}
                  >
                    <AxiomContainer
                      id="left-panel"
                      initialPosition="left"
                      className="bg-white shadow-lg rounded-lg p-4 border border-[#D4D1BE] w-[300px]"
                    >
                      <h4 className="text-lg font-bold mb-2">Left Panel</h4>
                      <p className="mb-4">This panel starts on the left side.</p>
                      <button
                        onClick={() => setShowRightPanel(!showRightPanel)}
                        className="px-4 py-2 bg-[#7E4E2D] text-white rounded hover:bg-[#8F5A35] transition-colors"
                      >
                        {showRightPanel ? 'Hide' : 'Show'} Right Panel
                      </button>
                    </AxiomContainer>
                  </AxiomTransition>
                  
                  {/* Right Panel */}
                  <AxiomTransition
                    show={showRightPanel}
                    type="slide"
                    direction="right"
                    duration={500}
                  >
                    <AxiomContainer
                      id="right-panel"
                      initialPosition="right"
                      className="bg-white shadow-lg rounded-lg p-4 border border-[#D4D1BE] w-[300px]"
                    >
                      <h4 className="text-lg font-bold mb-2">Right Panel</h4>
                      <p className="mb-4">This panel starts on the right side.</p>
                      <button
                        onClick={() => setShowLeftPanel(!showLeftPanel)}
                        className="px-4 py-2 bg-[#7E4E2D] text-white rounded hover:bg-[#8F5A35] transition-colors"
                      >
                        {showLeftPanel ? 'Hide' : 'Show'} Left Panel
                      </button>
                    </AxiomContainer>
                  </AxiomTransition>
                </div>
              )}
              
              {/* Predictive UI Demo */}
              {activeDemo === 'predictive-ui' && (
                <div className="relative min-h-[400px]">
                  <p className="mb-4">
                    This demo shows how the UI can anticipate user needs and suggest next actions.
                    Try clicking on different options to see how the system learns and predicts your next choice.
                  </p>
                  
                  <AxiomSelector
                    choices={['option1', 'option2', 'option3']}
                    autoPredict={true}
                    className="flex flex-col items-center justify-center gap-4 mt-8"
                  >
                    {(selectedId) => (
                      <>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          <button
                            onClick={() => handleDemoSelect('option1')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedId === 'option1'
                                ? 'border-[#7E4E2D] bg-[#7E4E2D] text-white'
                                : 'border-[#7E4E2D] text-[#7E4E2D] hover:bg-[rgba(126,78,45,0.1)]'
                            }`}
                          >
                            Option 1
                          </button>
                          
                          <button
                            onClick={() => handleDemoSelect('option2')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedId === 'option2'
                                ? 'border-[#7E4E2D] bg-[#7E4E2D] text-white'
                                : 'border-[#7E4E2D] text-[#7E4E2D] hover:bg-[rgba(126,78,45,0.1)]'
                            }`}
                          >
                            Option 2
                          </button>
                          
                          <button
                            onClick={() => handleDemoSelect('option3')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedId === 'option3'
                                ? 'border-[#7E4E2D] bg-[#7E4E2D] text-white'
                                : 'border-[#7E4E2D] text-[#7E4E2D] hover:bg-[rgba(126,78,45,0.1)]'
                            }`}
                          >
                            Option 3
                          </button>
                        </div>
                        
                        {selectedId && (
                          <div className="bg-white shadow-lg rounded-lg p-4 border border-[#D4D1BE] w-full max-w-md">
                            <h4 className="text-lg font-bold mb-2">Selected: {selectedId}</h4>
                            <p>
                              The system has recorded your selection and will use it to predict your future choices.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </AxiomSelector>
                </div>
              )}
              
              {/* Adaptive Layout Demo */}
              {activeDemo === 'adaptive-layout' && (
                <div className="relative min-h-[400px]">
                  <p className="mb-4">
                    This demo shows how layouts can adapt based on content and user behavior.
                    Resize your browser window to see how the layout adjusts.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    <AxiomTransition show={true} type="fade" duration={500} delay={100}>
                      <div className="bg-white shadow-lg rounded-lg p-4 border border-[#D4D1BE]">
                        <h4 className="text-lg font-bold mb-2">Card 1</h4>
                        <p>This card adapts to the available space.</p>
                      </div>
                    </AxiomTransition>
                    
                    <AxiomTransition show={true} type="fade" duration={500} delay={200}>
                      <div className="bg-white shadow-lg rounded-lg p-4 border border-[#D4D1BE]">
                        <h4 className="text-lg font-bold mb-2">Card 2</h4>
                        <p>This card adapts to the available space.</p>
                      </div>
                    </AxiomTransition>
                    
                    <AxiomTransition show={true} type="fade" duration={500} delay={300}>
                      <div className="bg-white shadow-lg rounded-lg p-4 border border-[#D4D1BE]">
                        <h4 className="text-lg font-bold mb-2">Card 3</h4>
                        <p>This card adapts to the available space.</p>
                      </div>
                    </AxiomTransition>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-[#D4D1BE] p-6 mt-auto">
          <div className="max-w-7xl mx-auto text-center">
            <p>
              Axiom of Choice UI Demo - Implementing mathematical principles in user interface design
            </p>
          </div>
        </footer>
      </div>
    </AxiomProvider>
  );
}
