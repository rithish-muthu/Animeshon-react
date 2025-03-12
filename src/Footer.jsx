// import { FaFacebook, FaTwitter, FaInstagram } from "";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faFacebook, faTwitter, faInstagram} from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 shadow-[0_-1px_0px] shadow-blue-200 ">
      <div className="container mx-auto px-4 text-center ">
        {/* <nav className="mb-4 flex justify-center gap-6">
          <a href="/about" className="hover:text-white">About</a>
          <a href="/contact" className="hover:text-white">Contact</a>
          <a href="/terms" className="hover:text-white">Terms of Service</a>
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        </nav> */}

        {/* <div className="flex justify-center gap-4 mb-4">
          <a href="#" className="hover:text-white text-xl">
            <FontAwesomeIcon icon={faFacebook} size="3x"/>
          </a>
          <a href="#" className="hover:text-white text-xl">
          <FontAwesomeIcon icon={faTwitter} size="3x"/>
          </a>
          <a href="#" className="hover:text-white text-xl">
          <FontAwesomeIcon icon={faInstagram} size="3x"/>
          </a>
        </div> */}

        <p className="text-sm">&copy; {new Date().getFullYear()} Animeshon. All rights reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;