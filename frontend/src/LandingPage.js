import React, { useEffect, useRef } from 'react';
import './LandingPage.css';
import Navbar from './components/Navbar';
import heart from './img-assets/heart.jpg';
import simpleflower from './img-assets/simpleflower.jpg';
import hug from './img-assets/hug.jpg';
import instagram_icon from './img-assets/instagram.png';
import linkedin_icon from './img-assets/linkedin.png';
import facebook_icon from './img-assets/facebook.png';
import intro_image from './img-assets/intro.jpg';

function LandingPage() {
  const boxContainerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentBoxContainer = boxContainerRef.current;

    if (currentBoxContainer) {
      observer.observe(currentBoxContainer);
    }

    return () => {
      if (currentBoxContainer) {
        observer.unobserve(currentBoxContainer);
      }
    };
  }, []);

  return (
    <div className="landing">
      {/* Navigation Bar */}
      <Navbar />

      <div className="landing-one">
        <button className="getStarted">Get started</button>
      </div>

      <div className="intro">
        <div className="intro-text">
          <span>Thrifting made easy.</span>
          <p>
            Our goal is to make thrifting a part of everyday life.
            <br />
            <br />
            Anywhere you are, we make thrifting simple—helping you pass along what you no longer need and discover new finds effortlessly.
          </p>
        </div>
        <div className="intro-image">
          <img src={intro_image} alt="Intro" />
        </div>
      </div>

      {/* Widgets */}
      <div className="widgets">
        <div className="box-container" ref={boxContainerRef}>
          <div className="box">
            <img src={heart} alt="Trust" className="box-image" />
            <h2 className="box-title">TRUST</h2>
            <p className="box-description">
              Trust is paramount. We safeguard user safety with strict data minimization and unwavering transparency.
            </p>
          </div>
          <div className="box">
            <img src={simpleflower} alt="Simplicity" className="box-image" />
            <h2 className="box-title">SIMPLICITY</h2>
            <p className="box-description">
              Simplicity is our core. We ensure effortless navigation and intuitive design for a seamless user experience.
            </p>
          </div>
          <div className="box">
            <img src={hug} alt="Community" className="box-image" />
            <h2 className="box-title">COMMUNITY</h2>
            <p className="box-description">
              Our community is everything. We’re committed to creating a trusted space where every member feels valued.
            </p>
          </div>
        </div>
        <div className='filler-div'></div>
        {/* Footer */}
        <footer className="footer">
          {/* Social Links */}
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://github.com/ArshanKaudinya"><img src={facebook_icon} alt="Facebook" /></a>
              <a href="https://github.com/ArshanKaudinya"><img src={linkedin_icon} alt="LinkedIn" /></a>
              <a href="https://github.com/ArshanKaudinya"><img src={instagram_icon} alt="Instagram" /></a>
            </div>
          </div>

          {/* Address */}
          <div className="footer-address">
            <p>
              Developed in: <br />
              VIT Chennai<br />
              Tamil Nadu
            </p>
          </div>

          {/* Help and Support */}
          <div className="footer-help">
            <h4>Help & Support</h4>
            <a href="https://github.com/ArshanKaudinya">FAQs</a>
            <a href="https://github.com/ArshanKaudinya">Contact Us</a>
            <a href="https://github.com/ArshanKaudinya">Live Chat</a>
          </div>

          {/* Legal Links */}
          <div className="footer-legal">
            <a href="https://github.com/ArshanKaudinya">Terms & Conditions</a>
            <a href="https://github.com/ArshanKaudinya">Privacy Policy</a>
            <a href="https://github.com/ArshanKaudinya">Ads Info</a>
            <a href="https://github.com/ArshanKaudinya">Trademark</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
