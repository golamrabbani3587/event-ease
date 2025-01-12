const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Event Ease. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
