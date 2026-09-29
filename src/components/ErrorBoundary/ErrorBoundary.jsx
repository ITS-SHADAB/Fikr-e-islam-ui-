import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-['Payami_Nastaleeq',serif] text-[#2B2118] mb-2">
            صفحہ لوڈ کرنے میں دشواری پیش آئی
          </h2>
          <p className="text-sm text-[#685545] font-['Payami_Nastaleeq',serif] max-w-md mb-6 leading-relaxed">
            براہ کرم صفحہ کو دوبارہ لوڈ کریں یا کچھ دیر بعد کوشش کریں۔
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A8793E] hover:bg-[#8C6226] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>دوبارہ کوشش کریں</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
