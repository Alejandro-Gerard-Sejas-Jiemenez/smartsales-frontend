import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes loguear el error aquí si lo deseas
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-gray-50 to-gray-100 px-4">
          <h1 className="text-4xl font-bold text-gray-700">Error en el componente</h1>
          <p className="text-gray-600 text-sm">
            {this.state.error?.message || "Algo salió mal en el componente."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
