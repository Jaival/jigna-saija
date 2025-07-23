export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          {/* Animated loader */}
          <div className="w-16 h-16 mx-auto">
            <div className="w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full">
              <div className="w-full h-full border-4 border-transparent border-t-pink-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading...
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please wait while we load the content
          </p>
        </div>
      </div>
    </div>
  );
}
