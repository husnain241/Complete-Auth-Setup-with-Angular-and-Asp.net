import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-section brand">
          <h3>Tech<span class="highlight">Zone</span></h3>
          <p>Your one-stop shop for the latest mobile phones and accessories.</p>
          <div class="socials">
            <i class="pi pi-facebook"></i>
            <i class="pi pi-twitter"></i>
            <i class="pi pi-instagram"></i>
          </div>
        </div>
        
        <div class="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Shop</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
        
        <div class="footer-section contact">
          <h4>Contact Us</h4>
          <p><i class="pi pi-map-marker"></i> 123 Tech Street, Digital City</p>
          <p><i class="pi pi-envelope"></i> support@techzone.com</p>
          <p><i class="pi pi-phone"></i> +1 234 567 890</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 TechZone. All rights reserved.</p>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background: #0b0f19;
      border-top: 1px solid var(--border-color);
      padding: 4rem 0 0;
      margin-top: auto;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 3rem;
      padding-bottom: 3rem;
    }
    
    .footer-section {
      h3, h4 {
        margin-bottom: 1.5rem;
        color: var(--text-main);
      }
      
      p, li {
        color: var(--text-muted);
        margin-bottom: 0.75rem;
        list-style: none;
      }

      a {
        text-decoration: none;
        color: var(--text-muted);
        transition: color 0.2s;
        
        &:hover {
            color: var(--primary-color);
        }
      }
    }
    
    .brand {
      h3 { font-size: 1.5rem; }
      .highlight { color: var(--primary-color); }
    }
    
    .socials {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      
      i {
        font-size: 1.25rem;
        cursor: pointer;
        transition: color 0.2s;
        
        &:hover { color: var(--primary-color); }
      }
    }
    
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.05);
      padding: 1.5rem 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
  `]
})
export class FooterComponent { }
