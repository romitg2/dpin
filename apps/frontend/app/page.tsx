import React from 'react';
import { Activity, Bell, Shield, Clock, ArrowRight } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Monitor Your Applications with Confidence
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Get real-time insights into your application's performance and uptime. Never miss a beat with our comprehensive monitoring solution.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold flex items-center transition-colors">
                Start Monitoring <ArrowRight className="ml-2" />
              </button>
              <button className="border border-gray-700 hover:border-blue-500 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-800/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose dpin uptime?</h2>
            <p className="text-gray-400">Comprehensive monitoring solutions for modern applications</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-blue-500" />}
              title="Real-time Alerts"
              description="Get instant notifications when your applications experience issues or downtime."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-500" />}
              title="Security First"
              description="Enterprise-grade security with end-to-end encryption for all your monitoring data."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-blue-500" />}
              title="Historical Data"
              description="Access detailed historical data and trends to make informed decisions."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="99.9%" label="Uptime Guarantee" />
            <StatCard number="24/7" label="Monitoring" />
            <StatCard number="1M+" label="API Calls Monitored" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-blue-500" />
              <span className="ml-2 font-semibold">dpin uptime</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 dpin uptime. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl">
      <div className="text-4xl font-bold text-blue-500 mb-2">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}

export default App;