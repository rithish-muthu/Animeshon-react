

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 shadow-[0_-1px_0px] shadow-blue-200 ">
      <div className="container mx-auto px-4 text-center ">


        <p className="text-sm">&copy; {new Date().getFullYear()} Animeshon. All rights reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;