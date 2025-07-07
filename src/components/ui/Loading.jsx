import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded-lg shimmer"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg shimmer"></div>
        </div>
        
        {/* Metrics cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-20 bg-gray-200 rounded shimmer"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg shimmer"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded shimmer mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 rounded shimmer"></div>
            </div>
          ))}
        </div>
        
        {/* Content area skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 w-32 bg-gray-200 rounded shimmer mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full shimmer"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded shimmer"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded shimmer"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded shimmer"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 w-32 bg-gray-200 rounded shimmer mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg shimmer"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'pipeline') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded-lg shimmer"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg shimmer"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-24 bg-gray-200 rounded shimmer"></div>
                <div className="h-6 w-12 bg-gray-200 rounded shimmer"></div>
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="h-4 w-full bg-gray-200 rounded shimmer mb-2"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded shimmer mb-2"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded shimmer"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (type === 'list') {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-32 bg-gray-200 rounded-lg shimmer"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg shimmer"></div>
        </div>
        
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full shimmer"></div>
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded shimmer"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded shimmer"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-4 w-20 bg-gray-200 rounded shimmer"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-4 w-4 bg-primary rounded-full animate-pulse"></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <span className="text-gray-600 ml-2">Loading...</span>
      </motion.div>
    </div>
  );
};

export default Loading;