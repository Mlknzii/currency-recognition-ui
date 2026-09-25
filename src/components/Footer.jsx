import React from "react";

const Footer = () => {
  const today = new Date();
  return (
    <div>
      <footer className=" footer">
        <p> &copy; {today.getFullYear()} جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default Footer;
