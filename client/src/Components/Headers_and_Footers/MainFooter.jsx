export default function MainFooter() {
  return (
    <div className="main-footer-div bg-gray-600  flex flex-col justify-center items-center w-full py-5">
      <p className="text-white mt-5 text-center px-5 md:px-10">
        This portfolio piece was designed and build by Mathew Ritchie, Click the link below to see
        more on my portfolio page.{" "}
      </p>
      <p>
        <a className="footer-link pl-2" href="https://mathewritchie.netlify.app/" target="_blank">
          mathewritchie.netlify.app
        </a>
      </p>
      <p className="text-white text-xs">
        Images sourced from <a href="https://www.freepik.com/">freepik.com</a>{" "}
      </p>
      <p className="text-white text-xs">© 2025 Fake Store. All rights reserved.</p>
    </div>
  );
}
