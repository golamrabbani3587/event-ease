const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 bg-yellow-50">
      <div className="w-80 bg-gray-800 text-white rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>
  );
};

export default Modal;
