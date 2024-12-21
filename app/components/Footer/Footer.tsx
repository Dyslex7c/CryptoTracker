import { GitlabIcon as GitHub, Twitter, Linkedin } from 'lucide-react'
import './footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>We provide cryptocurrency tracking and analytics.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="GitHub"><GitHub size={24} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={24} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={24} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Crypto Tracker. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

