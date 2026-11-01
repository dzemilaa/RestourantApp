import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <h2>Welcome to Bella Restaurant&apos;s online menu</h2>
<p>Order your favorites with ease, explore our daily specials, and enjoy the convenience of having your meal ready for pickup or delivered straight to your doorstep.</p>
<p>Follow us on social media for updates, special offers, and events!</p>
<p>Thank you for choosing Bella Restaurant. We&apos;re delighted to bring our kitchen to you, wherever you are!</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
            </div>

            <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
           <p> 📍 Address: Gradska, Novi Pazar</p>
             <p>  📞 Phone: (+381) 62-3101-004</p>
              <p> 📧 Email: info@bellarestaurant.com </p>
        </div>
        </div>
           <hr />
        <p className="footer-copyright">Copyright 2024 © Bella.com - All right Reserved.</p>
    </div>
  )
}

export default Footer
